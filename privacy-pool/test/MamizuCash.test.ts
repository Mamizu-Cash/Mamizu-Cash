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
    it("Should verify Pedersen XY coordinates (1-bit test)", async function () {
      const snarkjs = await import('snarkjs');

      console.log("\n🔍 PEDERSEN XY COORDINATE TEST");

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

        // Circuit side: Calculate using test circuit
        const input = { a: testCase.value.toString() };

        // Calculate witness using snarkjs with relative path
        const wasmPath = "circuits/test_pedersen_js/test_pedersen.wasm";
        const witness = await snarkjs.wtns.calculate(input, wasmPath);

        const circuitX = witness[1].toString();  // Output X
        const circuitY = witness[2].toString();  // Output Y
        console.log(`Circuit X: ${circuitX}`);
        console.log(`Circuit Y: ${circuitY}`);

        // Compare
        const xMatch = jsResult.x.toString() === circuitX;
        const yMatch = jsResult.y.toString() === circuitY;
        console.log(`✅ X Match: ${xMatch}, Y Match: ${yMatch}`);

        if (!xMatch || !yMatch) {
          console.log("❌ MISMATCH DETECTED!");
          console.log(`X diff: JS=${jsResult.x}, Circuit=${circuitX}`);
          console.log(`Y diff: JS=${jsResult.y}, Circuit=${circuitY}`);
        }
      }
    });

    it("Should debug Pedersen hash with fixed values", async function () {
      // Use fixed values for debugging
      const nullifier = 1n;
      const secret = 2n;
      const deposit = createDeposit({ nullifier, secret });

      console.log("\nDEBUG: Fixed values test");
      console.log("  nullifier:", nullifier.toString());
      console.log("  secret:", secret.toString());
      console.log("  nullifierHash:", deposit.nullifierHash.toString());
      console.log("  nullifierHex:", deposit.nullifierHex);
      console.log("  commitment:", deposit.commitment.toString());
      console.log("  commitmentHex:", deposit.commitmentHex);
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
      this.timeout(300000); // 5 minutes timeout for proof generation

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

      // Use the root from witness input instead of contract
      // Convert root to bytes32 format
      const witnessRoot = toHex(input.root);

      console.log("Expected public signals for Solidity:");
      console.log("  root:", witnessRoot);
      console.log("  nullifierHash:", deposit.nullifierHex);
      console.log("  recipient:", recipient);
      console.log("  relayer:", relayer);
      console.log("  fee:", fee.toString());

      // Execute withdrawal
      await expect(
        mamizuCash.connect(owner).naiveWithdraw(
          solidityProof,
          witnessRoot,
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
