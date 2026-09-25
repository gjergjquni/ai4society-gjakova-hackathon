"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  Crosshair,
  FileText,
  GitMerge,
  ImagePlus,
  Lightbulb,
  MapPin,
  Navigation,
  Radio,
  Route,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  TrafficCone,
  Trash2,
  Droplets,
  Lamp,
  Footprints,
  CarFront,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const GjakovaMap = dynamic(() => import("@/components/gjakova-map"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#dce4ec]" />,
});

type Issue = {
  id: string;
  rank: number;
  title: string;
  category: string;
  categoryId: string;
  location: string;
  reports: number;
  priority: number;
  trend: number;
  severity: "Kritike" | "E lartë" | "Mesatare";
  status: "Eskaluar" | "Në shqyrtim" | "Monitorim";
  department: string;
  age: string;
  impact: string;
  recommendation: string;
  reasons: { label: string; value: number }[];
  coords: { lat: number; lng: number };
  color: string;
};

const categories = [
  { id: "pothole", label: "Gropë", icon: TrafficCone },
  { id: "waste", label: "Mbeturina", icon: Trash2 },
  { id: "light", label: "Ndriçim", icon: Lamp },
  { id: "water", label: "Rrjedhje uji", icon: Droplets },
  { id: "sidewalk", label: "Trotuar", icon: Footprints },
  { id: "traffic", label: "Trafik", icon: CarFront },
];

const severities = [
  { id: "critical", label: "Rrezik", hint: "dikush mund të lëndohet" },
  { id: "blocking", label: "Bllokon", hint: "ndalon rrugën ose shërbimin" },
  { id: "annoying", label: "Bezdis", hint: "nuk është urgjent" },
];

const places = [
  { id: "sheshi", label: "Sheshi i Gjakovës", coords: { lat: 42.3806, lng: 20.4312 }, merge: { pothole: "GJK-1031" } },
  { id: "qender", label: "Rr. Nënë Tereza", coords: { lat: 42.3801, lng: 20.4304 }, merge: { pothole: "GJK-1031" } },
  { id: "carshia", label: "Çarshia e Madhe", coords: { lat: 42.3809, lng: 20.4272 }, merge: { light: "GJK-1047" } },
  { id: "spitali", label: "Pranë Spitalit", coords: { lat: 42.3854, lng: 20.4276 }, merge: { water: "GJK-1042" } },
  { id: "ura", label: "Ura e Terzive", coords: { lat: 42.3724, lng: 20.4308 }, merge: { waste: "GJK-1019" } },
  { id: "cabrati", label: "Çabrati", coords: { lat: 42.3878, lng: 20.4198 }, merge: {} },
];

const seedIssues: Issue[] = [
  {
    id: "GJK-1042",
    rank: 1,
    title: "Rrjedhje e madhe e ujit",
    category: "Ujësjellës",
    location: "Rr. UÇK · pranë Spitalit",
    reports: 23,
    priority: 94,
    trend: 12,
    severity: "Kritike",
    status: "Eskaluar",
    department: "KRU Gjakova",
    age: "2h 18m",
    impact: "≈ 1,400 qytetarë",
    recommendation:
      "Izoloni valvulën e segmentit dhe dërgoni ekipin e emergjencës. Rrjedhja është 180 m nga hyrja e spitalit dhe po prek qarkullimin.",
    reasons: [
      { label: "Siguria publike", value: 29 },
      { label: "23 sinjale", value: 24 },
      { label: "Lokacion kritik", value: 23 },
      { label: "Përhapja", value: 18 },
    ],
    categoryId: "water",
    coords: { lat: 42.3854, lng: 20.4276 },
    color: "#ff5e66",
  },
  {
    id: "GJK-1031",
    rank: 2,
    title: "Gropë e rrezikshme në rrugë",
    category: "Infrastrukturë",
    categoryId: "pothole",
    location: "Rr. Nënë Tereza · Qendër",
    reports: 17,
    priority: 87,
    trend: 8,
    severity: "E lartë",
    status: "Në shqyrtim",
    department: "Drejtoria e Shërbimeve Publike",
    age: "1d 4h",
    impact: "≈ 3,200 kalime/ditë",
    recommendation:
      "Vendosni sinjalizim të përkohshëm sot dhe planifikoni ekipin e asfaltimit brenda 24 orëve. Raportet tregojnë rritje të shpejtë.",
    reasons: [
      { label: "Trafik i lartë", value: 27 },
      { label: "17 sinjale", value: 21 },
      { label: "Rrezik aksidenti", value: 24 },
      { label: "Përsëritje", value: 15 },
    ],
    coords: { lat: 42.3801, lng: 20.4304 },
    color: "#ff9f43",
  },
  {
    id: "GJK-1019",
    rank: 3,
    title: "Deponi ilegale po zgjerohet",
    category: "Mbeturina",
    categoryId: "waste",
    location: "Ura e Terzive · dalje jugore",
    reports: 31,
    priority: 82,
    trend: 5,
    severity: "E lartë",
    status: "Eskaluar",
    department: "Çabrati Sh.A.",
    age: "3d 7h",
    impact: "31 raportues · 4 lagje",
    recommendation:
      "Largoni mbeturinat me mjet të rëndë, dokumentoni para/pas dhe nisni inspektim për burimin. 9 raporte të reja u bashkuan sot.",
    reasons: [
      { label: "31 sinjale", value: 28 },
      { label: "Rritje në kohë", value: 21 },
      { label: "Ndikim mjedisor", value: 20 },
      { label: "Afër lumit", value: 13 },
    ],
    coords: { lat: 42.3724, lng: 20.4308 },
    color: "#d6f36a",
  },
  {
    id: "GJK-1047",
    rank: 4,
    title: "Ndriçim publik jashtë funksionit",
    category: "Ndriçim",
    categoryId: "light",
    location: "Çarshia e Madhe",
    reports: 12,
    priority: 71,
    trend: 3,
    severity: "Mesatare",
    status: "Monitorim",
    department: "Drejtoria e Infrastrukturës",
    age: "8h 42m",
    impact: "≈ 600 këmbësorë/natë",
    recommendation:
      "Inspektoni qarkun L-14 para muzgut. Pesë raportime përshkruajnë të njëjtin segment me 7 shtylla të fikura.",
    reasons: [
      { label: "Siguria natën", value: 22 },
      { label: "12 sinjale", value: 17 },
      { label: "Zonë turistike", value: 20 },
      { label: "Kohëzgjatja", value: 12 },
    ],
    coords: { lat: 42.3809, lng: 20.4272 },
    color: "#8f7cff",
  },
];

const agents = [
  { name: "Kuptimi", icon: BrainCircuit, color: "#65e4ff", detail: "tekst + imazh" },
  { name: "Lokacioni", icon: Crosshair, color: "#8f7cff", detail: "geo + dublikatë" },
  { name: "Prioriteti", icon: Zap, color: "#d6f36a", detail: "renditje dinamike" },
  { name: "Ndikimi", icon: Users, color: "#ff9f43", detail: "rrezik + ekspozim" },
  { name: "Rutimi", icon: Route, color: "#52d6a4", detail: "departamenti" },
  { name: "Zgjidhja", icon: Lightbulb, color: "#ffd66b", detail: "veprimi i radhës" },
];

const activity = [
  { agent: "Lokacioni", text: "Bashkoi 3 raporte në GJK-1031", time: "tani", color: "#8f7cff" },
  { agent: "Prioriteti", text: "GJK-1042 u ngrit në #1", time: "12s", color: "#d6f36a" },
  { agent: "Rutimi", text: "Eskalim te KRU Gjakova", time: "38s", color: "#52d6a4" },
  { agent: "Ndikimi", text: "Zbuloi afërsinë me spitalin", time: "1m", color: "#ff9f43" },
];

export default function SwarmDashboard() {
  const [issues, setIssues] = useState(seedIssues);
  const [selectedId, setSelectedId] = useState(seedIssues[0].id);
  const [reportOpen, setReportOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");
  const [form, setForm] = useState({
    categoryId: "",
    severityId: "",
    placeId: "",
    photo: false,
  });
  const [mergedId, setMergedId] = useState("GJK-1031");

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveAgent((current) => (current + 1) % agents.length),
      1800,
    );
    return () => window.clearInterval(timer);
  }, []);

  const selected = useMemo(
    () => issues.find((issue) => issue.id === selectedId) ?? issues[0],
    [issues, selectedId],
  );

  function submitReport(event: FormEvent) {
    event.preventDefault();
    if (!form.categoryId || !form.severityId || !form.placeId) return;

    const place = places.find((item) => item.id === form.placeId);
    const category = categories.find((item) => item.id === form.categoryId);
    if (!place || !category) return;

    const existingId = (place.merge as Record<string, string | undefined>)[form.categoryId];
    setProcessing(true);

    window.setTimeout(() => {
      if (existingId) {
        setIssues((current) =>
          current.map((issue) =>
            issue.id === existingId
              ? {
                  ...issue,
                  reports: issue.reports + 1,
                  priority: Math.min(99, issue.priority + 2),
                  trend: issue.trend + 2,
                }
              : issue,
          ),
        );
        setMergedId(existingId);
        setSelectedId(existingId);
      } else {
        const newId = `GJK-${1050 + issues.length}`;
        const newIssue: Issue = {
          id: newId,
          rank: issues.length + 1,
          title: `${category.label} e raportuar`,
          category: category.label,
          categoryId: category.id,
          location: place.label,
          reports: 1,
          priority: form.severityId === "critical" ? 76 : form.severityId === "blocking" ? 64 : 51,
          trend: 4,
          severity: form.severityId === "critical" ? "Kritike" : form.severityId === "blocking" ? "E lartë" : "Mesatare",
          status: "Monitorim",
          department: "Drejtoria e Shërbimeve Publike",
          age: "tani",
          impact: "1 sinjal i ri",
          recommendation: `Inspektoni ${place.label} dhe konfirmoni ${category.label.toLowerCase()} para se të dërgohet ekipi.`,
          reasons: [
            { label: "Sinjal i ri", value: 18 },
            { label: "Lokacioni", value: 16 },
            { label: "Kategoria", value: 12 },
            { label: "Kohëzgjatja", value: 6 },
          ],
          coords: place.coords,
          color: "#65e4ff",
        };
        setIssues((current) => [newIssue, ...current].map((issue, index) => ({ ...issue, rank: index + 1 })));
        setMergedId(newId);
        setSelectedId(newId);
      }
      setProcessing(false);
      setSubmitted(true);
    }, 1200);
  }

  function useMyLocation() {
    setForm((current) => ({ ...current, placeId: "sheshi" }));
  }

  function resetReport() {
    setReportOpen(false);
    window.setTimeout(() => {
      setSubmitted(false);
      setForm({ categoryId: "", severityId: "", placeId: "", photo: false });
    }, 300);
  }

  return (
    <main className="min-h-screen bg-[#07110f] text-[#edf4ef]">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07110f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative grid size-9 place-items-center rounded-xl bg-[#d6f36a] text-[#07110f]">
              <Waves className="size-5" strokeWidth={2.7} />
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#07110f] bg-[#65e4ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-[-0.03em]">PULSI</span>
                <span className="rounded-full border border-[#d6f36a]/25 bg-[#d6f36a]/10 px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] text-[#d6f36a]">
                  GJAKOVA
                </span>
              </div>
              <p className="hidden text-[10px] tracking-[0.08em] text-white/35 sm:block">
                INTELIGJENCA QYTETARE NË KOHË REALE
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.035] p-1 md:flex">
            <button className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white">
              Pamja operative
            </button>
            <button className="rounded-full px-4 py-1.5 text-xs text-white/45 transition hover:text-white">
              Analitika
            </button>
            <button className="rounded-full px-4 py-1.5 text-xs text-white/45 transition hover:text-white">
              Departamentet
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-[#52d6a4]/20 bg-[#52d6a4]/8 px-3 py-2 text-[11px] text-[#8cecc4] sm:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#52d6a4] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[#52d6a4]" />
              </span>
              7 agjentë aktivë
            </div>
            <Button
              onClick={() => setReportOpen(true)}
              className="h-9 rounded-full bg-[#d6f36a] px-4 text-xs font-bold text-[#0c1713] hover:bg-[#e6ff88]"
            >
              <span className="hidden sm:inline">Raporto problem</span>
              <span className="sm:hidden">Raporto</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <section className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#65e4ff]">
              <Radio className="size-3.5" />
              Situata në qytet · live
            </div>
            <h1 className="max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl">
              Çfarë kërkon vëmendjen e
              <span className="text-[#d6f36a]"> Gjakovës tani?</span>
            </h1>
          </div>
          <p className="max-w-lg text-sm leading-6 text-white/46">
            Qytetarët japin sinjalet. Agjentët AI i bashkojnë, i kuptojnë dhe i kthejnë në
            raste të gatshme për veprim.
          </p>
        </section>

        <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Sinjale sot", value: "186", delta: "+24%", icon: Radio, color: "#65e4ff" },
            { label: "Probleme aktive", value: "42", delta: "11 kritike", icon: ShieldAlert, color: "#ff5e66" },
            { label: "Raporte të bashkuara", value: "68", delta: "36% më pak duplikate", icon: GitMerge, color: "#8f7cff" },
            { label: "Dërguar për veprim", value: "14", delta: "6 departamente", icon: Send, color: "#d6f36a" },
          ].map((stat) => (
            <div key={stat.label} className="panel-soft group flex min-h-24 items-center gap-3 p-4">
              <div
                className="grid size-10 shrink-0 place-items-center rounded-xl border"
                style={{ color: stat.color, borderColor: `${stat.color}28`, background: `${stat.color}0d` }}
              >
                <stat.icon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] uppercase tracking-[0.12em] text-white/35">{stat.label}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-[-0.04em]">{stat.value}</span>
                  <span className="hidden text-[10px] text-white/38 xl:inline">{stat.delta}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_1.35fr_0.76fr]">
          <div className="panel min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/7 px-4 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-[#d6f36a]" />
                  <h2 className="text-sm font-semibold">Prioriteti dinamik</h2>
                </div>
                <p className="mt-1 text-[10px] text-white/35">Rillogaritet me çdo sinjal të ri</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/45">
                <Clock3 className="size-3" /> tani
              </div>
            </div>

            <div className="divide-y divide-white/6">
              {issues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => setSelectedId(issue.id)}
                  className={`group w-full px-4 py-4 text-left transition ${
                    selectedId === issue.id ? "bg-white/[0.065]" : "hover:bg-white/[0.035]"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex w-7 shrink-0 flex-col items-center">
                      <span className="text-lg font-semibold text-white/65">{issue.rank}</span>
                      <span className="mt-1 flex items-center text-[9px] font-semibold text-[#72e3ac]">
                        ↑{issue.trend}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-start justify-between gap-3">
                        <div>
                          <p className="truncate text-sm font-medium">{issue.title}</p>
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-white/38">
                            <MapPin className="size-3" /> {issue.location}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: issue.color }}
                          />
                          <span className="text-xl font-semibold tracking-[-0.05em]">{issue.priority}</span>
                        </div>
                      </div>
                      <div className="mb-2.5 h-1 overflow-hidden rounded-full bg-white/6">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${issue.priority}%`, backgroundColor: issue.color }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/40">
                        <span>{issue.reports} raporte · {issue.age}</span>
                        <span className="flex items-center gap-1 text-white/55">
                          {issue.department.split(" ").slice(0, 2).join(" ")}
                          <ChevronRight className="size-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel relative min-h-[510px] overflow-hidden">
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#65e4ff]" />
                  <h2 className="text-sm font-semibold">Harta e sinjaleve</h2>
                </div>
                <p className="mt-1 text-[10px] text-white/35">Gjakovë · 42 probleme aktive</p>
              </div>
              <div className="flex rounded-lg border border-white/8 bg-[#0c1714]/80 p-1 backdrop-blur">
                <button
                  onClick={() => setMapStyle("streets")}
                  className={`rounded-md px-2.5 py-1 text-[10px] ${mapStyle === "streets" ? "bg-white/10 text-white" : "text-white/40"}`}
                >
                  Rrugët
                </button>
                <button
                  onClick={() => setMapStyle("satellite")}
                  className={`rounded-md px-2.5 py-1 text-[10px] ${mapStyle === "satellite" ? "bg-white/10 text-white" : "text-white/40"}`}
                >
                  Sateliti
                </button>
              </div>
            </div>

            <div className="absolute inset-0">
              <GjakovaMap
                issues={issues}
                selectedId={selectedId}
                style={mapStyle}
                onSelect={setSelectedId}
              />

              <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-white/9 bg-[#0a1512]/92 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white/35">#{selected.rank}</span>
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ color: selected.color, backgroundColor: `${selected.color}12` }}>
                        {selected.severity}
                      </span>
                      <span className="text-[9px] text-white/30">{selected.id}</span>
                    </div>
                    <h3 className="truncate text-base font-semibold">{selected.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
                      <MapPin className="size-3" /> {selected.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-semibold tracking-[-0.06em]" style={{ color: selected.color }}>
                      {selected.priority}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-white/30">prioritet</div>
                  </div>
                </div>
                <button
                  onClick={() => setDetailsOpen(true)}
                  className="mt-3 flex w-full items-center justify-between rounded-lg border border-white/7 bg-white/[0.035] px-3 py-2 text-[10px] text-white/60 transition hover:bg-white/[0.07] hover:text-white"
                >
                  Shih arsyetimin dhe veprimin e rekomanduar
                  <ArrowUpRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="panel overflow-hidden">
              <div className="border-b border-white/7 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="size-4 text-[#8f7cff]" />
                    <h2 className="text-sm font-semibold">Swarm AI</h2>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.14em] text-[#52d6a4]">në punë</span>
                </div>
                <p className="mt-1 text-[10px] text-white/35">Agjentë të koordinuar, jo një chatbot</p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/6">
                {agents.map((agent, index) => (
                  <div
                    key={agent.name}
                    className={`relative bg-[#0b1613] p-3 transition duration-500 ${
                      activeAgent === index ? "bg-white/[0.065]" : ""
                    }`}
                  >
                    {activeAgent === index && (
                      <span className="absolute right-2 top-2 size-1.5 animate-pulse rounded-full" style={{ backgroundColor: agent.color }} />
                    )}
                    <agent.icon className="mb-2 size-4" style={{ color: agent.color }} />
                    <p className="text-[11px] font-medium">{agent.name}</p>
                    <p className="mt-0.5 text-[8px] text-white/30">{agent.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/7 px-4 py-3.5">
                <h2 className="text-xs font-semibold">Aktiviteti i fundit</h2>
                <Search className="size-3.5 text-white/25" />
              </div>
              <div className="space-y-0 px-4">
                {activity.map((item, index) => (
                  <div key={item.text} className="relative flex gap-3 border-b border-white/6 py-3 last:border-0">
                    <div className="relative mt-1">
                      <span className="block size-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {index < activity.length - 1 && <span className="absolute left-[3px] top-3 h-9 w-px bg-white/8" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-semibold" style={{ color: item.color }}>{item.agent}</span>
                        <span className="text-[8px] text-white/25">{item.time}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] leading-4 text-white/55">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d6f36a]/15 bg-[#d6f36a]/[0.055] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#d6f36a]">
                <Sparkles className="size-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Sinjal i swarm-it</span>
              </div>
              <p className="text-xs leading-5 text-white/66">
                4 probleme në qendër po ndikojnë të njëjtin korridor. Koordinimi i dy ekipeve mund të
                shmangë 3 dalje të ndara.
              </p>
            </div>
          </aside>
        </section>
      </div>

      <Dialog open={reportOpen} onOpenChange={(open) => !open && resetReport()}>
        <DialogContent className="max-w-lg border-white/10 bg-[#0c1714] p-0 text-white sm:rounded-3xl">
          {!submitted ? (
            <>
              <DialogHeader className="border-b border-white/7 px-6 py-5">
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#d6f36a] text-[#07110f]">
                  <Navigation className="size-5" />
                </div>
                <DialogTitle className="text-xl tracking-[-0.03em]">Shtyp, mos shkruaj</DialogTitle>
                <p className="text-sm leading-5 text-white/45">
                  Tre butona. Swarm-i e kupton problemin, lokacionin dhe sa lart duhet të ngjitet.
                </p>
              </DialogHeader>
              <form onSubmit={submitReport} className="space-y-5 px-6 py-5">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">Çfarë është?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setForm({ ...form, categoryId: category.id })}
                        className={`flex h-[72px] flex-col items-center justify-center rounded-xl border text-[11px] font-medium transition ${
                          form.categoryId === category.id
                            ? "border-[#d6f36a]/40 bg-[#d6f36a]/12 text-[#d6f36a]"
                            : "border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.06]"
                        }`}
                      >
                        <category.icon className="mb-1.5 size-4" />
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">Sa serioze?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {severities.map((severity) => (
                      <button
                        key={severity.id}
                        type="button"
                        onClick={() => setForm({ ...form, severityId: severity.id })}
                        className={`rounded-xl border px-2 py-3 text-center transition ${
                          form.severityId === severity.id
                            ? "border-[#ff9f43]/40 bg-[#ff9f43]/12 text-[#ffcf9a]"
                            : "border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.06]"
                        }`}
                      >
                        <span className="block text-[12px] font-semibold">{severity.label}</span>
                        <span className="mt-1 block text-[9px] text-white/35">{severity.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">Ku ndodhet?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {places.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => setForm({ ...form, placeId: place.id })}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[11px] transition ${
                          form.placeId === place.id
                            ? "border-[#65e4ff]/40 bg-[#65e4ff]/10 text-[#65e4ff]"
                            : "border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.06]"
                        }`}
                      >
                        <MapPin className="size-3.5 shrink-0" />
                        {place.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, photo: !form.photo })}
                    className={`flex h-16 flex-col items-center justify-center rounded-xl border text-[10px] transition ${
                      form.photo
                        ? "border-[#d6f36a]/40 bg-[#d6f36a]/10 text-[#d6f36a]"
                        : "border-dashed border-white/15 bg-white/[0.025] text-white/40 hover:text-[#65e4ff]"
                    }`}
                  >
                    <ImagePlus className="mb-1 size-4" />
                    {form.photo ? "Foto u shtua" : "Shto foto"}
                  </button>
                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="flex h-16 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.025] text-[10px] text-white/40 transition hover:border-[#65e4ff]/40 hover:text-[#65e4ff]"
                  >
                    <Crosshair className="mb-1 size-4" />
                    Përdor lokacionin tim
                  </button>
                </div>
                <Button
                  disabled={processing || !form.categoryId || !form.severityId || !form.placeId}
                  className="h-12 w-full rounded-xl bg-[#d6f36a] font-bold text-[#07110f] hover:bg-[#e6ff88]"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <BrainCircuit className="size-4 animate-pulse" /> Agjentët po e analizojnë...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Dërgo sinjalin <ArrowUpRight className="size-4" /></span>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="px-6 py-8">
              <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-[#52d6a4]/12 text-[#52d6a4]">
                <Check className="size-7" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#52d6a4]">Sinjali u përpunua</p>
                <h3 className="mt-2 text-xl font-semibold">U lidh me rastin {mergedId}</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">
                  Protokolli e gjeti të njëjtin problem në listë. Sinjali yt e ngriti lart dhe
                  swarm-i e qarkulloi te komuna.
                </p>
              </div>
              <div className="my-6 grid grid-cols-3 gap-2">
                {[
                  ["Kategoria", categories.find((item) => item.id === form.categoryId)?.label ?? "Problem"],
                  ["Lokacioni", places.find((item) => item.id === form.placeId)?.label ?? "Gjakovë"],
                  ["Rasti", mergedId],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/7 bg-white/[0.03] p-3 text-center">
                    <p className="text-[8px] uppercase tracking-wider text-white/30">{label}</p>
                    <p className="mt-1 text-[10px] font-medium text-white/75">{value}</p>
                  </div>
                ))}
              </div>
              <Button onClick={resetReport} className="h-11 w-full rounded-xl bg-white text-[#07110f] hover:bg-white/90">
                Shih rastin në hartë
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/10 bg-[#0c1714] p-0 text-white sm:rounded-3xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Detajet e rastit {selected.id}</DialogTitle>
          </DialogHeader>
          <div className="border-b border-white/7 p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-1 text-[9px] font-bold" style={{ color: selected.color, backgroundColor: `${selected.color}12` }}>
                Prioritet {selected.priority}
              </span>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-[9px] text-white/45">{selected.status}</span>
              <span className="text-[9px] text-white/25">{selected.id}</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">{selected.title}</h2>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-white/40">
              <MapPin className="size-3.5" /> {selected.location}
            </p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Pse është prioritet
              </p>
              <div className="space-y-3">
                {selected.reasons.map((reason) => (
                  <div key={reason.label}>
                    <div className="mb-1.5 flex justify-between text-[10px]">
                      <span className="text-white/55">{reason.label}</span>
                      <span className="font-medium text-white/80">+{reason.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                      <div className="h-full rounded-full" style={{ width: `${reason.value * 3.2}%`, backgroundColor: selected.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Inteligjenca e rastit
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Raporte të lidhura", `${selected.reports}`],
                  ["Aktiv prej", selected.age],
                  ["Ndikimi", selected.impact],
                  ["Përgjegjësi", selected.department],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/7 bg-white/[0.025] p-3">
                    <p className="text-[8px] uppercase tracking-wider text-white/28">{label}</p>
                    <p className="mt-1.5 text-[11px] font-medium leading-4 text-white/75">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-6 mb-6 rounded-2xl border border-[#d6f36a]/15 bg-[#d6f36a]/[0.055] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#d6f36a]">
              <Lightbulb className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Veprimi i rekomanduar</span>
            </div>
            <p className="text-sm leading-6 text-white/68">{selected.recommendation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button className="h-9 rounded-lg bg-[#d6f36a] text-xs font-bold text-[#07110f] hover:bg-[#e6ff88]">
                <Send className="size-3.5" /> Dërgo te departamenti
              </Button>
              <Button variant="outline" className="h-9 border-white/10 bg-transparent text-xs text-white hover:bg-white/5 hover:text-white">
                <FileText className="size-3.5" /> Eksporto rastin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
