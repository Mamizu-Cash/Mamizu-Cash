// MiMC implementation for browser using circomlibjs
import * as circomlib from "circomlibjs";

let mimcSponge: any | null = null;
let initialized = false;

export async function initializeMiMC() {
  if (initialized) return;
  mimcSponge = await circomlib.buildMiMCSponge();
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
  const result = mimcSponge.F.toObject(mimcSponge.hash(left, right, 0));
  return typeof result === "bigint" ? result : BigInt(result.toString());
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
  const result = mimcSponge.F.toObject(mimcSponge.multiHash(elements, 0));
  return typeof result === "bigint" ? result : BigInt(result.toString());
}
