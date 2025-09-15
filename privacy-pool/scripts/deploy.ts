import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Starting MamizuCash deployment process...");

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider("https://rpc.kaigan.jsc.dev/rpc?token=QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q");
  const privateKey = process.env.KAIGAN_PRIVATE_KEY || "0x65d7efd64916f2b857e9d8af652e4915e418620a2bc751a466471d139571cfad";
  const deployer = new ethers.Wallet(privateKey, provider);
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await provider.getBalance(deployer.address)).toString());

  // Step 1: Deploy Hasher contract
  console.log("\n1. Deploying Hasher contract...");

  // Read the compiled Hasher bytecode
  const hasherPath = path.join(__dirname, "../circuits/build/Hasher.json");
  if (!fs.existsSync(hasherPath)) {
    console.error("Hasher.json not found! Please run 'mise run deploy-hasher' first");
    process.exit(1);
  }

  const hasherData = JSON.parse(fs.readFileSync(hasherPath, "utf8"));
  const hasherFactory = new ethers.ContractFactory(hasherData.abi, hasherData.bytecode, deployer);
  const hasher = await hasherFactory.deploy();
  await hasher.waitForDeployment();
  const hasherAddress = await hasher.getAddress();
  console.log("Hasher deployed to:", hasherAddress);

  // Step 2: Deploy Verifier contract
  console.log("\n2. Deploying Verifier contract...");
  const verifierArtifact = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/Verifier.sol/Verifier.json"), "utf8"));
  const verifierFactory = new ethers.ContractFactory(verifierArtifact.abi, verifierArtifact.bytecode, deployer);
  const verifier = await verifierFactory.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("Verifier deployed to:", verifierAddress);

  // Step 3: Deploy MamizuCash contract
  console.log("\n3. Deploying MamizuCash contract...");

  // Configuration
  const denomination = ethers.parseEther("0.001"); // 0.001 ETH
  const merkleTreeHeight = 10;

  const mamizuCashArtifact = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/MamizuCash.sol/MamizuCash.json"), "utf8"));
  const mamizuCashFactory = new ethers.ContractFactory(mamizuCashArtifact.abi, mamizuCashArtifact.bytecode, deployer);
  const mamizuCash = await mamizuCashFactory.deploy(
    verifierAddress,
    hasherAddress,
    denomination,
    merkleTreeHeight
  );
  await mamizuCash.waitForDeployment();
  const mamizuCashAddress = await mamizuCash.getAddress();
  console.log("MamizuCash deployed to:", mamizuCashAddress);

  // Step 4: Save deployment info
  const deploymentInfo = {
    network: "kaigan",
    chainId: await (await provider.getNetwork()).chainId.toString(),
    contracts: {
      Hasher: hasherAddress,
      Verifier: verifierAddress,
      MamizuCash: mamizuCashAddress
    },
    config: {
      denomination: denomination.toString(),
      merkleTreeHeight: merkleTreeHeight
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const deploymentPath = path.join(__dirname, "../deployments/kaigan.json");
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n✅ Deployment completed!");
  console.log("Deployment info saved to:", deploymentPath);
  console.log("\nContract addresses:");
  console.log("- Hasher:", hasherAddress);
  console.log("- Verifier:", verifierAddress);
  console.log("- MamizuCash:", mamizuCashAddress);
  console.log("\nConfiguration:");
  console.log("- Denomination:", ethers.formatEther(denomination), "ETH");
  console.log("- Merkle Tree Height:", merkleTreeHeight);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
