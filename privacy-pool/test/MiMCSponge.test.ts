import { expect } from "chai";
import { network } from "hardhat";
import type { MockHasher } from "../types/ethers-contracts/index.js";
import { createCode, abi } from "../utils/mimcsponge_gencontract.js";
const { ethers } = await network.connect();

describe("MiMCSponge", function () {
  let miMCSponge: MockHasher;
  let owner: any;

  // Constants from the MiMCSponge implementation
  const FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
  const ZERO_VALUE = 0n;
  const MAX_FIELD_VALUE = FIELD_SIZE - 1n;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Deploy MiMCSponge Hasher by directly generating the contract
    const hasherContract = {
      contractName: 'Hasher',
      abi: abi,
      bytecode: createCode('mimcsponge', 220), // Using 220 rounds as in the original implementation
    };

    const hasherFactory = new ethers.ContractFactory(
      hasherContract.abi,
      hasherContract.bytecode,
      owner
    );
    miMCSponge = await hasherFactory.deploy() as MockHasher;
  });

  describe("Contract Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await miMCSponge.getAddress()).to.not.equal(ethers.ZeroAddress);
    });

    it("Should have the correct contract code", async function () {
      const deployedCode = await ethers.provider.getCode(await miMCSponge.getAddress());
      expect(deployedCode).to.not.equal("0x");
      expect(deployedCode.length).to.be.greaterThan(2); // More than just "0x"
    });
  });

  describe("Basic MiMCSponge Hash Function", function () {
    it("Should hash two zero values", async function () {
      const result = await miMCSponge.MiMCSponge(ZERO_VALUE, ZERO_VALUE, 0n);

      expect(result.xL).to.be.a('bigint');
      expect(result.xR).to.be.a('bigint');
      expect(result.xL).to.be.lessThan(FIELD_SIZE);
      expect(result.xR).to.be.lessThan(FIELD_SIZE);
    });

    it("Should hash two non-zero values", async function () {
      const xL_in = 12345n;
      const xR_in = 67890n;

      const result = await miMCSponge.MiMCSponge(xL_in, xR_in, 0n);

      expect(result.xL).to.be.a('bigint');
      expect(result.xR).to.be.a('bigint');
      expect(result.xL).to.be.lessThan(FIELD_SIZE);
      expect(result.xR).to.be.lessThan(FIELD_SIZE);

      // Results should be different from inputs (unless by very rare chance)
      expect(result.xL !== xL_in || result.xR !== xR_in).to.be.true;
    });

    it("Should handle maximum field values", async function () {
      const result = await miMCSponge.MiMCSponge(MAX_FIELD_VALUE, MAX_FIELD_VALUE, 0n);

      expect(result.xL).to.be.lessThan(FIELD_SIZE);
      expect(result.xR).to.be.lessThan(FIELD_SIZE);
    });
  });

  describe("Deterministic Behavior", function () {
    it("Should produce consistent results for same inputs", async function () {
      const xL_in = ethers.toBigInt(ethers.keccak256(ethers.toUtf8Bytes("test1"))) % FIELD_SIZE;
      const xR_in = ethers.toBigInt(ethers.keccak256(ethers.toUtf8Bytes("test2"))) % FIELD_SIZE;

      const result1 = await miMCSponge.MiMCSponge(xL_in, xR_in, 0n);
      const result2 = await miMCSponge.MiMCSponge(xL_in, xR_in, 0n);

      expect(result1.xL).to.equal(result2.xL);
      expect(result1.xR).to.equal(result2.xR);
    });

    it("Should produce different results for different inputs", async function () {
      const xL_in1 = 111n;
      const xR_in1 = 222n;
      const xL_in2 = 333n;
      const xR_in2 = 444n;

      const result1 = await miMCSponge.MiMCSponge(xL_in1, xR_in1, 0n);
      const result2 = await miMCSponge.MiMCSponge(xL_in2, xR_in2, 0n);

      // Results should be different (unless by extremely rare chance)
      expect(result1.xL !== result2.xL || result1.xR !== result2.xR).to.be.true;
    });

    it("Should be sensitive to input order", async function () {
      const value1 = 12345n;
      const value2 = 54321n;

      const result1 = await miMCSponge.MiMCSponge(value1, value2, 0n);
      const result2 = await miMCSponge.MiMCSponge(value2, value1, 0n);

      // Results should be different when inputs are swapped
      expect(result1.xL !== result2.xL || result1.xR !== result2.xR).to.be.true;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle one zero and one non-zero value", async function () {
      const nonZero = 12345n;

      const result1 = await miMCSponge.MiMCSponge(ZERO_VALUE, nonZero, 0n);
      const result2 = await miMCSponge.MiMCSponge(nonZero, ZERO_VALUE, 0n);

      expect(result1.xL).to.be.lessThan(FIELD_SIZE);
      expect(result1.xR).to.be.lessThan(FIELD_SIZE);
      expect(result2.xL).to.be.lessThan(FIELD_SIZE);
      expect(result2.xR).to.be.lessThan(FIELD_SIZE);

      // Results should be different for different input positions
      expect(result1.xL !== result2.xL || result1.xR !== result2.xR).to.be.true;
    });

    it("Should handle very large values within field", async function () {
      const largeValue1 = FIELD_SIZE / 2n;
      const largeValue2 = FIELD_SIZE / 3n;

      const result = await miMCSponge.MiMCSponge(largeValue1, largeValue2, 0n);

      expect(result.xL).to.be.lessThan(FIELD_SIZE);
      expect(result.xR).to.be.lessThan(FIELD_SIZE);
    });

    it("Should handle sequential values", async function () {
      const base = 1000n;

      const result1 = await miMCSponge.MiMCSponge(base, base + 1n, 0n);
      const result2 = await miMCSponge.MiMCSponge(base + 1n, base + 2n, 0n);

      expect(result1.xL).to.be.lessThan(FIELD_SIZE);
      expect(result1.xR).to.be.lessThan(FIELD_SIZE);
      expect(result2.xL).to.be.lessThan(FIELD_SIZE);
      expect(result2.xR).to.be.lessThan(FIELD_SIZE);

      // Sequential inputs should produce different outputs
      expect(result1.xL !== result2.xL || result1.xR !== result2.xR).to.be.true;
    });
  });

  describe("Avalanche Effect (Cryptographic Property)", function () {
    it("Should show significant output change for small input change", async function () {
      const base = 12345n;

      const result1 = await miMCSponge.MiMCSponge(base, base, 0n);
      const result2 = await miMCSponge.MiMCSponge(base, base + 1n, 0n);

      // Calculate bit differences (simplified check)
      const xL_diff = result1.xL ^ result2.xL;
      const xR_diff = result1.xR ^ result2.xR;

      // Should have significant differences (not zero)
      expect(xL_diff !== 0n || xR_diff !== 0n).to.be.true;
    });
  });

  describe("Field Arithmetic Properties", function () {
    it("Should always return values within the field", async function () {
      const testCases = [
        [0n, 0n],
        [1n, 1n],
        [FIELD_SIZE - 1n, FIELD_SIZE - 1n],
        [FIELD_SIZE / 2n, FIELD_SIZE / 3n],
        [12345n, 67890n],
      ];

      for (const [xL_in, xR_in] of testCases) {
        const result = await miMCSponge.MiMCSponge(xL_in, xR_in, 0n);

        expect(result.xL).to.be.at.least(0n);
        expect(result.xL).to.be.lessThan(FIELD_SIZE);
        expect(result.xR).to.be.at.least(0n);
        expect(result.xR).to.be.lessThan(FIELD_SIZE);
      }
    });
  });

  describe("Gas Usage", function () {
    it("Should have reasonable gas consumption", async function () {
      const xL_in = 12345n;
      const xR_in = 67890n;

      const tx = await miMCSponge.MiMCSponge.populateTransaction(xL_in, xR_in, 0n);
      const gasEstimate = await ethers.provider.estimateGas(tx);

      // MiMCSponge should be computationally intensive but not excessive
      // This is a rough estimate - adjust based on actual requirements
      expect(gasEstimate).to.be.lessThan(1000000n); // Less than 1M gas
      expect(gasEstimate).to.be.greaterThan(10000n);  // More than 10K gas (it's not trivial)
    });
  });

  describe("Compatibility with Merkle Tree", function () {
    it("Should work as expected for Merkle tree leaf hashing", async function () {
      // Simulate hashing two leaf values as would be done in a Merkle tree
      const leaf1 = ethers.toBigInt(ethers.keccak256(ethers.toUtf8Bytes("leaf1"))) % FIELD_SIZE;
      const leaf2 = ethers.toBigInt(ethers.keccak256(ethers.toUtf8Bytes("leaf2"))) % FIELD_SIZE;

      const result = await miMCSponge.MiMCSponge(leaf1, leaf2, 0n);

      expect(result.xL).to.be.lessThan(FIELD_SIZE);
      expect(result.xR).to.be.lessThan(FIELD_SIZE);

      // The result should be suitable for use as a parent node in the tree
      expect(result.xL).to.not.equal(leaf1);
      expect(result.xR).to.not.equal(leaf2);
    });

    it("Should produce consistent intermediate nodes", async function () {
      // Test that the same leaf pair always produces the same parent
      const leaf1 = 111n;
      const leaf2 = 222n;

      const parent1 = await miMCSponge.MiMCSponge(leaf1, leaf2, 0n);
      const parent2 = await miMCSponge.MiMCSponge(leaf1, leaf2, 0n);

      expect(parent1.xL).to.equal(parent2.xL);
      expect(parent1.xR).to.equal(parent2.xR);
    });
  });
});
