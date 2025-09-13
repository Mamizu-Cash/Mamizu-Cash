import type { CeremonyStatus, ParticipantRole, VerificationStatus } from "../constants";

export interface Verifier {
  id: string;
  name: string;
  email: string;
  role: ParticipantRole;
  status: VerificationStatus;
  joinedAt: Date;
  clientId: string;
  connectedAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
  certificateUrl?: string;
  txid?: string;
}

export interface CeremonyState {
  id: string;
  status: CeremonyStatus;
  participants: Verifier[];
  startedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export async function fetchVerifierList(): Promise<Verifier[]> {
  // TODO: Replace with actual API call
  const now = new Date();
  return [
    {
      id: "1",
      name: "佐藤太郎",
      email: "taro@example.com",
      role: "VERIFIER",
      status: "verified",
      joinedAt: now,
      clientId: "client-1",
      connectedAt: now,
      lastActiveAt: now,
      isActive: true,
    },
    {
      id: "2",
      name: "田中花子",
      email: "hanako@example.com",
      role: "VERIFIER",
      status: "pending",
      joinedAt: now,
      clientId: "client-2",
      connectedAt: now,
      lastActiveAt: now,
      isActive: true,
    },
  ];
}

export async function updateVerifierState(
  id: string,
  state: Partial<Verifier>,
): Promise<{ success: boolean; verifier?: Verifier }> {
  // TODO: Replace with actual API call
  console.log("Updating verifier state:", id, state);

  const now = new Date();
  return {
    success: true,
    verifier: {
      id,
      name: "Updated Verifier",
      email: "updated@example.com",
      role: "VERIFIER",
      status: "verified",
      joinedAt: now,
      clientId: "client-updated",
      connectedAt: now,
      lastActiveAt: now,
      isActive: true,
      ...state,
    },
  };
}

export async function getCeremonyState(ceremonyId: string): Promise<CeremonyState> {
  // TODO: Replace with actual API call
  return {
    id: ceremonyId,
    status: "waiting",
    participants: await fetchVerifierList(),
    metadata: {},
  };
}

export async function startCeremony(ceremonyId: string): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  console.log("Starting ceremony:", ceremonyId);
  return { success: true };
}

export async function completeCeremony(ceremonyId: string): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  console.log("Completing ceremony:", ceremonyId);
  return { success: true };
}
