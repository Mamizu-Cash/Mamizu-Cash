import { initZkEmailSdk } from '@zk-email/sdk';

export async function getVerifierAddressFromBlueprint(blueprintId: string): Promise<`0x${string}`> {
  const sdk = initZkEmailSdk({ logging: { level: 'warn', enabled: true } });
  const blueprint = await sdk.getBlueprint(blueprintId);
  const addr = blueprint?.props?.verifierContract?.address as `0x${string}` | undefined;

  if (!addr || typeof addr !== 'string' || !addr.startsWith('0x') || addr.length !== 42) {
    throw new Error(`Verifier contract address not found or invalid for blueprint: ${blueprintId}`);
  }

  return addr;
}