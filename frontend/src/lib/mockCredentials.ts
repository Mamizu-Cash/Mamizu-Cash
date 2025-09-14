export interface CredentialInfo {
  type: "mizuhiki" | "unti";
  issuedAt: number;
  tokenId?: string;
  transactionHash?: string;
  userInfo?: {
    name?: string;
    email?: string;
    companyName?: string;
  };
}

const STORAGE_KEY = "mamizu_credentials";

export function hasCredential(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  return !!stored;
}

export function getCredential(): CredentialInfo | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setCredential(credential: CredentialInfo): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credential));
}

export function clearCredential(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateMockHash(): string {
  const chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateMockTokenId(): string {
  return Math.floor(Math.random() * 1000000).toString();
}

export async function simulateProcessingDelay(ms = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
