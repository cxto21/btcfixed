
export type TabType = 'dashboard' | 'bridge' | 'staking' | 'lending' | 'verify' | 'activity';

export type RouteType = TabType | 'community' | 'docs' | 'about';

export interface TokenData {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  price: number;
  change24h: number;
}
