import { expect } from "chai";
import { network } from "hardhat";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import type { MamizuCash, MockHasher, Verifier } from "../types/ethers-contracts/index.js";
import { createCode, abi } from "../utils/mimcsponge_gencontract.js";
import {
  initializeCircomlib,
  createDeposit,
  rbigint,
  toHex,
  generateInput,
  generateProof,
  formatProofForSolidity
} from "../utils/deposit.js";
const { ethers } = await network.connect();

// Helper function to save deposit events to JSON file
async function saveTmpDepositEventsJson(mamizuCash: MamizuCash) {
  // Query all Deposit events
  const filter = mamizuCash.filters.Deposit();
  const logs = await mamizuCash.queryFilter(filter);

  // Extract commitments and leaf indices from logs
  const commitments: string[] = [];
  const leafIndices: string[] = [];

  for (const log of logs) {
    if (log.args) {
      commitments.push(log.args.commitment);
      leafIndices.push(log.args.leafIndex.toString());
    }
  }

  // Create JSON object
  const depositEventsJson = {
    commitments: commitments,
    leafIndices: leafIndices
  };

  // Ensure tmp directory exists
  if (!existsSync("tmp")) {
    mkdirSync("tmp", { recursive: true });
  }

  // Write to file
  writeFileSync("tmp/deposit_events.json", JSON.stringify(depositEventsJson, null, 2));
  console.log(`Saved ${commitments.length} deposit events to tmp/deposit_events.json`);
}

describe("MamizuCash", function () {
  let mamizuCash: MamizuCash;
  let mockHasher: MockHasher;
  let mockVerifier: Verifier;
  let owner: any;
  let user: any;

  const denomination = ethers.parseEther("1.0"); // 1 ETH
  const merkleTreeHeight = 20;

  before(async function () {
    // Initialize circomlib modules once before all tests
    await initializeCircomlib();
  });

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy Hasher by directly generating the contract (same as compileHasher.js)
    const hasherContract = {
      contractName: 'Hasher',
      abi: abi,
      bytecode: createCode('mimcsponge', 220),
    };

    const hasherFactory = new ethers.ContractFactory(
      hasherContract.abi,
      hasherContract.bytecode,
      owner
    );
    mockHasher = await hasherFactory.deploy() as MockHasher;

    // Deploy Verifier using ethers.deployContract
    mockVerifier = await ethers.deployContract("Verifier");

    // Deploy MamizuCash
    mamizuCash = await ethers.deployContract("MamizuCash", [
      await mockVerifier.getAddress(),
      await mockHasher.getAddress(),
      denomination,
      merkleTreeHeight
    ]);
  });

  describe("Constructor and Deployment", function () {
    it("Should revert when denomination is zero", async function () {
      await expect(
        ethers.deployContract("MamizuCash", [
          await mockVerifier.getAddress(),
          await mockHasher.getAddress(),
          0, // zero denomination should fail
          merkleTreeHeight
        ])
      ).to.be.revertedWith("denomination should be greater than 0");
    });
  });

  describe("Deposit", function () {
    it("Should successfully deposit with correct amount and emit event", async function () {
      // Generate real deposit using Pedersen hash from cli.js
      const nullifier = rbigint(31);
      const secret = rbigint(31);
      const deposit = createDeposit({ nullifier, secret });
      const commitment = deposit.commitmentHex;

      const output = {
        nullifier: toHex(deposit.nullifier),
        nullifierHash: toHex(deposit.nullifierHash),
        secret: toHex(deposit.secret),
        preimage: `0x${deposit.preimage.toString("hex")}`,
        commitment: deposit.commitmentHex
      }
      console.log(JSON.stringify(output))
      console.log(user.address)

      const tx = await mamizuCash.connect(user).deposit(commitment, { value: denomination });
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt!.blockNumber);

      await expect(tx)
        .to.emit(mamizuCash, "Deposit")
        .withArgs(commitment, 0, block!.timestamp);

      // Verify commitment is stored
      expect(await mamizuCash.commitments(commitment)).to.be.true;

      // Verify contract balance
      expect(await ethers.provider.getBalance(await mamizuCash.getAddress())).to.equal(denomination);

      // Save deposit events to JSON file
      await saveTmpDepositEventsJson(mamizuCash);
    });
  });

  describe("Withdraw", function () {
    it("Should successfully withdraw with valid proof", async function () {
      this.timeout(60000000); // Increase timeout for proof generation

      // Generate real deposit using Pedersen hash
      const nullifier = rbigint(31);
      const secret = rbigint(31);
      const deposit = createDeposit({ nullifier, secret });

      // Log deposit info for debugging
      console.log("\nDeposit info for withdraw test:");
      console.log("  nullifier:", toHex(nullifier));
      console.log("  secret:", toHex(secret));
      console.log("  nullifierHash:", deposit.nullifierHex);
      console.log("  commitment:", deposit.commitmentHex);

      // Perform deposit
      await mamizuCash.connect(user).deposit(deposit.commitmentHex, { value: denomination });
      await saveTmpDepositEventsJson(mamizuCash);

      // Withdraw parameters
      const recipient = user.address;
      const relayer = ethers.Wallet.createRandom().address;
      const fee = ethers.parseEther("0.1");

      // Generate witness input for zk-SNARK
      const input = await generateInput({
        depositEventsJsonPath: "tmp/deposit_events.json",
        nullifier: deposit.nullifier,
        nullifierHash: deposit.nullifierHash,
        secret: deposit.secret,
        leafIndex: 0,
        recipient: recipient,
        relayerAddress: relayer,
        fee: fee.toString()
      });

      console.log("\nWitness input:");
      console.log("  root:", input.root);
      console.log("  nullifierHash (input):", toHex(input.nullifierHash));
      console.log("  nullifier:", toHex(input.nullifier));
      console.log("  secret:", toHex(input.secret));

      console.log("\nGenerating zk-SNARK proof...");

      // Generate proof using snarkjs
      const { proof, publicSignals } = await generateProof(
        input,
        "circuits/withdraw_js/withdraw.wasm",
        "circuits/build/withdraw_0001.zkey"
      );

      console.log("Proof generated successfully!");

      // Format proof for Solidity (based on gen_poof_calldata.py)
      const solidityProof = formatProofForSolidity(proof);

      // Check initial balances
      const initialRecipientBalance = await ethers.provider.getBalance(recipient);
      const initialRelayerBalance = await ethers.provider.getBalance(relayer);

      // Get merkle root
      const root = await mamizuCash.getLastRoot();

      // Execute withdrawal
      await expect(
        mamizuCash.connect(owner).withdraw(
          solidityProof,
          root,
          deposit.nullifierHex,
          recipient,
          relayer,
          fee
        )
      )
        .to.emit(mamizuCash, "Withdrawal")
        .withArgs(recipient, deposit.nullifierHex, relayer, fee);

      // Verify nullifier is spent
      expect(await mamizuCash.isSpent(deposit.nullifierHex)).to.be.true;

      // Verify balances changed correctly
      const finalRecipientBalance = await ethers.provider.getBalance(recipient);
      const finalRelayerBalance = await ethers.provider.getBalance(relayer);
      const finalContractBalance = await ethers.provider.getBalance(await mamizuCash.getAddress());

      expect(finalRecipientBalance - initialRecipientBalance).to.equal(denomination - fee);
      expect(finalRelayerBalance - initialRelayerBalance).to.equal(fee);
      expect(await ethers.provider.getBalance(await mamizuCash.getAddress())).to.equal(0n);
    });
  });
});
