"use client";

import {
  DIRECTORATE_STATUS_LABELS,
  STATUS_LABELS,
  priorityBars,
  type DirectorateReportStatus,
  type PriorityLevel,
  type ReportStatus,
} from "@/lib/arkivist-types";

export function StatusBadge({
  status,
  label,
}: {
  status: ReportStatus;
  label?: string;
}) {
  const tone: Record<ReportStatus, string> = {
    SUBMITTED: "text-[var(--color-ark-muted)] bg-[var(--color-ark-subtle)]",
    AI_ANALYZED: "text-[var(--color-ark-brand)] bg-[var(--color-ark-brand-soft)]",
    NE_SHQYRTIM: "text-[#8a6a08] bg-[var(--color-ark-warn-soft)]",
    APROVUAR: "text-[var(--color-ark-ok)] bg-[var(--color-ark-ok-soft)]",
    DERGUAR_TE_DREJTORIA: "text-[var(--color-ark-ok)] bg-[var(--color-ark-ok-soft)]",
    REFUZUAR: "text-[var(--color-ark-crit)] bg-[var(--color-ark-danger-soft)]",
    BASHKUAR: "text-[var(--color-ark-muted)] bg-[var(--color-ark-subtle)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${tone[status]}`}
    >
      {label ?? STATUS_LABELS[status]}
    </span>
  );
}

export function DirStatusBadge({
  status,
  label,
}: {
  status: DirectorateReportStatus;
  label?: string;
}) {
  const tone: Record<DirectorateReportStatus, string> = {
    NEW: "text-[var(--color-ark-brand)] bg-[var(--color-ark-brand-soft)]",
    ACCEPTED: "text-[#8a6a08] bg-[var(--color-ark-warn-soft)]",
    IN_PROGRESS: "text-[#8a6a08] bg-[var(--color-ark-warn-soft)]",
    RESOLVED: "text-[var(--color-ark-ok)] bg-[var(--color-ark-ok-soft)]",
    VERIFIED: "text-[var(--color-ark-ok)] bg-[var(--color-ark-ok-soft)]",
    CLOSED: "text-[var(--color-ark-muted)] bg-[var(--color-ark-subtle)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${tone[status]}`}
    >
      {label ?? DIRECTORATE_STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBars({
  priority,
  label,
}: {
  priority: PriorityLevel;
  label?: string;
}) {
  const filled = priorityBars(priority);
  const color =
    priority === "Kritike"
      ? "bg-[var(--color-ark-crit)]"
      : priority === "E lartë"
        ? "bg-[var(--color-ark-high)]"
        : priority === "Mesatare"
          ? "bg-[var(--color-ark-mid)]"
          : "bg-[var(--color-ark-low)]";

  const text = label ?? priority;

  return (
    <div className="inline-flex items-center gap-2" title={text}>
      <div className="flex items-end gap-[3px]">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`w-[3px] rounded-[1px] ${
              n <= filled ? color : "bg-[var(--color-ark-line-strong)]"
            }`}
            style={{ height: 5 + n * 2.5 }}
          />
        ))}
      </div>
      <span className="text-xs text-[var(--color-ark-muted)]">{text}</span>
    </div>
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  const pct = value <= 1 ? Math.round(value * 100) : Math.round(value);
  return (
    <div className="flex min-w-[72px] items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-ark-line)]">
        <div
          className="h-full rounded-full bg-[var(--color-ark-brand)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-[var(--color-ark-muted)]">
        {pct}%
      </span>
    </div>
  );
}

export function selectClassName() {
  return "h-9 w-full rounded-md border border-[var(--color-ark-line)] bg-white px-2.5 text-sm text-[var(--color-ark-ink)] outline-none transition focus-visible:border-[var(--color-ark-brand)] focus-visible:ring-2 focus-visible:ring-[var(--color-ark-brand)]/15";
}

export function osmEmbedSrc(lat: number, lng: number) {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.003}%2C${lat - 0.002}%2C${lng + 0.003}%2C${lat + 0.002}&layer=mapnik&marker=${lat}%2C${lng}`;
}
