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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthState {
  isConnected: boolean;
  address: string | null;
  walletId: WalletId | null;
  network: string;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  availableWallets: WalletInfo[];
  connect: (walletId: WalletId) => Promise<void>;
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

      if (!account) throw new Error('Cartridge: connection cancelled');

      // The account address is available as account.address
      const address = (account as unknown as { address: string }).address;
      if (!address) throw new Error('Cartridge: could not retrieve address');

      setState({
        isConnected: true,
        address,
        walletId: 'cartridge',
        network: ACTIVE_NETWORK,
        isLoading: false,
        error: null,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, walletId: 'cartridge' }));

      // Cartridge handles account events internally — no listener needed
      cleanupRef.current = () => {/* no-op */};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Cartridge: connection failed';
      if (!silent) setState((s) => ({ ...s, isLoading: false, error: message }));
      throw err;
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
      throw err;
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
    setState({
      isConnected: false,
      address: null,
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
      const { walletId } = JSON.parse(saved) as { address: string; walletId: WalletId };
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

  return (
    <AuthContext.Provider
      value={{ ...state, availableWallets, connect, disconnect: _disconnect }}
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
