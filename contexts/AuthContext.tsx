import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  detectAvailableWallets,
  getWalletObject,
  getCartridgeConnector,
  type WalletId,
  type WalletInfo,
} from '../config/wallets';
import { ACTIVE_NETWORK } from '../config/networks';

// Privy logout helper — lazily resolved to avoid errors if PrivyProvider is absent
let _privyLogout: (() => Promise<void>) | null = null;
export function setPrivyLogout(fn: (() => Promise<void>) | null) {
  _privyLogout = fn;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthState {
  isConnected: boolean;
  address: string | null;
  displayName: string | null;
  walletId: WalletId | null;
  network: string;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  availableWallets: WalletInfo[];
  connect: (walletId: WalletId) => Promise<void>;
  connectWithAddress: (walletId: WalletId, address: string, displayName?: string) => void;
  disconnect: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'btcfixed_wallet_v1';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isConnected: false,
    address: null,
    displayName: null,
    walletId: null,
    network: ACTIVE_NETWORK,
    isLoading: false,
    error: null,
  });

  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Detect injected wallets after extension has time to inject (≈500 ms)
  useEffect(() => {
    const t = setTimeout(() => setAvailableWallets(detectAvailableWallets()), 500);
    return () => clearTimeout(t);
  }, []);

  // ---------------------------------------------------------------------------
  // Cartridge connect path
  // ---------------------------------------------------------------------------
  const _connectCartridge = useCallback(async (silent = false) => {
    if (!silent) setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const connector = getCartridgeConnector();
      // connect() returns the account object directly on success, or throws on failure/cancel
      const account = await connector.connect();

      if (!account) {
        // User cancelled or popup was closed without completing auth
        if (!silent) setState((s) => ({ ...s, isLoading: false, error: null }));
        return;
      }

      // The account address is available as account.address
      const address = (account as unknown as { address: string }).address;
      if (!address) throw new Error('Cartridge: could not retrieve wallet address. Please try again.');

      setState({
        isConnected: true,
        address,
        displayName: null,
        walletId: 'cartridge',
        network: ACTIVE_NETWORK,
        isLoading: false,
        error: null,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, walletId: 'cartridge' }));

      // Cartridge handles account events internally — no listener needed
      cleanupRef.current = () => {/* no-op */};
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : String(err);

      // Map common Cartridge errors to user-friendly messages
      let message: string;
      if (rawMessage.includes('Timeout waiting for keychain')) {
        message = 'Cartridge keychain is taking too long to respond. Please try again or check your connection.';
      } else if (rawMessage.includes('destroyed connection')) {
        message = 'Cartridge connection was interrupted. Please try again.';
      } else if (rawMessage.includes('cancelled') || rawMessage.includes('cancel')) {
        message = ''; // User cancelled — clear error silently
      } else {
        message = rawMessage || 'Cartridge: connection failed. Please try again.';
      }

      if (!silent && message) {
        setState((s) => ({ ...s, isLoading: false, error: message }));
      } else if (!silent) {
        setState((s) => ({ ...s, isLoading: false, error: null }));
      }
      // Don't re-throw — the error state is already set above.
      // Re-throwing causes unhandled promise rejection in the UI handler.
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Injected wallet connect path (Argent X / Braavos)
  // ---------------------------------------------------------------------------
  const _connect = useCallback(async (walletId: WalletId, silent = false) => {
    if (walletId === 'cartridge') return _connectCartridge(silent);

    if (!silent) setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const wallet = getWalletObject(walletId);
      if (!wallet)
        throw new Error(
          `Wallet "${walletId}" is not installed. Please install the browser extension and try again.`,
        );

      await wallet.enable({ starknetVersion: 'v5' });

      const address = wallet.selectedAddress;
      if (!address) throw new Error('Could not retrieve wallet address.');

      setState({
        isConnected: true,
        address,
        displayName: null,
        walletId,
        network: ACTIVE_NETWORK,
        isLoading: false,
        error: null,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, walletId }));

      // Subscribe to account changes
      const onAccountsChanged = (accounts: string[]) => {
        if (!accounts.length) {
          _disconnect();
        } else {
          const newAddress = accounts[0];
          setState((s) => ({ ...s, address: newAddress }));
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ address: newAddress, walletId }));
        }
      };

      wallet.on('accountsChanged', onAccountsChanged as (...args: unknown[]) => void);
      cleanupRef.current = () =>
        wallet.off('accountsChanged', onAccountsChanged as (...args: unknown[]) => void);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      if (!silent) setState((s) => ({ ...s, isLoading: false, error: message }));
      // Don't re-throw — the error state is already set above.
    }
  }, [_connectCartridge]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Disconnect
  // ---------------------------------------------------------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _disconnect = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    // If Cartridge, also call their disconnect
    try { getCartridgeConnector().disconnect(); } catch { /* ignore */ }
    // If Privy, also call their logout
    if (_privyLogout) { _privyLogout().catch(() => {}); }
    setState({
      isConnected: false,
      address: null,
      displayName: null,
      walletId: null,
      network: ACTIVE_NETWORK,
      isLoading: false,
      error: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Silent reconnect on page load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { address: string; walletId: WalletId; displayName?: string };
      const { address, walletId } = parsed;
      if (walletId === 'privy') {
        // Privy sessions are handled by Privy SDK — just restore state
        // Privy's own provider will manage session validity
        const displayName = parsed.displayName as string | undefined;
        setState({
          isConnected: true,
          address,
          displayName: displayName ?? null,
          walletId: 'privy',
          network: ACTIVE_NETWORK,
          isLoading: false,
          error: null,
        });
        return;
      }
      if (walletId) {
        setTimeout(() => {
          _connect(walletId, true).catch(() => localStorage.removeItem(STORAGE_KEY));
        }, 800);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const connect = useCallback(
    (walletId: WalletId) => _connect(walletId, false),
    [_connect],
  );

  /** Direct connect path for Privy — address is already known from Privy SDK */
  const connectWithAddress = useCallback(
    (walletId: WalletId, address: string, displayName?: string) => {
      setState({
        isConnected: true,
        address,
        displayName: displayName ?? null,
        walletId,
        network: ACTIVE_NETWORK,
        isLoading: false,
        error: null,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, walletId, displayName }));
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{ ...state, availableWallets, connect, connectWithAddress, disconnect: _disconnect }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
