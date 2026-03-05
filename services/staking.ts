/**
 * StarkZap staking service — Session 2
 *
 * Provides read and write operations for STRK delegation staking
 * using the official Starknet staking protocol via StarkZap SDK.
 *
 * Architecture:
 *  - Read-only ops: use a minimal WalletInterface adapter (address + callContract)
 *  - Write ops: use staking.populate*() to get Call[] → execute via connected wallet
 */
import { Staking, Amount, mainnetValidators, getStakingPreset } from 'starkzap';
import type { WalletInterface, PoolMember } from 'starkzap';
import type { Call, RpcProvider } from 'starknet';
import { getSDK } from './sdk';

// ---------------------------------------------------------------------------
// Featured validators for BTCFixed
// ---------------------------------------------------------------------------

export const FEATURED_VALIDATORS = [
  { key: 'AVNU', ...mainnetValidators.AVNU },
  { key: 'KARNOT', ...mainnetValidators.KARNOT },
  { key: 'NETHERMIND', ...mainnetValidators.NETHERMIND },
] as const;

export type ValidatorKey = 'AVNU' | 'KARNOT' | 'NETHERMIND';

/**
 * Approximate protocol-level STRK staking APY based on Starknet inflation.
 * The effective user APY is: PROTOCOL_APY × (1 - commission / 100)
 */
export const PROTOCOL_APY = 7.4;

export function calcEffectiveAPY(commissionPercent: number): number {
  return parseFloat((PROTOCOL_APY * (1 - commissionPercent / 100)).toFixed(2));
}

// ---------------------------------------------------------------------------
// Cached instances
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _strkToken: any | null = null;
const _stakingCache = new Map<ValidatorKey, Staking>();

async function getStrkToken() {
  if (_strkToken) return _strkToken;
  const sdk = getSDK();
  const tokens = await sdk.stakingTokens();
  const strk = tokens.find((t) => t.symbol === 'STRK');
  if (!strk) throw new Error('STRK is not listed as a stakeable token on this network');
  _strkToken = strk;
  return _strkToken;
}

export async function getStakingForValidator(key: ValidatorKey): Promise<Staking> {
  const cached = _stakingCache.get(key);
  if (cached) return cached;

  const sdk = getSDK();
  const validator = mainnetValidators[key];
  const strkToken = await getStrkToken();
  const provider = sdk.getProvider();
  const stakingConfig = getStakingPreset('SN_MAIN');

  const staking = await Staking.fromStaker(
    validator.stakerAddress,
    strkToken,
    provider,
    stakingConfig,
  );

  _stakingCache.set(key, staking);
  return staking;
}

// ---------------------------------------------------------------------------
// Minimal read-only wallet adapter for position queries
// ---------------------------------------------------------------------------

function makeReadWallet(address: string, provider: RpcProvider): WalletInterface {
  return {
    address: address as WalletInterface['address'],
    callContract: (call: Call) => provider.callContract(call),
    isDeployed: () => Promise.resolve(true),
    ensureReady: () => Promise.resolve(),
    deploy: () => Promise.reject(new Error('read-only wallet')),
    execute: () => Promise.reject(new Error('read-only wallet')),
    tx: () => { throw new Error('read-only wallet'); },
    signMessage: () => Promise.reject(new Error('read-only wallet')),
    preflight: () => Promise.reject(new Error('read-only wallet')),
  } as unknown as WalletInterface;
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Get the validator's commission rate (e.g. 10 = 10%). */
export async function getValidatorCommission(key: ValidatorKey): Promise<number> {
  const staking = await getStakingForValidator(key);
  return staking.getCommission();
}

/** Get the current pool member position for a given address. Returns null if not staked. */
export async function getUserPosition(
  key: ValidatorKey,
  address: string,
): Promise<PoolMember | null> {
  const sdk = getSDK();
  const staking = await getStakingForValidator(key);
  const readWallet = makeReadWallet(address, sdk.getProvider());
  return staking.getPosition(readWallet);
}

/** Check if address is already a pool member. */
export async function isPoolMember(key: ValidatorKey, address: string): Promise<boolean> {
  const sdk = getSDK();
  const staking = await getStakingForValidator(key);
  const readWallet = makeReadWallet(address, sdk.getProvider());
  return staking.isMember(readWallet);
}

// ---------------------------------------------------------------------------
// Write: build Call arrays for wallet execution
// ---------------------------------------------------------------------------

/** Build approve + stake Call[]. Handles enter (first time) vs add (existing member). */
export async function buildStakeCalls(
  key: ValidatorKey,
  address: string,
  amountStrk: string,
): Promise<Call[]> {
  const sdk = getSDK();
  const strkToken = await getStrkToken();
  const staking = await getStakingForValidator(key);
  const amount = Amount.parse(amountStrk, strkToken);
  const readWallet = makeReadWallet(address, sdk.getProvider());
  const member = await staking.isMember(readWallet);

  if (member) {
    return staking.populateAdd(address as WalletInterface['address'], amount);
  }
  return staking.populateEnter(address as WalletInterface['address'], amount);
}

/** Build exit-intent Call (starts unstaking process, amount stops earning rewards). */
export async function buildExitIntentCalls(
  key: ValidatorKey,
  amountStrk: string,
): Promise<Call[]> {
  const strkToken = await getStrkToken();
  const staking = await getStakingForValidator(key);
  const amount = Amount.parse(amountStrk, strkToken);
  return [staking.populateExitIntent(amount)];
}

/** Build exit Call (completes unstaking after exit window has passed). */
export async function buildExitCalls(
  key: ValidatorKey,
  address: string,
): Promise<Call[]> {
  const staking = await getStakingForValidator(key);
  return [staking.populateExit(address as WalletInterface['address'])];
}

/** Build claim-rewards Call. */
export async function buildClaimCalls(
  key: ValidatorKey,
  address: string,
): Promise<Call[]> {
  const staking = await getStakingForValidator(key);
  return [staking.populateClaimRewards(address as WalletInterface['address'])];
}
