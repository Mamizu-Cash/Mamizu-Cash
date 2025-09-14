import { Proof } from '@zk-email/sdk';
import { createPublicClient, http, defineChain } from 'viem';
import * as snarkjs from 'snarkjs';

type HexAddress = `0x${string}`;

export interface VerifyOptions {
  addressOverride?: HexAddress;
  versionParam?: bigint;      // default: 1n
}

/**
 * Kaigan chain fixed configuration
 * Network: kaigan
 * Chain ID: 5278000
 * Currency: JETH
 * Explorer: https://explorer.kaigan.jsc.dev
 * Default RPC base (requires token): https://rpc.kaigan.jsc.dev/rpc?token=<token>
 */
export const KAIGAN_CHAIN = defineChain({
  id: 5278000,
  name: 'kaigan',
  network: 'kaigan',
  nativeCurrency: { name: 'JETH', symbol: 'JETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.kaigan.jsc.dev/rpc'],
    },
    public: {
      http: ['https://rpc.kaigan.jsc.dev/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'Kaigan Explorer', url: 'https://explorer.kaigan.jsc.dev' },
  },
});

/**
 * Compose the Kaigan RPC URL.
 * Overriding RPC is disabled; always return the fixed Kaigan RPC with embedded token.
 */
function getKaiganRpcUrl(): string {
  return 'https://rpc.kaigan.jsc.dev/rpc?token=QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q';
}

/**
 * On-chain verification fixed to Kaigan chain by default.
 * - RPC: uses the fixed Kaigan RPC URL.
 * - Verifier address: from blueprint unless overridden.
 * - ABI: generic Groth16 verifier: verify(uint256, uint256[2], uint256[2][2], uint256[2], uint256[]).
 */
export async function verifyProofOnChainGeneric(proof: Proof, opts: VerifyOptions = {}): Promise<boolean> {
  const rpcUrl = getKaiganRpcUrl();
  const versionParam = opts.versionParam ?? 1n;

  // Basic validations similar to reference implementation
  const verifierAddr = (opts.addressOverride ??
    (proof?.blueprint?.props as any)?.verifierContract?.address) as HexAddress | undefined;

  if (!verifierAddr) {
    throw new Error('No verifier contract address available (blueprint or override)');
  }

  if (!proof?.props?.proofData || !proof?.props?.publicOutputs) {
    throw new Error('No proof data generated yet');
  }

  // @ts-ignore - ProofData typing not exported; treat as any
  const proofData = proof.props.proofData as any;

  // Build viem client for Kaigan (fixed chain), with RPC possibly including token.
  const client = createPublicClient({
    chain: KAIGAN_CHAIN,
    transport: http(rpcUrl),
  });

  // Prepare calldata using snarkjs to ensure correct field shapes
  let rawCalldata = await snarkjs.groth16.exportSolidityCallData(
    proofData,
    // @ts-ignore - publicOutputs not strongly typed
    proof.props.publicOutputs
  );

  // snarkjs returns a comma-separated string that JSON parses into:
  // [ [a0,a1], [ [b00,b01],[b10,b11] ], [c0,c1], [pub0,pub1,...] ]
  const parsed = JSON.parse(`[${rawCalldata}]`);

  // Deep convert any nested decimal strings to BigInt to satisfy viem ABI encoding
  const toBigIntDeep = (v: any): any => {
    if (Array.isArray(v)) return v.map(toBigIntDeep);
    if (typeof v === 'string') return BigInt(v);
    if (typeof v === 'number') return BigInt(v);
    return v;
  };

  const [a, b, c, publicInputs] = toBigIntDeep(parsed) as [
    readonly [bigint, bigint],
    readonly [[bigint, bigint], [bigint, bigint]],
    readonly [bigint, bigint],
    readonly bigint[],
  ];

  // Minimal generic Groth16 verifier ABI
  const verifierAbi = [
    {
      type: 'function',
      stateMutability: 'view',
      name: 'verify',
      inputs: [
        { name: 'version', type: 'uint256' },
        { name: 'a', type: 'uint256[2]' },
        { name: 'b', type: 'uint256[2][2]' },
        { name: 'c', type: 'uint256[2]' },
        { name: 'publicInputs', type: 'uint256[]' },
      ],
      outputs: [{ name: '', type: 'bool' }],
    },
  ] as const;

  try {
    const ok = await client.readContract({
      address: verifierAddr,
      abi: verifierAbi,
      functionName: 'verify',
      args: [versionParam, a, b, c, publicInputs],
    });
    return Boolean(ok);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[prove4d] Error verifying proof on chain (Kaigan):', error);
    return false;
  }
}