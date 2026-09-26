"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  approveCase,
  fetchCases,
  mergeCase,
  rejectCase,
  resolveCase,
  updateCaseClassification,
  updateDirectorateStatus,
  type ClassificationPayload,
} from "./api";
import type { ArkivistReport, ResolutionRecord } from "./arkivist-types";
import type { DirectorateId } from "./directorates";

type Listener = () => void;

let memoryReports: ArkivistReport[] = [];
let memoryLoading = true;
let memoryError: string | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): ArkivistReport[] {
  return memoryReports;
}

function getServerSnapshot(): ArkivistReport[] {
  return memoryReports;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function upsertReport(next: ArkivistReport) {
  const exists = memoryReports.some(
    (report) => report.id === next.id || (next.reportId && report.reportId === next.reportId),
  );
  memoryReports = exists
    ? memoryReports.map((report) =>
        report.id === next.id || report.id === next.reportId ? next : report,
      )
    : [next, ...memoryReports];
  emit();
}

export async function refreshReports(directorateId?: DirectorateId) {
  memoryLoading = true;
  memoryError = null;
  emit();
  try {
    memoryReports = await fetchCases(
      directorateId ? { directorateId } : undefined,
    );
  } catch (error) {
    memoryError =
      error instanceof Error ? error.message : "Raportet nuk u ngarkuan.";
    memoryReports = [];
  } finally {
    memoryLoading = false;
    emit();
  }
}

export function useReports(directorateId?: DirectorateId): [
  ArkivistReport[],
  {
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    approve: (id: string, payload: ClassificationPayload) => Promise<ArkivistReport>;
    edit: (id: string, payload: ClassificationPayload) => Promise<ArkivistReport>;
    reject: (id: string, reason: string) => Promise<ArkivistReport>;
    merge: (id: string, targetId: string) => Promise<ArkivistReport>;
    accept: (id: string) => Promise<ArkivistReport>;
    resolve: (
      id: string,
      resolution: Omit<ResolutionRecord, "completedAt">,
    ) => Promise<ArkivistReport>;
  },
] {
  const [hydrated, setHydrated] = useState(false);
  const reports = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [loading, setLoading] = useState(memoryLoading);
  const [error, setError] = useState<string | null>(memoryError);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setLoading(memoryLoading);
      setError(memoryError);
    });
    refreshReports(directorateId).finally(() => setHydrated(true));
    return () => {
      unsubscribe();
    };
  }, [directorateId]);

  const refresh = useCallback(() => refreshReports(directorateId), [directorateId]);

  const approve = useCallback(async (id: string, payload: ClassificationPayload) => {
    const next = await approveCase(id, payload);
    upsertReport(next);
    return next;
  }, []);

  const edit = useCallback(async (id: string, payload: ClassificationPayload) => {
    const next = await updateCaseClassification(id, payload);
    upsertReport(next);
    return next;
  }, []);

  const reject = useCallback(async (id: string, reason: string) => {
    const next = await rejectCase(id, reason);
    upsertReport(next);
    return next;
  }, []);

  const merge = useCallback(async (id: string, targetId: string) => {
    const next = await mergeCase(id, targetId);
    upsertReport(next);
    return next;
  }, []);

  const accept = useCallback(async (id: string) => {
    const next = await updateDirectorateStatus(id, "IN_PROGRESS");
    upsertReport(next);
    return next;
  }, []);

  const resolve = useCallback(
    async (id: string, resolution: Omit<ResolutionRecord, "completedAt">) => {
      const next = await resolveCase(id, resolution);
      upsertReport(next);
      return next;
    },
    [],
  );

  return [
    hydrated ? reports : memoryReports,
    { loading, error, refresh, approve, edit, reject, merge, accept, resolve },
  ];
}
