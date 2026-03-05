// BTCFixed – Wallet definitions for browser-injected Starknet wallets

export type WalletId = 'argentX' | 'braavos' | 'any';

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
  any: {
    id: 'any',
    name: 'Starknet Wallet',
    icon: '',
    installUrl: 'https://www.starknet.io/en/ecosystem/wallets',
  },
};

export function detectAvailableWallets(): WalletInfo[] {
  const found: WalletInfo[] = [];
  if (typeof window === 'undefined') return found;
  if (window.starknet_argentX) found.push(WALLET_METADATA.argentX);
  if (window.starknet_braavos) found.push(WALLET_METADATA.braavos);
  if (!found.length && window.starknet) found.push(WALLET_METADATA.any);
  return found;
}

export function getWalletObject(id: WalletId): StarknetBrowserWallet | null {
  if (typeof window === 'undefined') return null;
  if (id === 'argentX') return window.starknet_argentX ?? null;
  if (id === 'braavos') return window.starknet_braavos ?? null;
  return window.starknet ?? null;
}

export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
