#!/usr/bin/env node
// based from https://github.com/tornadocash/tornado-core/blob/master/src/cli.js

const fs = require('fs')
const crypto = require('crypto')
const circomlibjs = require('circomlibjs')
const { utils } = require('ffjavascript')
const merkleTree = require('fixed-merkle-tree')
const program = require('commander')

const MERKLE_TREE_HEIGHT = 20;

let babyJub;
let pedersenHasher;

/** Generate random number of specified byte length */
const rbigint = nbytes => utils.leBuff2int(crypto.randomBytes(nbytes))

/** Compute pedersen hash */
const pedersenHash = data => {
  const hash = pedersenHasher.hash(data);
  const unpacked = babyJub.unpackPoint(hash);
  return utils.leBuff2int(unpacked[0]);
}

/** BigNumber to hex string of specified length */
function toHex(number, length = 32) {
  let str;
  if (number instanceof Buffer) {
    str = number.toString('hex');
  } else if (typeof number === 'object' && number.toString) {
    // Handle ffjavascript F field element
    str = number.toString(16);
  } else {
    str = BigInt(number).toString(16);
  }
  return '0x' + str.padStart(length * 2, '0')
}

/**
 * Create deposit object from secret and nullifier
 */
function createDeposit({ nullifier, secret }) {
  const deposit = { nullifier, secret }
  deposit.preimage = Buffer.concat([utils.leInt2Buff(deposit.nullifier, 31), utils.leInt2Buff(deposit.secret, 31)])
  deposit.commitment = pedersenHash(deposit.preimage)
  deposit.commitmentHex = toHex(deposit.commitment)
  deposit.nullifierHash = pedersenHash(utils.leInt2Buff(deposit.nullifier, 31))
  deposit.nullifierHex = toHex(deposit.nullifierHash)
  return deposit
}

function generateMerkleProof(depositEventsJsonPath, leafIndex) {
  const depositEventsJson = JSON.parse(fs.readFileSync(__dirname + "/../" + depositEventsJsonPath))
  const leaves = depositEventsJson.commitments.map(commitment => BigInt(commitment).toString())
  const tree = new merkleTree(MERKLE_TREE_HEIGHT, leaves)
  const { pathElements, pathIndices } = tree.path(leafIndex)
  return { pathElements, pathIndices, root: tree.root() }
}

async function generateInput({ depositEventsJsonPath, nullifier, nullifierHash, secret, leafIndex, recipient, relayerAddress = 0, fee = 0 }) {
  // Compute merkle proof of our commitment
  const { root, pathElements, pathIndices } = generateMerkleProof(depositEventsJsonPath, leafIndex)

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
  }

  return input
}

async function main() {
  // Initialize circomlib modules
  babyJub = await circomlibjs.buildBabyjub();
  pedersenHasher = await circomlibjs.buildPedersenHash();

  program
    .command('gen-deposit')
    .description('Generate a deposit object (nullifier, secret, preimage, and commitment) and print it to stdout as JSON data')
    .action(() => {
      const deposit = createDeposit({ nullifier: rbigint(31), secret: rbigint(31) })
      const output = {
        nullifier: toHex(deposit.nullifier),
        nullifierHash: toHex(deposit.nullifierHash),
        secret: toHex(deposit.secret),
        preimage: `0x${deposit.preimage.toString("hex")}`,
        commitment: deposit.commitmentHex
      }
      console.log(JSON.stringify(output))
    })
  program
    .command('gen-input <deposit_events_json_path> <nullifier> <nullifier_hash> <secret> <leaf_index> <recipient>')
    .description('Generate the witness of specified deposit commitment and deposit events and print it to stdout as JSON data')
    .action(async (depositEventsJsonPath, nullifier, nullifierHash, secret, leafIndex, recipient) => {
      const input = await generateInput({ depositEventsJsonPath, nullifier, nullifierHash, secret, leafIndex, recipient })
      console.log(JSON.stringify(input))
    })

  try {
    await program.parseAsync(process.argv)
    process.exit(0)
  } catch (e) {
    console.log('Error:', e)
    process.exit(1)
  }
}

main()
