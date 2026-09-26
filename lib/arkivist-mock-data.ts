import type { ArkivistReport } from "./arkivist-types";

export const ARKIVIST_PROFILE = {
  name: "Arben Krasniqi",
  role: "Arkivist",
  email: "arkivist@gjakova.rks-gov.net",
  initials: "AK",
};

export const mockReports: ArkivistReport[] = [
  {
    id: "GJK-1042",
    title: "Rrjedhje e madhe e ujit",
    description:
      "Ka një rrjedhje të madhe uji pranë hyrjes së spitalit. Uji po përhapet në rrugë dhe po vështirëson qarkullimin e ambulancave. Situata ka filluar sot në mëngjes.",
    date: "2026-09-26",
    time: "08:42",
    location: "Rr. UÇK · pranë Spitalit",
    coords: { lat: 42.3854, lng: 20.4276 },
    category: "Ujësjellës",
    directorate: "KRU Gjakova",
    sector: "Rrjeti i ujësjellësit",
    priority: "Kritike",
    aiConfidence: 94,
    status: "NE_SHQYRTIM",
    photoUrl: "https://picsum.photos/seed/gjk1042/800/500",
    aiSummary:
      "Rrjedhje aktive e ujit të pijshëm në zonë kritike (spital). Ndikim i lartë në trafik dhe shërbime emergjente.",
    aiSuggestion:
      "Izoloni valvulën e segmentit dhe dërgoni ekipin e emergjencës. Rrjedhja është ~180 m nga hyrja e spitalit.",
    citizenName: "Qytetar anonim",
  },
  {
    id: "GJK-1031",
    title: "Gropë e rrezikshme në rrugë",
    description:
      "Gropë e madhe në mes të rrugës Nënë Tereza. Disa makina kanë dëmtuar gomat. Duhet ndërhyrje urgjente me sinjalizim dhe riparim.",
    date: "2026-09-25",
    time: "16:18",
    location: "Rr. Nënë Tereza · Qendër",
    coords: { lat: 42.3801, lng: 20.4304 },
    category: "Infrastrukturë",
    directorate: "Drejtoria e Shërbimeve Publike",
    sector: "Mirëmbajtja e rrugëve",
    priority: "E lartë",
    aiConfidence: 89,
    status: "NE_SHQYRTIM",
    photoUrl: "https://picsum.photos/seed/gjk1031/800/500",
    aiSummary:
      "Gropë e thellë në rrugë me trafik të lartë. Rrezik aksidenti dhe dëmtim automjetesh. 17 sinjale të ngjashme në zonë.",
    aiSuggestion:
      "Vendosni sinjalizim të përkohshëm sot dhe planifikoni ekipin e asfaltimit brenda 24 orëve.",
    citizenName: "Mira Hoxha",
  },
  {
    id: "GJK-1047",
    title: "Ndriçim publik jashtë funksionit",
    description:
      "Shtyllat e ndriçimit në Çarshinë e Madhe nuk ndizen prej 3 netësh. Zona mbetet e errët dhe e pasigurt për këmbësorët.",
    date: "2026-09-25",
    time: "21:05",
    location: "Çarshia e Madhe",
    coords: { lat: 42.3809, lng: 20.4272 },
    category: "Ndriçim",
    directorate: "Drejtoria e Infrastrukturës",
    sector: "Ndriçimi publik",
    priority: "Mesatare",
    aiConfidence: 86,
    status: "AI_ANALYZED",
    photoUrl: "https://picsum.photos/seed/gjk1047/800/500",
    aiSummary:
      "Dështim i segmentit të ndriçimit publik L-14. Afër zonës historike/turistike me trafik këmbësorësh natën.",
    aiSuggestion:
      "Inspektoni qarkun L-14 para muzgut. Pesë raportime përshkruajnë të njëjtin segment me 7 shtylla të fikura.",
    citizenName: "Driton Berisha",
  },
  {
    id: "GJK-1019",
    title: "Deponi ilegale po zgjerohet",
    description:
      "Pranë Urës së Terzive po grumbullohen mbeturina. Deponia ilegale po zgjerohet drejt lumit dhe po bëhet e rrezikshme për mjedisin.",
    date: "2026-09-24",
    time: "11:30",
    location: "Ura e Terzive · dalje jugore",
    coords: { lat: 42.3724, lng: 20.4308 },
    category: "Mbeturina",
    directorate: "Çabrati Sh.A.",
    sector: "Menaxhimi i mbeturinave",
    priority: "E lartë",
    aiConfidence: 91,
    status: "NE_SHQYRTIM",
    photoUrl: "https://picsum.photos/seed/gjk1019/800/500",
    aiSummary:
      "Deponi ilegale në zgjerim afër lumit. Ndikim mjedisor i lartë; 31 sinjale nga 4 lagje.",
    aiSuggestion:
      "Largoni mbeturinat me mjet të rëndë, dokumentoni para/pas dhe nisni inspektim për burimin.",
    citizenName: "Qytetar anonim",
  },
  {
    id: "GJK-1051",
    title: "Trotuar i dëmtuar",
    description:
      "Trotuaret në lagjen Çabrati janë të thyer dhe të rrezikshëm për të moshuarit dhe fëmijët.",
    date: "2026-09-24",
    time: "09:12",
    location: "Çabrati · Rr. Ismail Qemali",
    coords: { lat: 42.3878, lng: 20.4198 },
    category: "Trotuar",
    directorate: "Drejtoria e Infrastrukturës",
    sector: "Hapësirat publike",
    priority: "Mesatare",
    aiConfidence: 78,
    status: "SUBMITTED",
    photoUrl: "https://picsum.photos/seed/gjk1051/800/500",
    aiSummary:
      "Dëmtim i trotuarit në zonë rezidenciale. Prioritet mesatar; nuk pengon trafikun automobilistik.",
    aiSuggestion:
      "Planifikoni riparim në ciklin e ardhshëm të mirëmbajtjes së lagjes.",
    citizenName: "Valbona Gashi",
  },
  {
    id: "GJK-1028",
    title: "Sinjalizim rrugor i dëmtuar",
    description:
      "Tabela e ndalimit është e rrëzuar në kryqëzim. Ka rrezik për aksidente.",
    date: "2026-09-23",
    time: "14:45",
    location: "Sheshi i Gjakovës",
    coords: { lat: 42.3806, lng: 20.4312 },
    category: "Trafik",
    directorate: "Drejtoria e Infrastrukturës",
    sector: "Sinjalizimi rrugor",
    priority: "E lartë",
    aiConfidence: 92,
    status: "APROVUAR",
    photoUrl: "https://picsum.photos/seed/gjk1028/800/500",
    aiSummary:
      "Sinjalizim i munguar në kryqëzim me trafik të dendur. Rrezik i lartë për aksidente.",
    aiSuggestion:
      "Vendosni tabelë të përkohshme menjëherë dhe planifikoni zëvendësimin e përhershëm.",
    citizenName: "Flamur Kelmendi",
  },
  {
    id: "GJK-1022",
    title: "Kontejnerë të mbushur",
    description:
      "Kontejnerët pranë Sheshit Çabrati janë plot prej 4 ditësh dhe mbeturinat po derdhen jashtë.",
    date: "2026-09-22",
    time: "07:55",
    location: "Sheshi Çabrati",
    coords: { lat: 42.3872, lng: 20.4205 },
    category: "Mbeturina",
    directorate: "Çabrati Sh.A.",
    sector: "Menaxhimi i mbeturinave",
    priority: "Mesatare",
    aiConfidence: 88,
    status: "DERGUAR_TE_DREJTORIA",
    photoUrl: "https://picsum.photos/seed/gjk1022/800/500",
    aiSummary:
      "Mbushje e kontejnerëve mbi kapacitet në zonë publike. Ndikim higjienik dhe estetik.",
    aiSuggestion:
      "Planifikoni zbrazje urgjente dhe rishikoni frekuencën e mbledhjes në këtë pikë.",
    citizenName: "Qytetar anonim",
  },
  {
    id: "GJK-1015",
    title: "Ankesë e dyfishtë për gropë",
    description:
      "E njëjta gropë që u raportua më herët në Nënë Tereza. Foto e re nga këndi tjetër.",
    date: "2026-09-25",
    time: "18:02",
    location: "Rr. Nënë Tereza · Qendër",
    coords: { lat: 42.3802, lng: 20.4305 },
    category: "Infrastrukturë",
    directorate: "Drejtoria e Shërbimeve Publike",
    sector: "Mirëmbajtja e rrugëve",
    priority: "E lartë",
    aiConfidence: 72,
    status: "NE_SHQYRTIM",
    photoUrl: "https://picsum.photos/seed/gjk1015/800/500",
    aiSummary:
      "Mundësi e lartë për duplikat të GJK-1031. Lokacioni dhe kategoria përputhen.",
    aiSuggestion:
      "Verifikoni nëse është i njëjti problem dhe bashkojeni me GJK-1031 nëse konfirmohet.",
    citizenName: "Petrit Rama",
  },
  {
    id: "GJK-1008",
    title: "Raport i pavlefshëm",
    description: "Tekst i paqartë pa lokacion konkret dhe pa foto të problemit.",
    date: "2026-09-21",
    time: "12:00",
    location: "I papërcaktuar",
    coords: { lat: 42.3806, lng: 20.4312 },
    category: "Infrastrukturë",
    directorate: "Drejtoria e Shërbimeve Publike",
    sector: "Mirëmbajtja e rrugëve",
    priority: "E ulët",
    aiConfidence: 31,
    status: "REFUZUAR",
    photoUrl: "https://picsum.photos/seed/gjk1008/800/500",
    aiSummary:
      "Raporti nuk përmban të dhëna të mjaftueshme për identifikimin e problemit.",
    aiSuggestion: "Kërkoni informacion shtesë ose refuzoni raportin.",
    citizenName: "Qytetar anonim",
    rejectReason: "Mungon lokacioni dhe fotografia e problemit.",
  },
];

export const mockNotifications = [
  {
    id: "n1",
    text: "3 raporte të reja presin shqyrtim",
    time: "2 min më parë",
    unread: true,
  },
  {
    id: "n2",
    text: "GJK-1042 ka prioritet kritik",
    time: "18 min më parë",
    unread: true,
  },
  {
    id: "n3",
    text: "GJK-1028 u dërgua te drejtoria",
    time: "1 orë më parë",
    unread: false,
  },
];
