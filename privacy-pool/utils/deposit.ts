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

/** Initialize circomlib modules */
export async function initializeCircomlib() {
  if (!initialized) {
    babyJub = await circomlibjs.buildBabyjub();
    pedersenHasher = await circomlibjs.buildPedersenHash();
    mimcSponge = await circomlibjs.buildMimcSponge();
    initialized = true;
  }
}

/** Generate random number of specified byte length */
export const rbigint = (nbytes: number): bigint => {
  return utils.leBuff2int(randomBytes(nbytes));
};

/** Compute pedersen hash (matches Circom Pedersen component) */
const pedersenHash = (data: Buffer): any => {
  if (!pedersenHasher) {
    throw new Error('Circomlib not initialized. Call initializeCircomlib() first.');
  }
  const hash = pedersenHasher.hash(data);
  const unpacked = babyJub.unpackPoint(hash);
  // Use F.toObject to get the x coordinate as BigInt (matches Circom out[0])
  return babyJub.F.toObject(unpacked[0]);
};

/** Compute MiMC sponge hash for Merkle tree (matches Circom implementation) */
const mimcSpongeHash = (left: string, right: string): string => {
  if (!mimcSponge) {
    throw new Error('Circomlib not initialized. Call initializeCircomlib() first.');
  }
  // MiMCSponge(2, 220, 1) to match Circom circuit
  const hash = mimcSponge.multiHash([BigInt(left), BigInt(right)], 0, 1);
  console.log('MiMC inputs:', left, right);
  console.log('MiMC hash result:', hash, 'type:', typeof hash, 'isArray:', Array.isArray(hash));

  // Handle different return types from mimcSponge.multiHash
  if (hash instanceof Uint8Array) {
    // Convert Uint8Array directly to BigInt using little-endian
    const result = utils.leBuff2int(Buffer.from(hash)).toString();
    console.log('MiMC result (Uint8Array):', result);
    return result;
  } else if (Array.isArray(hash)) {
    const result = hash[0].toString();
    console.log('MiMC result (Array):', result);
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

  const deposit: Deposit = {
    nullifier,
    secret,
    preimage: Buffer.concat([
      utils.leInt2Buff(nullifier, 31),
      utils.leInt2Buff(secret, 31)
    ]),
    commitment: null as any,
    commitmentHex: '',
    nullifierHash: null as any,
    nullifierHex: ''
  };

  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.commitmentHex = toHex(deposit.commitment);
  deposit.nullifierHash = pedersenHash(utils.leInt2Buff(deposit.nullifier, 31));
  deposit.nullifierHex = toHex(deposit.nullifierHash);

  return deposit;
}

/**
 * Generate merkle proof from deposit events
 */
export function generateMerkleProof(depositEventsJsonPath: string, leafIndex: number) {
  const depositEventsJson = JSON.parse(readFileSync(depositEventsJsonPath, 'utf8'));
  const leaves = depositEventsJson.commitments.map((commitment: string) => BigInt(commitment).toString());
  const tree = new MerkleTree(20, leaves, {
    hashFunction: mimcSpongeHash
  });
  const { pathElements, pathIndices } = tree.path(leafIndex);
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
 * Concatenates proof elements into a single hex string
 */
export function formatProofForSolidity(proof: any): string {
  // Remove "0x" prefix from each element and concatenate
  const proofHex =
    proof.pi_a[0].slice(2) + proof.pi_a[1].slice(2) +
    proof.pi_b[0][1].slice(2) + proof.pi_b[0][0].slice(2) +
    proof.pi_b[1][1].slice(2) + proof.pi_b[1][0].slice(2) +
    proof.pi_c[0].slice(2) + proof.pi_c[1].slice(2);

  return '0x' + proofHex;
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