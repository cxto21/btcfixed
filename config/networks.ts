export const NETWORKS = {
  sepolia: {
    name: 'Starknet Sepolia',
    chainId: '0x534e5f5345504f4c4941',
    rpcUrl:
      (import.meta.env.VITE_STARKNET_RPC_URL as string) ||
      'https://free-rpc.nethermind.io/sepolia-juno/',
    explorerUrl: 'https://sepolia.starkscan.co',
    isTestnet: true,
  },
  mainnet: {
    name: 'Starknet Mainnet',
    chainId: '0x534e5f4d41494e',
    rpcUrl:
      (import.meta.env.VITE_STARKNET_RPC_URL as string) ||
      'https://free-rpc.nethermind.io/mainnet-juno/',
    explorerUrl: 'https://starkscan.co',
    isTestnet: false,
  },
} as const;

export type NetworkName = keyof typeof NETWORKS;

export const ACTIVE_NETWORK: NetworkName =
  ((import.meta.env.VITE_STARKNET_NETWORK as string) as NetworkName) || 'sepolia';

export const ACTIVE_NETWORK_CONFIG = NETWORKS[ACTIVE_NETWORK];
