import type { ArkivistReport, PriorityLevel, ResolutionRecord } from "./arkivist-types";
import type { DirectorateId } from "./directorates";

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
  photo?: File | null;
};

export type ReportResult = {
  report_id: string;
  problem_id: string;
  case_code: string;
  category: string;
  category_id: string;
  location_text: string;
  duplicate_decision: string;
  workflow_status?: string;
  status?: string;
  title?: string;
  photo_url?: string | null;
  issue: Issue;
};

export type CitizenCase = {
  id: string;
  case_code: string;
  title: string;
  category: string;
  status: string;
  workflow_status: string;
  directorate_id: string;
  directorate_name: string;
  location_text: string;
  photo_url: string | null;
  timeline: string[];
  created_at: string;
  lat: number | null;
  lon: number | null;
};

export type ClassificationPayload = {
  title?: string;
  category?: string;
  sector?: string;
  directorateId?: DirectorateId;
  priority?: PriorityLevel;
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
  const hasFile = Boolean(payload.photo);
  const response = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: hasFile ? undefined : { "Content-Type": "application/json" },
    body: hasFile
      ? (() => {
          const form = new FormData();
          if (payload.category_id) form.append("category_id", payload.category_id);
          form.append("custom_text", payload.custom_text ?? "");
          if (payload.place_id) form.append("place_id", payload.place_id);
          form.append("has_photo", payload.photo ? "true" : "false");
          if (payload.lat != null) form.append("lat", String(payload.lat));
          if (payload.lon != null) form.append("lon", String(payload.lon));
          if (payload.photo) form.append("photo", payload.photo);
          return form;
        })()
      : JSON.stringify({
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

export async function fetchCases(params?: {
  directorateId?: DirectorateId;
  status?: string;
}): Promise<ArkivistReport[]> {
  const query = new URLSearchParams();
  if (params?.directorateId) query.set("directorate_id", params.directorateId);
  if (params?.status) query.set("status", params.status);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  const response = await fetch(`${API_BASE}/cases${suffix}`, { cache: "no-store" });
  return parseJson<ArkivistReport[]>(response);
}

export async function fetchCase(id: string): Promise<ArkivistReport> {
  const response = await fetch(`${API_BASE}/cases/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  return parseJson<ArkivistReport>(response);
}

export async function lookupCitizenCase(query: string): Promise<CitizenCase | null> {
  const response = await fetch(
    `${API_BASE}/cases/lookup?q=${encodeURIComponent(query)}`,
    { cache: "no-store" },
  );
  const rows = await parseJson<CitizenCase[]>(response);
  return rows[0] ?? null;
}

export async function updateCaseClassification(
  id: string,
  payload: ClassificationPayload,
): Promise<ArkivistReport> {
  const response = await fetch(`${API_BASE}/cases/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<ArkivistReport>(response);
}

export async function approveCase(
  id: string,
  payload: ClassificationPayload,
): Promise<ArkivistReport> {
  const response = await fetch(`${API_BASE}/cases/${encodeURIComponent(id)}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<ArkivistReport>(response);
}

export async function rejectCase(id: string, reason: string): Promise<ArkivistReport> {
  const response = await fetch(`${API_BASE}/cases/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  return parseJson<ArkivistReport>(response);
}

export async function mergeCase(id: string, targetId: string): Promise<ArkivistReport> {
  const response = await fetch(`${API_BASE}/cases/${encodeURIComponent(id)}/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetId }),
  });
  return parseJson<ArkivistReport>(response);
}

export async function updateDirectorateStatus(
  id: string,
  nextStatus: "IN_PROGRESS" | "RESOLVED" | "VERIFIED" | "CLOSED" | "ACCEPTED",
): Promise<ArkivistReport> {
  const response = await fetch(
    `${API_BASE}/cases/${encodeURIComponent(id)}/directorate-status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    },
  );
  return parseJson<ArkivistReport>(response);
}

export async function resolveCase(
  id: string,
  resolution: Omit<ResolutionRecord, "completedAt"> & { completedAt?: string },
): Promise<ArkivistReport> {
  const response = await fetch(`${API_BASE}/cases/${encodeURIComponent(id)}/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workDescription: resolution.workDescription,
      photoBeforeUrl: resolution.photoBeforeUrl,
      photoAfterUrl: resolution.photoAfterUrl,
    }),
  });
  return parseJson<ArkivistReport>(response);
}
