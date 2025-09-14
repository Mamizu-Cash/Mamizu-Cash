import { Command } from 'commander';
import { generateProofFromBlueprintAndEml } from './emailUtils.js';
import { generateProofFromBlueprintAndEml as provePlain } from './provePlain.js';
import { transplantBlueprintToKaigan } from './transplantContract.js';
import { getVerifierAddressFromBlueprint } from './getVerifierAddress.js';
import { getCreatorTxHashFromAddress } from './getCreatorTxHash.js';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { replayCreateOnKaigan } from './replayCreateOnKaigan.js';
import fs from 'fs';
import type { Proof } from '@zk-email/sdk';
    
const program = new Command();

program
  .command('prove4d')
  .description('Generate a ZK proof from blueprint and EML file using zk email sdk')
  .option(
    '--blueprint <blueprintId>',
    'Blueprint registry ID (default: yuki-js/mamizu_cash_reg@v4)',
    'yuki-js/mamizu_cash_reg@v4',
  )
  .requiredOption('--eml <emlFilePath>', 'Path to the .eml file')
  .option('--verifier <address>', 'Override verifier contract address (0x...)')
  .option('--version <n>', 'Override verify(version,...) first parameter (default 1)', (v) =>
    BigInt(v),
  )
  .action(async (options) => {
    try {
      const proof = await generateProofFromBlueprintAndEml(options.blueprint, options.eml, {
        addressOverride: options.verifier,
        versionParam: options.version,
      });
      console.log('Proof generated.');
      process.exit(0);
    } catch (error) {
      console.error('Error generating proof:', error);
      process.exit(1);
    }
  });

program
  .command('proveplain')
  .description('Generate a ZK proof from blueprint and EML file using zk email sdk')
  .option(
    '--blueprint <blueprintId>',
    'Blueprint registry ID (default: yuki-js/mamizu_cash_reg@v4)',
    'yuki-js/mamizu_cash_reg@v4',
  )
  .requiredOption('--eml <emlFilePath>', 'Path to the .eml file')
  .action(async (options) => {
    try {
      const proof = await provePlain(options.blueprint, options.eml);
      console.log('Proof generated.');
      process.exit(0);
    } catch (error) {
      console.error('Error generating proof:', error);
      process.exit(1);
    }
  });

program
  .command('transplant-base-to-kaigan')
  .description('Migrate contract from Base (blueprint) to Kaigan network')
  .requiredOption(
    '--blueprint <blueprintId>',
    'Blueprint registry ID (e.g. Bisht13/SuccinctZKResidencyInvite@v3)',
  )
  .action(async (options) => {
    try {
      const address = await transplantBlueprintToKaigan(options.blueprint);
      console.log('Transplanted contract address:');
      console.log(address);
      process.exit(0);
    } catch (error) {
      console.error('Error transplanting contract from Base to Kaigan:', error);
      process.exit(1);
    }
  });

program
  .command('get-verifier-addr-from-bp')
  .description('Extract only the verifier contract address from a blueprint')
  .option(
    '--blueprint <blueprintId>',
    'Blueprint registry ID (default: yuki-js/mamizu_cash_reg@v4)',
    'yuki-js/mamizu_cash_reg@v4',
  )
  .action(async (options) => {
    try {
      const addr = await getVerifierAddressFromBlueprint(options.blueprint);
      console.log(addr);
      process.exit(0);
    } catch (error) {
      console.error('Error fetching verifier address from blueprint:', error);
      process.exit(1);
    }
  });

program
  .command('get-creator-tx-from-addr')
  .description(
    'If the given address is a contract on Base Sepolia, find and print its creation transaction hash',
  )
  .requiredOption('--address <address>', 'Address on Base Sepolia (0x...)')
  .action(async (options) => {
    try {
      const address: string = options.address;
      const normalized = address?.toLowerCase();

      if (typeof normalized !== 'string' || !/^0x[0-9a-f]{40}$/.test(normalized)) {
        throw new Error(`Invalid address format: ${address}`);
      }

      const client = createPublicClient({
        chain: baseSepolia,
        transport: http('https://sepolia.base.org'),
      });

      const code = await client.getCode({ address: normalized as `0x${string}` });

      if (!code || code === '0x') {
        console.error('Given address has no runtime code (likely EOA). Nothing to do.');
        process.exit(1);
      }

      const txHash = await getCreatorTxHashFromAddress(normalized);
      console.log(txHash);
      process.exit(0);
    } catch (error) {
      console.error('Error getting creator transaction hash:', error);
      process.exit(1);
    }
  });

program
  .command('replay-create-on-kaigan')
  .description(
    'Given a Base Sepolia tx hash, if it is a contract creation (to == null), replay the creation on Kaigan and print the deployed address',
  )
  .requiredOption('--tx <txHash>', 'Base Sepolia transaction hash (0x...)')
  .action(async (options) => {
    try {
      const tx: string = options.tx;
      if (typeof tx !== 'string' || !tx.startsWith('0x') || tx.length !== 66) {
        throw new Error(`Invalid tx hash: ${tx}`);
      }
      const deployed = await replayCreateOnKaigan(tx as `0x${string}`);
      console.log(deployed);
      process.exit(0);
    } catch (error) {
      console.error('Error replaying creation tx on Kaigan:', error);
      process.exit(1);
    }
  });

// New command: generate JSON fixture for ZkEmailVerifier test
program
  .command('gen-fixture')
  .description('Generate proof fixture JSON for ZkEmailVerifier test')
  .option(
    '--blueprint <blueprintId>',
    'Blueprint registry ID (default: yuki-js/mamizu_cash_reg@v4)',
    'yuki-js/mamizu_cash_reg@v4',
  )
  .requiredOption('--eml <emlFilePath>', 'Path to the .eml file')
  .option('--verifier <address>', 'Override verifier contract address (0x...)')
  .option('--version <n>', 'Override version param (default 1)', (v) => BigInt(v))
  .option('--out <path>', 'Output fixture path', './fixtures/proof.json')
  .action(async (options) => {
    try {
      const proof = await generateProofFromBlueprintAndEml(
        options.blueprint,
        options.eml,
        {
          addressOverride: options.verifier,
          versionParam: options.version,
        },
      );
      const fixture = {
        proofData: proof.props.proofData,
        publicOutputs: proof.props.publicOutputs,
      };
      fs.writeFileSync(options.out, JSON.stringify(fixture, null, 2));
      console.log('Fixture generated at', options.out);
      process.exit(0);
    } catch (error) {
      console.error('Error generating fixture:', error);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
