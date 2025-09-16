import * as snarkjs from 'snarkjs';
import { MerkleTree } from 'fixed-merkle-tree';
import { buildMimcSponge, buildPedersenHash, buildBabyjub } from 'circomlibjs';

// Constants
const ZERO_VALUE = '21663839004416932945382355808790599225266501822907911457504978515578255421292';
const MERKLE_TREE_HEIGHT = 10;

// Global instances
let mimcSponge: any;
let pedersenHasher: any;
let babyJub: any;
let initialized = false;

// Initialize circomlib instances
async function initializeCircomlib() {
  if (initialized) return;

  [mimcSponge, pedersenHasher, babyJub] = await Promise.all([
    buildMimcSponge(),
    buildPedersenHash(),
    buildBabyjub()
  ]);

  initialized = true;
}

// MiMC sponge hash function for Merkle tree
function mimcSpongeHash(left: any, right: any): string {
  if (!mimcSponge) {
    throw new Error('MiMCSponge not initialized');
  }

  const hash = mimcSponge.multiHash([BigInt(left), BigInt(right)], 0, 1);

  if (Array.isArray(hash)) {
    return hash[0].toString();
  } else if (hash.xL) {
    return mimcSponge.F.toObject(hash.xL).toString();
  } else {
    return mimcSponge.F.toObject(hash).toString();
  }
}

// Pedersen hash function
function pedersenHash(data: Uint8Array): string {
  if (!pedersenHasher || !babyJub) {
    throw new Error('Pedersen hasher not initialized');
  }

  const hash = pedersenHasher.hash(data);
  const unpacked = babyJub.unpackPoint(hash);
  return babyJub.F.toObject(unpacked[0]).toString();
}


// Convert BigInt to little-endian bytes
function toBuffer(bigint: bigint, length: number = 32): Uint8Array {
  const hex = bigint.toString(16).padStart(length * 2, '0');
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = parseInt(hex.slice((length - 1 - i) * 2, (length - i) * 2), 16);
  }
  return bytes;
}

export interface ParsedNote {
  nullifier: bigint;
  secret: bigint;
  commitment: string;
}

/**
 * Parse note from the deposit format
 */
export function parseNote(note: string): ParsedNote {
  try {
    // Remove prefix if present
    const cleanNote = note.replace(/^mamizucash-mainnet-1eth-/, '');

    // Decode base64 URL-safe
    const decoded = atob(cleanNote.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(decoded);

    return {
      nullifier: BigInt(data.nullifier),
      secret: BigInt(data.secret),
      commitment: data.commitment
    };
  } catch (error) {
    console.error('Failed to parse note:', error);
    throw new Error('Invalid note format');
  }
}

/**
 * Generate Merkle proof for withdrawal
 */
export async function generateMerkleProof(
  commitment: string,
  commitments: string[]
): Promise<{
  root: string;
  pathElements: string[];
  pathIndices: number[];
}> {
  await initializeCircomlib();

  // Normalize commitments to lowercase for comparison
  const normalizedCommitments = commitments.map(c => c.toLowerCase());
  const normalizedCommitment = commitment.toLowerCase();

  console.log('Looking for commitment:', normalizedCommitment);
  console.log('Available commitments:', normalizedCommitments);

  // Find commitment index
  const leafIndex = normalizedCommitments.indexOf(normalizedCommitment);
  if (leafIndex === -1) {
    console.error('Commitment not found!');
    console.error('Target:', normalizedCommitment);
    console.error('Available:', normalizedCommitments);
    throw new Error('Commitment not found in tree');
  }

  console.log(`Found commitment at index ${leafIndex}`);

  // Convert to BigInt strings as expected by fixed-merkle-tree
  const leaves = normalizedCommitments.map(c => BigInt(c).toString());

  // Create merkle tree with BigInt strings (matching privacy-pool implementation)
  const tree = new MerkleTree(MERKLE_TREE_HEIGHT, leaves, {
    hashFunction: mimcSpongeHash,
    zeroElement: ZERO_VALUE
  });

  console.log(`Tree created with ${leaves.length} leaves, requesting proof for index ${leafIndex}`);

  // Generate proof
  const proof = tree.proof(leafIndex);

  return {
    root: tree.root.toString(),
    pathElements: proof.pathElements.map((x: any) => x.toString()),
    pathIndices: proof.pathIndices
  };
}

/**
 * Prepare withdrawal parameters and generate ZK proof
 */
export async function prepareWithdraw({
  note,
  commitments,
  recipient,
  relayerAddress = '0x0000000000000000000000000000000000000000',
  fee = '0',
  wasmPath = '/withdraw.wasm',
  zkeyPath = '/withdraw_0001.zkey'
}: {
  note: string;
  commitments: string[];
  recipient: string;
  relayerAddress?: string;
  fee?: string;
  wasmPath?: string;
  zkeyPath?: string;
}) {
  await initializeCircomlib();

  // Parse the note
  const { nullifier, secret, commitment } = parseNote(note);

  // Generate nullifier hash
  const nullifierBuffer = new Uint8Array(64);
  nullifierBuffer.set(toBuffer(nullifier, 31), 0);
  nullifierBuffer.set(toBuffer(secret, 31), 31);
  const nullifierHash = '0x' + pedersenHash(nullifierBuffer);

  // Generate merkle proof
  const merkleProof = await generateMerkleProof(commitment, commitments);

  // Ensure we have exactly 10 path elements
  while (merkleProof.pathElements.length < MERKLE_TREE_HEIGHT) {
    merkleProof.pathElements.push(ZERO_VALUE);
    merkleProof.pathIndices.push(0);
  }

  // Prepare circuit input
  const input = {
    root: merkleProof.root,
    nullifierHash: nullifierHash.slice(2), // Remove 0x prefix
    recipient: recipient.replace('0x', ''),
    relayer: relayerAddress.replace('0x', ''),
    fee: fee,
    nullifier: nullifier.toString(),
    secret: secret.toString(),
    pathElements: merkleProof.pathElements,
    pathIndices: merkleProof.pathIndices
  };

  console.log('Generating proof with input:', {
    root: input.root,
    nullifierHash: input.nullifierHash,
    recipient: input.recipient,
    pathElementsCount: input.pathElements.length
  });

  // Generate the proof
  const { proof } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );

  // Format proof for Solidity
  const solidityProof = [
    proof.pi_a[0], proof.pi_a[1],
    proof.pi_b[0][1], proof.pi_b[0][0],
    proof.pi_b[1][1], proof.pi_b[1][0],
    proof.pi_c[0], proof.pi_c[1]
  ];

  return {
    proof: solidityProof,
    root: '0x' + merkleProof.root,
    nullifierHash: nullifierHash,
    recipient: '0x' + recipient.replace('0x', ''),
    relayer: '0x' + relayerAddress.replace('0x', ''),
    fee: fee
  };
}