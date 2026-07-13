// BTCFixed – Wallet definitions for browser-injected Starknet wallets
import ControllerProvider from '@cartridge/controller';
import type { Call } from 'starknet';
import { NETWORKS, ACTIVE_NETWORK } from './networks';

export type WalletId = 'argentX' | 'braavos' | 'cartridge' | 'privy' | 'xverse' | 'any';

export interface WalletInfo {
  id: WalletId;
  name: string;
  // inline SVG string or image URL
  icon: string;
  installUrl: string;
}

export interface StarknetBrowserWallet {
  id: string;
  name: string;
  isConnected: boolean;
  selectedAddress: string;
  account: unknown;
  enable: (opts?: { starknetVersion?: string }) => Promise<string[]>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    starknet?: StarknetBrowserWallet;
    starknet_argentX?: StarknetBrowserWallet;
    starknet_braavos?: StarknetBrowserWallet;
  }
}

export const WALLET_METADATA: Record<WalletId, WalletInfo> = {
  cartridge: {
    id: 'cartridge',
    name: 'Cartridge',
    icon: 'https://cartridge.gg/icon.png',
    installUrl: 'https://cartridge.gg/',
  },
  argentX: {
    id: 'argentX',
    name: 'Argent X',
    icon: 'https://raw.githubusercontent.com/argentlabs/argent-x/main/packages/extension/src/ui/assets/argent-x-icon.svg',
    installUrl: 'https://www.argent.xyz/argent-x/',
  },
  braavos: {
    id: 'braavos',
    name: 'Braavos',
    icon: 'https://braavos.app/favicon.ico',
    installUrl: 'https://braavos.app/',
  },
  privy: {
    id: 'privy',
    name: 'Privy',
    icon: 'https://privy.io/favicon.ico',
    installUrl: 'https://privy.io/',
  },
  any: {
    id: 'any',
    name: 'Starknet Wallet',
    icon: '',
    installUrl: 'https://www.starknet.io/en/ecosystem/wallets',
  },
  xverse: {
    id: 'xverse',
    name: 'XVerse',
    icon: 'https://xverse.app/favicon.ico',
    installUrl: 'https://xverse.app/',
  },
};

// ---------------------------------------------------------------------------
// Cartridge Controller singleton
// ---------------------------------------------------------------------------

let _cartridgeConnector: InstanceType<typeof ControllerProvider> | null = null;

export function getCartridgeConnector(): InstanceType<typeof ControllerProvider> {
  if (!_cartridgeConnector) {
    // Build chain config based on active network
    const networkConfig = NETWORKS[ACTIVE_NETWORK];
    const chains = [
      { rpcUrl: networkConfig.rpcUrl },
      // Always include mainnet so the controller can switch
      { rpcUrl: NETWORKS.mainnet.rpcUrl },
    ];

    _cartridgeConnector = new ControllerProvider({
      chains,
      // No policies for Session 1 – user always signs manually
      // Sessions 2+ will add staking/swap policy entries
      policies: [],
      // Allow Cartridge to handle its own UI
      lazyload: false,
    });
  }
  return _cartridgeConnector;
}

/** Detects browser-injected wallets (Argent X, Braavos). Cartridge is always available. */
export function detectAvailableWallets(): WalletInfo[] {
  const found: WalletInfo[] = [];
  if (typeof window === 'undefined') return found;
  
  // Check for specific wallet objects
  if (window.starknet_argentX) found.push(WALLET_METADATA.argentX);
  if (window.starknet_braavos) found.push(WALLET_METADATA.braavos);
  
  // Check for XVerse (uses bitcoin provider or sats-connect)
  if (window.bitcoin || (window as Record<string, unknown>).xverse) {
    found.push(WALLET_METADATA.xverse);
  }
  
  // If no specific wallets found, check generic starknet object
  if (!found.length && window.starknet) {
    // Try to detect which wallet from the generic object
    const sn = window.starknet as Record<string, unknown>;
    if (sn.isArgent || sn.name?.toString().toLowerCase().includes('argent')) {
      found.push(WALLET_METADATA.argentX);
    } else if (sn.isBraavos || sn.name?.toString().toLowerCase().includes('braavos')) {
      found.push(WALLET_METADATA.braavos);
    } else {
      found.push(WALLET_METADATA.any);
    }
  }
  
  return found;
}

/** Returns the injected wallet object for a given wallet ID (not Cartridge). */
export function getWalletObject(id: WalletId): StarknetBrowserWallet | null {
  if (typeof window === 'undefined') return null;
  
  // Try specific wallet objects first (newer extension versions)
  if (id === 'argentX') {
    return window.starknet_argentX ?? (window.starknet as StarknetBrowserWallet | undefined) ?? null;
  }
  if (id === 'braavos') {
    return window.starknet_braavos ?? (window.starknet as StarknetBrowserWallet | undefined) ?? null;
  }
  if (id === 'cartridge') return null; // handled separately via getCartridgeConnector()
  
  // Fallback to generic starknet object
  return window.starknet ?? null;
}

export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// ---------------------------------------------------------------------------
// Transaction execution helpers (Session 2+)
// ---------------------------------------------------------------------------

interface UnknownAccount {
  execute: (calls: Call[]) => Promise<{ transaction_hash: string }>;
}

/**
 * Execute a list of Starknet calls on behalf of the connected wallet.
 * - Cartridge: uses probe() to get the WalletAccount without showing a popup
 * - Argent X / Braavos: uses the injected wallet's account object
 * Returns the transaction hash.
 */
export async function executeTransaction(
  walletId: WalletId,
  calls: Call[],
): Promise<string> {
  if (walletId === 'cartridge') {
    const connector = getCartridgeConnector();
    const account = await connector.probe();
    if (!account) throw new Error('Cartridge not connected. Please reconnect your account.');
    const result = await account.execute(calls);
    if (!result?.transaction_hash) throw new Error('Cartridge: transaction hash was not returned.');
    return result.transaction_hash;
  }

  const wallet = getWalletObject(walletId);
  if (!wallet) throw new Error(`Wallet "${walletId}" is not available.`);
  const account = wallet.account as UnknownAccount;
  if (!account?.execute) throw new Error('Wallet does not support transaction execution.');
  const result = await account.execute(calls);
  return result.transaction_hash;
}
