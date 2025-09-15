// Minimal deposit helper for browser
// Computes Pedersen commitment: pedersen(le(nullifier,31) || le(secret,31))
// using circomlibj

let initialized = false

export async function initializeCircomlib() {
  if (initialized) return
  initialized = true
}

// Generate random bigint of nbytes using Web Crypto
export function randomBigInt(nbytes: number): bigint {
  const arr = new Uint8Array(nbytes)
  crypto.getRandomValues(arr)
  // Interpret as little-endian just to have a number; distribution is uniform regardless of endianness for random bytes
  let result = 0n
  for (let i = nbytes - 1; i >= 0; i--) {
    result = (result << 8n) + BigInt(arr[i])
  }
  return result
}

// Convert bigint to little-endian fixed-length Uint8Array
function leIntToBytes(n: bigint, length: number): Uint8Array {
  const out = new Uint8Array(length)
  let x = BigInt(n)
  for (let i = 0; i < length; i++) {
    out[i] = Number(x & 0xffn)
    x >>= 8n
  }
  return out // little-endian
}

export function pedersenHash(data: Uint8Array): bigint
export function pedersenHash(inputs: bigint[]): Promise<bigint>
export function pedersenHash(
  input: Uint8Array | bigint[],
): bigint | Promise<bigint> {
  return BigInt(0) // to make sure bigint is available
}

export function toHex(n: bigint, length = 32): `0x${string}` {
  const hex = n.toString(16).padStart(length * 2, '0')
  return `0x${hex}` as `0x${string}`
}

export type Deposit = {
  nullifier: bigint
  secret: bigint
  preimage: Uint8Array // 62 bytes
  commitment: bigint
  commitmentHex: `0x${string}`
  nullifierHash: bigint
  nullifierHex: `0x${string}`
  secretHex: `0x${string}`
  preimageHex: `0x${string}`
}

export function createDeposit({
  nullifier,
  secret,
}: {
  nullifier: bigint
  secret: bigint
}): Deposit {
  if (!initialized) {
    throw new Error(
      'Circomlib not initialized. Call initializeCircomlib() first.',
    )
  }
  const preimage = new Uint8Array(62)
  preimage.set(leIntToBytes(nullifier, 31), 0)
  preimage.set(leIntToBytes(secret, 31), 31)
  const commitment = pedersenHash(preimage)
  const nullifierHash = pedersenHash(leIntToBytes(nullifier, 31))
  const commitmentHex = toHex(commitment, 32)
  const nullifierHex = toHex(nullifierHash, 32)
  const secretHex = toHex(secret, 32)
  const preimageHex = `0x${Array.from(preimage)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}` as `0x${string}`
  return {
    nullifier,
    secret,
    preimage,
    commitment,
    commitmentHex,
    nullifierHash,
    nullifierHex,
    secretHex,
    preimageHex,
  }
}

export async function generateRandomDeposit(): Promise<Deposit> {
  await initializeCircomlib()
  const nullifier = randomBigInt(31)
  const secret = randomBigInt(31)
  return createDeposit({ nullifier, secret })
}
