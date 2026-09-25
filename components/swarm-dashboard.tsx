"use client";

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
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Issue = {
  id: string;
  rank: number;
  title: string;
  category: string;
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
  map: { x: number; y: number };
  color: string;
};

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
    map: { x: 59, y: 38 },
    color: "#ff5e66",
  },
  {
    id: "GJK-1031",
    rank: 2,
    title: "Gropë e rrezikshme në rrugë",
    category: "Infrastrukturë",
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
    map: { x: 44, y: 54 },
    color: "#ff9f43",
  },
  {
    id: "GJK-1019",
    rank: 3,
    title: "Deponi ilegale po zgjerohet",
    category: "Mbeturina",
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
    map: { x: 70, y: 72 },
    color: "#d6f36a",
  },
  {
    id: "GJK-1047",
    rank: 4,
    title: "Ndriçim publik jashtë funksionit",
    category: "Ndriçim",
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
    map: { x: 34, y: 32 },
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
  const [form, setForm] = useState({ description: "", location: "" });

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
    setProcessing(true);
    window.setTimeout(() => {
      setIssues((current) =>
        current.map((issue) =>
          issue.id === "GJK-1031"
            ? { ...issue, reports: issue.reports + 1, priority: 89, trend: issue.trend + 2 }
            : issue,
        ),
      );
      setSelectedId("GJK-1031");
      setProcessing(false);
      setSubmitted(true);
    }, 1700);
  }

  function resetReport() {
    setReportOpen(false);
    window.setTimeout(() => {
      setSubmitted(false);
      setForm({ description: "", location: "" });
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
                <button className="rounded-md bg-white/10 px-2.5 py-1 text-[10px]">Problemet</button>
                <button className="px-2.5 py-1 text-[10px] text-white/40">Nxehtësia</button>
              </div>
            </div>

            <div className="city-map absolute inset-0">
              <svg className="absolute inset-0 size-full opacity-90" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                <path d="M-20 390 C130 320 230 440 390 340 S640 230 840 310" fill="none" stroke="#65e4ff" strokeOpacity=".13" strokeWidth="26" />
                <path d="M-20 390 C130 320 230 440 390 340 S640 230 840 310" fill="none" stroke="#65e4ff" strokeOpacity=".28" strokeWidth="2" />
                <path d="M120 -20 C180 120 260 180 210 340 S260 520 360 640" fill="none" stroke="white" strokeOpacity=".1" strokeWidth="11" />
                <path d="M120 -20 C180 120 260 180 210 340 S260 520 360 640" fill="none" stroke="white" strokeOpacity=".2" strokeWidth="1.5" />
                <path d="M650 -30 C570 130 640 240 520 350 S430 540 470 640" fill="none" stroke="white" strokeOpacity=".09" strokeWidth="9" />
                <path d="M650 -30 C570 130 640 240 520 350 S430 540 470 640" fill="none" stroke="white" strokeOpacity=".18" strokeWidth="1.5" />
                <path d="M40 130 L760 520" stroke="white" strokeOpacity=".07" strokeWidth="7" />
                <path d="M20 530 L700 70" stroke="white" strokeOpacity=".06" strokeWidth="6" />
                <path d="M300 -20 L760 440" stroke="white" strokeOpacity=".06" strokeWidth="5" />
                <g fill="none" stroke="white" strokeOpacity=".045">
                  <path d="M40 80h210v100H40zM300 55h160v130H300zM510 80h230v100H510z" />
                  <path d="M40 230h150v115H40zM270 210h190v95H270zM540 220h180v100H540z" />
                  <path d="M65 430h150v100H65zM295 420h180v110H295zM555 400h170v120H555z" />
                </g>
              </svg>

              <span className="absolute left-[13%] top-[24%] text-[9px] tracking-widest text-white/17">ÇABRATI</span>
              <span className="absolute left-[42%] top-[46%] text-[9px] tracking-widest text-white/17">QENDRA</span>
              <span className="absolute left-[65%] top-[78%] text-[9px] tracking-widest text-white/17">URA E TERZIVE</span>
              <span className="absolute left-[70%] top-[23%] text-[9px] tracking-widest text-white/17">SPITALI</span>

              {issues.map((issue) => (
                <button
                  key={issue.id}
                  aria-label={issue.title}
                  onClick={() => setSelectedId(issue.id)}
                  className="map-marker absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${issue.map.x}%`, top: `${issue.map.y}%` }}
                >
                  <span
                    className={`absolute inset-0 rounded-full opacity-20 ${selectedId === issue.id ? "animate-ping" : ""}`}
                    style={{ backgroundColor: issue.color }}
                  />
                  <span
                    className="relative grid size-10 place-items-center rounded-full border-4 border-[#0a1512] text-[11px] font-bold text-[#07110f] shadow-2xl transition hover:scale-110"
                    style={{ backgroundColor: issue.color }}
                  >
                    {issue.reports}
                  </span>
                </button>
              ))}

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
                <DialogTitle className="text-xl tracking-[-0.03em]">Çfarë po ndodh?</DialogTitle>
                <p className="text-sm leading-5 text-white/45">
                  Shkruaje siç do t&apos;ia tregoje një fqinji. Agjentët tanë e strukturojnë pjesën tjetër.
                </p>
              </DialogHeader>
              <form onSubmit={submitReport} className="space-y-5 px-6 py-5">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    Përshkrimi
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="p.sh. Është hapur një gropë e madhe para semaforit, dy vetura gati u aksidentuan..."
                    className="min-h-28 resize-none border-white/10 bg-white/[0.035] text-sm placeholder:text-white/20 focus-visible:ring-[#d6f36a]/40"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    Lokacioni
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#65e4ff]" />
                    <Input
                      value={form.location}
                      onChange={(event) => setForm({ ...form, location: event.target.value })}
                      placeholder="Rr. Nënë Tereza, Gjakovë"
                      className="border-white/10 bg-white/[0.035] pl-10 placeholder:text-white/20 focus-visible:ring-[#d6f36a]/40"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.025] text-white/40 transition hover:border-[#65e4ff]/40 hover:text-[#65e4ff]">
                    <ImagePlus className="mb-1.5 size-5" />
                    <span className="text-[10px]">Shto foto/video</span>
                    <input type="file" accept="image/*,video/*" className="hidden" />
                  </label>
                  <button type="button" className="flex h-20 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.025] text-white/40 transition hover:border-[#65e4ff]/40 hover:text-[#65e4ff]">
                    <Crosshair className="mb-1.5 size-5" />
                    <span className="text-[10px]">Përdor lokacionin tim</span>
                  </button>
                </div>
                <Button
                  disabled={processing}
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
                <p className="text-center text-[9px] text-white/25">
                  Nuk ke nevojë të zgjedhësh kategori apo departament — këtë e bën swarm-i.
                </p>
              </form>
            </>
          ) : (
            <div className="px-6 py-8">
              <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-[#52d6a4]/12 text-[#52d6a4]">
                <Check className="size-7" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#52d6a4]">Sinjali u përpunua</p>
                <h3 className="mt-2 text-xl font-semibold">U lidh me rastin GJK-1031</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">
                  Agjenti i lokacionit gjeti një problem ekzistues 18 metra larg. Raporti yt e ngriti
                  prioritetin nga 87 në 89.
                </p>
              </div>
              <div className="my-6 grid grid-cols-3 gap-2">
                {[
                  ["Kategoria", "Infrastrukturë"],
                  ["Raporte", "18 të lidhura"],
                  ["Prioriteti", "89 · i lartë"],
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
