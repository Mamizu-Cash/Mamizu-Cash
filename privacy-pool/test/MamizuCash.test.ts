import { expect } from "chai";
import { network } from "hardhat";
import type { MamizuCash, MockHasher, Verifier } from "../types/ethers-contracts/index.js";
import { createCode, abi } from "../utils/mimcsponge_gencontract.js";
const { ethers } = await network.connect();

describe("MamizuCash", function () {
  let mamizuCash: MamizuCash;
  let mockHasher: MockHasher;
  let mockVerifier: Verifier;
  let owner: any;
  let user: any;

  const denomination = ethers.parseEther("1.0"); // 1 ETH
  const merkleTreeHeight = 20;

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
      // Generate commitment within the field size
      const FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
      const rawCommitment = ethers.keccak256(ethers.toUtf8Bytes("test-commitment"));
      const commitment = ethers.toBeHex(BigInt(rawCommitment) % FIELD_SIZE, 32);

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
    });
  });

  describe("Withdraw", function () {
    it("Should successfully withdraw with valid proof", async function () {
      // Generate commitment and nullifier within the field size
      const FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
      const rawCommitment = ethers.keccak256(ethers.toUtf8Bytes("test-commitment"));
      const commitment = ethers.toBeHex(BigInt(rawCommitment) % FIELD_SIZE, 32);
      const rawNullifier = ethers.keccak256(ethers.toUtf8Bytes("test-nullifier"));
      const nullifierHash = ethers.toBeHex(BigInt(rawNullifier) % FIELD_SIZE, 32);
      const recipient = user.address;
      const relayer = ethers.Wallet.createRandom().address; // Use different address for relayer
      const fee = ethers.parseEther("0.1");

      // First deposit
      await mamizuCash.connect(user).deposit(commitment, { value: denomination });

      // Get the merkle root after deposit
      const root = await mamizuCash.getLastRoot();

      // Create mock proof (8 uint256 values)
      const mockProof = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256[8]"],
        [[1, 2, 3, 4, 5, 6, 7, 8]]
      );

      const initialRecipientBalance = await ethers.provider.getBalance(recipient);
      const initialRelayerBalance = await ethers.provider.getBalance(relayer);
      const initialContractBalance = await ethers.provider.getBalance(await mamizuCash.getAddress());

      await expect(
        mamizuCash.connect(owner).withdraw(
          mockProof,
          root,
          nullifierHash,
          recipient,
          relayer,
          fee
        )
      )
        .to.emit(mamizuCash, "Withdrawal")
        .withArgs(recipient, nullifierHash, relayer, fee);

      // Verify nullifier is spent
      expect(await mamizuCash.isSpent(nullifierHash)).to.be.true;

      // Verify balances changed correctly
      const finalRecipientBalance = await ethers.provider.getBalance(recipient);
      const finalRelayerBalance = await ethers.provider.getBalance(relayer);
      const finalContractBalance = await ethers.provider.getBalance(await mamizuCash.getAddress());

      expect(finalRecipientBalance - initialRecipientBalance).to.equal(denomination - fee);
      expect(finalRelayerBalance - initialRelayerBalance).to.equal(fee);
      expect(initialContractBalance - finalContractBalance).to.equal(denomination);
    });
  });
});
