"use client";

import { useAdminLocale } from "@/lib/use-admin-locale";

type Props = {
  routeId: string;
};

export default function DirectorateNotFound({ routeId }: Props) {
  const { t } = useAdminLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ark-bg)] px-4">
      <div className="max-w-md rounded-xl border border-[var(--color-ark-line)] bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-[var(--color-ark-ink)]">
          {t.notFoundTitle}
        </p>
        <p className="mt-2 text-sm text-[var(--color-ark-muted)]">
          {t.notFoundDesc(routeId)}
        </p>
      </div>
    </div>
  );
}
