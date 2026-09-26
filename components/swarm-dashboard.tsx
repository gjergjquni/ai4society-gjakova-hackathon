"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ClipboardPen,
  Crosshair,
  ImagePlus,
  Mail,
  MapPin,
  PenLine,
  Phone,
  X,
  TrafficCone,
  Trash2,
  Droplets,
  Lamp,
  Footprints,
  CarFront,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  createReport,
  fetchProblems,
  lookupCitizenCase,
  type CitizenCase,
  type Issue,
} from "@/lib/api";
import { DEFAULT_LOCALE, LOCALE_OPTIONS, LOCALE_STORAGE_KEY, getMessages, type Locale } from "@/lib/i18n";

const categories = [
  { id: "pothole", label: "Gropë", icon: TrafficCone },
  { id: "waste", label: "Mbeturina", icon: Trash2 },
  { id: "light", label: "Ndriçim", icon: Lamp },
  { id: "water", label: "Rrjedhje uji", icon: Droplets },
  { id: "sidewalk", label: "Trotuar", icon: Footprints },
  { id: "traffic", label: "Trafik", icon: CarFront },
];

const places = [
  { id: "sheshi", label: "Sheshi i Gjakovës", coords: { lat: 42.3806, lng: 20.4312 } },
  { id: "qender", label: "Rr. Nënë Tereza", coords: { lat: 42.3801, lng: 20.4304 } },
  { id: "carshia", label: "Çarshia e Madhe", coords: { lat: 42.3809, lng: 20.4272 } },
  { id: "spitali", label: "Pranë Spitalit", coords: { lat: 42.3854, lng: 20.4276 } },
  { id: "ura", label: "Ura e Terzive", coords: { lat: 42.3724, lng: 20.4308 } },
  { id: "cabrati", label: "Çabrati", coords: { lat: 42.3878, lng: 20.4198 } },
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

export default function SwarmDashboard() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const t = getMessages(locale);
  const [issues, setIssues] = useState(seedIssues);
  const [reportOpen, setReportOpen] = useState(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("report") === "1",
  );
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    categoryId: "",
    placeId: "",
    photo: false,
    customRequest: "",
  });
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState<CitizenCase | null>(null);
  const [trackStatus, setTrackStatus] = useState<"idle" | "loading" | "error" | "empty">("idle");
  const [submittedStatus, setSubmittedStatus] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "ready" | "denied" | "error">("idle");
  const [customRequestOpen, setCustomRequestOpen] = useState(false);
  const [mergedId, setMergedId] = useState("GJK-1031");
  const [submittedSummary, setSubmittedSummary] = useState({
    category: "",
    location: "",
  });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (stored === "sq" || stored === "en" || stored === "sr") {
        setLocaleState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.metaTitle;
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.setAttribute("content", "#04408b");
  }, [locale, t.metaTitle]);

  useEffect(() => {
    let cancelled = false;
    fetchProblems()
      .then((data) => {
        if (!cancelled && data.length) setIssues(data);
      })
      .catch(() => {
        // Keep seeded demo cases if the API is offline.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submitReport(event: FormEvent) {
    event.preventDefault();
    const customText = form.customRequest.trim();
    if (!form.categoryId && !customText) return;

    const place = places.find((item) => item.id === form.placeId);
    const category = categories.find((item) => item.id === form.categoryId);
    if (form.categoryId && !category) return;

    setProcessing(true);
    setSubmitError("");

    try {
      const result = await createReport({
        category_id: form.categoryId || null,
        custom_text: customText,
        place_id: form.placeId || null,
        has_photo: Boolean(photoFile || form.photo),
        lat: gps?.lat ?? null,
        lon: gps?.lng ?? null,
        photo: photoFile,
      });

      const categoryLabel = category
        ? (t.categories[category.id] ?? category.label)
        : customText || t.customRequest;
      const locationLabel =
        gps?.label ||
        (form.placeId && t.places[form.placeId]) ||
        place?.label ||
        result.location_text ||
        t.unspecifiedLocation;

      setIssues((current) => {
        const without = current.filter((issue) => issue.id !== result.issue.id);
        return [result.issue, ...without]
          .sort((a, b) => b.priority - a.priority || b.reports - a.reports)
          .map((issue, index) => ({ ...issue, rank: index + 1 }));
      });
      setMergedId(result.case_code);
      setSubmittedStatus(result.status || "Në shqyrtim");
      setSubmittedSummary({ category: categoryLabel, location: locationLabel });
      setSubmitted(true);
      setCustomRequestOpen(false);
      setForm((current) => ({ ...current, customRequest: "" }));
    } catch {
      setSubmitError(t.submitError);
    } finally {
      setProcessing(false);
    }
  }

  function clearPhoto() {
    setPhotoPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setPhotoName("");
    setPhotoFile(null);
    setPhotoError("");
    setForm((current) => ({ ...current, photo: false }));
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function onPhotoPicked(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError(t.photoTooLarge);
      event.target.value = "";
      return;
    }
    const preview = URL.createObjectURL(file);
    setPhotoPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return preview;
    });
    setPhotoName(file.name);
    setPhotoFile(file);
    setPhotoError("");
    setForm((current) => ({ ...current, photo: true }));
  }

  function useMyLocation() {
    if (locationStatus === "loading") return;
    if (!navigator.geolocation) {
      setGps(null);
      setLocationStatus("error");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setGps({ lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
        setLocationStatus("ready");
      },
      (error) => {
        setGps(null);
        setLocationStatus(error.code === error.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  function resetReport() {
    setReportOpen(false);
    window.setTimeout(() => {
      setSubmitted(false);
      setCustomRequestOpen(false);
      setSubmitError("");
      setSubmittedSummary({ category: "", location: "" });
      setForm({ categoryId: "", placeId: "", photo: false, customRequest: "" });
      setPhotoPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      setPhotoName("");
      setPhotoFile(null);
      setPhotoError("");
      setSubmittedStatus("");
      setGps(null);
      setLocationStatus("idle");
      if (photoInputRef.current) photoInputRef.current.value = "";
    }, 300);
  }

  async function trackReport() {
    const code = trackCode.trim();
    if (!code) {
      setTrackStatus("empty");
      setTrackResult(null);
      return;
    }
    setTrackStatus("loading");
    try {
      const found = await lookupCitizenCase(code);
      setTrackResult(found);
      setTrackStatus(found ? "idle" : "empty");
    } catch {
      setTrackResult(null);
      setTrackStatus("error");
    }
  }

  const canSubmit = Boolean(form.categoryId || form.customRequest.trim());

  const navItems = [
    { href: "#ballina", label: t.navHome, key: "home" },
    { href: "#ankesa", label: t.navNotices, key: "notices" },
    { href: "#ankesa", label: t.navServices, key: "services" },
    { href: "#kontakt", label: t.navContact, key: "contact" },
  ];

  return (
    <main id="ballina" className="municipal-page relative min-h-screen overflow-x-hidden">
      <div className="sticky top-0 z-40">
        <header className="site-header">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
            <a href="#ballina" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <img
                src="/gjakova-emblem.png"
                alt={t.emblemAlt}
                width={48}
                height={56}
                className="h-10 w-auto shrink-0 sm:h-12"
              />
              <span className="min-w-0">
                <span className="block text-[12px] text-[#54595f]">{t.republic}</span>
                <span className="block truncate text-base font-semibold leading-tight text-[#161616] sm:text-[20px]">
                  {t.municipality}
                </span>
                <span className="mt-0.5 block truncate text-[13px] font-semibold leading-tight tracking-tight text-[#04408b] sm:text-sm">
                  {t.brand}
                </span>
              </span>
            </a>
            <div className="lang-switch shrink-0" role="navigation" aria-label="Language Switcher">
              {LOCALE_OPTIONS.map((option, index) => (
                <span key={option.id} className="inline-flex items-center">
                  {index > 0 && <span className="px-0.5 text-[#cfd8e3]">/</span>}
                  <button
                    type="button"
                    lang={option.lang}
                    aria-current={locale === option.id ? "true" : undefined}
                    onClick={() => setLocale(option.id)}
                    className={
                      locale === option.id
                        ? "bg-[#04408b] text-white"
                        : "text-[#54595f] hover:text-[#04408b]"
                    }
                  >
                    {option.label}
                  </button>
                </span>
              ))}
            </div>
          </div>
        </header>
      </div>

      <section id="ankesa" className="hero-complaint">
        <div className="hero-complaint-shade" aria-hidden />
        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-white sm:text-[40px] lg:text-[44px]">
              {t.heroLine1}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:mt-4 sm:text-lg">
              {t.heroLine2}
            </p>
          </div>

          <div className="mt-10 w-full max-w-sm rounded-2xl bg-white p-0.5 shadow-[0_18px_50px_rgb(0_0_0/0.28)] sm:mt-12">
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="flex h-14 w-full items-center justify-between gap-3 rounded-xl bg-[#04408b] px-5 text-left text-base font-semibold text-white transition hover:bg-[#03346f] sm:h-16 sm:text-lg"
            >
              <span className="inline-flex items-center gap-3">
                <ClipboardPen className="size-5 shrink-0 sm:size-6" />
                {t.heroCta}
              </span>
              <ArrowRight className="size-5 shrink-0 sm:size-6" />
            </button>
          </div>

          <form
            className="mt-5 w-full max-w-sm rounded-2xl bg-white/95 p-4 shadow-[0_12px_30px_rgb(0_0_0/0.18)]"
            onSubmit={(event) => {
              event.preventDefault();
              void trackReport();
            }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#54595f]">
              {t.trackTitle}
            </p>
            <div className="mt-2 flex gap-2">
              <input
                value={trackCode}
                onChange={(event) => setTrackCode(event.target.value)}
                placeholder={t.trackPlaceholder}
                className="h-10 min-w-0 flex-1 rounded-sm border border-[#e5e5e5] bg-[#f7f8fa] px-3 text-sm outline-none focus:border-[#04408b]/40"
              />
              <button
                type="submit"
                className="h-10 shrink-0 rounded-sm bg-[#04408b] px-3 text-sm font-semibold text-white hover:bg-[#03346f]"
              >
                {t.trackButton}
              </button>
            </div>
            {trackStatus === "loading" ? (
              <p className="mt-2 text-sm text-[#54595f]">Duke u ngarkuar...</p>
            ) : null}
            {trackStatus === "empty" ? (
              <p className="mt-2 text-sm text-[#b42318]">{t.trackNotFound}</p>
            ) : null}
            {trackStatus === "error" ? (
              <p className="mt-2 text-sm text-[#b42318]">{t.trackError}</p>
            ) : null}
            {trackResult ? (
              <div className="mt-3 rounded-sm border border-[#e5e5e5] bg-[#f7f8fa] p-3">
                <p className="text-sm font-semibold text-[#161616]">{trackResult.case_code}</p>
                <p className="mt-1 text-sm text-[#54595f]">{trackResult.title}</p>
                <p className="mt-2 text-sm font-medium text-[#04408b]">{trackResult.status}</p>
                {trackResult.timeline.length ? (
                  <p className="mt-1 text-xs text-[#54595f]">{trackResult.timeline.join(" → ")}</p>
                ) : null}
              </div>
            ) : null}
          </form>
        </div>
      </section>

      <footer id="kontakt" className="site-footer">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <img src="/gjakova-emblem.png" alt={t.emblemAlt} width={40} height={46} className="h-10 w-auto" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">{t.republic}</p>
                <p className="text-base font-semibold">{t.municipality}</p>
                <p className="mt-0.5 text-sm font-medium text-white/80">{t.brand}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-white/65">{t.footerAbout}</p>
          </div>
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55">{t.footerContact}</h2>
            <div className="space-y-2 text-sm text-white/80">
              <p>
                {t.addressLine1}
                <br />
                {t.addressLine2}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-3.5" /> Tel: {t.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-3.5" /> {t.email}
              </p>
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55">{t.footerInfo}</h2>
            <p className="text-sm text-white/80">{t.infoCenter}</p>
            <div className="lang-switch mt-4">
              {LOCALE_OPTIONS.map((option, index) => (
                <span key={option.id} className="inline-flex items-center">
                  {index > 0 && <span className="px-0.5 text-white/30">/</span>}
                  <button
                    type="button"
                    onClick={() => setLocale(option.id)}
                    className={locale === option.id ? "bg-white text-[#161616]" : "text-white/75 hover:text-white"}
                  >
                    {option.label}
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55">{t.footerLinks}</h2>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              {navItems.map((item) => (
                <a key={item.key} href={item.href} className="hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-[1500px] px-4 py-4 text-center text-[11px] text-white/45 sm:px-6">
            {t.copyright}
          </p>
        </div>
      </footer>

      <Dialog open={reportOpen} onOpenChange={(open) => !open && resetReport()}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-[960px] overflow-y-auto border-[#e5e5e5] bg-white p-0 text-[#161616] sm:max-w-[960px] sm:rounded-xl">
          {!submitted ? (
            <>
              <DialogHeader className="border-b border-[#e5e5e5] px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex items-start gap-4 pr-8">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[#04408b] text-white sm:size-11">
                    <ClipboardPen className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="text-xl tracking-[-0.03em] sm:text-2xl">{t.reportTitle}</DialogTitle>
                    <p className="mt-1 text-sm leading-5 text-[#54595f] sm:max-w-2xl">{t.reportLead}</p>
                  </div>
                </div>
              </DialogHeader>
              <form onSubmit={submitReport} className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:gap-6 sm:px-6 sm:py-6">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#54595f]">{t.whatIsIt}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setForm({ ...form, categoryId: category.id })}
                        className={`flex h-[72px] flex-col items-center justify-center rounded-sm border text-[11px] font-medium transition sm:h-[80px] ${
                          form.categoryId === category.id
                            ? "border-[#04408b]/40 bg-[#edf2f7] text-[#04408b]"
                            : "border-[#e5e5e5] bg-[#f7f8fa] text-[#161616]/70 hover:bg-[#edf2f7]"
                        }`}
                      >
                        <category.icon className="mb-1.5 size-4" />
                        {t.categories[category.id]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#54595f]">{t.whereIsIt}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {places.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => setForm({ ...form, placeId: place.id })}
                        className={`flex min-h-[52px] items-center gap-2 rounded-sm border px-3 py-2.5 text-left text-[11px] transition sm:min-h-[56px] ${
                          form.placeId === place.id
                            ? "border-[#04408b]/40 bg-[#edf2f7] text-[#04408b]"
                            : "border-[#e5e5e5] bg-[#f7f8fa] text-[#161616]/70 hover:bg-[#edf2f7]"
                        }`}
                      >
                        <MapPin className="size-3.5 shrink-0" />
                        {t.places[place.id]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-label={t.addPhoto}
                    onChange={onPhotoPicked}
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className={`flex h-12 items-center justify-center gap-2 rounded-sm border px-3 text-sm font-medium transition ${
                        form.photo
                          ? "border-[#04408b]/40 bg-[#edf2f7] text-[#04408b]"
                          : "border-dashed border-[#cfd8e3] bg-[#f7f8fa] text-[#54595f] hover:border-[#04408b]/40 hover:text-[#04408b]"
                      }`}
                    >
                      <ImagePlus className="size-4 shrink-0" />
                      <span className="truncate">{form.photo ? t.photoAdded : t.addPhoto}</span>
                    </button>
                    <button
                      type="button"
                      onClick={useMyLocation}
                      className={`flex h-12 items-center justify-center gap-2 rounded-sm border px-3 text-sm font-medium transition ${
                        gps
                          ? "border-[#04408b]/40 bg-[#edf2f7] text-[#04408b]"
                          : "border-dashed border-[#cfd8e3] bg-[#f7f8fa] text-[#54595f] hover:border-[#04408b]/40 hover:text-[#04408b]"
                      }`}
                    >
                      <Crosshair className={`size-4 shrink-0 ${locationStatus === "loading" ? "animate-pulse" : ""}`} />
                      <span className="truncate">
                        {locationStatus === "loading" ? t.locating : gps ? gps.label : t.useMyLocation}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomRequestOpen((open) => !open)}
                      className={`flex h-12 items-center justify-center gap-2 rounded-sm border px-3 text-sm font-medium transition ${
                        customRequestOpen || form.customRequest.trim()
                          ? "border-[#04408b]/40 bg-[#edf2f7] text-[#04408b]"
                          : "border-dashed border-[#cfd8e3] bg-[#f7f8fa] text-[#54595f] hover:border-[#04408b]/40 hover:text-[#04408b]"
                      }`}
                    >
                      <PenLine className="size-4 shrink-0" />
                      <span className="truncate">{t.customRequest}</span>
                    </button>
                  </div>
                  {photoPreview ? (
                    <div className="flex items-center gap-3 rounded-sm border border-[#e5e5e5] bg-[#f7f8fa] p-2">
                      <img
                        src={photoPreview}
                        alt={photoName || t.photoAdded}
                        className="size-16 shrink-0 rounded-sm object-cover"
                      />
                      <p className="min-w-0 flex-1 truncate text-sm text-[#161616]">{photoName}</p>
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="inline-flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium text-[#54595f] hover:bg-white hover:text-[#04408b]"
                      >
                        <X className="size-3.5" />
                        {t.removePhoto}
                      </button>
                    </div>
                  ) : null}
                  {photoError ? <p className="text-sm text-[#b42318]">{photoError}</p> : null}
                  {locationStatus === "denied" || locationStatus === "error" ? (
                    <p className="text-sm text-[#b42318]">
                      {locationStatus === "denied" ? t.locationDenied : t.locationError}
                    </p>
                  ) : null}
                  {customRequestOpen && (
                    <textarea
                      value={form.customRequest}
                      onChange={(event) =>
                        setForm({ ...form, customRequest: event.target.value })
                      }
                      placeholder={t.customRequestPlaceholder}
                      rows={3}
                      className="w-full resize-y rounded-sm border border-[#e5e5e5] bg-[#f7f8fa] px-3 py-2.5 text-sm text-[#161616] outline-none transition placeholder:text-[#54595f]/70 focus:border-[#04408b]/40 focus:bg-white"
                    />
                  )}
                  <Button
                    type="submit"
                    disabled={processing || !canSubmit}
                    className="h-12 w-full rounded-sm bg-[#04408b] text-base font-bold text-white hover:bg-[#03346f] disabled:bg-[#04408b]/45 disabled:opacity-100"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <BrainCircuit className="size-4 animate-pulse" /> {t.agentsAnalyzing}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {t.sendSignal} <ArrowUpRight className="size-4" />
                      </span>
                    )}
                  </Button>
                  {submitError ? (
                    <p className="text-center text-sm text-[#b42318]">{submitError}</p>
                  ) : null}
                </div>
              </form>
            </>
          ) : (
            <div className="mx-auto max-w-xl px-6 py-10">
              <div className="mx-auto mb-5 grid size-14 place-items-center rounded-sm bg-[#e8f6ee] text-[#2f6f4e]">
                <Check className="size-7" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2f6f4e]">{t.signalProcessed}</p>
                <h3 className="mt-2 text-xl font-semibold">
                  {t.linkedCase} {mergedId}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#54595f]">{t.processedLead}</p>
              </div>
              <div className="my-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  [t.fieldCategory, submittedSummary.category],
                  [t.fieldLocation, submittedSummary.location],
                  [t.fieldCase, mergedId],
                  [t.fieldStatus, submittedStatus || "Në shqyrtim"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-sm border border-[#e5e5e5] bg-[#f7f8fa] p-3 text-center">
                    <p className="text-[8px] uppercase tracking-wider text-[#54595f]">{label}</p>
                    <p className="mt-1 text-[10px] font-medium text-[#161616]">{value}</p>
                  </div>
                ))}
              </div>
              <Button onClick={resetReport} className="h-11 w-full rounded-sm bg-[#04408b] text-white hover:bg-[#03346f]">
                {t.seeOnMap}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
