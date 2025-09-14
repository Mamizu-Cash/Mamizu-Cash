export const CONSTANTS = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3000",
  CHAIN_ID: 1,
  CONTRACT_ADDRESS: "0x0000000000000000000000000000000000000000",
  CEREMONY_TIMEOUT: 30000,
  MAX_PARTICIPANTS: 100,
  DEFAULT_CEREMONY_DURATION: 300000, // 5 minutes
  SUPPORTED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  precomputedTransactionDataHex: "0x1234567890abcdef",
  precomputedTransactionHash: "0xabcdef1234567890",
  names: {
    bride: "新婦",
    groom: "新郎",
  },
  precomputedDocumentHash: "0xdocument123456789",
  documentUrl: "https://example.com/document.pdf",
  blockExplorer: {
    url: "https://etherscan.io",
    tx: "https://etherscan.io/tx/",
  },
  tosUrl: "https://example.com/terms",
  EMAIL_CONFIG: {
    FROM: "me@aoki.app",
    TO: "ayukiyhs@gmail.com",
    ORGANIZATION: "AokiApp Inc.",
    DOMAIN: "aoki.app",
    SUBJECT: "[Mamizu-Cash]Registration & Business Verification",
    BODY_TEMPLATE: `I am going to register the Mamizu-Cash and prove our business.

Org: AokiApp Inc.
Domain: aoki.app`,
  },
  certs: {
    ca: "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----",
    intermediate: "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----",
    bride: "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----",
    groom: "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----",
  },
  ROUTES: {
    HOME: "/",
    VERIFIER_REGISTER: "/verifier/register",
    VERIFIER_VERIFY: "/verifier/verify",
    VERIFIER_CEREMONY: "/verifier/ceremony",
    PROVER_WELCOME: "/prover/welcome",
    PROVER_DOCUMENT: "/prover/document",
    ADMIN: "/admin",
  },
} as const;

export type CeremonyStatus = "waiting" | "in_progress" | "completed" | "failed";
export type ParticipantRole = "BRIDE" | "GROOM" | "VERIFIER";
export type VerificationStatus = "pending" | "verified" | "failed";

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: ParticipantRole;
  status: VerificationStatus;
  joinedAt: string;
  clientId: string;
  connectedAt: string;
  lastActiveAt: string;
  isActive: boolean;
  certificateUrl?: string;
}
