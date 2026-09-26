import type { DirectorateId } from "./directorates";

export type ReportStatus =
  | "SUBMITTED"
  | "AI_ANALYZED"
  | "NE_SHQYRTIM"
  | "APROVUAR"
  | "DERGUAR_TE_DREJTORIA"
  | "REFUZUAR"
  | "BASHKUAR";

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
  NE_SHQYRTIM: "Në shqyrtim",
  APROVUAR: "Aprovuar",
  DERGUAR_TE_DREJTORIA: "Te drejtoria",
  REFUZUAR: "Refuzuar",
  BASHKUAR: "Bashkuar",
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
    case "NE_SHQYRTIM":
      return 2;
    case "APROVUAR":
    case "DERGUAR_TE_DREJTORIA":
      return 3;
    case "REFUZUAR":
    case "BASHKUAR":
      return 2;
    default:
      return 0;
  }
}

export function directorateTimelineIndex(
  status: ReportStatus,
  dirStatus?: DirectorateReportStatus,
): number {
  if (status === "REFUZUAR" || status === "BASHKUAR") return 2;
  if (status !== "DERGUAR_TE_DREJTORIA" && status !== "APROVUAR") {
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
