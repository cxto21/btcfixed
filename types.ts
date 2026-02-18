
export type TabType = 'dashboard' | 'bridge' | 'staking' | 'lending' | 'verify';

export interface TokenData {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  price: number;
  change24h: number;
}

export interface Activity {
  id: string;
  type: 'Bridge' | 'Stake' | 'Mint' | 'Borrow' | 'Repay';
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: string;
}
