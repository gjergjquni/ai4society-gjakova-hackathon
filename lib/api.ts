export type IssueSeverity = "Kritike" | "E lartë" | "Mesatare";
export type IssueStatus = "Eskaluar" | "Në shqyrtim" | "Monitorim";

export type Issue = {
  id: string;
  rank: number;
  title: string;
  category: string;
  categoryId: string;
  location: string;
  reports: number;
  priority: number;
  trend: number;
  severity: IssueSeverity;
  status: IssueStatus;
  department: string;
  age: string;
  impact: string;
  recommendation: string;
  reasons: { label: string; value: number }[];
  coords: { lat: number; lng: number } | null;
  color: string;
};

export type ReportCreatePayload = {
  category_id?: string | null;
  custom_text?: string;
  place_id?: string | null;
  has_photo?: boolean;
  lat?: number | null;
  lon?: number | null;
};

export type ReportResult = {
  report_id: string;
  problem_id: string;
  case_code: string;
  category: string;
  category_id: string;
  location_text: string;
  duplicate_decision: string;
  issue: Issue;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api/v1";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (Array.isArray(body?.detail)) detail = body.detail[0]?.msg ?? detail;
    } catch {
      // keep default message
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export async function fetchProblems(): Promise<Issue[]> {
  const response = await fetch(`${API_BASE}/problems`, { cache: "no-store" });
  return parseJson<Issue[]>(response);
}

export async function createReport(payload: ReportCreatePayload): Promise<ReportResult> {
  const response = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category_id: payload.category_id || null,
      custom_text: payload.custom_text ?? "",
      place_id: payload.place_id || null,
      has_photo: Boolean(payload.has_photo),
      lat: payload.lat ?? null,
      lon: payload.lon ?? null,
    }),
  });
  return parseJson<ReportResult>(response);
}
