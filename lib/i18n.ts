export type Locale = "sq" | "sr" | "en";

export const LOCALE_OPTIONS: { id: Locale; label: string; lang: string }[] = [
  { id: "sq", label: "SQ", lang: "sq" },
  { id: "en", label: "EN", lang: "en" },
  { id: "sr", label: "SR", lang: "sr" },
];

export const DEFAULT_LOCALE: Locale = "sq";

export type Messages = {
  metaTitle: string;
  metaDescription: string;
  republic: string;
  municipality: string;
  brand: string;
  emblemAlt: string;
  contactShort: string;
  phone: string;
  infoCenter: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  navHome: string;
  navNotices: string;
  navServices: string;
  navContact: string;
  report: string;
  reportShort: string;
  heroTitle: string;
  heroLead: string;
  heroLine1: string;
  heroLine2: string;
  heroCta: string;
  liveAgents: string;
  liveShort: string;
  priorityTitle: string;
  priorityHint: string;
  now: string;
  mapTitle: string;
  streets: string;
  satellite: string;
  cases: string;
  signals: string;
  aiShort: string;
  details: string;
  swipeCases: string;
  today: string;
  citizens: string;
  agentsTitle: string;
  agentsHint: string;
  agentsWorking: string;
  activityTitle: string;
  insightKicker: string;
  insightBody: string;
  reportTitle: string;
  reportLead: string;
  whatIsIt: string;
  howSerious: string;
  whereIsIt: string;
  addPhoto: string;
  photoAdded: string;
  photoTooLarge: string;
  removePhoto: string;
  useMyLocation: string;
  locating: string;
  locationDenied: string;
  locationError: string;
  customRequest: string;
  customRequestPlaceholder: string;
  unspecifiedLocation: string;
  sendSignal: string;
  agentsAnalyzing: string;
  submitError: string;
  signalProcessed: string;
  linkedCase: string;
  processedLead: string;
  fieldCategory: string;
  fieldLocation: string;
  fieldCase: string;
  seeOnMap: string;
  whyPriority: string;
  caseIntelligence: string;
  linkedReports: string;
  activeSince: string;
  impact: string;
  responsible: string;
  recommendedAction: string;
  sendDepartment: string;
  exportCase: string;
  caseDetails: string;
  footerAbout: string;
  footerContact: string;
  footerLinks: string;
  footerInfo: string;
  copyright: string;
  mapMissingKey: string;
  categories: Record<string, string>;
  severities: Record<string, { label: string; hint: string }>;
  places: Record<string, string>;
  agents: Record<string, { name: string; detail: string }>;
  severityLabel: Record<string, string>;
  statusLabel: Record<string, string>;
  departments: Record<string, string>;
  activity: { agent: string; text: string; time: string }[];
  issues: Record<
    string,
    {
      title: string;
      location: string;
      impact: string;
      recommendation: string;
      age: string;
      reasons: { label: string; value: number }[];
    }
  >;
  newIssueTitle: (category: string) => string;
  newIssueImpact: string;
  newIssueRecommendation: (place: string, category: string) => string;
  newIssueReasons: { label: string; value: number }[];
  reasonFallback: Record<string, string>;
};

export const messages: Record<Locale, Messages> = {
  sq: {
    metaTitle: "ReagoGjakovë · Komuna e Gjakovës",
    metaDescription: "Raportoni probleme komunale në Gjakovë — harta, prioriteti dhe agjentët e komunës.",
    republic: "Republika e Kosovës",
    municipality: "Komuna e Gjakovës",
    brand: "ReagoGjakovë",
    emblemAlt: "Emblema e Komunës së Gjakovës",
    contactShort: "Rr. Nëna Tereze, 50000 Gjakovë",
    phone: "+383 390 321 100",
    infoCenter: "0800 60000 & 0800 60001",
    email: "gjakova.ic@rks-gov.net",
    addressLine1: "Rr. Nëna Tereze",
    addressLine2: "50000 Gjakovë",
    navHome: "Ballina",
    navNotices: "Njoftime",
    navServices: "Shërbime",
    navContact: "Kontakt",
    report: "Raporto problem",
    reportShort: "Raporto",
    heroTitle: "Raportoni një problem në qytet",
    heroLead: "Qytetarët dërgojnë sinjalet. Agjentët e komunës i bashkojnë, i vlerësojnë dhe i kthejnë në raste për veprim.",
    heroLine1: "Kontribuoni në përmirësimin e qytetit",
    heroLine2: "Raportoni problemet publike në Komunën e Gjakovës.",
    heroCta: "Krijo Ankesën",
    liveAgents: "7 agjentë aktivë",
    liveShort: "Live",
    priorityTitle: "Prioriteti dinamik",
    priorityHint: "Rillogaritet me çdo sinjal të ri",
    now: "tani",
    mapTitle: "Harta e Gjakovës",
    streets: "Rrugët",
    satellite: "Sateliti",
    cases: "raste",
    signals: "sinjale",
    aiShort: "AI",
    details: "Detajet",
    swipeCases: "Rrëshqit rastet",
    today: "sot",
    citizens: "qytetarë",
    agentsTitle: "Agjentë të komunës",
    agentsHint: "Mjet komunal për vlerësimin e rasteve",
    agentsWorking: "në punë",
    activityTitle: "Aktiviteti i fundit",
    insightKicker: "Sinjal i agjentëve",
    insightBody:
      "4 probleme në qendër po ndikojnë të njëjtin korridor. Koordinimi i dy ekipeve mund të shmangë 3 dalje të ndara.",
    reportTitle: "Shtyp, mos shkruaj",
    reportLead: "Shtyp çfarë është dhe ku ndodhet. Agjentët e komunës e kuptojnë problemin dhe e dërgojnë te ekipi i duhur.",
    whatIsIt: "Çfarë është?",
    howSerious: "Sa serioze?",
    whereIsIt: "Ku ndodhet?",
    addPhoto: "Shto foto (opsionale)",
    photoAdded: "Foto u shtua",
    photoTooLarge: "Fotoja është shumë e madhe (maks. 8 MB).",
    removePhoto: "Hiq foton",
    useMyLocation: "Përdor lokacionin tim (opsionale)",
    locating: "Duke marrë lokacionin...",
    locationDenied: "Lejo lokacionin te cilësimet e pajisjes",
    locationError: "Lokacioni nuk u mor. Provo përsëri.",
    customRequest: "Kërkesë e personalizuar",
    customRequestPlaceholder: "Përshkruani kërkesën tuaj...",
    unspecifiedLocation: "Lokacion i pacaktuar",
    sendSignal: "Dërgo raportin",
    agentsAnalyzing: "Agjentët po e analizojnë...",
    submitError: "Raporti nuk u dërgua. Provo përsëri.",
    signalProcessed: "Raporti u përpunua",
    linkedCase: "U lidh me rastin",
    processedLead: "Sistemi e gjeti të njëjtin problem në listë. Sinjali yt e ngriti lart dhe u qarkullua te komuna.",
    fieldCategory: "Kategoria",
    fieldLocation: "Lokacioni",
    fieldCase: "Rasti",
    seeOnMap: "Mbyll",
    whyPriority: "Pse është prioritet",
    caseIntelligence: "Vlerësimi i rastit",
    linkedReports: "Raporte të lidhura",
    activeSince: "Aktiv prej",
    impact: "Ndikimi",
    responsible: "Përgjegjësi",
    recommendedAction: "Veprimi i rekomanduar",
    sendDepartment: "Dërgo te departamenti",
    exportCase: "Eksporto rastin",
    caseDetails: "Detajet e rastit",
    footerAbout: "Faqe zyrtare për raportimin e problemeve komunale në Gjakovë.",
    footerContact: "Kontakt",
    footerLinks: "Lidhje",
    footerInfo: "Qendra Informative",
    copyright: "© 2026 Komuna e Gjakovës. Të gjitha të drejtat e rezervuara.",
    mapMissingKey: "Shto NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
    categories: {
      pothole: "Gropë",
      waste: "Mbeturina",
      light: "Ndriçim",
      water: "Rrjedhje uji",
      sidewalk: "Trotuar",
      traffic: "Trafik",
    },
    severities: {
      critical: { label: "Rrezik", hint: "dikush mund të lëndohet" },
      blocking: { label: "Bllokon", hint: "ndalon rrugën ose shërbimin" },
      annoying: { label: "Bezdis", hint: "nuk është urgjent" },
    },
    places: {
      sheshi: "Sheshi i Gjakovës",
      qender: "Rr. Nënë Tereza",
      carshia: "Çarshia e Madhe",
      spitali: "Pranë Spitalit",
      ura: "Ura e Terzive",
      cabrati: "Çabrati",
    },
    agents: {
      Kuptimi: { name: "Kuptimi", detail: "tekst + imazh" },
      Lokacioni: { name: "Lokacioni", detail: "geo + dublikatë" },
      Prioriteti: { name: "Prioriteti", detail: "renditje dinamike" },
      Ndikimi: { name: "Ndikimi", detail: "rrezik + ekspozim" },
      Rutimi: { name: "Rutimi", detail: "departamenti" },
      Zgjidhja: { name: "Zgjidhja", detail: "veprimi i radhës" },
    },
    severityLabel: { Kritike: "Kritike", "E lartë": "E lartë", Mesatare: "Mesatare" },
    statusLabel: { Eskaluar: "Eskaluar", "Në shqyrtim": "Në shqyrtim", Monitorim: "Monitorim" },
    departments: {
      "KRU Gjakova": "KRU Gjakova",
      "Drejtoria e Shërbimeve Publike": "Drejtoria e Shërbimeve Publike",
      "Çabrati Sh.A.": "Çabrati Sh.A.",
      "Drejtoria e Infrastrukturës": "Drejtoria e Infrastrukturës",
    },
    activity: [
      { agent: "Lokacioni", text: "Bashkoi 3 raporte në GJK-1031", time: "tani" },
      { agent: "Prioriteti", text: "GJK-1042 u ngrit në #1", time: "12s" },
      { agent: "Rutimi", text: "Eskalim te KRU Gjakova", time: "38s" },
      { agent: "Ndikimi", text: "Zbuloi afërsinë me spitalin", time: "1m" },
    ],
    issues: {
      "GJK-1042": {
        title: "Rrjedhje e madhe e ujit",
        location: "Rr. UÇK · pranë Spitalit",
        impact: "≈ 1,400 qytetarë",
        recommendation:
          "Izoloni valvulën e segmentit dhe dërgoni ekipin e emergjencës. Rrjedhja është 180 m nga hyrja e spitalit dhe po prek qarkullimin.",
        age: "2h 18m",
        reasons: [
          { label: "Siguria publike", value: 29 },
          { label: "23 sinjale", value: 24 },
          { label: "Lokacion kritik", value: 23 },
          { label: "Përhapja", value: 18 },
        ],
      },
      "GJK-1031": {
        title: "Gropë e rrezikshme në rrugë",
        location: "Rr. Nënë Tereza · Qendër",
        impact: "≈ 3,200 kalime/ditë",
        recommendation:
          "Vendosni sinjalizim të përkohshëm sot dhe planifikoni ekipin e asfaltimit brenda 24 orëve. Raportet tregojnë rritje të shpejtë.",
        age: "1d 4h",
        reasons: [
          { label: "Trafik i lartë", value: 27 },
          { label: "17 sinjale", value: 21 },
          { label: "Rrezik aksidenti", value: 24 },
          { label: "Përsëritje", value: 15 },
        ],
      },
      "GJK-1019": {
        title: "Deponi ilegale po zgjerohet",
        location: "Ura e Terzive · dalje jugore",
        impact: "31 raportues · 4 lagje",
        recommendation:
          "Largoni mbeturinat me mjet të rëndë, dokumentoni para/pas dhe nisni inspektim për burimin. 9 raporte të reja u bashkuan sot.",
        age: "3d 7h",
        reasons: [
          { label: "31 sinjale", value: 28 },
          { label: "Rritje në kohë", value: 21 },
          { label: "Ndikim mjedisor", value: 20 },
          { label: "Afër lumit", value: 13 },
        ],
      },
      "GJK-1047": {
        title: "Ndriçim publik jashtë funksionit",
        location: "Çarshia e Madhe",
        impact: "≈ 600 këmbësorë/natë",
        recommendation:
          "Inspektoni qarkun L-14 para muzgut. Pesë raportime përshkruajnë të njëjtin segment me 7 shtylla të fikura.",
        age: "8h 42m",
        reasons: [
          { label: "Siguria natën", value: 22 },
          { label: "12 sinjale", value: 17 },
          { label: "Zonë turistike", value: 20 },
          { label: "Kohëzgjatja", value: 12 },
        ],
      },
    },
    newIssueTitle: (category) => `${category} e raportuar`,
    newIssueImpact: "1 sinjal i ri",
    newIssueRecommendation: (place, category) =>
      `Inspektoni ${place} dhe konfirmoni ${category.toLowerCase()} para se të dërgohet ekipi.`,
    newIssueReasons: [
      { label: "Sinjal i ri", value: 18 },
      { label: "Lokacioni", value: 16 },
      { label: "Kategoria", value: 12 },
      { label: "Kohëzgjatja", value: 6 },
    ],
    reasonFallback: {
      "Sinjal i ri": "Sinjal i ri",
      Lokacioni: "Lokacioni",
      Kategoria: "Kategoria",
      Kohëzgjatja: "Kohëzgjatja",
    },
  },
  sr: {
    metaTitle: "ReagoGjakovë · Opština Đakovica",
    metaDescription: "Prijavite komunalne probleme u Đakovici — mapa, prioritet i opštinski agenti.",
    republic: "Republika Kosovo",
    municipality: "Opština Đakovica",
    brand: "ReagoGjakovë",
    emblemAlt: "Amblem Opštine Đakovica",
    contactShort: "Rr. Nëna Tereze, 50000 Gjakovë",
    phone: "+383 390 321 100",
    infoCenter: "0800 60000 & 0800 60001",
    email: "gjakova.ic@rks-gov.net",
    addressLine1: "Rr. Nëna Tereze",
    addressLine2: "50000 Gjakovë",
    navHome: "Početak",
    navNotices: "Obaveštenja",
    navServices: "Usluge",
    navContact: "Kontakt",
    report: "Prijavi problem",
    reportShort: "Prijavi",
    heroTitle: "Prijavite problem u gradu",
    heroLead: "Građani šalju signale. Opštinski agenti ih spajaju, procenjuju i pretvaraju u slučajeve za postupanje.",
    heroLine1: "Doprinesite unapređenju grada",
    heroLine2: "Prijavite javne probleme u Opštini Đakovica.",
    heroCta: "Kreiraj žalbu",
    liveAgents: "7 aktivnih agenata",
    liveShort: "Uživo",
    priorityTitle: "Dinamički prioritet",
    priorityHint: "Preračunava se sa svakim novim signalom",
    now: "sada",
    mapTitle: "Mapa Đakovice",
    streets: "Ulice",
    satellite: "Satelit",
    cases: "slučajevi",
    signals: "signali",
    aiShort: "AI",
    details: "Detalji",
    swipeCases: "Prevucite slučajeve",
    today: "danas",
    citizens: "građani",
    agentsTitle: "Opštinski agenti",
    agentsHint: "Opštinski alat za procenu slučajeva",
    agentsWorking: "u radu",
    activityTitle: "Poslednja aktivnost",
    insightKicker: "Signal agenata",
    insightBody:
      "4 problema u centru utiču na isti koridor. Koordinacija dva tima može da izbegne 3 odvojena izlaska.",
    reportTitle: "Pritisnite, ne pišite",
    reportLead: "Pritisnite šta je i gde se dešava. Opštinski agenti razumeju problem i šalju ga pravom timu.",
    whatIsIt: "Šta je?",
    howSerious: "Koliko je ozbiljno?",
    whereIsIt: "Gde se nalazi?",
    addPhoto: "Dodaj fotografiju (opciono)",
    photoAdded: "Fotografija je dodata",
    photoTooLarge: "Fotografija je prevelika (maks. 8 MB).",
    removePhoto: "Ukloni fotografiju",
    useMyLocation: "Koristi moju lokaciju (opciono)",
    locating: "Preuzimanje lokacije...",
    locationDenied: "Dozvolite lokaciju u podešavanjima uređaja",
    locationError: "Lokacija nije preuzeta. Pokušajte ponovo.",
    customRequest: "Prilagođeni zahtev",
    customRequestPlaceholder: "Opišite svoj zahtev...",
    unspecifiedLocation: "Lokacion i pacaktuar",
    sendSignal: "Pošalji prijavu",
    agentsAnalyzing: "Agenti analiziraju...",
    submitError: "Prijava nije poslata. Pokušajte ponovo.",
    signalProcessed: "Prijava je obrađena",
    linkedCase: "Povezano sa slučajem",
    processedLead: "Sistem je pronašao isti problem na listi. Vaš signal ga je podigao i prosleđen je opštini.",
    fieldCategory: "Kategorija",
    fieldLocation: "Lokacija",
    fieldCase: "Slučaj",
    seeOnMap: "Zatvori",
    whyPriority: "Zašto je prioritet",
    caseIntelligence: "Procena slučaja",
    linkedReports: "Povezane prijave",
    activeSince: "Aktivno od",
    impact: "Uticaj",
    responsible: "Nadležnost",
    recommendedAction: "Preporučena radnja",
    sendDepartment: "Pošalji direktorijatu",
    exportCase: "Izvezi slučaj",
    caseDetails: "Detalji slučaja",
    footerAbout: "Zvanična stranica za prijavu komunalnih problema u Đakovici.",
    footerContact: "Kontakt",
    footerLinks: "Linkovi",
    footerInfo: "Informativni centar",
    copyright: "© 2026 Opština Đakovica. Sva prava zadržana.",
    mapMissingKey: "Dodajte NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
    categories: {
      pothole: "Rupa",
      waste: "Otpad",
      light: "Osvetljenje",
      water: "Curenje vode",
      sidewalk: "Trotoar",
      traffic: "Saobraćaj",
    },
    severities: {
      critical: { label: "Opasnost", hint: "neko može da se povredi" },
      blocking: { label: "Blokira", hint: "zaustavlja put ili uslugu" },
      annoying: { label: "Smeta", hint: "nije hitno" },
    },
    places: {
      sheshi: "Trg Đakovice",
      qender: "Ul. Nënë Tereza",
      carshia: "Velika čaršija",
      spitali: "Kod bolnice",
      ura: "Terzijski most",
      cabrati: "Čabrati",
    },
    agents: {
      Kuptimi: { name: "Razumevanje", detail: "tekst + slika" },
      Lokacioni: { name: "Lokacija", detail: "geo + duplikat" },
      Prioriteti: { name: "Prioritet", detail: "dinamički redosled" },
      Ndikimi: { name: "Uticaj", detail: "rizik + izloženost" },
      Rutimi: { name: "Usmeravanje", detail: "direktorijat" },
      Zgjidhja: { name: "Rešenje", detail: "sledeća radnja" },
    },
    severityLabel: { Kritike: "Kritično", "E lartë": "Visok", Mesatare: "Srednji" },
    statusLabel: { Eskaluar: "Eskalirano", "Në shqyrtim": "Na razmatranju", Monitorim: "Praćenje" },
    departments: {
      "KRU Gjakova": "KRU Đakovica",
      "Drejtoria e Shërbimeve Publike": "Direktorijat javnih službi",
      "Çabrati Sh.A.": "Čabrati d.o.o.",
      "Drejtoria e Infrastrukturës": "Direktorijat za infrastrukturu",
    },
    activity: [
      { agent: "Lokacija", text: "Spojio 3 prijave u GJK-1031", time: "sada" },
      { agent: "Prioritet", text: "GJK-1042 je podignut na #1", time: "12s" },
      { agent: "Usmeravanje", text: "Eskalacija ka KRU Đakovica", time: "38s" },
      { agent: "Uticaj", text: "Otkrivena blizina bolnice", time: "1m" },
    ],
    issues: {
      "GJK-1042": {
        title: "Veliko curenje vode",
        location: "Ul. UÇK · kod bolnice",
        impact: "≈ 1.400 građana",
        recommendation:
          "Izolujte ventil segmenta i pošaljite ekipu hitne pomoći. Curenje je 180 m od ulaza u bolnicu i utiče na saobraćaj.",
        age: "2h 18m",
        reasons: [
          { label: "Javna bezbednost", value: 29 },
          { label: "23 signala", value: 24 },
          { label: "Kritična lokacija", value: 23 },
          { label: "Širenje", value: 18 },
        ],
      },
      "GJK-1031": {
        title: "Opasna rupa na putu",
        location: "Ul. Nënë Tereza · Centar",
        impact: "≈ 3.200 prolaza/dan",
        recommendation:
          "Postavite privremenu signalizaciju danas i planirajte ekipu za asfaltiranje u roku od 24 sata. Prijave pokazuju brzi rast.",
        age: "1d 4h",
        reasons: [
          { label: "Gust saobraćaj", value: 27 },
          { label: "17 signala", value: 21 },
          { label: "Rizik od nesreće", value: 24 },
          { label: "Ponavljanje", value: 15 },
        ],
      },
      "GJK-1019": {
        title: "Ilegalna deponija se širi",
        location: "Terzijski most · južni izlaz",
        impact: "31 prijavilac · 4 naselja",
        recommendation:
          "Uklonite otpad teškom mehanizacijom, dokumentujte pre/posle i pokrenite inspekciju izvora. 9 novih prijava je spojeno danas.",
        age: "3d 7h",
        reasons: [
          { label: "31 signal", value: 28 },
          { label: "Rast tokom vremena", value: 21 },
          { label: "Uticaj na životnu sredinu", value: 20 },
          { label: "Blizu reke", value: 13 },
        ],
      },
      "GJK-1047": {
        title: "Javna rasveta van funkcije",
        location: "Velika čaršija",
        impact: "≈ 600 pešaka/noć",
        recommendation:
          "Pregledajte kolo L-14 pre sumraka. Pet prijava opisuje isti segment sa 7 ugašenih stubova.",
        age: "8h 42m",
        reasons: [
          { label: "Noćna bezbednost", value: 22 },
          { label: "12 signala", value: 17 },
          { label: "Turistička zona", value: 20 },
          { label: "Trajanje", value: 12 },
        ],
      },
    },
    newIssueTitle: (category) => `Prijavljeno: ${category}`,
    newIssueImpact: "1 novi signal",
    newIssueRecommendation: (place, category) =>
      `Pregledajte ${place} i potvrdite ${category.toLowerCase()} pre slanja ekipe.`,
    newIssueReasons: [
      { label: "Novi signal", value: 18 },
      { label: "Lokacija", value: 16 },
      { label: "Kategorija", value: 12 },
      { label: "Trajanje", value: 6 },
    ],
    reasonFallback: {
      "Sinjal i ri": "Novi signal",
      Lokacioni: "Lokacija",
      Kategoria: "Kategorija",
      Kohëzgjatja: "Trajanje",
    },
  },
  en: {
    metaTitle: "ReagoGjakovë · Municipality of Gjakova",
    metaDescription: "Report municipal problems in Gjakova — map, priority, and municipal agents.",
    republic: "Republic of Kosovo",
    municipality: "Municipality of Gjakova",
    brand: "ReagoGjakovë",
    emblemAlt: "Emblem of the Municipality of Gjakova",
    contactShort: "Rr. Nëna Tereze, 50000 Gjakovë",
    phone: "+383 390 321 100",
    infoCenter: "0800 60000 & 0800 60001",
    email: "gjakova.ic@rks-gov.net",
    addressLine1: "Rr. Nëna Tereze",
    addressLine2: "50000 Gjakovë",
    navHome: "Home",
    navNotices: "Notices",
    navServices: "Services",
    navContact: "Contact",
    report: "Report a problem",
    reportShort: "Report",
    heroTitle: "Report a problem in the city",
    heroLead: "Citizens send the signals. Municipal agents merge, assess, and turn them into cases ready for action.",
    heroLine1: "Help improve the city",
    heroLine2: "Report public problems in the Municipality of Gjakova.",
    heroCta: "Create complaint",
    liveAgents: "7 agents active",
    liveShort: "Live",
    priorityTitle: "Dynamic priority",
    priorityHint: "Recalculated with every new signal",
    now: "now",
    mapTitle: "Map of Gjakova",
    streets: "Streets",
    satellite: "Satellite",
    cases: "cases",
    signals: "signals",
    aiShort: "AI",
    details: "Details",
    swipeCases: "Swipe cases",
    today: "today",
    citizens: "residents",
    agentsTitle: "Municipal agents",
    agentsHint: "A municipal tool for assessing cases",
    agentsWorking: "at work",
    activityTitle: "Recent activity",
    insightKicker: "Agent signal",
    insightBody:
      "4 problems in the centre affect the same corridor. Coordinating two crews can avoid 3 separate dispatches.",
    reportTitle: "Tap, don’t type",
    reportLead: "Tap what it is and where it is. Municipal agents read the problem and route it to the right team.",
    whatIsIt: "What is it?",
    howSerious: "How serious?",
    whereIsIt: "Where is it?",
    addPhoto: "Add photo (optional)",
    photoAdded: "Photo added",
    photoTooLarge: "Photo is too large (max 8 MB).",
    removePhoto: "Remove photo",
    useMyLocation: "Use my location (optional)",
    locating: "Getting your location...",
    locationDenied: "Allow location in your device settings",
    locationError: "Location could not be read. Try again.",
    customRequest: "Custom request",
    customRequestPlaceholder: "Describe your request...",
    unspecifiedLocation: "Lokacion i pacaktuar",
    sendSignal: "Submit report",
    agentsAnalyzing: "Agents are analysing...",
    submitError: "Report could not be sent. Please try again.",
    signalProcessed: "Report processed",
    linkedCase: "Linked to case",
    processedLead: "The system found the same problem on the list. Your signal raised it and it was circulated to the municipality.",
    fieldCategory: "Category",
    fieldLocation: "Location",
    fieldCase: "Case",
    seeOnMap: "Close",
    whyPriority: "Why it is a priority",
    caseIntelligence: "Case assessment",
    linkedReports: "Linked reports",
    activeSince: "Active for",
    impact: "Impact",
    responsible: "Responsible",
    recommendedAction: "Recommended action",
    sendDepartment: "Send to department",
    exportCase: "Export case",
    caseDetails: "Case details",
    footerAbout: "Official page for reporting municipal problems in Gjakova.",
    footerContact: "Contact",
    footerLinks: "Links",
    footerInfo: "Information Centre",
    copyright: "© 2026 Municipality of Gjakova. All rights reserved.",
    mapMissingKey: "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
    categories: {
      pothole: "Pothole",
      waste: "Waste",
      light: "Lighting",
      water: "Water leak",
      sidewalk: "Sidewalk",
      traffic: "Traffic",
    },
    severities: {
      critical: { label: "Danger", hint: "someone could be hurt" },
      blocking: { label: "Blocking", hint: "stops the road or service" },
      annoying: { label: "Annoying", hint: "not urgent" },
    },
    places: {
      sheshi: "Gjakova Square",
      qender: "Nënë Tereza St.",
      carshia: "Grand Bazaar",
      spitali: "Near the Hospital",
      ura: "Terzi Bridge",
      cabrati: "Çabrati",
    },
    agents: {
      Kuptimi: { name: "Understanding", detail: "text + image" },
      Lokacioni: { name: "Location", detail: "geo + duplicate" },
      Prioriteti: { name: "Priority", detail: "dynamic ranking" },
      Ndikimi: { name: "Impact", detail: "risk + exposure" },
      Rutimi: { name: "Routing", detail: "department" },
      Zgjidhja: { name: "Resolution", detail: "next action" },
    },
    severityLabel: { Kritike: "Critical", "E lartë": "High", Mesatare: "Medium" },
    statusLabel: { Eskaluar: "Escalated", "Në shqyrtim": "Under review", Monitorim: "Monitoring" },
    departments: {
      "KRU Gjakova": "KRU Gjakova",
      "Drejtoria e Shërbimeve Publike": "Directorate of Public Services",
      "Çabrati Sh.A.": "Çabrati J.S.C.",
      "Drejtoria e Infrastrukturës": "Directorate of Infrastructure",
    },
    activity: [
      { agent: "Location", text: "Merged 3 reports into GJK-1031", time: "now" },
      { agent: "Priority", text: "GJK-1042 rose to #1", time: "12s" },
      { agent: "Routing", text: "Escalated to KRU Gjakova", time: "38s" },
      { agent: "Impact", text: "Detected proximity to the hospital", time: "1m" },
    ],
    issues: {
      "GJK-1042": {
        title: "Major water leak",
        location: "UÇK St. · near the Hospital",
        impact: "≈ 1,400 residents",
        recommendation:
          "Isolate the segment valve and dispatch the emergency crew. The leak is 180 m from the hospital entrance and is affecting traffic.",
        age: "2h 18m",
        reasons: [
          { label: "Public safety", value: 29 },
          { label: "23 signals", value: 24 },
          { label: "Critical location", value: 23 },
          { label: "Spread", value: 18 },
        ],
      },
      "GJK-1031": {
        title: "Dangerous pothole in the road",
        location: "Nënë Tereza St. · Centre",
        impact: "≈ 3,200 passages/day",
        recommendation:
          "Place temporary signage today and schedule the asphalt crew within 24 hours. Reports show a rapid rise.",
        age: "1d 4h",
        reasons: [
          { label: "High traffic", value: 27 },
          { label: "17 signals", value: 21 },
          { label: "Accident risk", value: 24 },
          { label: "Recurrence", value: 15 },
        ],
      },
      "GJK-1019": {
        title: "Illegal dump is expanding",
        location: "Terzi Bridge · southern exit",
        impact: "31 reporters · 4 neighbourhoods",
        recommendation:
          "Remove the waste with heavy machinery, document before/after, and start an inspection of the source. 9 new reports were merged today.",
        age: "3d 7h",
        reasons: [
          { label: "31 signals", value: 28 },
          { label: "Rise over time", value: 21 },
          { label: "Environmental impact", value: 20 },
          { label: "Near the river", value: 13 },
        ],
      },
      "GJK-1047": {
        title: "Public lighting out of service",
        location: "Grand Bazaar",
        impact: "≈ 600 pedestrians/night",
        recommendation:
          "Inspect circuit L-14 before dusk. Five reports describe the same segment with 7 dark poles.",
        age: "8h 42m",
        reasons: [
          { label: "Night safety", value: 22 },
          { label: "12 signals", value: 17 },
          { label: "Tourist area", value: 20 },
          { label: "Duration", value: 12 },
        ],
      },
    },
    newIssueTitle: (category) => `Reported ${category.toLowerCase()}`,
    newIssueImpact: "1 new signal",
    newIssueRecommendation: (place, category) =>
      `Inspect ${place} and confirm the ${category.toLowerCase()} before the crew is sent.`,
    newIssueReasons: [
      { label: "New signal", value: 18 },
      { label: "Location", value: 16 },
      { label: "Category", value: 12 },
      { label: "Duration", value: 6 },
    ],
    reasonFallback: {
      "Sinjal i ri": "New signal",
      Lokacioni: "Location",
      Kategoria: "Category",
      Kohëzgjatja: "Duration",
    },
  },
};

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.sq;
}
