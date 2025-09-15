import hre from "hardhat";
import { ethers } from "ethers";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { createCode, abi } from "../utils/mimcsponge_gencontract.js";

async function main() {
  console.log("🚀 Starting MamizuCash deployment to Kaigan testnet...");

  try {
    // Get provider from network configuration
    const networkUrl = "https://rpc.kaigan.jsc.dev/rpc?token=QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q";
    const provider = new ethers.JsonRpcProvider(networkUrl);

    // Get signer from private key
    const privateKey = process.env.KAIGAN_PRIVATE_KEY || "0x65d7efd64916f2b857e9d8af652e4915e418620a2bc751a466471d139571cfad";
    const deployer = new ethers.Wallet(privateKey, provider);

    console.log("Deploying with account:", deployer.address);

    const balance = await provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance));

    // Check minimum balance
    const minBalance = ethers.parseEther("0.01");
    if (balance < minBalance) {
      throw new Error(`Insufficient balance. Need at least 0.01 ETH, have ${ethers.formatEther(balance)} ETH`);
    }

    // 1. Deploy Hasher contract
    console.log("\n1. Deploying Hasher contract...");
    const hasherContract = {
      contractName: 'Hasher',
      abi: abi,
      bytecode: createCode('mimcsponge', 220),
    };

    const hasherFactory = new ethers.ContractFactory(
      hasherContract.abi,
      hasherContract.bytecode,
      deployer
    );
    const hasher = await hasherFactory.deploy();
    await hasher.waitForDeployment();
    const hasherAddress = await hasher.getAddress();
    console.log("✅ Hasher deployed at:", hasherAddress);

    // 2. Deploy Verifier contract
    console.log("\n2. Deploying Verifier contract...");

    // Read compiled artifacts
    const verifierArtifact = JSON.parse(readFileSync('artifacts/contracts/Verifier.sol/Verifier.json', 'utf8'));
    const verifierFactory = new ethers.ContractFactory(verifierArtifact.abi, verifierArtifact.bytecode, deployer);
    const verifier = await verifierFactory.deploy();
    await verifier.waitForDeployment();
    const verifierAddress = await verifier.getAddress();
    console.log("✅ Verifier deployed at:", verifierAddress);

    // 3. Deploy MamizuCash contract
    console.log("\n3. Deploying MamizuCash contract...");
    const denomination = ethers.parseEther("0.001"); // 0.001 ETH
    const merkleTreeHeight = 10; // Changed from 20 to 10

    const mamizuCashArtifact = JSON.parse(readFileSync('artifacts/contracts/MamizuCash.sol/MamizuCash.json', 'utf8'));
    const mamizuCashFactory = new ethers.ContractFactory(mamizuCashArtifact.abi, mamizuCashArtifact.bytecode, deployer);
    const mamizuCash = await mamizuCashFactory.deploy(
      verifierAddress,
      hasherAddress,
      denomination,
      merkleTreeHeight
    );
    await mamizuCash.waitForDeployment();
    const mamizuCashAddress = await mamizuCash.getAddress();
    console.log("✅ MamizuCash deployed at:", mamizuCashAddress);

    // 4. Verify deployments
    console.log("\n4. Verifying deployments...");

    // Test basic contract interactions
    const mamizuDenomination = await mamizuCash.denomination();
    console.log("✅ MamizuCash denomination:", ethers.formatEther(mamizuDenomination), "ETH");

    const mamizuLevels = await mamizuCash.levels();
    console.log("✅ MamizuCash tree height:", mamizuLevels.toString());

    // 5. Save deployment addresses
    console.log("\n5. Saving deployment info...");

    // Ensure deployments directory exists
    if (!existsSync("deployments")) {
      mkdirSync("deployments", { recursive: true });
    }

    const deployment = {
      network: "kaigan",
      chainId: 5278000,
      deployedAt: new Date().toISOString(),
      contracts: {
        hasher: hasherAddress,
        verifier: verifierAddress,
        mamizuCash: mamizuCashAddress
      },
      parameters: {
        denomination: "0.001 ETH",
        merkleTreeHeight: merkleTreeHeight
      }
    };

    writeFileSync(
      "deployments/kaigan-latest.json",
      JSON.stringify(deployment, null, 2)
    );
    console.log("✅ Deployment info saved to deployments/kaigan-latest.json");

    // 6. Display summary
    console.log("\n========================================");
    console.log("🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("========================================");
    console.log("Network: Kaigan Testnet");
    console.log("Chain ID: 5278000");
    console.log("----------------------------------------");
    console.log("Hasher:", hasherAddress);
    console.log("Verifier:", verifierAddress);
    console.log("MamizuCash:", mamizuCashAddress);
    console.log("----------------------------------------");
    console.log("Denomination: 0.001 ETH");
    console.log("Merkle Tree Height: 10");
    console.log("========================================");

    // 7. Update frontend contracts
    console.log("\n📝 Update frontend/src/lib/web3/contracts.ts with:");
    console.log(`MAMIZU_CASH: "${mamizuCashAddress}" as \`0x\${string}\`,`);

  } catch (error: any) {
    console.error("\n❌ DEPLOYMENT FAILED!");
    console.error("Error:", error.message);

    if (error.code === 'INSUFFICIENT_FUNDS') {
      console.error("💡 Solution: Add more ETH to the deployer account");
    } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      console.error("💡 Solution: Check contract compilation and constructor arguments");
    } else if (error.message.includes('network')) {
      console.error("💡 Solution: Check network configuration in hardhat.config.ts");
    }

    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });