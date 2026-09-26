import type { DirectorateId } from "./directorates";

export type ReportStatus =
  | "SUBMITTED"
  | "AI_ANALYZED"
  | "PENDING_REVIEW"
  | "NE_SHQYRTIM"
  | "APPROVED"
  | "APROVUAR"
  | "ASSIGNED"
  | "DERGUAR_TE_DREJTORIA"
  | "REJECTED"
  | "REFUZUAR"
  | "BASHKUAR"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "VERIFIED"
  | "CLOSED";

export type DirectorateReportStatus =
  | "NEW"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "VERIFIED"
  | "CLOSED";

export type PriorityLevel = "Kritike" | "E lartë" | "Mesatare" | "E ulët";

export type ReportLocation = {
  address: string;
  lat: number;
  lng: number;
  neighborhood: string;
};

export type AiAnalysis = {
  confidence: number;
  suggestedCategory: string;
  suggestedPriority: PriorityLevel;
  suggestedDirectorate: DirectorateId;
  reasoning: string;
};

export type ResolutionRecord = {
  workDescription: string;
  photoBeforeUrl: string;
  photoAfterUrl: string;
  completedAt: string;
};

export type ArkivistReport = {
  id: string;
  reportId?: string;
  workflowStatus?: string;
  title: string;
  description: string;
  citizenNotes?: string;
  category: string;
  sector: string;
  directorateId: DirectorateId;
  priority: PriorityLevel;
  status: ReportStatus;
  directorateStatus?: DirectorateReportStatus;
  createdAt: string;
  date: string;
  time: string;
  location: ReportLocation;
  photoUrl: string;
  aiAnalysis: AiAnalysis;
  timeline: string[];
  citizenName?: string;
  mergedWithId?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  resolution?: ResolutionRecord;
};

export type ArkivistNavId =
  | "dashboard"
  | "raportet"
  | "ne-shqyrtim"
  | "te-aprovuara"
  | "te-refuzuara"
  | "statistikat";

export type DirectorateNavId =
  | "paneli"
  | "raportet"
  | "te-reja"
  | "ne-proces"
  | "te-zgjidhura"
  | "statistikat";

export const ARKIVIST_TIMELINE = [
  "Raportuar",
  "Analizuar nga AI",
  "Në shqyrtim",
  "Drejtoria",
  "Në proces",
  "Zgjidhur",
] as const;

export const STATUS_LABELS: Record<ReportStatus, string> = {
  SUBMITTED: "Raportuar",
  AI_ANALYZED: "Analizuar nga AI",
  PENDING_REVIEW: "Në shqyrtim",
  NE_SHQYRTIM: "Në shqyrtim",
  APPROVED: "Aprovuar",
  APROVUAR: "Aprovuar",
  ASSIGNED: "Te drejtoria",
  DERGUAR_TE_DREJTORIA: "Te drejtoria",
  REJECTED: "Refuzuar",
  REFUZUAR: "Refuzuar",
  BASHKUAR: "Bashkuar",
  IN_PROGRESS: "Në proces",
  RESOLVED: "Zgjidhur",
  VERIFIED: "Verifikuar",
  CLOSED: "Mbyllur",
};

export const DIRECTORATE_STATUS_LABELS: Record<
  DirectorateReportStatus,
  string
> = {
  NEW: "I ri",
  ACCEPTED: "I pranuar",
  IN_PROGRESS: "Në proces",
  RESOLVED: "I zgjidhur",
  VERIFIED: "I verifikuar",
  CLOSED: "I mbyllur",
};

export const CATEGORIES = [
  "Infrastrukturë",
  "Mbeturina",
  "Ndriçim",
  "Ujësjellës",
  "Trotuar",
  "Trafik",
  "Ambient",
  "Arsim",
  "Shëndetësi",
] as const;

export const SECTORS = [
  "Mirëmbajtja e rrugëve",
  "Menaxhimi i mbeturinave",
  "Ndriçimi publik",
  "Rrjeti i ujësjellësit",
  "Sinjalizimi rrugor",
  "Hapësirat publike",
  "Urbanizëm",
  "Inspektime",
  "Administratë",
] as const;

export const PRIORITIES: PriorityLevel[] = [
  "Kritike",
  "E lartë",
  "Mesatare",
  "E ulët",
];

export function priorityBars(priority: PriorityLevel): number {
  switch (priority) {
    case "Kritike":
      return 4;
    case "E lartë":
      return 3;
    case "Mesatare":
      return 2;
    case "E ulët":
      return 1;
  }
}

export function arkivistTimelineIndex(status: ReportStatus): number {
  switch (status) {
    case "SUBMITTED":
      return 0;
    case "AI_ANALYZED":
      return 1;
    case "PENDING_REVIEW":
    case "NE_SHQYRTIM":
      return 2;
    case "APPROVED":
    case "APROVUAR":
    case "ASSIGNED":
    case "DERGUAR_TE_DREJTORIA":
    case "IN_PROGRESS":
    case "RESOLVED":
    case "VERIFIED":
    case "CLOSED":
      return 3;
    case "REJECTED":
    case "REFUZUAR":
    case "BASHKUAR":
      return 2;
    default:
      return 0;
  }
}

export function isPendingReview(status: ReportStatus | string): boolean {
  return (
    status === "SUBMITTED" ||
    status === "AI_ANALYZED" ||
    status === "NE_SHQYRTIM" ||
    status === "PENDING_REVIEW"
  );
}

export function isApprovedStatus(status: ReportStatus | string): boolean {
  return (
    status === "APROVUAR" ||
    status === "APPROVED" ||
    status === "DERGUAR_TE_DREJTORIA" ||
    status === "ASSIGNED" ||
    status === "IN_PROGRESS" ||
    status === "RESOLVED" ||
    status === "VERIFIED" ||
    status === "CLOSED"
  );
}

export function isRejectedStatus(status: ReportStatus | string): boolean {
  return (
    status === "REFUZUAR" ||
    status === "REJECTED" ||
    status === "BASHKUAR"
  );
}

export function isAssignedToDirectorate(status: ReportStatus | string): boolean {
  return (
    status === "DERGUAR_TE_DREJTORIA" ||
    status === "ASSIGNED" ||
    status === "APROVUAR" ||
    status === "APPROVED"
  );
}

export function directorateTimelineIndex(
  status: ReportStatus,
  dirStatus?: DirectorateReportStatus,
): number {
  if (status === "REFUZUAR" || status === "BASHKUAR") return 2;
  if (
    status !== "DERGUAR_TE_DREJTORIA" &&
    status !== "APROVUAR" &&
    status !== "ASSIGNED" &&
    status !== "APPROVED"
  ) {
    return arkivistTimelineIndex(status);
  }
  switch (dirStatus) {
    case "NEW":
      return 3;
    case "ACCEPTED":
    case "IN_PROGRESS":
      return 4;
    case "RESOLVED":
      return 5;
    case "VERIFIED":
      return 6;
    case "CLOSED":
      return 7;
    default:
      return 3;
  }
}
