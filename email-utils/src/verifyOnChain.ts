import { Proof } from '@zk-email/sdk';
import { createPublicClient, http, defineChain } from 'viem';
import { baseSepolia } from 'viem/chains';
import * as snarkjs from 'snarkjs';

type HexAddress = `0x${string}`;

export interface VerifyOptions {
  addressOverride?: HexAddress;
  versionParam?: bigint; // default: 1n
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
 * Resolve target chain and RPC URL depending on environment variable BASE.
 * - If BASE=1 -> use Base Sepolia with https://sepolia.base.org
 * - Otherwise -> use Kaigan with fixed tokenized RPC
 */
function getChainAndRpc(useBase: boolean) {
  if (useBase) {
    return {
      chain: baseSepolia,
      rpcUrl: 'https://sepolia.base.org',
    } as const;
  }
  return {
    chain: KAIGAN_CHAIN,
    rpcUrl: getKaiganRpcUrl(),
  } as const;
}

/**
 * On-chain verification fixed to Kaigan chain by default.
 * - RPC: uses the fixed Kaigan RPC URL.
 * - Verifier address: from blueprint unless overridden.
 * - ABI: generic Groth16 verifier: verify(uint256, uint256[2], uint256[2][2], uint256[2], uint256[]).
 */
/**
 * Returns a minimal ABI for Groth16 verifier contracts.
 * Supports both verifyProof and verify function names.
 */
export function getVerifierContractAbi(signalCount: number) {
  // Default: verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[${signalCount}])
  return [
    {
      "inputs": [
        { "internalType": "uint256[2]", "name": "a", "type": "uint256[2]" },
        { "internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]" },
        { "internalType": "uint256[2]", "name": "c", "type": "uint256[2]" },
        { "internalType": `uint256[${signalCount}]`, "name": "signals", "type": `uint256[${signalCount}]` }
      ],
      "name": "verifyProof",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256[2]", "name": "a", "type": "uint256[2]" },
        { "internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]" },
        { "internalType": "uint256[2]", "name": "c", "type": "uint256[2]" },
        { "internalType": `uint256[${signalCount}]`, "name": "signals", "type": `uint256[${signalCount}]` }
      ],
      "name": "verify",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];
}

/**
 * Directly verify proof using the Verifier contract (not wrapper).
 * Calls the Verifier contract's verifyProof (or verify) method with proof parameters.
 */
export async function verifyProofDirectOnChain(
  proof: Proof,
  opts: VerifyOptions = {},
): Promise<boolean> {
  const useBase = process?.env?.BASE === '1';
  const { chain, rpcUrl } = getChainAndRpc(useBase);

  const verifierAddr = (opts.addressOverride ??
    (proof?.blueprint?.props as any)?.verifierContract?.address) as HexAddress | undefined;

  if (!verifierAddr) {
    throw new Error('No verifier contract address available (blueprint or override)');
  }

  if (!proof?.props?.proofData || !proof?.props?.publicOutputs) {
    throw new Error('No proof data generated yet');
  }

  // Normalize proofData: some callsites provide a JSON string, others an object
  // @ts-ignore - ProofData typing not exported; treat as any
  const rawProofData = proof.props.proofData;
  const proofData = typeof rawProofData === 'string' ? JSON.parse(rawProofData) : rawProofData;

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  // Prepare calldata using snarkjs to ensure correct field shapes
  let calldata = await snarkjs.groth16.exportSolidityCallData(
    proofData as any,
    (proof.props.publicOutputs as any)
  );
  calldata = JSON.parse(`[${calldata}]`);

  // Try both 'verifyProof' and 'verify' function names for compatibility
  const signalCount =
    Array.isArray(proof.props.publicOutputs) && typeof proof.props.publicOutputs.length === 'number'
      ? proof.props.publicOutputs.length
      : 5; // fallback to 5 if unknown
  const abi = getVerifierContractAbi(signalCount);
  const functionNames = ['verifyProof', 'verify'];
  for (const functionName of functionNames) {
    try {
      await client.readContract({
        address: verifierAddr,
        abi,
        functionName,
        args: Array.isArray(calldata) ? calldata : [calldata],
      });
      return true;
    } catch (error) {
      // Try next function name
    }
  }
  return false;
}
