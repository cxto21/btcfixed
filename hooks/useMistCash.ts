import { useCallback, useEffect, useRef, useState } from 'react';
import { Contract, RpcProvider } from 'starknet';
import { ACTIVE_NETWORK_CONFIG } from '../config/networks';
import { executeTransaction, type WalletId } from '../config/wallets';

// MistCash SDK and config are loaded dynamically to avoid bloating the main bundle
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _mistSdk: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _mistConfig: any = null;

async function loadMistCash() {
  if (!_mistSdk) {
    const [sdk, config] = await Promise.all([
      import('@mistcash/sdk'),
      import('@mistcash/config'),
    ]);
    _mistSdk = sdk;
    _mistConfig = config;
  }
  return { sdk: _mistSdk, config: _mistConfig };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MistStep = 'idle' | 'deposit' | 'withdraw';
export type MistStatus =
  | 'ready'
  | 'initializing'
  | 'approving'
  | 'depositing'
  | 'finding_tx'
  | 'proving'
  | 'withdrawing'
  | 'success'
  | 'error';

export interface MistToken {
  symbol: string;
  address: string;
  decimals: number;
}

export const MIST_TOKENS: MistToken[] = [
  {
    symbol: 'ETH',
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    decimals: 18,
  },
  {
    symbol: 'STRK',
    address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    decimals: 6,
  },
];

// Minimal ERC-20 ABI for approve
const ERC20_APPROVE_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'core::starknet::contract_address::ContractAddress' },
      { name: 'amount', type: 'core::integer::u256' },
    ],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'external',
  },
] as const;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Asset = any;

export interface UseMistCashResult {
  // State
  status: MistStatus;
  statusMessage: string;
  error: string | null;
  txHash: string | null;
  chamberAddress: string;

  // SDK init
  isReady: boolean;

  // Deposit flow
  deposit: (token: MistToken, amount: string) => Promise<{ claimKey: string; recipientAddress: string } | null>;

  // Withdraw flow
  claimKey: string;
  setClaimKey: (v: string) => void;
  recipientAddress: string;
  setRecipientAddress: (v: string) => void;
  foundAsset: Asset | null;
  findAsset: () => Promise<Asset | null>;
  withdraw: () => Promise<string | null>;

  // Helpers
  reset: () => void;
  formatAmount: (amount: bigint, decimals: number) => string;
  parseAmount: (amountStr: string, decimals: number) => bigint;
}

export function useMistCash(
  walletId: WalletId | null,
  userAddress: string | null,
): UseMistCashResult {
  const [status, setStatus] = useState<MistStatus>('initializing');
  const [statusMessage, setStatusMessage] = useState('Initializing privacy engine…');
  const [error, setError] = useState<string | null>(null);
  const [resultTxHash, setResultTxHash] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Withdraw state
  const [claimKey, setClaimKey] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [foundAsset, setFoundAsset] = useState<Asset | null>(null);

  // Provider + contract (read-only)
  const providerRef = useRef<RpcProvider | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contractRef = useRef<any>(null);
  const chamberAddrRef = useRef('');

  // ---------------------------------------------------------------------------
  // Init WASM + contract (dynamic import)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { sdk, config } = await loadMistCash();
        const provider = new RpcProvider({ nodeUrl: ACTIVE_NETWORK_CONFIG.rpcUrl });
        providerRef.current = provider;
        chamberAddrRef.current = config.CHAMBER_ADDR_MAINNET;
        contractRef.current = new Contract(
          config.CHAMBER_ABI,
          config.CHAMBER_ADDR_MAINNET,
          provider,
        );
        await sdk.initCore();
        if (!cancelled) {
          setIsReady(true);
          setStatus('ready');
          setStatusMessage('');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'Failed to initialize privacy engine');
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---------------------------------------------------------------------------
  // Deposit: approve ERC-20 + deposit to Chamber
  // ---------------------------------------------------------------------------

  const deposit = useCallback(async (token: MistToken, amountStr: string) => {
    if (!walletId || !userAddress || !contractRef.current) {
      setError('Wallet not connected');
      return null;
    }

    try {
      const { sdk } = await loadMistCash();
      setError(null);
      setResultTxHash(null);

      // 1. Generate claiming key
      const newClaimKey = sdk.generateClaimingKey();
      const recipientAddr = userAddress;

      // 2. Compute tx hash for the merkle tree
      const amount = sdk.fmtAmtToBigInt(amountStr, token.decimals);
      const hash = sdk.txHash(
        newClaimKey,
        recipientAddr,
        BigInt(token.address).toString(),
        amount.toString(),
      );

      // 3. Approve ERC-20 transfer to Chamber
      setStatus('approving');
      setStatusMessage('Approving token transfer…');

      const erc20 = new Contract(
        ERC20_APPROVE_ABI as Parameters<typeof Contract>[0],
        token.address,
        providerRef.current!,
      );
      const approveCall = erc20.populate('approve', [chamberAddrRef.current, amount]);

      // 4. Deposit to Chamber (batch approve + deposit)
      setStatus('depositing');
      setStatusMessage('Depositing to privacy pool…');

      const chamber = contractRef.current;
      const depositCall = chamber.populate('deposit', [
        hash,
        { amount, addr: token.address },
      ]);

      const tx = await executeTransaction(walletId, [approveCall, depositCall]);
      setResultTxHash(tx);
      setStatus('success');
      setStatusMessage('Deposit successful!');

      return { claimKey: newClaimKey, recipientAddress: recipientAddr };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Deposit failed';
      setError(msg);
      setStatus('error');
      setStatusMessage('');
      return null;
    }
  }, [walletId, userAddress]);

  // ---------------------------------------------------------------------------
  // Withdraw: find asset → generate ZK proof → call handle_zkp
  // ---------------------------------------------------------------------------

  const findAsset = useCallback(async (): Promise<Asset | null> => {
    if (!contractRef.current || !claimKey || !recipientAddress) {
      setError('Enter claiming key and recipient address');
      return null;
    }

    try {
      const { sdk } = await loadMistCash();
      setError(null);
      setStatus('finding_tx');
      setStatusMessage('Searching for transaction…');

      const asset = await sdk.fetchTxAssets(contractRef.current, claimKey, recipientAddress);
      if (asset.amount === 0n || asset.amount === BigInt(0)) {
        setError('No funds found for this key');
        setFoundAsset(null);
        setStatus('ready');
        setStatusMessage('');
        return null;
      }

      setFoundAsset(asset);
      setStatus('ready');
      setStatusMessage('');
      return asset;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to find transaction';
      setError(msg);
      setStatus('error');
      setStatusMessage('');
      return null;
    }
  }, [claimKey, recipientAddress]);

  const withdraw = useCallback(async (): Promise<string | null> => {
    if (!contractRef.current || !walletId || !foundAsset) {
      setError('No asset to withdraw');
      return null;
    }

    try {
      const { sdk } = await loadMistCash();
      setError(null);
      setStatus('proving');
      setStatusMessage('Generating ZK proof… This may take a moment.');

      const contract = contractRef.current;

      // Fetch merkle tree
      const txLeaves = (await contract.tx_array()) as bigint[];
      const merkleRoot = (await contract.merkle_root()) as bigint;

      const tx_hash = sdk.txHash(
        claimKey,
        recipientAddress,
        BigInt(foundAsset.addr).toString(),
        BigInt(foundAsset.amount).toString(),
      );
      const tx_index = txLeaves.indexOf(tx_hash);
      if (tx_index === -1) {
        setError('Transaction not found in merkle tree');
        setStatus('error');
        return null;
      }

      const merkleProofWRoot = sdk.calculateMerkleRootAndProof(txLeaves, tx_index);
      const merkleProof = merkleProofWRoot
        .slice(0, merkleProofWRoot.length - 1)
        .map((bi: bigint) => bi.toString());

      // Full withdrawal — no re-keying
      const dummySecret = sdk.txSecret(sdk.generateClaimingKey(), recipientAddress);

      const witness = {
        ClaimingKey: claimKey,
        Owner: recipientAddress,
        TxAsset: {
          Amount: BigInt(foundAsset.amount).toString(),
          Addr: foundAsset.addr,
        },
        MerkleProof: [...merkleProof, ...new Array(20 - merkleProof.length).fill('0')],
        MerkleRoot: merkleRoot.toString(),
        Withdraw: {
          Amount: BigInt(foundAsset.amount).toString(),
          Addr: foundAsset.addr,
        },
        Tx1Secret: dummySecret.toString(),
      };

      const calldata = (await sdk.full_prove(witness)).slice(1);

      // Send withdraw transaction
      setStatus('withdrawing');
      setStatusMessage('Submitting withdrawal…');

      const chamberCall = contract.populate('handle_zkp', [calldata]);
      const tx = await executeTransaction(walletId, [chamberCall]);

      setResultTxHash(tx);
      setFoundAsset(null);
      setStatus('success');
      setStatusMessage('Withdrawal successful!');
      return tx;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Withdrawal failed';
      setError(msg);
      setStatus('error');
      setStatusMessage('');
      return null;
    }
  }, [walletId, claimKey, recipientAddress, foundAsset]);

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    setStatus('ready');
    setStatusMessage('');
    setError(null);
    setResultTxHash(null);
    setFoundAsset(null);
    setClaimKey('');
    setRecipientAddress('');
  }, []);

  // Wrap fmtAmount / fmtAmtToBigInt safely — they're sync helpers from the SDK
  const formatAmount = useCallback((amount: bigint, decimals: number) => {
    if (_mistSdk) return _mistSdk.fmtAmount(amount, decimals);
    return '0';
  }, []);

  const parseAmount = useCallback((amountStr: string, decimals: number) => {
    if (_mistSdk) return _mistSdk.fmtAmtToBigInt(amountStr, decimals);
    return 0n;
  }, []);

  return {
    status,
    statusMessage,
    error,
    txHash: resultTxHash,
    chamberAddress: chamberAddrRef.current,
    isReady,
    deposit,
    claimKey,
    setClaimKey,
    recipientAddress,
    setRecipientAddress,
    foundAsset,
    findAsset,
    withdraw,
    reset,
    formatAmount,
    parseAmount,
  };
}
