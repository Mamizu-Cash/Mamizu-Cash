import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import * as circomlibjs from 'circomlibjs';
import { utils } from 'ffjavascript';
import { MerkleTree } from 'fixed-merkle-tree';
import * as snarkjs from 'snarkjs';

let babyJub: any;
let pedersenHasher: any;
let mimcSponge: any;
let initialized = false;

// Tornado-compliant constants
const FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
const ZERO_VALUE = 21663839004416932945382355908790599225266501822907911457504978515578255421292n; // keccak256("tornado") % FIELD_SIZE

/** Initialize circomlib modules */
export async function initializeCircomlib() {
  if (!initialized) {
    babyJub = await circomlibjs.buildBabyjub();
    pedersenHasher = await circomlibjs.buildPedersenHash();
    mimcSponge = await circomlibjs.buildMimcSponge();
    initialized = true;
  }
}

/** Convert 31-byte value to little-endian Buffer */
export const toBE31Buffer = (value: bigint): Buffer => {
  const buffer = Buffer.alloc(31);
  let v = value;
  for (let i = 0; i < 31; i++) {
    buffer[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return buffer;
};

/** Compute Pedersen hash XY coordinates (proper circomlib implementation) */
export const pedersenHashXY = (data: Buffer): { x: bigint; y: bigint } => {
  if (!pedersenHasher || !babyJub) {
    throw new Error('Circomlib not initialized. Call initializeCircomlib() first.');
  }

  // Use pedersenHasher.hash with Buffer input (returns compressed point)
  const compressedPoint = pedersenHasher.hash(data);

  // Unpack to get X,Y coordinates
  const [xField, yField] = babyJub.unpackPoint(compressedPoint);

  // Use F.toObject() for proper field element conversion (no custom mod)
  const x = babyJub.F.toObject(xField);
  const y = babyJub.F.toObject(yField);

  return { x, y };
};

/** Compute Pedersen hash (X coordinate only for compatibility) */
const pedersenHash = (data: Buffer): bigint => {
  return pedersenHashXY(data).x;
};


/** Generate random number of specified byte length */
export const rbigint = (nbytes: number): bigint => {
  return utils.leBuff2int(randomBytes(nbytes));
};


/** Compute MiMC sponge hash for Merkle tree (Tornado-compliant with ZERO_VALUE) */
const mimcSpongeHash = (left: string, right: string): string => {
  if (!mimcSponge) {
    throw new Error('Circomlib not initialized. Call initializeCircomlib() first.');
  }
  // MiMCSponge(2, 220, 1) to match Circom circuit
  const hash = mimcSponge.multiHash([BigInt(left), BigInt(right)], 0, 1);
  console.log('MiMC inputs:', left, right);
  console.log('MiMC hash result:', hash, 'type:', typeof hash, 'isArray:', Array.isArray(hash));

  // Handle different return types from mimcSponge.multiHash
  // Prioritize Array format to match Circom implementation
  if (Array.isArray(hash)) {
    const result = hash[0].toString();
    console.log('MiMC result (Array):', result);
    return result;
  } else if (hash instanceof Uint8Array) {
    // Use F.toString for proper field element conversion to match Circom
    const result = mimcSponge.F.toString(hash);
    console.log('MiMC result (Uint8Array via F.toString):', result);
    return result;
  } else {
    const result = hash.toString();
    console.log('MiMC result (other):', result);
    return result;
  }
};

/** BigNumber to hex string of specified length */
export function toHex(number: any, length = 32): string {
  let str: string;
  if (number instanceof Buffer) {
    str = number.toString('hex');
  } else if (Array.isArray(number)) {
    // Handle array like [46,108,193,89,...]
    str = BigInt('0x' + Buffer.from(number).toString('hex')).toString(16);
  } else if (typeof number === 'object' && number.toString) {
    // Handle ffjavascript F field element
    str = number.toString(16);
  } else {
    str = BigInt(number).toString(16);
  }
  return '0x' + str.padStart(length * 2, '0');
}

export interface Deposit {
  nullifier: bigint;
  secret: bigint;
  preimage: Buffer;
  commitment: any;
  commitmentHex: string;
  nullifierHash: any;
  nullifierHex: string;
}

/**
 * Create deposit object from secret and nullifier
 */
export function createDeposit({ nullifier, secret }: { nullifier: bigint; secret: bigint }): Deposit {
  if (!initialized) {
    throw new Error('Circomlib not initialized. Call initializeCircomlib() first.');
  }

  const nullifierBuffer = toBE31Buffer(nullifier);
  const secretBuffer = toBE31Buffer(secret);

  const deposit: Deposit = {
    nullifier,
    secret,
    preimage: Buffer.concat([nullifierBuffer, secretBuffer]),
    commitment: null as any,
    commitmentHex: '',
    nullifierHash: null as any,
    nullifierHex: ''
  };

  // Use Pedersen hash to match reference implementation
  // commitment = Pedersen(nullifier||secret)
  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.commitmentHex = toHex(deposit.commitment);

  // nullifierHash = Pedersen(nullifier)
  deposit.nullifierHash = pedersenHash(nullifierBuffer);
  deposit.nullifierHex = toHex(deposit.nullifierHash);

  return deposit;
}

/**
 * Generate merkle proof from deposit events
 */
export function generateMerkleProof(depositEventsJsonPath: string, leafIndex: number) {
  const depositEventsJson = JSON.parse(readFileSync(depositEventsJsonPath, 'utf8'));
  const leaves = depositEventsJson.commitments.map((commitment: string) => BigInt(commitment).toString());
  const tree = new MerkleTree(10, leaves, {
    hashFunction: mimcSpongeHash,
    zeroElement: ZERO_VALUE.toString()  // Tornado-compliant zero element
  });
  const { pathElements, pathIndices } = tree.path(leafIndex);

  // Debug: log path information
  console.log('Debug pathIndices:', pathIndices);
  console.log('Debug pathElements first 3:', pathElements.slice(0, 3));
  console.log('Debug tree root:', tree.root);

  return { pathElements, pathIndices, root: tree.root };
}

/**
 * Generate witness input for zk-SNARK circuit
 */
export async function generateInput({
  depositEventsJsonPath,
  nullifier,
  nullifierHash,
  secret,
  leafIndex,
  recipient,
  relayerAddress = '0x0000000000000000000000000000000000000000',
  fee = '0'
}: {
  depositEventsJsonPath: string;
  nullifier: bigint | string;
  nullifierHash: any;
  secret: bigint | string;
  leafIndex: number;
  recipient: string;
  relayerAddress?: string;
  fee?: string | bigint;
}) {
  const { root, pathElements, pathIndices } = generateMerkleProof(depositEventsJsonPath, leafIndex);

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
 * Format proof for Solidity (based on gen_poof_calldata.py)
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