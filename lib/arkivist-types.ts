export type ReportStatus =
  | "SUBMITTED"
  | "AI_ANALYZED"
  | "NE_SHQYRTIM"
  | "APROVUAR"
  | "DERGUAR_TE_DREJTORIA"
  | "REFUZUAR"
  | "BASHKUAR";

export type PriorityLevel = "Kritike" | "E lartë" | "Mesatare" | "E ulët";

export type ArkivistReport = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coords: { lat: number; lng: number };
  category: string;
  directorate: string;
  sector: string;
  priority: PriorityLevel;
  aiConfidence: number;
  status: ReportStatus;
  photoUrl: string;
  aiSummary: string;
  aiSuggestion: string;
  citizenName?: string;
  mergedWithId?: string;
  rejectReason?: string;
};

export type ArkivistNavId =
  | "dashboard"
  | "raportet"
  | "ne-shqyrtim"
  | "te-aprovuara"
  | "te-refuzuara"
  | "statistikat";

export const STATUS_PIPELINE: ReportStatus[] = [
  "SUBMITTED",
  "AI_ANALYZED",
  "NE_SHQYRTIM",
  "APROVUAR",
  "DERGUAR_TE_DREJTORIA",
];

export const STATUS_LABELS: Record<ReportStatus, string> = {
  SUBMITTED: "SUBMITTED",
  AI_ANALYZED: "AI ANALYZED",
  NE_SHQYRTIM: "NË SHQYRTIM",
  APROVUAR: "APROVUAR",
  DERGUAR_TE_DREJTORIA: "DËRGUAR TE DREJTORIA",
  REFUZUAR: "REFUZUAR",
  BASHKUAR: "BASHKUAR",
};

export const CATEGORIES = [
  "Infrastrukturë",
  "Mbeturina",
  "Ndriçim",
  "Ujësjellës",
  "Trotuar",
  "Trafik",
] as const;

export const DIRECTORATES = [
  "Drejtoria e Shërbimeve Publike",
  "Drejtoria e Infrastrukturës",
  "KRU Gjakova",
  "Çabrati Sh.A.",
  "Drejtoria e Urbanizmit",
  "Inspektorati Komunal",
] as const;

export const SECTORS = [
  "Mirëmbajtja e rrugëve",
  "Menaxhimi i mbeturinave",
  "Ndriçimi publik",
  "Rrjeti i ujësjellësit",
  "Sinjalizimi rrugor",
  "Hapësirat publike",
] as const;

export const PRIORITIES: PriorityLevel[] = [
  "Kritike",
  "E lartë",
  "Mesatare",
  "E ulët",
];
