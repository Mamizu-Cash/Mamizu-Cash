import * as circomlibjs from 'circomlibjs';
import { utils } from 'ffjavascript';
import { MerkleTree } from 'fixed-merkle-tree';
import * as snarkjs from 'snarkjs';

// Constants matching the contract
const MERKLE_TREE_HEIGHT = 10;
const ZERO_VALUE = '21663839004416932945382355908790599225266501822907911457504978515578255421292';

// Contract's precomputed zero values for each level
const CONTRACT_ZEROS = [
  '0x2fe54c60d3acabf3343a35b6eba15db4821b340f76e741e2249685ed4899af6c',
  '0x256a6135777eee2fd26f54b8b7037a25439d5235caee224154186d2b8a52e31d',
  '0x1151949895e82ab19924de92c40a3d6f7bcb60d92b00504b8199613683f0c200',
  '0x20121ee811489ff8d61f09fb89e313f14959a0f28bb428a20dba6b0b068b3bdb',
  '0x0a89ca6ffa14cc462cfedb842c30ed221a50a3d6bf022a6a57dc82ab24c157c9',
  '0x24ca05c2b5cd42e890d6be94c68d0689f4f21c9cec9c0f13fe41d566dfb54959',
  '0x1ccb97c932565a92c60156bdba2d08f3bf1377464e025cee765679e604a7315c',
  '0x19156fbd7d1a8bf5cba8909367de1b624534ebab4f0f79e003bccdd1b182bdb4',
  '0x261af8c1f0912e465744641409f622d466c3920ac6e5ff37e36604cb11dfff80',
  '0x0058459724ff6ca5a1652fcbc3e82b93895cf08e975b19beab3f54c217d1c007'
].map(hex => BigInt(hex).toString());

// Initialize circomlib modules
let mimcSponge: any;
let babyJub: any;
let pedersenHasher: any;
let initialized = false;

async function initializeCircomlib() {
  if (!initialized) {
    babyJub = await circomlibjs.buildBabyjub();
    pedersenHasher = await circomlibjs.buildPedersenHash();
    mimcSponge = await circomlibjs.buildMimcSponge();
    initialized = true;
  }
}

/** Compute MiMC sponge hash for Merkle tree (matches Circom implementation) */
const mimcSpongeHash = (left: string, right: string): string => {
  if (!mimcSponge) {
    throw new Error('Circomlib not initialized. Call initializeCircomlib() first.');
  }
  const hash = mimcSponge.multiHash([BigInt(left), BigInt(right)], 0, 1);

  // Handle different return types from mimcSponge.multiHash
  if (Array.isArray(hash)) {
    return hash[0].toString();
  } else if (hash instanceof Uint8Array) {
    return mimcSponge.F.toString(hash);
  } else {
    return hash.toString();
  }
};

/** Compute Pedersen hash */
const pedersenHash = (data: Buffer): bigint => {
  const hash = pedersenHasher.hash(data);
  const unpacked = babyJub.unpackPoint(hash);
  return utils.leBuff2int(unpacked[0]);
};

/** BigNumber to hex string of specified length */
export function toHex(number: any, length = 32): string {
  let str: string;
  if (number instanceof Buffer) {
    str = number.toString('hex');
  } else if (Array.isArray(number)) {
    // Handle array like [46,108,193,89,...]
    str = Buffer.from(number).toString('hex');
  } else if (typeof number === 'object' && number.toString) {
    // Handle ffjavascript F field element
    str = number.toString(16);
  } else {
    str = BigInt(number).toString(16);
  }
  return '0x' + str.padStart(length * 2, '0');
}

/**
 * Parse note string to extract nullifier and secret
 * Note format: "mamizucash-<network>-<amount>-0x<nullifier>-<secret>"
 */
export function parseNote(note: string): { nullifier: bigint; secret: bigint } {
  const parts = note.split('-');
  if (parts.length < 5 || parts[0] !== 'mamizucash') {
    throw new Error('Invalid note format');
  }

  // Extract nullifier and secret from the last part (concatenated hex)
  const noteHex = parts.slice(3).join(''); // Join parts after amount
  const nullifierHex = noteHex.slice(0, 64); // First 32 bytes
  const secretHex = noteHex.slice(64, 128); // Second 32 bytes

  return {
    nullifier: BigInt('0x' + nullifierHex),
    secret: BigInt('0x' + secretHex)
  };
}

/**
 * Generate merkle proof from deposit events
 */
export async function generateMerkleProof(
  commitments: string[],
  leafIndex: number
): Promise<{ pathElements: string[]; pathIndices: number[]; root: string }> {
  await initializeCircomlib();

  const leaves = commitments.map(commitment => BigInt(commitment).toString());

  const tree = new MerkleTree(MERKLE_TREE_HEIGHT, leaves, {
    hashFunction: mimcSpongeHash,
    zeroElement: ZERO_VALUE
  });

  const { pathElements, pathIndices } = tree.path(leafIndex);

  // Ensure pathElements has exactly 10 elements (matching circuit levels)
  const paddedPathElements = [...pathElements];
  const paddedPathIndices = [...pathIndices];

  let zeroIndex = pathElements.length;
  while (paddedPathElements.length < 10) {
    paddedPathElements.push(CONTRACT_ZEROS[zeroIndex] || '0');
    paddedPathIndices.push(0);
    zeroIndex++;
  }

  // Convert to string format for circom
  const stringPathElements = paddedPathElements.map(el => el.toString());
  const numberPathIndices = paddedPathIndices.map(idx => Number(idx));

  return {
    pathElements: stringPathElements,
    pathIndices: numberPathIndices,
    root: tree.root
  };
}

/**
 * Generate witness input for zk-SNARK circuit
 */
export async function generateWitnessInput({
  commitments,
  nullifier,
  secret,
  leafIndex,
  recipient,
  relayerAddress = '0x0000000000000000000000000000000000000000',
  fee = '0'
}: {
  commitments: string[];
  nullifier: bigint | string;
  secret: bigint | string;
  leafIndex: number;
  recipient: string;
  relayerAddress?: string;
  fee?: string | bigint;
}) {
  await initializeCircomlib();

  // Calculate nullifier hash
  const nullifierBuff = utils.leInt2Buff(BigInt(nullifier), 31);
  const nullifierHash = pedersenHash(nullifierBuff);

  // Generate merkle proof
  const { root, pathElements, pathIndices } = await generateMerkleProof(commitments, leafIndex);

  return {
    // Public inputs
    root: root,
    nullifierHash: BigInt(nullifierHash).toString(),
    recipient: BigInt(recipient).toString(),
    relayer: BigInt(relayerAddress).toString(),
    fee: BigInt(fee).toString(),

    // Private inputs
    nullifier: BigInt(nullifier).toString(),
    secret: BigInt(secret).toString(),
    pathElements: pathElements,
    pathIndices: pathIndices,
  };
}

/**
 * Format proof for Solidity (based on gen_proof_calldata.py)
 * Returns proof elements as array for uint256[8] encoding
 */
export function formatProofForSolidity(proof: any): string[] {
  // Return array of 8 proof elements for uint256[8] ABI encoding
  return [
    toHex(proof.pi_a[0]),
    toHex(proof.pi_a[1]),
    toHex(proof.pi_b[0][1]),
    toHex(proof.pi_b[0][0]),
    toHex(proof.pi_b[1][1]),
    toHex(proof.pi_b[1][0]),
    toHex(proof.pi_c[0]),
    toHex(proof.pi_c[1])
  ];
}

/**
 * Generate zk-SNARK proof using snarkjs
 */
export async function generateProof(
  input: any,
  wasmPath: string,
  zkeyPath: string
): Promise<{ proof: any; publicSignals: any }> {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );
  return { proof, publicSignals };
}

/**
 * Complete withdraw process
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
  fee?: string | bigint;
  wasmPath?: string;
  zkeyPath?: string;
}) {
  await initializeCircomlib();

  // Parse note to get nullifier and secret
  const { nullifier, secret } = parseNote(note);

  // Calculate commitment from nullifier and secret
  const preimage = Buffer.concat([
    utils.leInt2Buff(nullifier, 31),
    utils.leInt2Buff(secret, 31)
  ]);
  const commitment = pedersenHash(preimage);
  const commitmentHex = toHex(commitment);

  // Find leaf index of commitment
  const leafIndex = commitments.findIndex(c =>
    BigInt(c).toString() === BigInt(commitment).toString()
  );

  if (leafIndex === -1) {
    throw new Error('Commitment not found in the tree');
  }

  // Generate witness input
  const witnessInput = await generateWitnessInput({
    commitments,
    nullifier,
    secret,
    leafIndex,
    recipient,
    relayerAddress,
    fee
  });

  // Generate proof
  const { proof, publicSignals } = await generateProof(
    witnessInput,
    wasmPath,
    zkeyPath
  );

  // Format proof for Solidity
  const solidityProof = formatProofForSolidity(proof);

  // Calculate nullifier hash for the contract
  const nullifierBuff = utils.leInt2Buff(nullifier, 31);
  const nullifierHash = pedersenHash(nullifierBuff);
  const nullifierHex = toHex(nullifierHash);

  return {
    proof: solidityProof,
    root: toHex(witnessInput.root),
    nullifierHash: nullifierHex,
    recipient,
    relayer: relayerAddress,
    fee: BigInt(fee),
    publicSignals
  };
}