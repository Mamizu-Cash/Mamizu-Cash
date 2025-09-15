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
  formatProofForSolidity,
  toBE31Buffer,
  pedersenHashXY
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

  const denomination = ethers.parseEther("0.001"); // 0.001 ETH
  const merkleTreeHeight = 10;

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

      const tx = await mamizuCash.connect(user).naiveDeposit(commitment, { value: denomination });
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
    it("Should verify Pedersen XY coordinates (JavaScript only)", async function () {
      console.log("\n🔍 PEDERSEN XY COORDINATE TEST (JavaScript Implementation)");

      // Test cases: a=1, a=256 (1<<8), a=2^247
      const testCases = [
        { name: "LSB=1", value: 1n },
        { name: "Byte2_LSB=1", value: 256n },  // 1 << 8
        { name: "MSB=1", value: 1n << 247n }   // 2^247
      ];

      for (const testCase of testCases) {
        console.log(`\n--- Testing ${testCase.name} (${testCase.value}) ---`);

        // JavaScript side: Calculate using circomlibjs
        const buffer = toBE31Buffer(testCase.value);
        const jsResult = pedersenHashXY(buffer);
        console.log(`JS X: ${jsResult.x}`);
        console.log(`JS Y: ${jsResult.y}`);
        console.log(`Buffer: 0x${buffer.toString('hex')}`);
        console.log(`Buffer length: ${buffer.length} bytes`);

        // Verify X, Y are valid field elements (< field modulus)
        const fieldModulus = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
        const xValid = jsResult.x < fieldModulus;
        const yValid = jsResult.y < fieldModulus;
        console.log(`✅ X valid field element: ${xValid}`);
        console.log(`✅ Y valid field element: ${yValid}`);

        // Basic sanity checks
        expect(xValid).to.be.true;
        expect(yValid).to.be.true;
        expect(jsResult.x).to.not.equal(0n);
        expect(jsResult.y).to.not.equal(0n);
      }
    });

    it("Should verify 496-bit commitment concatenation order", async function () {
      console.log("\n🔍 496-BIT COMMITMENT CONCATENATION TEST");

      // Use fixed values for reproducible testing
      const nullifier = 1n;
      const secret = 2n;

      console.log(`\nTesting nullifier=${nullifier}, secret=${secret}`);

      // Create deposit using existing function
      const deposit = createDeposit({ nullifier, secret });

      // Manually create the same concatenation
      const nullifierBuffer = toBE31Buffer(nullifier);
      const secretBuffer = toBE31Buffer(secret);
      const manualPreimage = Buffer.concat([nullifierBuffer, secretBuffer]);

      console.log("Deposit preimage:", `0x${deposit.preimage.toString('hex')}`);
      console.log("Manual preimage:", `0x${manualPreimage.toString('hex')}`);
      console.log("Preimages match:", deposit.preimage.equals(manualPreimage));

      // Calculate commitment manually
      const manualCommitment = pedersenHashXY(manualPreimage);
      const depositCommitmentValue = deposit.commitment;

      console.log("Deposit commitment:", depositCommitmentValue.toString());
      console.log("Manual commitment X:", manualCommitment.x.toString());
      console.log("Manual commitment Y:", manualCommitment.y.toString());

      // Verify they match (deposit uses X coordinate)
      expect(depositCommitmentValue.toString()).to.equal(manualCommitment.x.toString());
      expect(deposit.preimage.equals(manualPreimage)).to.be.true;

      // Verify total length is 62 bytes (31+31)
      expect(deposit.preimage.length).to.equal(62);
    });

    it("Should verify 248-bit nullifierHash calculation", async function () {
      console.log("\n🔍 248-BIT NULLIFIER HASH TEST");

      // Use fixed values for reproducible testing
      const nullifier = 1n;

      console.log(`\nTesting nullifier=${nullifier}`);

      // Create deposit using existing function
      const deposit = createDeposit({ nullifier, secret: 2n });

      // Manually calculate nullifierHash
      const nullifierBuffer = toBE31Buffer(nullifier);
      const manualNullifierHash = pedersenHashXY(nullifierBuffer);

      console.log("Nullifier buffer:", `0x${nullifierBuffer.toString('hex')}`);
      console.log("Deposit nullifierHash:", deposit.nullifierHash.toString());
      console.log("Manual nullifierHash X:", manualNullifierHash.x.toString());
      console.log("Manual nullifierHash Y:", manualNullifierHash.y.toString());

      // Verify they match (deposit uses X coordinate)
      expect(deposit.nullifierHash.toString()).to.equal(manualNullifierHash.x.toString());

      // Verify it's a valid field element
      const fieldModulus = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
      expect(deposit.nullifierHash < fieldModulus).to.be.true;

      // Verify buffer length is 31 bytes
      expect(nullifierBuffer.length).to.equal(31);
    });

    it("Should test fixed values with circuit", async function () {
      this.timeout(120000);

      // Use same fixed values as above test
      const nullifier = 1n;
      const secret = 2n;
      const deposit = createDeposit({ nullifier, secret });

      console.log("\nDEBUG: Circuit test with fixed values");
      console.log("  Using nullifier=1, secret=2");
      console.log("  Expected nullifierHash:", deposit.nullifierHash.toString());

      // Perform deposit
      await mamizuCash.connect(user).naiveDeposit(deposit.commitmentHex, { value: denomination });
      await saveTmpDepositEventsJson(mamizuCash);

      // Generate witness input
      const input = await generateInput({
        depositEventsJsonPath: "tmp/deposit_events.json",
        nullifier: deposit.nullifier,
        nullifierHash: deposit.nullifierHash,
        secret: deposit.secret,
        leafIndex: 0,
        recipient: user.address,
        relayerAddress: ethers.Wallet.createRandom().address,
        fee: "0"
      });

      console.log("  Circuit input nullifierHash:", input.nullifierHash);

      try {
        // Try to generate proof
        const { proof, publicSignals } = await generateProof(
          input,
          "circuits/withdraw_js/withdraw.wasm",
          "circuits/build/withdraw_0001.zkey"
        );
        console.log("✅ Proof generation succeeded with fixed values!");
      } catch (error: any) {
        console.log("❌ Proof generation failed:", error.message);
      }
    });

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
      await mamizuCash.connect(user).naiveDeposit(deposit.commitmentHex, { value: denomination });
      await saveTmpDepositEventsJson(mamizuCash);

      // Withdraw parameters
      const recipient = user.address;
      const relayer = ethers.Wallet.createRandom().address;
      const fee = ethers.parseEther("0.0001");

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
      console.log("Raw proof:", JSON.stringify(proof, null, 2));
      console.log("Public signals:", JSON.stringify(publicSignals, null, 2));

      // Format proof for Solidity (based on gen_poof_calldata.py)
      const solidityProofArray = formatProofForSolidity(proof);
      console.log("Formatted proof array:", solidityProofArray);

      // ABI encode the proof array as uint256[8]
      const solidityProof = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256[8]"],
        [solidityProofArray]
      );
      console.log("ABI encoded proof length:", solidityProof.length);

      // Check initial balances
      const initialRecipientBalance = await ethers.provider.getBalance(recipient);
      const initialRelayerBalance = await ethers.provider.getBalance(relayer);

      // Use the root from witness input and convert to hex
      const witnessRootHex = toHex(input.root);

      console.log("Expected public signals for Solidity:");
      console.log("  root:", input.root);
      console.log("  rootHex:", witnessRootHex);
      console.log("  nullifierHash:", BigInt(deposit.nullifierHex).toString());
      console.log("  recipient:", BigInt(recipient).toString());
      console.log("  relayer:", BigInt(relayer).toString());
      console.log("  fee:", fee.toString());

      // Execute withdrawal
      await expect(
        mamizuCash.connect(owner).naiveWithdraw(
          solidityProof,
          witnessRootHex,
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
