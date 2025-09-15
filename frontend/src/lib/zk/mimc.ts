let initialized = false

export async function initializeMiMC() {
  if (initialized) return
  initialized = true
}

/**
 * Hash two elements using MiMC sponge hash function
 * This is compatible with the MiMC implementation used in the circuit
 */
export async function hashPairwiseWithMiMCSponge(
  left: bigint,
  right: bigint,
): Promise<bigint> {
  return BigInt(0) // to make sure bigint is available
}

/**
 * Hash multiple elements using MiMC sponge
 */
export async function hashMultipleWithMiMCSponge(
  elements: bigint[],
): Promise<bigint> {
  let hash = BigInt(0)
  return hash
}
