"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  CircleCheck,
  FileWarning,
  Inbox,
  LayoutDashboard,
  MapPin,
  Menu,
  Search,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DirStatusBadge,
  osmEmbedSrc,
  selectClassName,
} from "@/components/arkivist/shared-ui";
import LangSwitcher from "@/components/lang-switcher";
import SidebarProfile from "@/components/sidebar-profile";
import {
  CATEGORIES,
  directorateTimelineIndex,
  isAssignedToDirectorate,
  type ArkivistReport,
  type DirectorateNavId,
  type DirectorateReportStatus,
} from "@/lib/arkivist-types";
import type { Directorate } from "@/lib/directorates";
import type { AdminMessages } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import { useReports } from "@/lib/reports-store";

const navIcons: {
  id: DirectorateNavId;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "paneli", icon: LayoutDashboard },
  { id: "raportet", icon: Inbox },
  { id: "te-reja", icon: FileWarning },
  { id: "ne-proces", icon: Clock3 },
  { id: "te-zgjidhura", icon: CircleCheck },
  { id: "statistikat", icon: BarChart3 },
];

const DIR_STATUS_FILTER: DirectorateReportStatus[] = [
  "NEW",
  "ACCEPTED",
  "IN_PROGRESS",
  "RESOLVED",
  "VERIFIED",
  "CLOSED",
];

function navLabel(id: DirectorateNavId, t: AdminMessages): string {
  switch (id) {
    case "paneli":
      return t.navPanel;
    case "raportet":
      return t.navReports;
    case "te-reja":
      return t.navNew;
    case "ne-proces":
      return t.navInProgress;
    case "te-zgjidhura":
      return t.navResolved;
    case "statistikat":
      return t.navStats;
  }
}

type Props = {
  directorate: Directorate;
};

export default function DirectorateDashboard({ directorate }: Props) {
  const { locale, setLocale, t } = useAdminLocale();
  const [reports, { loading, error, refresh, accept, resolve }] = useReports();
  const [nav, setNav] = useState<DirectorateNavId>("paneli");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [workDescription, setWorkDescription] = useState("");
  const [photoBefore, setPhotoBefore] = useState("");
  const [photoAfter, setPhotoAfter] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const mine = useMemo(
    () =>
      reports.filter(
        (r) =>
          r.directorateId === directorate.id &&
          isAssignedToDirectorate(r.status) &&
          Boolean(r.directorateStatus),
      ),
    [reports, directorate.id],
  );

  const stats = useMemo(() => {
    const teReja = mine.filter((r) => r.directorateStatus === "NEW").length;
    const neProces = mine.filter(
      (r) =>
        r.directorateStatus === "ACCEPTED" ||
        r.directorateStatus === "IN_PROGRESS",
    ).length;
    const prioritet = mine.filter(
      (r) => r.priority === "Kritike" || r.priority === "E lartë",
    ).length;
    const zgjidhura = mine.filter(
      (r) =>
        r.directorateStatus === "RESOLVED" ||
        r.directorateStatus === "VERIFIED" ||
        r.directorateStatus === "CLOSED",
    ).length;
    return { teReja, neProces, prioritet, zgjidhura, total: mine.length };
  }, [mine]);

  const filtered = useMemo(() => {
    let list = [...mine];
    if (nav === "te-reja") {
      list = list.filter((r) => r.directorateStatus === "NEW");
    } else if (nav === "ne-proces") {
      list = list.filter(
        (r) =>
          r.directorateStatus === "ACCEPTED" ||
          r.directorateStatus === "IN_PROGRESS",
      );
    } else if (nav === "te-zgjidhura") {
      list = list.filter(
        (r) =>
          r.directorateStatus === "RESOLVED" ||
          r.directorateStatus === "VERIFIED" ||
          r.directorateStatus === "CLOSED",
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.location.address.toLowerCase().includes(q) ||
          r.location.neighborhood.toLowerCase().includes(q),
      );
    }
    if (filterStatus)
      list = list.filter((r) => r.directorateStatus === filterStatus);
    if (filterCategory)
      list = list.filter((r) => r.category === filterCategory);
    return list;
  }, [mine, nav, search, filterStatus, filterCategory]);

  const selected =
    mine.find((r) => r.id === selectedId) ??
    reports.find((r) => r.id === selectedId) ??
    null;

  async function acceptReport(report: ArkivistReport) {
    try {
      await accept(report.id);
      setSuccessMessage(t.successAccepted);
    } catch {
      setSuccessMessage(t.actionError);
    }
  }

  async function submitResolution() {
    if (!selected || !workDescription.trim()) return;
    try {
      await resolve(selected.id, {
        workDescription: workDescription.trim(),
        photoBeforeUrl: photoBefore.trim(),
        photoAfterUrl: photoAfter.trim(),
      });
      setResolveOpen(false);
      setWorkDescription("");
      setPhotoBefore("");
      setPhotoAfter("");
      setSuccessMessage(t.successResolved);
    } catch {
      setSuccessMessage(t.actionError);
    }
  }

  const pageTitle = navLabel(nav, t);
  const directorateName = t.directorateNames[directorate.id];

  return (
    <div className="flex min-h-screen bg-[var(--color-ark-bg)] text-[var(--color-ark-ink)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label={t.closeMenu}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--color-ark-line)] bg-[var(--color-ark-surface)] transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-[var(--color-ark-line)] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/gjakova-emblem.png"
              alt={t.municipality}
              width={40}
              height={48}
              className="h-11 w-auto shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[11px] text-[var(--color-ark-muted)]">
                {t.municipality}
              </p>
              <p className="truncate text-sm font-semibold leading-tight">
                {directorateName}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[var(--color-ark-brand)]">
                {t.brand}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navIcons.map((item) => {
            const Icon = item.icon;
            const active = nav === item.id && !selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setNav(item.id);
                  setSelectedId(null);
                  setSuccessMessage(null);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? "bg-[var(--color-ark-brand)] text-white"
                    : "text-[var(--color-ark-muted)] hover:bg-[var(--color-ark-brand-soft)] hover:text-[var(--color-ark-ink)]"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {navLabel(item.id, t)}
              </button>
            );
          })}
        </nav>

        <SidebarProfile
          name={`${t.official} · ${directorate.id}`}
          role={t.directorateNames[directorate.id]}
          initials={directorate.id.slice(0, 2)}
          profileLabel={t.profile}
          logoutLabel={t.logout}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[var(--color-ark-line)] bg-[var(--color-ark-surface)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label={t.openMenu}
              >
                <Menu className="size-4" />
              </Button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold sm:text-base">
                  {directorateName}
                </p>
                <p className="truncate text-xs text-[var(--color-ark-muted)]">
                  {t.directorateDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <LangSwitcher locale={locale} onChange={setLocale} />

              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[var(--color-ark-muted)]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="h-9 w-40 pl-8 sm:w-52 lg:w-64"
                />
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNotifOpen((v) => !v)}
                  aria-label={t.notifications}
                >
                  <Bell className="size-4" />
                </Button>
                {stats.teReja > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--color-ark-crit)] text-[10px] font-bold text-white">
                    {stats.teReja}
                  </span>
                )}
                {notifOpen && (
                  <div
                    className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[var(--color-ark-line)] bg-white p-4 text-sm"
                    style={{ boxShadow: "var(--shadow-ark-pop)" }}
                  >
                    <p className="font-semibold">{t.notifications}</p>
                    <p className="mt-2 text-[var(--color-ark-muted)]">
                      {t.reportsCount(stats.teReja)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main
          className="flex-1 p-4 sm:p-6"
          onClick={() => setNotifOpen(false)}
        >
          {loading && !selected ? (
            <p className="mb-4 text-[13px] text-[var(--color-ark-faint)]">
              Duke u ngarkuar...
            </p>
          ) : null}
          {error ? (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-ark-danger-soft)] bg-[var(--color-ark-danger-soft)] px-4 py-3">
              <p className="text-[13px] text-[var(--color-ark-crit)]">{t.loadError}</p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="text-[13px] font-medium text-[var(--color-ark-brand)]"
              >
                {t.loadRetry}
              </button>
            </div>
          ) : null}
          {selected ? (
            <ReportDetail
              t={t}
              report={
                reports.find((r) => r.id === selected.id) ?? selected
              }
              successMessage={successMessage}
              onBack={() => {
                setSelectedId(null);
                setSuccessMessage(null);
              }}
              onAccept={() =>
                acceptReport(
                  reports.find((r) => r.id === selected.id) ?? selected,
                )
              }
              onResolve={() => {
                setWorkDescription("");
                setPhotoBefore("");
                setPhotoAfter("");
                setResolveOpen(true);
              }}
            />
          ) : nav === "statistikat" ? (
            <StatsView t={t} stats={stats} directorateName={directorateName} />
          ) : nav === "paneli" ? (
            <PanelView
              t={t}
              stats={stats}
              reports={mine}
              onOpen={(id) => {
                setSelectedId(id);
                setSuccessMessage(null);
              }}
            />
          ) : (
            <ListView
              t={t}
              title={pageTitle}
              reports={filtered}
              filterStatus={filterStatus}
              filterCategory={filterCategory}
              onFilterStatus={setFilterStatus}
              onFilterCategory={setFilterCategory}
              onOpen={(id) => {
                setSelectedId(id);
                setSuccessMessage(null);
              }}
            />
          )}
        </main>
      </div>

      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.resolveDialogTitle}</DialogTitle>
            <DialogDescription>{t.resolveDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">{t.workDescription}</span>
              <Textarea
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder={t.workPlaceholder}
                className="min-h-24"
              />
            </label>
            <PhotoUploadField
              label={t.photoBefore}
              value={photoBefore}
              onChange={setPhotoBefore}
              chooseLabel={t.choosePhoto}
              changeLabel={t.changePhoto}
              removeLabel={t.removePhoto}
            />
            <PhotoUploadField
              label={t.photoAfter}
              value={photoAfter}
              onChange={setPhotoAfter}
              chooseLabel={t.choosePhoto}
              changeLabel={t.changePhoto}
              removeLabel={t.removePhoto}
            />
            <p className="text-xs text-[var(--color-ark-muted)]">
              {t.completionDate}:{" "}
              {new Date().toLocaleDateString(
                locale === "en"
                  ? "en-US"
                  : locale === "sr"
                    ? "sr-RS"
                    : "sq-AL",
              )}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveOpen(false)}>
              {t.cancel}
            </Button>
            <Button
              disabled={!workDescription.trim()}
              onClick={submitResolution}
            >
              {t.saveResolution}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PhotoUploadField({
  label,
  value,
  onChange,
  chooseLabel,
  changeLabel,
  removeLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  chooseLabel: string;
  changeLabel: string;
  removeLabel: string;
}) {
  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {value ? (
        <div className="overflow-hidden rounded-lg border border-[var(--color-ark-line)]">
          <img
            src={value}
            alt={label}
            className="aspect-video w-full object-cover"
          />
          <div className="flex items-center gap-2 border-t border-[var(--color-ark-line)] bg-[var(--color-ark-subtle)] px-3 py-2">
            <label className="cursor-pointer text-[12px] font-medium text-[var(--color-ark-brand)] hover:underline">
              {changeLabel}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  handleFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[12px] font-medium text-[var(--color-ark-crit)] hover:underline"
            >
              {removeLabel}
            </button>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--color-ark-line-strong)] bg-[var(--color-ark-subtle)] px-4 py-6 text-center transition hover:border-[var(--color-ark-brand)] hover:bg-[var(--color-ark-brand-soft)]/40">
          <span className="text-[13px] font-medium text-[var(--color-ark-brand)]">
            {chooseLabel}
          </span>
          <span className="text-[11px] text-[var(--color-ark-faint)]">
            JPG, PNG, WEBP
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}

function EightStepTimeline({
  report,
  t,
}: {
  report: ArkivistReport;
  t: AdminMessages;
}) {
  const active = directorateTimelineIndex(
    report.status,
    report.directorateStatus,
  );
  const steps = t.directorateTimeline;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((step, index) => {
        const done = active >= index;
        const isActive = active === index;
        return (
          <div key={`${step}-${index}`} className="flex items-center gap-1.5">
            <div
              className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wide sm:text-[11px] ${
                isActive
                  ? "bg-[var(--color-ark-brand)] text-white"
                  : done
                    ? "bg-[var(--color-ark-brand-soft)] text-[var(--color-ark-brand)]"
                    : "bg-[var(--color-ark-line)] text-[var(--color-ark-faint)]"
              }`}
            >
              {step}
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="size-3.5 text-[var(--color-ark-line-strong)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PanelView({
  t,
  stats,
  reports,
  onOpen,
}: {
  t: AdminMessages;
  stats: {
    teReja: number;
    neProces: number;
    prioritet: number;
    zgjidhura: number;
  };
  reports: ArkivistReport[];
  onOpen: (id: string) => void;
}) {
  const cards = [
    {
      label: t.statNew,
      value: stats.teReja,
      icon: FileWarning,
      tone: "text-[var(--color-ark-brand)] bg-[var(--color-ark-brand-soft)]",
    },
    {
      label: t.statInProgress,
      value: stats.neProces,
      icon: ClipboardList,
      tone: "text-[#8a6a08] bg-[var(--color-ark-warn-soft)]",
    },
    {
      label: t.statHighPriority,
      value: stats.prioritet,
      icon: Clock3,
      tone: "text-[var(--color-ark-crit)] bg-[var(--color-ark-danger-soft)]",
    },
    {
      label: t.statResolved,
      value: stats.zgjidhura,
      icon: CircleCheck,
      tone: "text-[var(--color-ark-ok)] bg-[var(--color-ark-ok-soft)]",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t.panelTitle}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ark-muted)]">
          {t.directorateDesc}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="rounded-xl bg-white shadow-none ring-[var(--color-ark-line)]"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardDescription>{card.label}</CardDescription>
                    <CardTitle className="mt-1 text-3xl tabular-nums">
                      {card.value}
                    </CardTitle>
                  </div>
                  <span
                    className={`flex size-10 items-center justify-center rounded-lg ${card.tone}`}
                  >
                    <Icon className="size-5" />
                  </span>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-xl bg-white shadow-none ring-[var(--color-ark-line)]">
        <CardHeader className="border-b border-[var(--color-ark-line)] [.border-b]:pb-4">
          <CardTitle className="text-base">{t.allReports}</CardTitle>
          <CardDescription>{t.allReportsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ReportsTable t={t} reports={reports} onOpen={onOpen} />
        </CardContent>
      </Card>
    </div>
  );
}

function ListView({
  t,
  title,
  reports,
  filterStatus,
  filterCategory,
  onFilterStatus,
  onFilterCategory,
  onOpen,
}: {
  t: AdminMessages;
  title: string;
  reports: ArkivistReport[];
  filterStatus: string;
  filterCategory: string;
  onFilterStatus: (v: string) => void;
  onFilterCategory: (v: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ark-muted)]">
            {t.reportsCount(reports.length)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className={`${selectClassName()} w-auto min-w-[140px]`}
            value={filterStatus}
            onChange={(e) => onFilterStatus(e.target.value)}
          >
            <option value="">{t.filterStatus}</option>
            {DIR_STATUS_FILTER.map((s) => (
              <option key={s} value={s}>
                {t.dirStatusLabels[s]}
              </option>
            ))}
          </select>
          <select
            className={`${selectClassName()} w-auto min-w-[140px]`}
            value={filterCategory}
            onChange={(e) => onFilterCategory(e.target.value)}
          >
            <option value="">{t.filterCategory}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--color-ark-line)] bg-white">
        <ReportsTable t={t} reports={reports} onOpen={onOpen} />
      </div>
    </div>
  );
}

function ReportsTable({
  t,
  reports,
  onOpen,
}: {
  t: AdminMessages;
  reports: ArkivistReport[];
  onOpen: (id: string) => void;
}) {
  if (reports.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-[var(--color-ark-muted)]">
        <p className="font-medium text-[var(--color-ark-ink)]">
          {t.emptyDirectorateTitle}
        </p>
        <p className="mt-1">{t.emptyDirectorateDesc}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[var(--color-ark-line)] bg-[var(--color-ark-subtle)] text-[11px] font-semibold tracking-wide text-[var(--color-ark-muted)] uppercase">
            <tr>
              <th className="px-4 py-3">{t.colId}</th>
              <th className="px-4 py-3">{t.colTitleCategory}</th>
              <th className="px-4 py-3">{t.colLocation}</th>
              <th className="px-4 py-3">{t.colDateTime}</th>
              <th className="px-4 py-3">{t.colStatus}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-[var(--color-ark-line)] last:border-0 hover:bg-[var(--color-ark-subtle)]"
              >
                <td className="px-4 py-3 font-semibold text-[var(--color-ark-brand)]">
                  {report.id}
                </td>
                <td className="max-w-[220px] px-4 py-3">
                  <p className="truncate font-medium">{report.title}</p>
                  <Badge variant="secondary" className="mt-1">
                    {report.category}
                  </Badge>
                </td>
                <td className="max-w-[160px] truncate px-4 py-3 text-[var(--color-ark-muted)]">
                  {report.location.neighborhood}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-[var(--color-ark-muted)]">
                  {report.date} · {report.time}
                </td>
                <td className="px-4 py-3">
                  {report.directorateStatus && (
                    <DirStatusBadge
                      status={report.directorateStatus}
                      label={t.dirStatusLabels[report.directorateStatus]}
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onOpen(report.id)}
                    className="rounded-md px-2.5 py-1.5 text-[12px] font-medium text-[var(--color-ark-brand)] transition hover:bg-[var(--color-ark-brand-soft)]"
                  >
                    {t.actionOpenDetails}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[var(--color-ark-line)] lg:hidden">
        {reports.map((report) => (
          <button
            key={report.id}
            type="button"
            onClick={() => onOpen(report.id)}
            className="flex w-full flex-col gap-2 px-4 py-4 text-left hover:bg-[var(--color-ark-subtle)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-[var(--color-ark-brand)]">
                  {report.id}
                </p>
                <p className="font-medium">{report.title}</p>
              </div>
              {report.directorateStatus && (
                <DirStatusBadge
                  status={report.directorateStatus}
                  label={t.dirStatusLabels[report.directorateStatus]}
                />
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[var(--color-ark-muted)]">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {report.location.neighborhood}
              </span>
              <span>{report.category}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function ReportDetail({
  t,
  report,
  successMessage,
  onBack,
  onAccept,
  onResolve,
}: {
  t: AdminMessages;
  report: ArkivistReport;
  successMessage: string | null;
  onBack: () => void;
  onAccept: () => void;
  onResolve: () => void;
}) {
  const status = report.directorateStatus;
  const isReadonly = status === "VERIFIED" || status === "CLOSED";

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ark-muted)] transition hover:text-[var(--color-ark-ink)]"
        >
          <ArrowLeft className="size-3.5" />
          {t.backToList}
        </button>
        {status && (
          <DirStatusBadge
            status={status}
            label={t.dirStatusLabels[status]}
          />
        )}
      </div>

      <div className="rounded-lg border border-[var(--color-ark-line)] bg-white px-4 py-3.5 sm:px-5">
        <EightStepTimeline t={t} report={report} />
      </div>

      {successMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-[#cfe4d8] bg-[var(--color-ark-ok-soft)] px-4 py-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--color-ark-ok)]" />
          <p className="text-[13px] font-medium text-[var(--color-ark-ok)]">
            {successMessage}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left — case content */}
        <div className="space-y-6">
          <div>
            <p className="text-[12px] font-medium tracking-wide text-[var(--color-ark-brand)] uppercase">
              {report.id}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              {report.title}
            </h2>
            <p className="mt-2 text-[13px] text-[var(--color-ark-faint)]">
              {report.date} · {report.time}
            </p>
            {report.verifiedBy && (
              <p className="mt-1.5 text-[13px] text-[var(--color-ark-muted)]">
                {t.verifiedBy}:{" "}
                <span className="font-medium text-[var(--color-ark-ink)]">
                  {report.verifiedBy}
                </span>
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-medium tracking-wide text-[var(--color-ark-faint)] uppercase">
              {t.citizenDescription}
            </h3>
            <p className="text-[14px] leading-relaxed text-[var(--color-ark-ink)]">
              {report.description}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-medium tracking-wide text-[var(--color-ark-faint)] uppercase">
              {t.photo}
            </h3>
            <div className="overflow-hidden rounded-lg border border-[var(--color-ark-line)]">
              <img
                src={report.photoUrl}
                alt={report.id}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-medium tracking-wide text-[var(--color-ark-faint)] uppercase">
              {t.location}
            </h3>
            <div className="overflow-hidden rounded-lg border border-[var(--color-ark-line)]">
              <iframe
                title={`${t.location} ${report.id}`}
                src={osmEmbedSrc(report.location.lat, report.location.lng)}
                className="h-52 w-full border-0"
                loading="lazy"
              />
              <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 text-[12px] text-[var(--color-ark-muted)]">
                <MapPin className="size-3.5 shrink-0 text-[var(--color-ark-brand)]" />
                {report.location.address} · {report.location.neighborhood}
              </div>
            </div>
          </div>
        </div>

        {/* Right — actions & classification */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-[var(--color-ark-line)] bg-white">
            <div className="border-b border-[var(--color-ark-line)] px-5 py-4">
              <p className="text-[14px] font-semibold tracking-tight">
                {t.aiAnalysis}
              </p>
            </div>

            <dl className="space-y-3.5 px-5 py-4">
              <div>
                <dt className="text-[11px] text-[var(--color-ark-faint)]">
                  {t.category}
                </dt>
                <dd className="mt-0.5 text-[13px] font-medium">
                  {report.category}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-[var(--color-ark-faint)]">
                  {t.sector}
                </dt>
                <dd className="mt-0.5 text-[13px] font-medium">
                  {report.sector}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-[var(--color-ark-faint)]">
                  {t.recommendedDirectorate}
                </dt>
                <dd className="mt-0.5 text-[13px] font-medium">
                  {t.directorateNames[report.directorateId]}
                </dd>
              </div>
            </dl>

            <div className="space-y-2 border-t border-[var(--color-ark-line)] px-5 py-4">
              {status === "NEW" && (
                <button
                  type="button"
                  onClick={onAccept}
                  className="flex h-10 w-full items-center justify-center rounded-md bg-[var(--color-ark-brand)] text-[13px] font-medium text-white transition hover:bg-[#03366f]"
                >
                  {t.acceptReport}
                </button>
              )}

              {(status === "ACCEPTED" || status === "IN_PROGRESS") && (
                <button
                  type="button"
                  onClick={onResolve}
                  className="flex h-10 w-full items-center justify-center rounded-md bg-[var(--color-ark-brand)] text-[13px] font-medium text-white transition hover:bg-[#03366f]"
                >
                  {t.markResolved}
                </button>
              )}

              {status === "RESOLVED" && report.resolution && (
                <div className="space-y-3">
                  <p className="text-[13px] font-medium leading-relaxed text-[var(--color-ark-ok)]">
                    {t.resolvedBanner}
                  </p>
                  <p className="text-[13px] leading-relaxed text-[var(--color-ark-ink)]">
                    {report.resolution.workDescription}
                  </p>
                  <p className="text-[11px] text-[var(--color-ark-faint)]">
                    {t.completed}: {report.resolution.completedAt}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="mb-1 text-[11px] text-[var(--color-ark-faint)]">
                        {t.before}
                      </p>
                      <img
                        src={report.resolution.photoBeforeUrl}
                        alt={t.before}
                        className="aspect-video w-full rounded-md object-cover"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-[var(--color-ark-faint)]">
                        {t.after}
                      </p>
                      <img
                        src={report.resolution.photoAfterUrl}
                        alt={t.after}
                        className="aspect-video w-full rounded-md object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isReadonly && (
                <p className="text-[13px] leading-relaxed text-[var(--color-ark-muted)]">
                  {t.archiveState(
                    status === "VERIFIED" ? t.verified : t.closed,
                  )}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatsView({
  t,
  stats,
  directorateName,
}: {
  t: AdminMessages;
  stats: {
    teReja: number;
    neProces: number;
    prioritet: number;
    zgjidhura: number;
    total: number;
  };
  directorateName: string;
}) {
  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t.pageStatsTitle}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ark-muted)]">
          {directorateName}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: t.statTotal, value: stats.total },
          { label: t.navNew, value: stats.teReja },
          { label: t.statInProgress, value: stats.neProces },
          { label: t.statHighPriority, value: stats.prioritet },
          { label: t.statResolved, value: stats.zgjidhura },
        ].map((item) => (
          <Card
            key={item.label}
            className="rounded-xl bg-white shadow-none ring-[var(--color-ark-line)]"
          >
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {item.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
