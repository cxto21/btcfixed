export interface TokenConfig {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  coingeckoId: string;
}

// Starknet Sepolia token addresses (verified from Starknet docs)
export const SEPOLIA_TOKENS: Record<string, TokenConfig> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    decimals: 18,
    coingeckoId: 'ethereum',
  },
  STRK: {
    symbol: 'STRK',
    name: 'Stark',
    address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    decimals: 18,
    coingeckoId: 'starknet',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    decimals: 6,
    coingeckoId: 'usd-coin',
  },
};

// Starknet Mainnet – verified addresses from AVNU / StarkZap presets
export const MAINNET_TOKENS: Record<string, TokenConfig> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    decimals: 18,
    coingeckoId: 'ethereum',
  },
  STRK: {
    symbol: 'STRK',
    name: 'Stark',
    address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    decimals: 18,
    coingeckoId: 'starknet',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    decimals: 6,
    coingeckoId: 'usd-coin',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    decimals: 6,
    coingeckoId: 'tether',
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    address: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
    decimals: 8,
    coingeckoId: 'wrapped-bitcoin',
  },
};

import { ACTIVE_NETWORK } from './networks';
export const ACTIVE_TOKENS =
  ACTIVE_NETWORK === 'sepolia' ? SEPOLIA_TOKENS : MAINNET_TOKENS;
