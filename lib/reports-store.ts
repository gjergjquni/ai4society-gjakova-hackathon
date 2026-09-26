"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { mockReports } from "./arkivist-mock-data";
import type { ArkivistReport } from "./arkivist-types";

const STORAGE_KEY = "reagigjakove-reports-v1";

type Listener = () => void;

let memoryReports: ArkivistReport[] = structuredClone(mockReports);
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function readFromStorage(): ArkivistReport[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ArkivistReport[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeToStorage(reports: ArkivistReport[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    /* ignore quota */
  }
}

function getSnapshot(): ArkivistReport[] {
  return memoryReports;
}

function getServerSnapshot(): ArkivistReport[] {
  return mockReports;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hydrateReportsStore() {
  const stored = readFromStorage();
  if (stored) {
    memoryReports = stored;
    emit();
  }
}

export function setReports(next: ArkivistReport[] | ((prev: ArkivistReport[]) => ArkivistReport[])) {
  memoryReports =
    typeof next === "function" ? next(memoryReports) : next;
  writeToStorage(memoryReports);
  emit();
}

export function updateReport(id: string, patch: Partial<ArkivistReport>) {
  setReports((prev) =>
    prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  );
}

export function useReports(): [
  ArkivistReport[],
  {
    setReports: typeof setReports;
    updateReport: typeof updateReport;
    resetReports: () => void;
  },
] {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrateReportsStore();
    setHydrated(true);
  }, []);

  const reports = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const resetReports = useCallback(() => {
    memoryReports = structuredClone(mockReports);
    writeToStorage(memoryReports);
    emit();
  }, []);

  // Avoid hydration mismatch: show mock until client hydrates from localStorage
  return [
    hydrated ? reports : mockReports,
    { setReports, updateReport, resetReports },
  ];
}
