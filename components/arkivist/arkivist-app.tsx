"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileWarning,
  Filter,
  LayoutDashboard,
  Link2,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  BarChart3,
  Inbox,
  Clock3,
  CircleCheck,
  CircleX,
  BrainCircuit,
  Pencil,
  ArrowLeft,
  LogOut,
  User,
  Eye,
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
  ARKIVIST_PROFILE,
  mockNotifications,
  mockReports,
} from "@/lib/arkivist-mock-data";
import {
  CATEGORIES,
  DIRECTORATES,
  PRIORITIES,
  SECTORS,
  STATUS_LABELS,
  STATUS_PIPELINE,
  type ArkivistNavId,
  type ArkivistReport,
  type PriorityLevel,
  type ReportStatus,
} from "@/lib/arkivist-types";

const navItems: {
  id: ArkivistNavId;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "raportet", label: "Raportet", icon: Inbox },
  { id: "ne-shqyrtim", label: "Në shqyrtim", icon: Clock3 },
  { id: "te-aprovuara", label: "Të aprovuara", icon: CircleCheck },
  { id: "te-refuzuara", label: "Të refuzuara", icon: CircleX },
  { id: "statistikat", label: "Statistikat", icon: BarChart3 },
];

function statusTone(status: ReportStatus) {
  switch (status) {
    case "SUBMITTED":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    case "AI_ANALYZED":
      return "bg-sky-50 text-sky-800 ring-sky-200";
    case "NE_SHQYRTIM":
      return "bg-amber-50 text-amber-800 ring-amber-200";
    case "APROVUAR":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
    case "DERGUAR_TE_DREJTORIA":
      return "bg-[#04408b]/10 text-[#04408b] ring-[#04408b]/20";
    case "REFUZUAR":
      return "bg-red-50 text-red-700 ring-red-200";
    case "BASHKUAR":
      return "bg-violet-50 text-violet-800 ring-violet-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function priorityTone(priority: PriorityLevel) {
  switch (priority) {
    case "Kritike":
      return "bg-red-600 text-white";
    case "E lartë":
      return "bg-orange-500 text-white";
    case "Mesatare":
      return "bg-amber-400 text-[#161616]";
    case "E ulët":
      return "bg-slate-200 text-slate-700";
  }
}

function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ${statusTone(status)}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${priorityTone(priority)}`}
    >
      {priority}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 85 ? "bg-emerald-500" : value >= 70 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex min-w-[88px] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-[#161616]">{value}%</span>
    </div>
  );
}

function StatusPipeline({ current }: { current: ReportStatus }) {
  const rejected = current === "REFUZUAR" || current === "BASHKUAR";
  const activeIndex = STATUS_PIPELINE.indexOf(
    current === "REFUZUAR" || current === "BASHKUAR" ? "NE_SHQYRTIM" : current,
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {STATUS_PIPELINE.map((step, index) => {
          const done = !rejected && activeIndex >= index;
          const active = !rejected && activeIndex === index;
          return (
            <div key={step} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wide sm:text-[11px] ${
                  active
                    ? "bg-[#04408b] text-white"
                    : done
                      ? "bg-[#04408b]/10 text-[#04408b]"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {STATUS_LABELS[step]}
              </div>
              {index < STATUS_PIPELINE.length - 1 && (
                <ChevronRight className="size-3.5 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>
      {rejected && (
        <p className="text-xs font-medium text-red-600">
          Status final: {STATUS_LABELS[current]}
        </p>
      )}
    </div>
  );
}

function selectClassName() {
  return "h-9 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
}

export default function ArkivistApp() {
  const [reports, setReports] = useState<ArkivistReport[]>(mockReports);
  const [nav, setNav] = useState<ArkivistNavId>("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [mergeTargetId, setMergeTargetId] = useState("");
  const [editForm, setEditForm] = useState({
    category: "",
    directorate: "",
    sector: "",
    priority: "Mesatare" as PriorityLevel,
  });

  const selected = reports.find((r) => r.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const neu = reports.filter(
      (r) => r.status === "SUBMITTED" || r.status === "AI_ANALYZED",
    ).length;
    const shqyrtim = reports.filter((r) => r.status === "NE_SHQYRTIM").length;
    const aprovuara = reports.filter(
      (r) => r.status === "APROVUAR" || r.status === "DERGUAR_TE_DREJTORIA",
    ).length;
    const prioritet = reports.filter(
      (r) =>
        (r.priority === "Kritike" || r.priority === "E lartë") &&
        r.status !== "REFUZUAR" &&
        r.status !== "BASHKUAR" &&
        r.status !== "DERGUAR_TE_DREJTORIA",
    ).length;
    const refuzuara = reports.filter((r) => r.status === "REFUZUAR").length;
    return { neu, shqyrtim, aprovuara, prioritet, refuzuara, total: reports.length };
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
        (r) => r.status === "APROVUAR" || r.status === "DERGUAR_TE_DREJTORIA",
      );
    } else if (nav === "te-refuzuara") {
      list = list.filter((r) => r.status === "REFUZUAR" || r.status === "BASHKUAR");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.directorate.toLowerCase().includes(q),
      );
    }
    return list;
  }, [reports, nav, search]);

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
    setSelectedId(id);
    setSuccessMessage(null);
    setSidebarOpen(false);
  }

  function backToList() {
    setSelectedId(null);
    setSuccessMessage(null);
  }

  function updateReport(id: string, patch: Partial<ArkivistReport>) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function approveReport(report: ArkivistReport) {
    updateReport(report.id, {
      status: "DERGUAR_TE_DREJTORIA",
    });
    setSuccessMessage(
      "Raporti u aprovua dhe iu caktua drejtorisë përkatëse.",
    );
  }

  function openEdit(report: ArkivistReport) {
    setEditForm({
      category: report.category,
      directorate: report.directorate,
      sector: report.sector,
      priority: report.priority,
    });
    setEditOpen(true);
  }

  function saveEdit() {
    if (!selected) return;
    updateReport(selected.id, {
      ...editForm,
      status: "NE_SHQYRTIM",
    });
    setEditOpen(false);
    setSuccessMessage("Klasifikimi u përditësua. Mund të aprovoni raportin.");
  }

  function confirmReject() {
    if (!selected || !rejectReason.trim()) return;
    updateReport(selected.id, {
      status: "REFUZUAR",
      rejectReason: rejectReason.trim(),
    });
    setRejectOpen(false);
    setRejectReason("");
    setSuccessMessage("Raporti u refuzua me arsye.");
  }

  function confirmMerge() {
    if (!selected || !mergeTargetId) return;
    updateReport(selected.id, {
      status: "BASHKUAR",
      mergedWithId: mergeTargetId,
    });
    setMergeOpen(false);
    setMergeTargetId("");
    setSuccessMessage(`Raporti u bashkua me ${mergeTargetId}.`);
  }

  const pageTitle =
    navItems.find((item) => item.id === nav)?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#f7f9fc] text-[#161616]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Mbyll menynë"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#e5e5e5] bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-[#e5e5e5] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/gjakova-emblem.png"
              alt="Stema e Republikës së Kosovës"
              width={40}
              height={48}
              className="h-11 w-auto"
            />
            <div className="min-w-0">
              <p className="text-[11px] text-[#54595f]">Republika e Kosovës</p>
              <p className="truncate text-sm font-semibold leading-tight">
                Komuna e Gjakovës
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#04408b]">
                ReagoGjakovë · Arkivist
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
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
                    ? "bg-[#04408b] text-white"
                    : "text-[#54595f] hover:bg-[#edf2f7] hover:text-[#161616]"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#e5e5e5] p-4">
          <div className="rounded-lg bg-[#edf2f7] px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#54595f]">
              Sesioni
            </p>
            <p className="mt-1 text-sm font-medium">{ARKIVIST_PROFILE.name}</p>
            <p className="text-xs text-[#54595f]">{ARKIVIST_PROFILE.role}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[#e5e5e5] bg-white">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="size-4" />
              </Button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold sm:text-base">
                  {selected ? selected.id : pageTitle}
                </p>
                <p className="truncate text-xs text-[#54595f]">
                  {selected
                    ? selected.title
                    : "Verifikim, korrigjim dhe dërgim te drejtoria"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#54595f]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Kërko raporte..."
                  className="h-9 w-56 pl-8 lg:w-64"
                />
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setProfileOpen(false);
                  }}
                  aria-label="Njoftimet"
                >
                  <Bell className="size-4" />
                </Button>
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#04408b] text-[10px] font-bold text-white">
                  2
                </span>
                {notifOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-lg">
                    <div className="border-b border-[#e5e5e5] px-4 py-3">
                      <p className="text-sm font-semibold">Njoftimet</p>
                    </div>
                    <ul className="max-h-72 overflow-y-auto">
                      {mockNotifications.map((n) => (
                        <li
                          key={n.id}
                          className={`border-b border-[#e5e5e5] px-4 py-3 last:border-0 ${
                            n.unread ? "bg-[#04408b]/[0.03]" : ""
                          }`}
                        >
                          <p className="text-sm">{n.text}</p>
                          <p className="mt-1 text-xs text-[#54595f]">{n.time}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-2 py-1.5 transition hover:bg-[#edf2f7]"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#04408b] text-xs font-bold text-white">
                    {ARKIVIST_PROFILE.initials}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-semibold leading-tight">
                      {ARKIVIST_PROFILE.name}
                    </span>
                    <span className="block text-[11px] text-[#54595f]">
                      {ARKIVIST_PROFILE.role}
                    </span>
                  </span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-lg">
                    <div className="border-b border-[#e5e5e5] px-4 py-3">
                      <p className="text-sm font-semibold">{ARKIVIST_PROFILE.name}</p>
                      <p className="text-xs text-[#54595f]">
                        {ARKIVIST_PROFILE.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#54595f] hover:bg-[#edf2f7]"
                    >
                      <User className="size-4" /> Profili
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="size-4" /> Dil
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main
          className="flex-1 p-4 sm:p-6"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        >
          {selected ? (
            <ReportDetail
              report={reports.find((r) => r.id === selected.id) ?? selected}
              allReports={reports}
              successMessage={successMessage}
              onBack={backToList}
              onApprove={approveReport}
              onEdit={openEdit}
              onReject={() => setRejectOpen(true)}
              onMerge={() => {
                setMergeTargetId("");
                setMergeOpen(true);
              }}
            />
          ) : nav === "statistikat" ? (
            <StatsView reports={reports} stats={stats} />
          ) : nav === "dashboard" ? (
            <DashboardView
              stats={stats}
              queue={reviewQueue}
              onOpen={openReport}
              onGoReview={() => setNav("ne-shqyrtim")}
            />
          ) : (
            <ReportsListView
              title={pageTitle}
              reports={filtered}
              search={search}
              onSearch={setSearch}
              onOpen={openReport}
            />
          )}
        </main>
      </div>

      {/* Edit classification */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ndrysho klasifikimin</DialogTitle>
            <DialogDescription>
              Korrigjoni kategorinë, drejtorinë, sektorin ose prioritetin e AI-së.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Kategoria</span>
              <select
                className={selectClassName()}
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Drejtoria</span>
              <select
                className={selectClassName()}
                value={editForm.directorate}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, directorate: e.target.value }))
                }
              >
                {DIRECTORATES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Sektori</span>
              <select
                className={selectClassName()}
                value={editForm.sector}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, sector: e.target.value }))
                }
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Prioriteti</span>
              <select
                className={selectClassName()}
                value={editForm.priority}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    priority: e.target.value as PriorityLevel,
                  }))
                }
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Anulo
            </Button>
            <Button onClick={saveEdit}>Ruaj ndryshimet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Refuzo raportin</DialogTitle>
            <DialogDescription>
              Shkruani arsyen e refuzimit. Kjo do t&apos;i dërgohet qytetarit.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="P.sh. Mungon lokacioni ose fotografia e problemit..."
            className="min-h-28"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Anulo
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim()}
              onClick={confirmReject}
            >
              Refuzo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge */}
      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bashko me raport ekzistues</DialogTitle>
            <DialogDescription>
              Zgjidhni raportin kryesor nëse ky është duplikat.
            </DialogDescription>
          </DialogHeader>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Raporti kryesor</span>
            <select
              className={selectClassName()}
              value={mergeTargetId}
              onChange={(e) => setMergeTargetId(e.target.value)}
            >
              <option value="">Zgjidhni...</option>
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
              Anulo
            </Button>
            <Button disabled={!mergeTargetId} onClick={confirmMerge}>
              Bashko
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DashboardView({
  stats,
  queue,
  onOpen,
  onGoReview,
}: {
  stats: {
    neu: number;
    shqyrtim: number;
    aprovuara: number;
    prioritet: number;
  };
  queue: ArkivistReport[];
  onOpen: (id: string) => void;
  onGoReview: () => void;
}) {
  const cards = [
    {
      label: "Raporte të reja",
      value: stats.neu,
      icon: FileWarning,
      hint: "SUBMITTED / AI ANALYZED",
      tone: "text-[#04408b] bg-[#04408b]/10",
    },
    {
      label: "Në shqyrtim",
      value: stats.shqyrtim,
      icon: ClipboardList,
      hint: "Presin vendim",
      tone: "text-amber-700 bg-amber-50",
    },
    {
      label: "Të aprovuara",
      value: stats.aprovuara,
      icon: ShieldCheck,
      hint: "Aprovuar / dërguar",
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Me prioritet të lartë",
      value: stats.prioritet,
      icon: Filter,
      hint: "Kritike / E lartë",
      tone: "text-red-700 bg-red-50",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Dashboard i Arkivistit
        </h1>
        <p className="mt-1 text-sm text-[#54595f]">
          Shqyrtoni raportet e analizuara nga AI para se të dërgohen te drejtoria.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="rounded-xl bg-white shadow-none ring-[#e5e5e5]">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardDescription className="text-[#54595f]">
                      {card.label}
                    </CardDescription>
                    <CardTitle className="mt-1 text-3xl font-semibold tabular-nums">
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
              <CardContent>
                <p className="text-xs text-[#54595f]">{card.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-xl bg-white shadow-none ring-[#e5e5e5]">
        <CardHeader className="border-b border-[#e5e5e5] [.border-b]:pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Raporte për shqyrtim
              </CardTitle>
              <CardDescription>
                Lista e raporteve që kërkojnë verifikim nga arkivisti
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onGoReview}>
              Shiko të gjitha
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ReportsTable reports={queue.slice(0, 6)} onOpen={onOpen} />
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsListView({
  title,
  reports,
  search,
  onSearch,
  onOpen,
}: {
  title: string;
  reports: ArkivistReport[];
  search: string;
  onSearch: (v: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[#54595f]">
            {reports.length} raporte në këtë listë
          </p>
        </div>
        <div className="relative w-full sm:w-64 md:hidden">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#54595f]" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Kërko..."
            className="h-9 pl-8"
          />
        </div>
      </div>

      <Card className="rounded-xl bg-white shadow-none ring-[#e5e5e5]">
        <CardContent className="p-0">
          <ReportsTable reports={reports} onOpen={onOpen} />
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsTable({
  reports,
  onOpen,
}: {
  reports: ArkivistReport[];
  onOpen: (id: string) => void;
}) {
  if (reports.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-[#54595f]">
        Nuk ka raporte për t&apos;u shfaqur.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-[#e5e5e5] bg-[#fafbfc] text-[11px] font-semibold tracking-wide text-[#54595f] uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Titulli</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Lokacioni</th>
              <th className="px-4 py-3">Kategoria</th>
              <th className="px-4 py-3">Drejtoria (AI)</th>
              <th className="px-4 py-3">Prioriteti</th>
              <th className="px-4 py-3">AI Confidence</th>
              <th className="px-4 py-3">Statusi</th>
              <th className="px-4 py-3">Veprimet</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-[#e5e5e5] last:border-0 hover:bg-[#f7f9fc]"
              >
                <td className="px-4 py-3 font-semibold text-[#04408b]">
                  {report.id}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                  {report.title}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-[#54595f]">
                  {report.date}
                </td>
                <td className="max-w-[160px] truncate px-4 py-3 text-[#54595f]">
                  {report.location}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{report.category}</Badge>
                </td>
                <td className="max-w-[180px] truncate px-4 py-3 text-[#54595f]">
                  {report.directorate}
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={report.priority} />
                </td>
                <td className="px-4 py-3">
                  <ConfidenceBar value={report.aiConfidence} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="outline" onClick={() => onOpen(report.id)}>
                    Hap
                    <Eye data-icon="inline-end" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-[#e5e5e5] lg:hidden">
        {reports.map((report) => (
          <button
            key={report.id}
            type="button"
            onClick={() => onOpen(report.id)}
            className="flex w-full flex-col gap-2 px-4 py-4 text-left transition hover:bg-[#f7f9fc]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-[#04408b]">{report.id}</p>
                <p className="mt-0.5 font-medium">{report.title}</p>
              </div>
              <StatusBadge status={report.status} />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#54595f]">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {report.location}
              </span>
              <span>·</span>
              <span>{report.date}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{report.category}</Badge>
              <PriorityBadge priority={report.priority} />
              <ConfidenceBar value={report.aiConfidence} />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function ReportDetail({
  report,
  allReports,
  successMessage,
  onBack,
  onApprove,
  onEdit,
  onReject,
  onMerge,
}: {
  report: ArkivistReport;
  allReports: ArkivistReport[];
  successMessage: string | null;
  onBack: () => void;
  onApprove: (r: ArkivistReport) => void;
  onEdit: (r: ArkivistReport) => void;
  onReject: () => void;
  onMerge: () => void;
}) {
  const canAct =
    report.status === "NE_SHQYRTIM" ||
    report.status === "AI_ANALYZED" ||
    report.status === "SUBMITTED" ||
    report.status === "APROVUAR";

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${
    report.coords.lng - 0.01
  }%2C${report.coords.lat - 0.008}%2C${report.coords.lng + 0.01}%2C${
    report.coords.lat + 0.008
  }&layer=mapnik&marker=${report.coords.lat}%2C${report.coords.lng}`;

  const possibleDupes = allReports.filter(
    (r) =>
      r.id !== report.id &&
      r.category === report.category &&
      r.status !== "REFUZUAR" &&
      r.status !== "BASHKUAR",
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft data-icon="inline-start" />
          Kthehu
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={report.status} />
          <PriorityBadge priority={report.priority} />
        </div>
      </div>

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold">{successMessage}</p>
            {report.status === "DERGUAR_TE_DREJTORIA" && (
              <p className="mt-0.5 text-sm text-emerald-800/80">
                Drejtoria: {report.directorate}
              </p>
            )}
          </div>
        </div>
      )}

      <Card className="rounded-xl bg-white shadow-none ring-[#e5e5e5]">
        <CardHeader className="border-b border-[#e5e5e5] [.border-b]:pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#04408b]">{report.id}</p>
              <CardTitle className="mt-1 text-xl sm:text-2xl">
                {report.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {report.date} · {report.time} · {report.citizenName ?? "Qytetar"}
              </CardDescription>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-[#54595f] uppercase">
              Rrjedha e statusit
            </p>
            <StatusPipeline current={report.status} />
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 pt-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold">Fotografia e problemit</p>
              <div className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#edf2f7]">
                <img
                  src={report.photoUrl}
                  alt={`Foto për ${report.id}`}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Përshkrimi i qytetarit</p>
              <p className="rounded-xl border border-[#e5e5e5] bg-[#fafbfc] p-4 text-sm leading-relaxed text-[#161616]">
                {report.description}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Lokacioni në hartë</p>
              <div className="overflow-hidden rounded-xl border border-[#e5e5e5]">
                <iframe
                  title={`Harta për ${report.id}`}
                  src={mapSrc}
                  className="h-56 w-full border-0"
                  loading="lazy"
                />
                <div className="flex items-center gap-2 border-t border-[#e5e5e5] bg-white px-3 py-2 text-xs text-[#54595f]">
                  <MapPin className="size-3.5 text-[#04408b]" />
                  {report.location} · {report.coords.lat.toFixed(4)},{" "}
                  {report.coords.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-[#e5e5e5] bg-[#fafbfc] p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#04408b]/10 text-[#04408b]">
                  <BrainCircuit className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Analiza e AI</p>
                  <p className="text-xs text-[#54595f]">
                    Klasifikimi i automatizuar për verifikim
                  </p>
                </div>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-semibold tracking-wide text-[#54595f] uppercase">
                    Kategoria
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{report.category}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-wide text-[#54595f] uppercase">
                    Drejtoria
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{report.directorate}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-wide text-[#54595f] uppercase">
                    Sektori
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{report.sector}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-wide text-[#54595f] uppercase">
                    Prioriteti
                  </dt>
                  <dd className="mt-1">
                    <PriorityBadge priority={report.priority} />
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-semibold tracking-wide text-[#54595f] uppercase">
                    Confidence
                  </dt>
                  <dd className="mt-2">
                    <ConfidenceBar value={report.aiConfidence} />
                  </dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-[#e5e5e5] pt-4">
                <p className="text-[11px] font-semibold tracking-wide text-[#54595f] uppercase">
                  Përmbledhja
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{report.aiSummary}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#04408b]/15 bg-[#04408b]/[0.04] p-4">
              <p className="text-[11px] font-semibold tracking-wide text-[#04408b] uppercase">
                Sugjerimi i AI-së për trajtim
              </p>
              <p className="mt-2 text-sm leading-relaxed">{report.aiSuggestion}</p>
            </div>

            {report.rejectReason && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-semibold">Arsyeja e refuzimit</p>
                <p className="mt-1">{report.rejectReason}</p>
              </div>
            )}

            {report.mergedWithId && (
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
                <p className="font-semibold">Bashkuar me {report.mergedWithId}</p>
              </div>
            )}

            {possibleDupes.length > 0 && canAct && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">Mundësi duplikati</p>
                <p className="mt-1 text-amber-900/80">
                  {possibleDupes
                    .slice(0, 2)
                    .map((d) => d.id)
                    .join(", ")}{" "}
                  kanë kategori të ngjashme.
                </p>
              </div>
            )}

            {canAct && (
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  className="h-10"
                  onClick={() => onApprove(report)}
                  disabled={report.status === "DERGUAR_TE_DREJTORIA"}
                >
                  <ThumbsUp data-icon="inline-start" />
                  Aprovo klasifikimin
                </Button>
                <Button variant="outline" className="h-10" onClick={() => onEdit(report)}>
                  <Pencil data-icon="inline-start" />
                  Ndrysho
                </Button>
                <Button variant="outline" className="h-10" onClick={onMerge}>
                  <Link2 data-icon="inline-start" />
                  Bashko (duplikat)
                </Button>
                <Button variant="destructive" className="h-10" onClick={onReject}>
                  <ThumbsDown data-icon="inline-start" />
                  Refuzo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsView({
  reports,
  stats,
}: {
  reports: ArkivistReport[];
  stats: {
    neu: number;
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
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Statistikat
        </h1>
        <p className="mt-1 text-sm text-[#54595f]">
          Përmbledhje e ngarkesës së arkivistit (mock data)
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Totali i raporteve", value: stats.total },
          { label: "Në shqyrtim", value: stats.shqyrtim },
          { label: "Të aprovuara / dërguara", value: stats.aprovuara },
          { label: "Të refuzuara", value: stats.refuzuara },
          { label: "Prioritet i lartë", value: stats.prioritet },
          { label: "Të reja", value: stats.neu },
        ].map((item) => (
          <Card
            key={item.label}
            className="rounded-xl bg-white shadow-none ring-[#e5e5e5]"
          >
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl bg-white shadow-none ring-[#e5e5e5]">
        <CardHeader>
          <CardTitle>Sipas kategorisë</CardTitle>
          <CardDescription>Shpërndarja e raporteve në mock dataset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {byCategory.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="tabular-nums text-[#54595f]">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#04408b]"
                  style={{ width: `${(item.count / maxCat) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
