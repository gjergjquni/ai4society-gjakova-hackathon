"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  name: string;
  role: string;
  initials: string;
  email?: string;
  profileLabel: string;
  logoutLabel: string;
};

export default function SidebarProfile({
  name,
  role,
  initials,
  email,
  profileLabel,
  logoutLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    try {
      window.localStorage.removeItem("reagigjakove-reports-v1");
    } catch {
      /* ignore */
    }
    router.push("/");
  }

  return (
    <div ref={rootRef} className="relative border-t border-[var(--color-ark-line)] px-3 py-3">
      {open && (
        <div
          className="absolute right-3 bottom-[calc(100%+6px)] left-3 z-50 overflow-hidden rounded-lg border border-[var(--color-ark-line)] bg-white shadow-[var(--shadow-ark-pop)]"
          role="menu"
        >
          <div className="border-b border-[var(--color-ark-line)] px-3.5 py-3">
            <p className="text-[13px] font-medium text-[var(--color-ark-ink)]">
              {name}
            </p>
            {email && (
              <p className="mt-0.5 truncate text-[11px] text-[var(--color-ark-faint)]">
                {email}
              </p>
            )}
            <p className="mt-0.5 text-[11px] text-[var(--color-ark-muted)]">
              {role}
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] text-[var(--color-ark-muted)] transition hover:bg-[var(--color-ark-subtle)] hover:text-[var(--color-ark-ink)]"
            onClick={() => setOpen(false)}
          >
            <User className="size-3.5 shrink-0" />
            {profileLabel}
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 border-t border-[var(--color-ark-line)] px-3.5 py-2.5 text-left text-[13px] font-medium text-[var(--color-ark-crit)] transition hover:bg-[var(--color-ark-danger-soft)]"
            onClick={handleLogout}
          >
            <LogOut className="size-3.5 shrink-0" />
            {logoutLabel}
          </button>
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition hover:bg-[var(--color-ark-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ark-brand)]/20"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-ark-brand)] text-[11px] font-semibold text-white">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-[var(--color-ark-ink)]">
            {name}
          </span>
          <span className="block truncate text-[11px] text-[var(--color-ark-faint)]">
            {role}
          </span>
        </span>
        <ChevronUp
          className={`size-3.5 shrink-0 text-[var(--color-ark-faint)] transition ${
            open ? "" : "rotate-180"
          }`}
        />
      </button>
    </div>
  );
}
