#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Automatically sync deployment addresses to frontend contracts.ts
 */
async function syncFrontendContracts() {
  console.log("🔄 Syncing deployment addresses to frontend...");

  try {
    // Read deployment info
    const deploymentPath = join(__dirname, '../deployments/kaigan-latest.json');
    if (!existsSync(deploymentPath)) {
      throw new Error('Deployment file not found: deployments/kaigan-latest.json');
    }

    const deployment = JSON.parse(readFileSync(deploymentPath, 'utf8'));
    console.log('📖 Reading deployment info:', deployment.deployedAt);

    // Read current frontend contracts
    const frontendContractsPath = join(__dirname, '../../frontend/src/lib/web3/contracts.ts');
    if (!existsSync(frontendContractsPath)) {
      throw new Error('Frontend contracts file not found: frontend/src/lib/web3/contracts.ts');
    }

    let contractsContent = readFileSync(frontendContractsPath, 'utf8');

    // Update addresses using regex replacement
    const updates = [
      {
        name: 'HASHER',
        address: deployment.contracts.hasher,
        pattern: /HASHER:\s*"0x[a-fA-F0-9]{40}"/g
      },
      {
        name: 'VERIFIER',
        address: deployment.contracts.verifier,
        pattern: /VERIFIER:\s*"0x[a-fA-F0-9]{40}"/g
      },
      {
        name: 'MAMIZU_CASH',
        address: deployment.contracts.mamizuCash,
        pattern: /MAMIZU_CASH:\s*"0x[a-fA-F0-9]{40}"/g
      }
    ];

    let updatedCount = 0;

    for (const update of updates) {
      const newValue = `${update.name}: "${update.address}"`;

      if (update.pattern.test(contractsContent)) {
        contractsContent = contractsContent.replace(update.pattern, newValue);
        console.log(`✅ Updated ${update.name}: ${update.address}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Pattern not found for ${update.name}, address may need manual update`);
      }
    }

    // Update deployment comment
    const deploymentComment = `// Privacy Pool contracts (deployed ${deployment.deployedAt.split('T')[0]})`;
    const commentPattern = /\/\/ Privacy Pool contracts \(deployed [^)]+\)/g;

    if (commentPattern.test(contractsContent)) {
      contractsContent = contractsContent.replace(commentPattern, deploymentComment);
      console.log(`✅ Updated deployment timestamp`);
    }

    // Write updated content
    writeFileSync(frontendContractsPath, contractsContent);

    console.log("\n🎉 Frontend contracts synchronized successfully!");
    console.log(`📝 Updated ${updatedCount} contract addresses`);
    console.log(`📅 Deployment date: ${deployment.deployedAt}`);
    console.log(`⛓️  Network: ${deployment.network} (Chain ID: ${deployment.chainId})`);

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncFrontendContracts();
}

export { syncFrontendContracts };