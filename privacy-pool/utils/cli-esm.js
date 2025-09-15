#!/usr/bin/env node
// ESM version of cli.js for testing

import fs from 'fs';
import crypto from 'crypto';
import * as circomlibjs from 'circomlibjs';
import { utils } from 'ffjavascript';
import { MerkleTree } from 'fixed-merkle-tree';

const MERKLE_TREE_HEIGHT = 10;
// Use the same ZERO_VALUE as the contract (keccak256("tornado") % FIELD_SIZE)
const ZERO_VALUE = '21663839004416932945382355908790599225266501822907911457504978515578255421292';

let babyJub;
let pedersenHasher;
let mimcSponge;

/** Generate random number of specified byte length */
export const rbigint = nbytes => utils.leBuff2int(crypto.randomBytes(nbytes));

/** Compute pedersen hash */
export const pedersenHash = data => {
  const hash = pedersenHasher.hash(data);
  const unpacked = babyJub.unpackPoint(hash);
  return utils.leBuff2int(unpacked[0]);
};

/** Compute MiMC sponge hash for Merkle tree (matches Circom implementation) */
export const mimcSpongeHash = (left, right) => {
  if (!mimcSponge) {
    throw new Error('MiMCSponge not initialized. Call initializeCircomlib() first.');
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

/** BigNumber to hex string of specified length */
export function toHex(number, length = 32) {
  let str;
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

/**
 * Create deposit object from secret and nullifier
 */
export function createDeposit({ nullifier, secret }) {
  const deposit = { nullifier, secret };
  deposit.preimage = Buffer.concat([utils.leInt2Buff(deposit.nullifier, 31), utils.leInt2Buff(deposit.secret, 31)]);
  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.commitmentHex = toHex(deposit.commitment);
  deposit.nullifierHash = pedersenHash(utils.leInt2Buff(deposit.nullifier, 31));
  deposit.nullifierHex = toHex(deposit.nullifierHash);
  return deposit;
}

export function generateMerkleProof(depositEventsJsonPath, leafIndex) {
  const depositEventsJson = JSON.parse(fs.readFileSync(depositEventsJsonPath, 'utf8'));
  const leaves = depositEventsJson.commitments.map(commitment => BigInt(commitment).toString());

  // Create tree with proper configuration matching contract
  const tree = new MerkleTree(MERKLE_TREE_HEIGHT, leaves, {
    hashFunction: mimcSpongeHash,
    zeroElement: ZERO_VALUE
  });

  const { pathElements, pathIndices } = tree.path(leafIndex);

  // Ensure pathElements has exactly 10 elements (matching circuit levels)
  const paddedPathElements = [...pathElements];
  const paddedPathIndices = [...pathIndices];

  // Use the same zeros as the contract's zeros() function
  const contractZeros = [
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

  let zeroIndex = pathElements.length;
  while (paddedPathElements.length < 10) {
    paddedPathElements.push(contractZeros[zeroIndex] || '0');
    paddedPathIndices.push(0);
    zeroIndex++;
  }

  return { pathElements: paddedPathElements, pathIndices: paddedPathIndices, root: tree.root };
}

export async function generateInput({ depositEventsJsonPath, nullifier, nullifierHash, secret, leafIndex, recipient, relayerAddress = 0, fee = 0 }) {
  // Compute merkle proof of our commitment
  const { root, pathElements, pathIndices } = generateMerkleProof(depositEventsJsonPath, leafIndex);

  // Prepare circuit input
  const input = {
    // Public snark inputs
    root: root,
    nullifierHash: BigInt(nullifierHash).toString(),
    recipient: BigInt(recipient).toString(),
    relayer: BigInt(relayerAddress).toString(),
    fee: BigInt(fee).toString(),

    // Private snark inputs
    nullifier: BigInt(nullifier).toString(),
    secret: BigInt(secret).toString(),
    pathElements: pathElements,
    pathIndices: pathIndices,
  };

  return input;
}

// Initialize circomlib modules
export async function initializeCircomlib() {
  babyJub = await circomlibjs.buildBabyjub();
  pedersenHasher = await circomlibjs.buildPedersenHash();
  mimcSponge = await circomlibjs.buildMimcSponge();
}

// Initialize when imported
await initializeCircomlib();