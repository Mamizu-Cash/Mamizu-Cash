import { createPublicClient, http, defineChain, parseAbiItem } from 'viem';
import { CONTRACT_ADDRESSES } from './web3/contracts';

// Kaigan chain configuration
const kaiganChain = defineChain({
  id: 5278000,
  name: 'JSC Kaigan Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.kaigan.jsc.dev/rpc?token=QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q'],
    },
  },
  testnet: true,
});

const mamizuCashAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'commitment', type: 'bytes32' },
      { indexed: false, internalType: 'uint32', name: 'leafIndex', type: 'uint32' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    name: 'Deposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'nullifierHash', type: 'bytes32' },
      { indexed: false, internalType: 'address', name: 'relayer', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' }
    ],
    name: 'Withdrawal',
    type: 'event'
  }
] as const;

let publicClient: ReturnType<typeof createPublicClient> | null = null;

function getPublicClient() {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: kaiganChain,
      transport: http()
    });
  }
  return publicClient;
}

/**
 * Fetch all deposit commitments from the MamizuCash contract
 */
export async function getCommitments(): Promise<string[]> {
  try {
    const client = getPublicClient();

    // Parse event ABI using parseAbiItem
    const depositEvent = parseAbiItem(
      'event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp)'
    );

    console.log('Fetching deposits from:', CONTRACT_ADDRESSES.MAMIZU_CASH);

    // Get all Deposit events from the contract
    const logs = await client.getLogs({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      event: depositEvent,
      fromBlock: 0n,
      toBlock: 'latest'
    });

    // Extract commitments and sort by leafIndex for proper tree construction
    const commitments = logs
      .map(log => ({
        commitment: log.args.commitment!,
        leafIndex: Number(log.args.leafIndex!)
      }))
      .sort((a, b) => a.leafIndex - b.leafIndex)
      .map(item => item.commitment);

    console.log(`Found ${commitments.length} commitments from contract`);
    return commitments;
  } catch (error) {
    console.error('Failed to fetch commitments:', error);
    throw new Error('Failed to load commitments from contract');
  }
}

/**
 * Check if a nullifier hash has been spent (used for withdrawal)
 */
export async function isNullifierSpent(nullifierHash: string): Promise<boolean> {
  try {
    const client = getPublicClient();

    // Get all Withdrawal events and check if our nullifier is there
    const logs = await client.getLogs({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      event: {
        type: 'event',
        name: 'Withdrawal',
        inputs: [
          { type: 'address', name: 'to' },
          { type: 'bytes32', name: 'nullifierHash' },
          { type: 'address', name: 'relayer' },
          { type: 'uint256', name: 'fee' }
        ]
      },
      fromBlock: 'earliest',
      toBlock: 'latest'
    });

    // Check if any withdrawal used this nullifier
    return logs.some(log => log.args.nullifierHash === nullifierHash);
  } catch (error) {
    console.error('Failed to check nullifier status:', error);
    // Return false if we can't check (better to allow the transaction to fail on-chain)
    return false;
  }
}

/**
 * Find the index of a commitment in the commitment array
 */
export async function findCommitmentIndex(commitment: string): Promise<number> {
  const commitments = await getCommitments();
  const index = commitments.indexOf(commitment);
  if (index === -1) {
    throw new Error('Commitment not found in tree');
  }
  return index;
}