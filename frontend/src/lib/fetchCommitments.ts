import { PublicClient, createPublicClient, http, parseAbiItem } from 'viem';
import { defineChain } from 'viem';
import MamizuCashAbi from '../abi/MamizuCash.abi.json';
import { CONTRACT_ADDRESSES } from './web3/contracts';

// Define Kaigan testnet chain
const kaiganTestnet = defineChain({
  id: 1031,
  name: 'Kaigan Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://eth-kaigan.provable.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.kaigan.network' },
  },
});

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: kaiganTestnet,
  transport: http(),
});

/**
 * Fetch all deposit events from the MamizuCash contract
 */
export async function getAllDeposits(): Promise<{
  commitments: string[];
  leafIndices: number[];
  timestamps: number[];
}> {
  try {
    // Get deposit events from the contract
    const depositEvents = await publicClient.getLogs({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      event: parseAbiItem('event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp)'),
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    // Extract data from events
    const commitments: string[] = [];
    const leafIndices: number[] = [];
    const timestamps: number[] = [];

    for (const event of depositEvents) {
      if (event.args?.commitment && event.args?.leafIndex !== undefined && event.args?.timestamp) {
        commitments.push(event.args.commitment);
        leafIndices.push(Number(event.args.leafIndex));
        timestamps.push(Number(event.args.timestamp));
      }
    }

    // Sort by leaf index to maintain correct order
    const sortedData = commitments
      .map((commitment, index) => ({
        commitment,
        leafIndex: leafIndices[index],
        timestamp: timestamps[index],
      }))
      .sort((a, b) => a.leafIndex - b.leafIndex);

    return {
      commitments: sortedData.map(item => item.commitment),
      leafIndices: sortedData.map(item => item.leafIndex),
      timestamps: sortedData.map(item => item.timestamp),
    };
  } catch (error) {
    console.error('Failed to fetch deposit events:', error);
    throw new Error('Failed to fetch commitments from the blockchain');
  }
}

/**
 * Get commitments array for merkle tree construction
 */
export async function getCommitments(): Promise<string[]> {
  const { commitments } = await getAllDeposits();
  return commitments;
}

/**
 * Find the leaf index of a specific commitment
 */
export async function findCommitmentIndex(targetCommitment: string): Promise<number> {
  const { commitments } = await getAllDeposits();

  // Normalize the commitment format for comparison
  const normalizeCommitment = (commitment: string) => {
    return BigInt(commitment).toString();
  };

  const normalizedTarget = normalizeCommitment(targetCommitment);
  const index = commitments.findIndex(commitment =>
    normalizeCommitment(commitment) === normalizedTarget
  );

  if (index === -1) {
    throw new Error(`Commitment ${targetCommitment} not found in the tree`);
  }

  return index;
}

/**
 * Check if a nullifier has been spent
 */
export async function isNullifierSpent(nullifierHash: string): Promise<boolean> {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: 'isSpent',
      args: [nullifierHash as `0x${string}`],
    });

    return result as boolean;
  } catch (error) {
    console.error('Failed to check nullifier status:', error);
    return false;
  }
}

/**
 * Get the current merkle tree root from the contract
 */
export async function getCurrentRoot(): Promise<string> {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: 'getLastRoot',
      args: [],
    });

    return result as string;
  } catch (error) {
    console.error('Failed to get current root:', error);
    throw new Error('Failed to get current merkle tree root');
  }
}

/**
 * Validate a merkle root against the contract's known roots
 */
export async function isKnownRoot(root: string): Promise<boolean> {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: 'isKnownRoot',
      args: [root as `0x${string}`],
    });

    return result as boolean;
  } catch (error) {
    console.error('Failed to validate root:', error);
    return false;
  }
}