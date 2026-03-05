/**
 * StarkZap SDK singleton.
 * Initialized lazily and reused across Sessions 2-N (staking, swaps, lending).
 */
import { StarkZap } from 'starkzap';
import { ACTIVE_NETWORK } from '../config/networks';

let _sdk: StarkZap | null = null;

export function getSDK(): StarkZap {
  if (!_sdk) {
    _sdk = new StarkZap({ network: ACTIVE_NETWORK });
  }
  return _sdk;
}
