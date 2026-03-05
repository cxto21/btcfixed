/**
 * BTCFixed – Session 5: Activity Store
 *
 * Lightweight localStorage-backed transaction log.
 * Each successful transaction from Staking, Swaps, and Lending
 * writes an entry here. ActivityHistory reads from here.
 */

export type ActivityType =
  | 'Stake'
  | 'Unstake'
  | 'ClaimRewards'
  | 'Swap'
  | 'Supply'
  | 'Withdraw';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  /** Human-readable label, e.g. "1.5 STRK", "0.1 ETH → 200 USDC" */
  label: string;
  txHash: string;
  /** ISO timestamp string */
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed';
  /** Explorer URL base (filled by reading ACTIVE_NETWORK_CONFIG at log time) */
  explorerBase: string;
}

const STORAGE_KEY = 'btcfixed:activity';
const MAX_ENTRIES = 50;

function load(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ActivityEntry[];
  } catch {
    return [];
  }
}

function save(entries: ActivityEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

/** Add a new activity entry (prepended, newest first). */
export function logActivity(entry: Omit<ActivityEntry, 'id' | 'timestamp'>): void {
  const entries = load();
  const newEntry: ActivityEntry = {
    ...entry,
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  save([newEntry, ...entries]);
}

/** Return all stored activity entries (newest first). */
export function getActivity(): ActivityEntry[] {
  return load();
}

/** Clear all activity (for testing). */
export function clearActivity(): void {
  localStorage.removeItem(STORAGE_KEY);
}
