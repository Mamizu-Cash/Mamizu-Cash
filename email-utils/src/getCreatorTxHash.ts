/**
 * Fetch contract creator transaction hash for a given contract address on Base Sepolia.
 * Primary: BaseScan (optional API key).
 * Fallback: Blockscout (no API key).
 * Returns only the tx hash.
 */

const BASESCAN_API_URL = 'https://api-sepolia.basescan.org/api';
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || '';
const BLOCKSCOUT_API_URL = 'https://base-sepolia.blockscout.com/api';

async function fetchFromBaseScan(addr: string): Promise<`0x${string}` | null> {
  try {
    const url = new URL(BASESCAN_API_URL);
    url.searchParams.set('module', 'contract');
    url.searchParams.set('action', 'getcontractcreation');
    url.searchParams.set('contractaddresses', addr);
    if (BASESCAN_API_KEY) url.searchParams.set('apikey', BASESCAN_API_KEY);

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const body = await res.json();
    if (body.status !== '1' || !Array.isArray(body.result) || body.result.length === 0) return null;

    const entry = body.result[0] || {};
    const txHash = entry.txHash || entry.txhash || entry.txHashs;
    if (typeof txHash === 'string' && txHash.startsWith('0x') && txHash.length === 66) {
      return txHash as `0x${string}`;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchFromBlockscout(addr: string): Promise<`0x${string}` | null> {
  try {
    const url = new URL(BLOCKSCOUT_API_URL);
    url.searchParams.set('module', 'contract');
    url.searchParams.set('action', 'getcontractcreation');
    url.searchParams.set('contractaddresses', addr);

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const body = await res.json();
    if (body.status !== '1' || !Array.isArray(body.result) || body.result.length === 0) return null;

    const entry = body.result[0] || {};
    const txHash = entry.txHash || entry.txhash || entry.txHashs;
    if (typeof txHash === 'string' && txHash.startsWith('0x') && txHash.length === 66) {
      return txHash as `0x${string}`;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCreatorTxHashFromAddress(address: string): Promise<`0x${string}`> {
  const addr = address?.toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(addr)) {
    throw new Error(`Invalid address: ${address}`);
  }

  // Try BaseScan first
  const baseScanHash = await fetchFromBaseScan(addr);
  if (baseScanHash) return baseScanHash;

  // Fallback to Blockscout (no API key)
  const blockscoutHash = await fetchFromBlockscout(addr);
  if (blockscoutHash) return blockscoutHash;

  throw new Error('Failed to locate creator tx on both BaseScan and Blockscout.');
}