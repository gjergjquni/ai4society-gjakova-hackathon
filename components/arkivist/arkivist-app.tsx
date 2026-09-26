"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Link2,
  MapPin,
  Menu,
  Search,
  BarChart3,
  Inbox,
  Clock3,
  CircleCheck,
  CircleX,
  Pencil,
  ArrowLeft,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  StatusBadge,
  osmEmbedSrc,
  selectClassName,
} from "@/components/arkivist/shared-ui";
import LangSwitcher from "@/components/lang-switcher";
import SidebarProfile from "@/components/sidebar-profile";
import {
  ARKIVIST_PROFILE,
  mockNotifications,
} from "@/lib/arkivist-mock-data";
import {
  CATEGORIES,
  PRIORITIES,
  SECTORS,
  arkivistTimelineIndex,
  type ArkivistNavId,
  type ArkivistReport,
  type PriorityLevel,
  type ReportStatus,
} from "@/lib/arkivist-types";
import {
  DIRECTORATES,
  getDirectorateById,
  type DirectorateId,
} from "@/lib/directorates";
import type { AdminMessages } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import { useReports } from "@/lib/reports-store";

const navIcons: {
  id: ArkivistNavId;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "raportet", icon: Inbox },
  { id: "ne-shqyrtim", icon: Clock3 },
  { id: "te-aprovuara", icon: CircleCheck },
  { id: "te-refuzuara", icon: CircleX },
  { id: "statistikat", icon: BarChart3 },
];

const STATUS_FILTER_VALUES: ReportStatus[] = [
  "SUBMITTED",
  "AI_ANALYZED",
  "NE_SHQYRTIM",
  "DERGUAR_TE_DREJTORIA",
  "REFUZUAR",
  "BASHKUAR",
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function pageMetaFor(
  nav: ArkivistNavId,
  t: AdminMessages,
): { title: string; desc: string } {
  switch (nav) {
    case "dashboard":
      return { title: t.pageDashboardTitle, desc: t.pageDashboardDesc };
    case "raportet":
      return { title: t.pageReportsTitle, desc: t.pageReportsDesc };
    case "ne-shqyrtim":
      return { title: t.pageInReviewTitle, desc: t.pageInReviewDesc };
    case "te-aprovuara":
      return { title: t.pageApprovedTitle, desc: t.pageApprovedDesc };
    case "te-refuzuara":
      return { title: t.pageRejectedTitle, desc: t.pageRejectedDesc };
    case "statistikat":
      return { title: t.pageStatsTitle, desc: t.pageStatsDesc };
  }
}

function navLabel(id: ArkivistNavId, t: AdminMessages): string {
  switch (id) {
    case "dashboard":
      return t.navDashboard;
    case "raportet":
      return t.navReports;
    case "ne-shqyrtim":
      return t.navInReview;
    case "te-aprovuara":
      return t.navApproved;
    case "te-refuzuara":
      return t.navRejected;
    case "statistikat":
      return t.navStats;
  }
}

export default function ArkivistApp() {
  const { locale, setLocale, t } = useAdminLocale();
  const [reports, { updateReport }] = useReports();
  const [nav, setNav] = useState<ArkivistNavId>("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [photoZoom, setPhotoZoom] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [mergeTargetId, setMergeTargetId] = useState("");
  const [draft, setDraft] = useState({
    category: "",
    sector: "",
    directorateId: "INF" as DirectorateId,
    priority: "Mesatare" as PriorityLevel,
  });

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const selected = reports.find((r) => r.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const today = todayIso();
    const teReja = reports.filter((r) => r.date === today).length;
    const shqyrtim = reports.filter(
      (r) =>
        r.status === "SUBMITTED" ||
        r.status === "AI_ANALYZED" ||
        r.status === "NE_SHQYRTIM",
    ).length;
    const aprovuara = reports.filter(
      (r) =>
        r.status === "APROVUAR" || r.status === "DERGUAR_TE_DREJTORIA",
    ).length;
    const prioritet = reports.filter(
      (r) =>
        (r.priority === "Kritike" || r.priority === "E lartë") &&
        r.status !== "REFUZUAR" &&
        r.status !== "BASHKUAR" &&
        r.status !== "DERGUAR_TE_DREJTORIA",
    ).length;
    return {
      teReja,
      shqyrtim,
      aprovuara,
      prioritet,
      refuzuara: reports.filter((r) => r.status === "REFUZUAR").length,
      total: reports.length,
    };
  }, [reports]);

  const filtered = useMemo(() => {
    let list = [...reports];
    if (nav === "ne-shqyrtim") {
      list = list.filter(
        (r) =>
          r.status === "NE_SHQYRTIM" ||
          r.status === "AI_ANALYZED" ||
          r.status === "SUBMITTED",
      );
    } else if (nav === "te-aprovuara") {
      list = list.filter(
        (r) =>
          r.status === "APROVUAR" || r.status === "DERGUAR_TE_DREJTORIA",
      );
    } else if (nav === "te-refuzuara") {
      list = list.filter(
        (r) => r.status === "REFUZUAR" || r.status === "BASHKUAR",
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
    if (filterStatus) list = list.filter((r) => r.status === filterStatus);
    if (filterPriority)
      list = list.filter((r) => r.priority === filterPriority);
    if (filterCategory)
      list = list.filter((r) => r.category === filterCategory);
    return list;
  }, [reports, nav, search, filterStatus, filterPriority, filterCategory]);

  const reviewQueue = useMemo(
    () =>
      reports.filter(
        (r) =>
          r.status === "NE_SHQYRTIM" ||
          r.status === "AI_ANALYZED" ||
          r.status === "SUBMITTED",
      ),
    [reports],
  );

  function openReport(id: string) {
    const report = reports.find((r) => r.id === id);
    if (report) {
      setDraft({
        category: report.category,
        sector: report.sector,
        directorateId: report.directorateId,
        priority: report.priority,
      });
    }
    setSelectedId(id);
    setSuccessMessage(null);
    setSidebarOpen(false);
  }

  function syncDraftFromSelected(report: ArkivistReport) {
    setDraft({
      category: report.category,
      sector: report.sector,
      directorateId: report.directorateId,
      priority: report.priority,
    });
  }

  function confirmApprove() {
    if (!selected) return;
    updateReport(selected.id, {
      category: draft.category,
      sector: draft.sector,
      directorateId: draft.directorateId,
      priority: draft.priority,
      status: "DERGUAR_TE_DREJTORIA",
      directorateStatus: "NEW",
      verifiedBy: ARKIVIST_PROFILE.name,
      timeline: [
        "Raportuar",
        "Analizuar nga AI",
        "Verifikuar nga Arkivisti",
        "Dërguar te Drejtoria",
      ],
    });
    setApproveOpen(false);
    setSuccessMessage(t.successApproved);
  }

  function saveEdit() {
    if (!selected) return;
    updateReport(selected.id, {
      ...draft,
      status: "NE_SHQYRTIM",
    });
    setEditOpen(false);
    setSuccessMessage(t.successClassification);
  }

  function confirmReject() {
    if (!selected || !rejectReason.trim()) return;
    updateReport(selected.id, {
      status: "REFUZUAR",
      rejectionReason: rejectReason.trim(),
    });
    setRejectOpen(false);
    setRejectReason("");
    setSuccessMessage(t.successRejected);
  }

  function confirmMerge() {
    if (!selected || !mergeTargetId) return;
    updateReport(selected.id, {
      status: "BASHKUAR",
      mergedWithId: mergeTargetId,
    });
    setMergeOpen(false);
    setMergeTargetId("");
    setSuccessMessage(t.successMerged(mergeTargetId));
  }

  const meta = pageMetaFor(nav, t);
  const unread = mockNotifications.filter((n) => n.unread).length;
  const liveSelected = selected
    ? (reports.find((r) => r.id === selected.id) ?? selected)
    : null;

  const headerTitle = liveSelected ? t.pageReviewTitle : meta.title;
  const headerDesc = liveSelected
    ? `${liveSelected.id} · ${liveSelected.title}`
    : meta.desc;

  return (
    <div className="flex min-h-screen bg-[#f7f8fa] text-[var(--color-ark-ink)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label={t.closeMenu}
          className="fixed inset-0 z-40 bg-[var(--color-ark-ink)]/20 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-[var(--color-ark-line)] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <img
            src="/gjakova-emblem.png"
            alt={t.municipality}
            width={40}
            height={48}
            className="h-11 w-auto shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-tight">
              {t.brand}
            </p>
            <p className="truncate text-[11px] text-[var(--color-ark-faint)]">
              {t.arkivistPanel}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
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
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] transition ${
                  active
                    ? "bg-[var(--color-ark-brand-soft)] font-medium text-[var(--color-ark-brand)]"
                    : "font-normal text-[var(--color-ark-muted)] hover:bg-[var(--color-ark-subtle)] hover:text-[var(--color-ark-ink)]"
                }`}
              >
                <Icon className="size-[15px] shrink-0 opacity-80" />
                {navLabel(item.id, t)}
              </button>
            );
          })}
        </nav>

        <SidebarProfile
          name={ARKIVIST_PROFILE.name}
          role={ARKIVIST_PROFILE.role}
          initials={ARKIVIST_PROFILE.initials}
          email={ARKIVIST_PROFILE.email}
          profileLabel={t.profile}
          logoutLabel={t.logout}
        />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[var(--color-ark-line)] bg-white/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-md border border-[var(--color-ark-line)] text-[var(--color-ark-muted)] transition hover:bg-[var(--color-ark-subtle)] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label={t.openMenu}
              >
                <Menu className="size-4" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-[15px] font-semibold tracking-tight sm:text-base">
                  {headerTitle}
                </h1>
                <p className="truncate text-[12px] text-[var(--color-ark-faint)]">
                  {headerDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LangSwitcher locale={locale} onChange={setLocale} />

              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[var(--color-ark-faint)]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="h-9 w-56 border-[var(--color-ark-line)] bg-[var(--color-ark-subtle)] pl-9 text-[13px] shadow-none lg:w-64"
                />
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative flex size-9 items-center justify-center rounded-md border border-[var(--color-ark-line)] text-[var(--color-ark-muted)] transition hover:bg-[var(--color-ark-subtle)]"
                  aria-label={t.notifications}
                >
                  <Bell className="size-4" />
                  {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--color-ark-brand)]" />
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-[var(--color-ark-line)] bg-white shadow-[var(--shadow-ark-pop)]">
                    <div className="flex items-center justify-between border-b border-[var(--color-ark-line)] px-4 py-3">
                      <p className="text-[13px] font-medium">{t.notifications}</p>
                      <button
                        type="button"
                        onClick={() => setNotifOpen(false)}
                        className="text-[var(--color-ark-faint)] hover:text-[var(--color-ark-ink)]"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                    <ul>
                      {mockNotifications.map((n) => (
                        <li
                          key={n.id}
                          className="border-b border-[var(--color-ark-line)] px-4 py-3 last:border-0"
                        >
                          <p className="text-[13px] leading-snug">{n.text}</p>
                          <p className="mt-1 text-[11px] text-[var(--color-ark-faint)]">
                            {n.time}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main
          className="flex-1 px-4 py-6 sm:px-8 sm:py-8"
          onClick={() => setNotifOpen(false)}
        >
          {liveSelected ? (
            <ReportDetail
              t={t}
              report={liveSelected}
              draft={draft}
              onDraftChange={setDraft}
              successMessage={successMessage}
              onBack={() => {
                setSelectedId(null);
                setSuccessMessage(null);
              }}
              onApprove={() => setApproveOpen(true)}
              onEdit={() => {
                syncDraftFromSelected(liveSelected);
                setEditOpen(true);
              }}
              onReject={() => setRejectOpen(true)}
              onMerge={() => {
                setMergeTargetId("");
                setMergeOpen(true);
              }}
              onZoomPhoto={() => setPhotoZoom(true)}
            />
          ) : nav === "statistikat" ? (
            <StatsView t={t} reports={reports} stats={stats} />
          ) : nav === "dashboard" ? (
            <DashboardView
              t={t}
              stats={stats}
              queue={reviewQueue}
              searchActive={Boolean(search.trim())}
              onOpen={openReport}
              onGoReview={() => setNav("ne-shqyrtim")}
            />
          ) : (
            <ReportsListView
              t={t}
              nav={nav}
              reports={filtered}
              search={search}
              onSearch={setSearch}
              searchActive={Boolean(search.trim())}
              filterStatus={filterStatus}
              filterPriority={filterPriority}
              filterCategory={filterCategory}
              onFilterStatus={setFilterStatus}
              onFilterPriority={setFilterPriority}
              onFilterCategory={setFilterCategory}
              onOpen={openReport}
            />
          )}
        </main>
      </div>

      {/* Dialogs — unchanged logic */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.approveDialogTitle}</DialogTitle>
            <DialogDescription>
              {t.approveDialogDesc(
                selected?.id ?? "",
                t.directorateNames[draft.directorateId] ??
                  getDirectorateById(draft.directorateId)?.name ??
                  draft.directorateId,
                t.priorityLabels[draft.priority],
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={confirmApprove}>{t.confirmSend}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.editDialogTitle}</DialogTitle>
            <DialogDescription>{t.editDialogDesc}</DialogDescription>
          </DialogHeader>
          <ClassificationFields t={t} draft={draft} onChange={setDraft} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={saveEdit}>{t.saveChanges}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.rejectDialogTitle}</DialogTitle>
            <DialogDescription>{t.rejectDialogDesc}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t.rejectPlaceholder}
            className="min-h-28"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim()}
              onClick={confirmReject}
            >
              {t.reject}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.mergeDialogTitle}</DialogTitle>
            <DialogDescription>{t.mergeDialogDesc}</DialogDescription>
          </DialogHeader>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">{t.primaryReport}</span>
            <select
              className={selectClassName()}
              value={mergeTargetId}
              onChange={(e) => setMergeTargetId(e.target.value)}
            >
              <option value="">{t.choose}</option>
              {reports
                .filter(
                  (r) =>
                    r.id !== selected?.id &&
                    r.status !== "REFUZUAR" &&
                    r.status !== "BASHKUAR",
                )
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} — {r.title}
                  </option>
                ))}
            </select>
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeOpen(false)}>
              {t.cancel}
            </Button>
            <Button disabled={!mergeTargetId} onClick={confirmMerge}>
              {t.merge}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={photoZoom} onOpenChange={setPhotoZoom}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t.photoOf(selected?.id ?? "")}</DialogTitle>
          </DialogHeader>
          {selected && (
            <img
              src={selected.photoUrl}
              alt={t.photoOf(selected.id)}
              className="max-h-[70vh] w-full rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClassificationFields({
  t,
  draft,
  onChange,
}: {
  t: AdminMessages;
  draft: {
    category: string;
    sector: string;
    directorateId: DirectorateId;
    priority: PriorityLevel;
  };
  onChange: (d: typeof draft) => void;
}) {
  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5 text-[13px]">
        <span className="font-medium text-[var(--color-ark-muted)]">
          {t.category}
        </span>
        <select
          className={selectClassName()}
          value={draft.category}
          onChange={(e) => onChange({ ...draft, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-[13px]">
        <span className="font-medium text-[var(--color-ark-muted)]">
          {t.sector}
        </span>
        <select
          className={selectClassName()}
          value={draft.sector}
          onChange={(e) => onChange({ ...draft, sector: e.target.value })}
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-[13px]">
        <span className="font-medium text-[var(--color-ark-muted)]">
          {t.recommendedDirectorate}
        </span>
        <select
          className={selectClassName()}
          value={draft.directorateId}
          onChange={(e) =>
            onChange({
              ...draft,
              directorateId: e.target.value as DirectorateId,
            })
          }
        >
          {DIRECTORATES.map((d) => (
            <option key={d.id} value={d.id}>
              {t.directorateNames[d.id]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-[var(--color-ark-subtle)]">
        <FileText className="size-4 text-[var(--color-ark-faint)]" />
      </div>
      <p className="text-[14px] font-medium text-[var(--color-ark-ink)]">
        {title}
      </p>
      <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-[var(--color-ark-faint)]">
        {description}
      </p>
    </div>
  );
}

function emptyCopy(
  nav: ArkivistNavId | "search",
  t: AdminMessages,
): { title: string; description: string } {
  switch (nav) {
    case "search":
      return {
        title: t.emptySearchTitle,
        description: t.emptySearchDesc,
      };
    case "ne-shqyrtim":
      return {
        title: t.emptyReviewTitle,
        description: t.emptyReviewDesc,
      };
    case "te-aprovuara":
      return {
        title: t.emptyApprovedTitle,
        description: t.emptyApprovedDesc,
      };
    case "te-refuzuara":
      return {
        title: t.emptyRejectedTitle,
        description: t.emptyRejectedDesc,
      };
    default:
      return {
        title: t.emptyDefaultTitle,
        description: t.emptyDefaultDesc,
      };
  }
}

function WorkflowTimeline({
  report,
  t,
}: {
  report: ArkivistReport;
  t: AdminMessages;
}) {
  const rejected =
    report.status === "REFUZUAR" || report.status === "BASHKUAR";
  let active = arkivistTimelineIndex(report.status);
  if (
    report.directorateStatus === "IN_PROGRESS" ||
    report.directorateStatus === "ACCEPTED"
  ) {
    active = 4;
  }
  if (
    report.directorateStatus === "RESOLVED" ||
    report.directorateStatus === "VERIFIED" ||
    report.directorateStatus === "CLOSED"
  ) {
    active = 5;
  }

  const steps = t.timeline;

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-1">
        {steps.map((step, index) => {
          const done = !rejected && active >= index;
          const isActive = !rejected && active === index;
          return (
            <div key={`${step}-${index}`} className="flex items-center gap-1">
              <span
                className={`rounded px-2 py-1 text-[11px] font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--color-ark-brand)] text-white"
                    : done
                      ? "text-[var(--color-ark-brand)]"
                      : "text-[var(--color-ark-faint)]"
                }`}
              >
                {step}
              </span>
              {index < steps.length - 1 && (
                <ChevronRight
                  className={`size-3 shrink-0 ${
                    done && !isActive
                      ? "text-[var(--color-ark-brand)]/40"
                      : "text-[var(--color-ark-line-strong)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {rejected && (
        <p className="mt-2 text-[12px] text-[var(--color-ark-crit)]">
          {t.colStatus}:{" "}
          {report.status === "REFUZUAR"
            ? t.statusLabels.REFUZUAR
            : t.statusLabels.BASHKUAR}
        </p>
      )}
    </div>
  );
}

function DashboardView({
  t,
  stats,
  queue,
  searchActive,
  onOpen,
  onGoReview,
}: {
  t: AdminMessages;
  stats: {
    teReja: number;
    shqyrtim: number;
    aprovuara: number;
    prioritet: number;
  };
  queue: ArkivistReport[];
  searchActive: boolean;
  onOpen: (id: string) => void;
  onGoReview: () => void;
}) {
  const metrics = [
    { label: t.statNewReports, value: stats.teReja },
    { label: t.statInReview, value: stats.shqyrtim },
    { label: t.statApproved, value: stats.aprovuara },
    { label: t.statHighPriority, value: stats.prioritet },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-8">
      {/* Compact stats */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-ark-line)] bg-[var(--color-ark-line)] sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white px-5 py-4">
            <p className="text-[12px] text-[var(--color-ark-faint)]">
              {m.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main focus: review queue */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">
              {t.reviewQueueTitle}
            </h2>
          </div>
          {queue.length > 0 && (
            <button
              type="button"
              onClick={onGoReview}
              className="text-[13px] font-medium text-[var(--color-ark-brand)] transition hover:underline"
            >
              {t.viewAll}
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-[var(--color-ark-line)] bg-white">
          {queue.length === 0 ? (
            <EmptyState
              {...(searchActive
                ? emptyCopy("search", t)
                : emptyCopy("ne-shqyrtim", t))}
            />
          ) : (
            <ReportsTable t={t} reports={queue.slice(0, 8)} onOpen={onOpen} />
          )}
        </div>
      </section>
    </div>
  );
}

function ReportsListView({
  t,
  nav,
  reports,
  search,
  onSearch,
  searchActive,
  filterStatus,
  filterPriority,
  filterCategory,
  onFilterStatus,
  onFilterPriority,
  onFilterCategory,
  onOpen,
}: {
  t: AdminMessages;
  nav: ArkivistNavId;
  reports: ArkivistReport[];
  search: string;
  onSearch: (v: string) => void;
  searchActive: boolean;
  filterStatus: string;
  filterPriority: string;
  filterCategory: string;
  onFilterStatus: (v: string) => void;
  onFilterPriority: (v: string) => void;
  onFilterCategory: (v: string) => void;
  onOpen: (id: string) => void;
}) {
  const empty = searchActive
    ? emptyCopy("search", t)
    : emptyCopy(nav, t);

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[180px] flex-1 md:hidden">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[var(--color-ark-faint)]" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-9 border-[var(--color-ark-line)] bg-white pl-9 text-[13px] shadow-none"
          />
        </div>
        <select
          className={`${selectClassName()} w-auto min-w-[120px]`}
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value)}
        >
          <option value="">{t.filterStatus}</option>
          {STATUS_FILTER_VALUES.map((s) => (
            <option key={s} value={s}>
              {t.statusLabels[s]}
            </option>
          ))}
        </select>
        <select
          className={`${selectClassName()} w-auto min-w-[120px]`}
          value={filterPriority}
          onChange={(e) => onFilterPriority(e.target.value)}
        >
          <option value="">{t.filterPriority}</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {t.priorityLabels[p]}
            </option>
          ))}
        </select>
        <select
          className={`${selectClassName()} w-auto min-w-[120px]`}
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

      <p className="text-[12px] text-[var(--color-ark-faint)]">
        {t.reportsCount(reports.length)}
      </p>

      <div className="overflow-hidden rounded-lg border border-[var(--color-ark-line)] bg-white">
        {reports.length === 0 ? (
          <EmptyState {...empty} />
        ) : (
          <ReportsTable t={t} reports={reports} onOpen={onOpen} />
        )}
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
  const headers = [
    t.colId,
    t.colProblem,
    t.colLocation,
    t.colCategory,
    t.colDirectorate,
    t.colStatus,
    "",
  ];

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-[var(--color-ark-line)]">
              {headers.map((h, i) => (
                <th
                  key={h || `act-${i}`}
                  className="px-4 py-3 text-[11px] font-medium tracking-wide text-[var(--color-ark-faint)] uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-[var(--color-ark-line)] last:border-0 transition hover:bg-[var(--color-ark-subtle)]/80"
              >
                <td className="px-4 py-3.5 text-[13px] font-medium text-[var(--color-ark-brand)]">
                  {report.id}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3.5 text-[13px] font-medium">
                  {report.title}
                </td>
                <td className="max-w-[140px] truncate px-4 py-3.5 text-[13px] text-[var(--color-ark-muted)]">
                  {report.location.neighborhood}
                </td>
                <td className="px-4 py-3.5 text-[13px] text-[var(--color-ark-muted)]">
                  {report.category}
                </td>
                <td className="max-w-[160px] truncate px-4 py-3.5 text-[13px] text-[var(--color-ark-muted)]">
                  {getDirectorateById(report.directorateId)?.id ??
                    report.directorateId}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge
                    status={report.status}
                    label={t.statusLabels[report.status]}
                  />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onOpen(report.id)}
                    className="rounded-md px-2.5 py-1.5 text-[12px] font-medium text-[var(--color-ark-brand)] transition hover:bg-[var(--color-ark-brand-soft)]"
                  >
                    {t.actionReview}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-[var(--color-ark-line)] lg:hidden">
        {reports.map((report) => (
          <button
            key={report.id}
            type="button"
            onClick={() => onOpen(report.id)}
            className="flex w-full flex-col gap-2.5 px-4 py-4 text-left transition active:bg-[var(--color-ark-subtle)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-[var(--color-ark-brand)]">
                  {report.id}
                </p>
                <p className="mt-0.5 truncate text-[14px] font-medium">
                  {report.title}
                </p>
              </div>
              <StatusBadge
                status={report.status}
                label={t.statusLabels[report.status]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-[var(--color-ark-muted)]">
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
  draft,
  onDraftChange,
  successMessage,
  onBack,
  onApprove,
  onEdit,
  onReject,
  onMerge,
  onZoomPhoto,
}: {
  t: AdminMessages;
  report: ArkivistReport;
  draft: {
    category: string;
    sector: string;
    directorateId: DirectorateId;
    priority: PriorityLevel;
  };
  onDraftChange: (d: typeof draft) => void;
  successMessage: string | null;
  onBack: () => void;
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  onMerge: () => void;
  onZoomPhoto: () => void;
}) {
  const canAct =
    report.status === "NE_SHQYRTIM" ||
    report.status === "AI_ANALYZED" ||
    report.status === "SUBMITTED" ||
    report.status === "APROVUAR";

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
        <StatusBadge
          status={report.status}
          label={t.statusLabels[report.status]}
        />
      </div>

      {/* Timeline */}
      <div className="rounded-lg border border-[var(--color-ark-line)] bg-white px-4 py-3.5 sm:px-5">
        <WorkflowTimeline t={t} report={report} />
      </div>

      {successMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-[#cfe4d8] bg-[var(--color-ark-ok-soft)] px-4 py-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--color-ark-ok)]" />
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ark-ok)]">
              {successMessage}
            </p>
            {report.status === "DERGUAR_TE_DREJTORIA" && (
              <p className="mt-0.5 text-[12px] text-[var(--color-ark-ok)]/80">
                {t.directorateNames[report.directorateId] ??
                  getDirectorateById(report.directorateId)?.name}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Two-column review */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: case content */}
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
              {report.citizenName ? ` · ${report.citizenName}` : ""}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-medium tracking-wide text-[var(--color-ark-faint)] uppercase">
              {t.citizenDescription}
            </h3>
            <p className="text-[14px] leading-relaxed text-[var(--color-ark-ink)]">
              {report.description}
            </p>
            {report.citizenNotes && (
              <p className="mt-3 text-[13px] text-[var(--color-ark-muted)]">
                {t.note}: {report.citizenNotes}
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-medium tracking-wide text-[var(--color-ark-faint)] uppercase">
              {t.photo}
            </h3>
            <button
              type="button"
              onClick={onZoomPhoto}
              className="block w-full overflow-hidden rounded-lg border border-[var(--color-ark-line)] transition hover:opacity-95"
            >
              <img
                src={report.photoUrl}
                alt={t.photoOf(report.id)}
                className="aspect-[16/10] w-full object-cover"
              />
            </button>
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
                {report.location.neighborhood} · {report.location.address}
              </div>
            </div>
          </div>
        </div>

        {/* Right: decision panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-[var(--color-ark-line)] bg-white">
            <div className="border-b border-[var(--color-ark-line)] px-5 py-4">
              <p className="text-[14px] font-semibold tracking-tight">
                {t.aiAnalysis}
              </p>
            </div>

            <div className="space-y-4 px-5 py-4">
              {canAct ? (
                <ClassificationFields
                  t={t}
                  draft={draft}
                  onChange={onDraftChange}
                />
              ) : (
                <dl className="space-y-3">
                  {[
                    { label: t.category, value: report.category },
                    {
                      label: t.recommendedDirectorate,
                      value:
                        t.directorateNames[report.directorateId] ??
                        getDirectorateById(report.directorateId)?.name ??
                        report.directorateId,
                    },
                    { label: t.sector, value: report.sector },
                  ].map((row) => (
                    <div key={row.label}>
                      <dt className="text-[11px] text-[var(--color-ark-faint)]">
                        {row.label}
                      </dt>
                      <dd className="mt-0.5 text-[13px] font-medium">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {report.rejectionReason && (
                <div className="rounded-md bg-[var(--color-ark-danger-soft)] px-3 py-2.5 text-[12px] text-[var(--color-ark-crit)]">
                  <p className="font-medium">{t.rejectReason}</p>
                  <p className="mt-0.5">{report.rejectionReason}</p>
                </div>
              )}

              {report.mergedWithId && (
                <div className="rounded-md bg-[var(--color-ark-subtle)] px-3 py-2.5 text-[12px] text-[var(--color-ark-muted)]">
                  {t.mergedWith(report.mergedWithId)}
                </div>
              )}
            </div>

            {canAct && (
              <div className="space-y-2 border-t border-[var(--color-ark-line)] px-5 py-4">
                <button
                  type="button"
                  onClick={onApprove}
                  className="flex h-10 w-full items-center justify-center rounded-md bg-[var(--color-ark-brand)] text-[13px] font-medium text-white transition hover:bg-[#03366f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ark-brand)]/30"
                >
                  {t.approveSend}
                </button>
                <button
                  type="button"
                  onClick={onEdit}
                  className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-[var(--color-ark-line)] text-[13px] font-medium text-[var(--color-ark-ink)] transition hover:bg-[var(--color-ark-subtle)]"
                >
                  <Pencil className="size-3.5" />
                  {t.changeClassification}
                </button>
                <button
                  type="button"
                  onClick={onMerge}
                  className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-[var(--color-ark-line)] text-[13px] font-medium text-[var(--color-ark-ink)] transition hover:bg-[var(--color-ark-subtle)]"
                >
                  <Link2 className="size-3.5" />
                  {t.mergeWithExisting}
                </button>
                <button
                  type="button"
                  onClick={onReject}
                  className="flex h-9 w-full items-center justify-center rounded-md text-[13px] font-medium text-[var(--color-ark-crit)] transition hover:bg-[var(--color-ark-danger-soft)]"
                >
                  {t.rejectReport}
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatsView({
  t,
  reports,
  stats,
}: {
  t: AdminMessages;
  reports: ArkivistReport[];
  stats: {
    teReja: number;
    shqyrtim: number;
    aprovuara: number;
    prioritet: number;
    refuzuara: number;
    total: number;
  };
}) {
  const byCategory = CATEGORIES.map((cat) => ({
    label: cat,
    count: reports.filter((r) => r.category === cat).length,
  })).filter((c) => c.count > 0);
  const maxCat = Math.max(...byCategory.map((c) => c.count), 1);

  return (
    <div className="mx-auto max-w-[800px] space-y-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-ark-line)] bg-[var(--color-ark-line)] sm:grid-cols-3">
        {[
          { label: t.statTotal, value: stats.total },
          { label: t.statInReview, value: stats.shqyrtim },
          { label: t.statApproved, value: stats.aprovuara },
          { label: t.statRejected, value: stats.refuzuara },
          { label: t.statHighPriority, value: stats.prioritet },
          { label: t.statNewToday, value: stats.teReja },
        ].map((item) => (
          <div key={item.label} className="bg-white px-5 py-4">
            <p className="text-[12px] text-[var(--color-ark-faint)]">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--color-ark-line)] bg-white px-5 py-5">
        <h2 className="text-[14px] font-semibold">{t.byCategory}</h2>
        <div className="mt-5 space-y-4">
          {byCategory.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex justify-between text-[13px]">
                <span className="text-[var(--color-ark-muted)]">
                  {item.label}
                </span>
                <span className="tabular-nums text-[var(--color-ark-faint)]">
                  {item.count}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[var(--color-ark-line)]">
                <div
                  className="h-full rounded-full bg-[var(--color-ark-brand)]"
                  style={{ width: `${(item.count / maxCat) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
