
export type TabType = 'dashboard' | 'bridge' | 'staking' | 'lending' | 'verify' | 'activity';

export interface TokenData {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  price: number;
  change24h: number;
}