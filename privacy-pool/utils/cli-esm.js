#!/usr/bin/env node
// ESM version of cli.js for testing

import fs from 'fs';
import crypto from 'crypto';
import * as circomlibjs from 'circomlibjs';
import { utils } from 'ffjavascript';
import { MerkleTree } from 'fixed-merkle-tree';

const MERKLE_TREE_HEIGHT = 20;

let babyJub;
let pedersenHasher;

/** Generate random number of specified byte length */
export const rbigint = nbytes => utils.leBuff2int(crypto.randomBytes(nbytes));

/** Compute pedersen hash */
export const pedersenHash = data => {
  const hash = pedersenHasher.hash(data);
  const unpacked = babyJub.unpackPoint(hash);
  return utils.leBuff2int(unpacked[0]);
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
  const tree = new MerkleTree(MERKLE_TREE_HEIGHT, leaves);
  const { pathElements, pathIndices } = tree.path(leafIndex);
  return { pathElements, pathIndices, root: tree.root };
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
}

// Initialize when imported
await initializeCircomlib();