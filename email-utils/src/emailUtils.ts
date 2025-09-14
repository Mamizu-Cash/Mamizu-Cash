import { initZkEmailSdk } from '@zk-email/sdk';
import fs from 'fs/promises';

/**
 * Generates a zero-knowledge proof from an EML file and blueprint ID.
 * Uses local proving and debug logging.
 * @param blueprintId Blueprint registry ID (e.g. "Bisht13/SuccinctZKResidencyInvite@v3")
 * @param emlFilePath Path to the .eml file
 * @returns The generated proof object
 */
export async function generateProofFromBlueprintAndEml(
  blueprintId: string,
  emlFilePath: string,
): Promise<unknown> {
  console.log('[prove4d] Initializing ZKEmail SDK (local mode, debug)...');
  const sdk = initZkEmailSdk({ logging: { level: 'debug', enabled: true } });

  console.log(`[prove4d] Fetching blueprint: ${blueprintId}`);
  const blueprint = await sdk.getBlueprint(blueprintId);

  console.log(`[prove4d] Reading EML file: ${emlFilePath}`);
  const eml = await fs.readFile(emlFilePath, 'utf-8');

  console.log('[prove4d] Creating prover...');
  const prover = blueprint.createProver();

  const proof = await prover.generateProof(eml);

  const verif = await proof.verify();
  console.log(`[prove4d] Off-chain verification result: ${verif}`);

  debugger;
  const verifOnChain = await blueprint.verifyProofOnChain(proof);
  console.log(`[prove4d] On-chain verification result: ${verifOnChain}`);

  return proof;
}
