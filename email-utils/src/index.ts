import { Command } from 'commander';
import { generateProofFromBlueprintAndEml } from './emailUtils.js';

const program = new Command();

program
  .name('prove4d')
  .description('Generate a ZK proof from blueprint and EML file using zk email sdk')
  .version('0.1.0', '--version', 'Show CLI version')
  .requiredOption(
    '--blueprint <blueprintId>',
    'Blueprint registry ID (e.g. Bisht13/SuccinctZKResidencyInvite@v3)',
  )
  .requiredOption('--eml <emlFilePath>', 'Path to the .eml file')
  .action(async (options) => {
    try {
      const proof = await generateProofFromBlueprintAndEml(options.blueprint, options.eml);
      console.log('Proof generated:');
      console.log(JSON.stringify(proof, null, 2));
    } catch (error) {
      console.error('Error generating proof:', error);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
