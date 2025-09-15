// MiMC implementation for browser using circomlibjs
import { buildMimcSponge } from "circomlibjs";

let mimcSponge: any | null = null;
let initialized = false;

export async function initializeMiMC() {
  if (initialized) return;
  mimcSponge = await buildMimcSponge();
  initialized = true;
}

/**
 * Hash two elements using MiMC sponge hash function
 * This is compatible with the MiMC implementation used in the circuit
 */
export async function hashPairwiseWithMiMCSponge(left: bigint, right: bigint): Promise<bigint> {
  if (!initialized || !mimcSponge) {
    await initializeMiMC();
  }

  if (!mimcSponge) {
    throw new Error("Failed to initialize MiMC sponge");
  }

  // Use MiMC sponge to hash the pair
  const result = mimcSponge.hash(left, right, 0);
  const xL = mimcSponge.F.toObject(result.xL);
  return typeof xL === "bigint" ? xL : BigInt(xL.toString());
}

/**
 * Hash multiple elements using MiMC sponge
 */
export async function hashMultipleWithMiMCSponge(elements: bigint[]): Promise<bigint> {
  if (!initialized || !mimcSponge) {
    await initializeMiMC();
  }

  if (!mimcSponge) {
    throw new Error("Failed to initialize MiMC sponge");
  }

  // Hash multiple elements
  const result = mimcSponge.multiHash(elements, 0);
  const output = mimcSponge.F.toObject(result);
  return typeof output === "bigint" ? output : BigInt(output.toString());
}
