import { groth16 } from "snarkjs";
import { initializeCircomlib, pedersenHash } from "./deposit";
import { MerkleTree } from "./merkleTree";
import { hashPairwiseWithMiMCSponge } from "./mimc";

export interface WithdrawNote {
  nullifier: bigint;
  secret: bigint;
  commitment: bigint;
  preimage: bigint;
}

export interface WithdrawInput {
  // Public inputs
  root: bigint;
  nullifierHash: bigint;
  recipient: bigint; // address as bigint
  relayer: bigint; // address as bigint
  fee: bigint;

  // Private inputs
  nullifier: bigint;
  secret: bigint;
  pathElements: bigint[];
  pathIndices: number[];
}

export interface WithdrawProof {
  proof: {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
  };
  publicSignals: string[];
}

/**
 * Parse a note from URL fragment format
 */
export function parseNoteFromUrl(fragment: string): WithdrawNote | null {
  try {
    const json = decodeURIComponent(
      atob(
        fragment.replace(/-/g, "+").replace(/_/g, "/") +
          "=".repeat((4 - (fragment.length % 4)) % 4),
      ),
    );
    const payload = JSON.parse(json);

    return {
      nullifier: BigInt(payload.n),
      secret: BigInt(payload.s),
      commitment: BigInt(payload.c),
      preimage: BigInt(payload.p),
    };
  } catch (error) {
    console.error("Failed to parse note from URL:", error);
    return null;
  }
}

/**
 * Generate nullifier hash from nullifier and secret
 */
export async function generateNullifierHash(nullifier: bigint, secret: bigint): Promise<bigint> {
  await initializeCircomlib();

  // Use the same hash function as in the circuit (Pedersen)
  return await pedersenHash([nullifier, secret]);
}

/**
 * Create a Merkle tree from commitment list and get proof for a specific commitment
 */
export async function getMerkleProof(
  commitment: bigint,
  commitments: bigint[],
): Promise<{ pathElements: bigint[]; pathIndices: number[]; root: bigint } | null> {
  const tree = new MerkleTree(10, hashPairwiseWithMiMCSponge); // height = 10

  // Add all commitments to the tree
  for (const c of commitments) {
    await tree.insert(c);
  }

  // Find the index of our commitment
  const leafIndex = commitments.indexOf(commitment);
  if (leafIndex === -1) {
    console.error("Commitment not found in tree");
    return null;
  }

  const { pathElements, pathIndices } = tree.path(leafIndex);
  const root = tree.root();

  return {
    pathElements,
    pathIndices,
    root,
  };
}

/**
 * Generate ZK proof for withdrawal
 */
export async function generateWithdrawProof(
  note: WithdrawNote,
  recipient: string,
  relayer: string,
  fee: bigint,
  commitments: bigint[],
): Promise<WithdrawProof | null> {
  try {
    await initializeCircomlib();

    // Generate nullifier hash
    const nullifierHash = await generateNullifierHash(note.nullifier, note.secret);

    // Get Merkle proof for the commitment
    const merkleProof = await getMerkleProof(note.commitment, commitments);
    if (!merkleProof) {
      throw new Error("Failed to generate Merkle proof");
    }

    // Convert addresses to BigInt properly (remove 0x prefix if present)
    const recipientAddr = recipient.startsWith("0x") ? recipient.slice(2) : recipient;
    const relayerAddr = relayer.startsWith("0x") ? relayer.slice(2) : relayer;

    // Prepare circuit inputs
    const input: WithdrawInput = {
      // Public inputs
      root: merkleProof.root,
      nullifierHash,
      recipient: BigInt(`0x${recipientAddr}`),
      relayer: BigInt(`0x${relayerAddr}`),
      fee,

      // Private inputs
      nullifier: note.nullifier,
      secret: note.secret,
      pathElements: merkleProof.pathElements,
      pathIndices: merkleProof.pathIndices,
    };

    // Load circuit files
    const wasmUrl = "/circuits/withdraw.wasm";
    const zkeyUrl = "/circuits/withdraw_0001.zkey";

    console.log("Generating proof with inputs:", {
      root: input.root.toString(),
      nullifierHash: input.nullifierHash.toString(),
      recipient: input.recipient.toString(),
      relayer: input.relayer.toString(),
      fee: input.fee.toString(),
    });

    // Generate the proof
    const { proof, publicSignals } = await groth16.fullProve(
      {
        root: input.root.toString(),
        nullifierHash: input.nullifierHash.toString(),
        recipient: input.recipient.toString(),
        relayer: input.relayer.toString(),
        fee: input.fee.toString(),
        nullifier: input.nullifier.toString(),
        secret: input.secret.toString(),
        pathElements: input.pathElements.map((x) => x.toString()),
        pathIndices: input.pathIndices,
      },
      wasmUrl,
      zkeyUrl,
    );

    return {
      proof: {
        pi_a: [proof.pi_a[0], proof.pi_a[1]],
        pi_b: [
          [proof.pi_b[0][1], proof.pi_b[0][0]],
          [proof.pi_b[1][1], proof.pi_b[1][0]],
        ], // Note: swapped for Solidity
        pi_c: [proof.pi_c[0], proof.pi_c[1]],
      },
      publicSignals,
    };
  } catch (error) {
    console.error("Failed to generate withdraw proof:", error);
    return null;
  }
}

/**
 * Format proof for contract call
 */
export function formatProofForContract(proof: WithdrawProof): `0x${string}` {
  const { pi_a, pi_b, pi_c } = proof.proof;

  // Pack proof elements into a single bytes array for the contract
  const proofElements = [
    pi_a[0],
    pi_a[1],
    pi_b[0][0],
    pi_b[0][1],
    pi_b[1][0],
    pi_b[1][1],
    pi_c[0],
    pi_c[1],
  ];

  // Convert to padded hex strings and concatenate
  const packedProof = proofElements.map((x) => BigInt(x).toString(16).padStart(64, "0")).join("");

  return `0x${packedProof}` as `0x${string}`;
}
