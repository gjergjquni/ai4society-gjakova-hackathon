import {
  DEFAULT_LOCALE,
  LOCALE_OPTIONS,
  type Locale,
} from "@/lib/i18n";
import type { DirectorateId } from "@/lib/directorates";
import type {
  DirectorateReportStatus,
  PriorityLevel,
  ReportStatus,
} from "@/lib/arkivist-types";

export { DEFAULT_LOCALE, LOCALE_OPTIONS, type Locale };

export type AdminMessages = {
  brand: string;
  arkivistPanel: string;
  municipality: string;
  republic: string;
  closeMenu: string;
  openMenu: string;
  searchPlaceholder: string;
  notifications: string;
  profile: string;
  logout: string;
  session: string;

  navDashboard: string;
  navReports: string;
  navInReview: string;
  navApproved: string;
  navRejected: string;
  navStats: string;
  navPanel: string;
  navNew: string;
  navInProgress: string;
  navResolved: string;

  pageDashboardTitle: string;
  pageDashboardDesc: string;
  pageReportsTitle: string;
  pageReportsDesc: string;
  pageInReviewTitle: string;
  pageInReviewDesc: string;
  pageApprovedTitle: string;
  pageApprovedDesc: string;
  pageRejectedTitle: string;
  pageRejectedDesc: string;
  pageStatsTitle: string;
  pageStatsDesc: string;
  pageReviewTitle: string;

  statNewReports: string;
  statInReview: string;
  statApproved: string;
  statHighPriority: string;
  statTotal: string;
  statRejected: string;
  statNewToday: string;
  statNew: string;
  statInProgress: string;
  statResolved: string;

  reviewQueueTitle: string;
  reviewQueueDesc: string;
  viewAll: string;
  reportsCount: (n: number) => string;

  colId: string;
  colProblem: string;
  colLocation: string;
  colCategory: string;
  colDirectorate: string;
  colPriority: string;
  colAi: string;
  colStatus: string;
  colTitleCategory: string;
  colDateTime: string;
  actionReview: string;
  actionOpenDetails: string;

  filterStatus: string;
  filterPriority: string;
  filterCategory: string;
  filterAll: string;

  emptySearchTitle: string;
  emptySearchDesc: string;
  emptyReviewTitle: string;
  emptyReviewDesc: string;
  emptyApprovedTitle: string;
  emptyApprovedDesc: string;
  emptyRejectedTitle: string;
  emptyRejectedDesc: string;
  emptyDefaultTitle: string;
  emptyDefaultDesc: string;
  emptyDirectorateTitle: string;
  emptyDirectorateDesc: string;

  backToList: string;
  citizenDescription: string;
  note: string;
  photo: string;
  location: string;
  aiAnalysis: string;
  aiAnalysisHint: string;
  confidence: string;
  category: string;
  recommendedDirectorate: string;
  sector: string;
  priority: string;
  problemSummary: string;
  rejectReason: string;
  mergedWith: (id: string) => string;

  approveSend: string;
  changeClassification: string;
  mergeWithExisting: string;
  rejectReport: string;

  approveDialogTitle: string;
  approveDialogDesc: (
    id: string,
    directorate: string,
    priority: string,
  ) => string;
  confirmSend: string;
  cancel: string;
  editDialogTitle: string;
  editDialogDesc: string;
  saveChanges: string;
  rejectDialogTitle: string;
  rejectDialogDesc: string;
  rejectPlaceholder: string;
  reject: string;
  mergeDialogTitle: string;
  mergeDialogDesc: string;
  primaryReport: string;
  choose: string;
  merge: string;
  photoOf: (id: string) => string;

  successApproved: string;
  successClassification: string;
  successRejected: string;
  successMerged: (id: string) => string;

  timeline: string[];
  directorateTimeline: string[];

  statusLabels: Record<ReportStatus, string>;
  dirStatusLabels: Record<DirectorateReportStatus, string>;
  priorityLabels: Record<PriorityLevel, string>;
  directorateNames: Record<DirectorateId, string>;
  directorateDesc: string;
  isolationNote: string;
  official: string;
  director: string;
  byCategory: string;
  verifiedBy: string;
  acceptReport: string;
  markResolved: string;
  resolveDialogTitle: string;
  resolveDialogDesc: string;
  workDescription: string;
  workPlaceholder: string;
  photoBefore: string;
  photoAfter: string;
  choosePhoto: string;
  changePhoto: string;
  removePhoto: string;
  completionDate: string;
  saveResolution: string;
  resolvedBanner: string;
  completed: string;
  before: string;
  after: string;
  archiveState: (state: string) => string;
  verified: string;
  closed: string;
  notFoundTitle: string;
  notFoundDesc: (routeId: string) => string;
  panelTitle: string;
  allReports: string;
  allReportsDesc: string;
  successAccepted: string;
  successResolved: string;
};

const directorateNamesSq: Record<DirectorateId, string> = {
  ADM: "Drejtoria e Administratës",
  FIN: "Drejtoria për Buxhet dhe Financa",
  SHP: "Drejtoria për Shërbime Publike",
  INF: "Drejtoria për Infrastrukturë",
  SHS: "Drejtoria për Shëndetësi dhe Mirëqenie Sociale",
  ARS: "Drejtoria për Arsim",
  KRS: "Drejtoria për Kulturë, Rini dhe Sport",
  ZHE: "Drejtoria për Zhvillim Ekonomik",
  URB: "Drejtoria për Urbanizëm dhe Mbrojtje të Mjedisit",
  BUJ: "Drejtoria për Bujqësi, Pylltari dhe Zhvillim Rural",
  KAD: "Drejtoria për Gjeodezi, Kadastër dhe Pronë",
  MSH: "Drejtoria për Mbrojtje dhe Shpëtim",
  INS: "Drejtoria për Inspektime",
};

const directorateNamesEn: Record<DirectorateId, string> = {
  ADM: "Directorate of Administration",
  FIN: "Directorate for Budget and Finance",
  SHP: "Directorate for Public Services",
  INF: "Directorate for Infrastructure",
  SHS: "Directorate for Health and Social Welfare",
  ARS: "Directorate for Education",
  KRS: "Directorate for Culture, Youth and Sport",
  ZHE: "Directorate for Economic Development",
  URB: "Directorate for Urbanism and Environmental Protection",
  BUJ: "Directorate for Agriculture, Forestry and Rural Development",
  KAD: "Directorate for Geodesy, Cadastre and Property",
  MSH: "Directorate for Protection and Rescue",
  INS: "Directorate for Inspections",
};

const directorateNamesSr: Record<DirectorateId, string> = {
  ADM: "Direktorijat za administraciju",
  FIN: "Direktorijat za budžet i finansije",
  SHP: "Direktorijat za javne službe",
  INF: "Direktorijat za infrastrukturu",
  SHS: "Direktorijat za zdravstvo i socijalnu zaštitu",
  ARS: "Direktorijat za obrazovanje",
  KRS: "Direktorijat za kulturu, omladinu i sport",
  ZHE: "Direktorijat za ekonomski razvoj",
  URB: "Direktorijat za urbanizam i zaštitu životne sredine",
  BUJ: "Direktorijat za poljoprivredu, šumarstvo i ruralni razvoj",
  KAD: "Direktorijat za geodeziju, katastar i imovinu",
  MSH: "Direktorijat za zaštitu i spasavanje",
  INS: "Direktorijat za inspekcije",
};

const statusSq: Record<ReportStatus, string> = {
  SUBMITTED: "Raportuar",
  AI_ANALYZED: "Analizuar nga AI",
  NE_SHQYRTIM: "Në shqyrtim",
  APROVUAR: "Aprovuar",
  DERGUAR_TE_DREJTORIA: "Te drejtoria",
  REFUZUAR: "Refuzuar",
  BASHKUAR: "Bashkuar",
};

const statusEn: Record<ReportStatus, string> = {
  SUBMITTED: "Submitted",
  AI_ANALYZED: "AI analyzed",
  NE_SHQYRTIM: "Under review",
  APROVUAR: "Approved",
  DERGUAR_TE_DREJTORIA: "Sent to directorate",
  REFUZUAR: "Rejected",
  BASHKUAR: "Merged",
};

const statusSr: Record<ReportStatus, string> = {
  SUBMITTED: "Prijavljeno",
  AI_ANALYZED: "Analizirano AI",
  NE_SHQYRTIM: "Na razmatranju",
  APROVUAR: "Odobreno",
  DERGUAR_TE_DREJTORIA: "Kod direktorijata",
  REFUZUAR: "Odbijeno",
  BASHKUAR: "Spojeno",
};

const dirStatusSq: Record<DirectorateReportStatus, string> = {
  NEW: "I ri",
  ACCEPTED: "I pranuar",
  IN_PROGRESS: "Në proces",
  RESOLVED: "I zgjidhur",
  VERIFIED: "I verifikuar",
  CLOSED: "I mbyllur",
};

const dirStatusEn: Record<DirectorateReportStatus, string> = {
  NEW: "New",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  VERIFIED: "Verified",
  CLOSED: "Closed",
};

const dirStatusSr: Record<DirectorateReportStatus, string> = {
  NEW: "Novo",
  ACCEPTED: "Prihvaćeno",
  IN_PROGRESS: "U toku",
  RESOLVED: "Rešeno",
  VERIFIED: "Verifikovano",
  CLOSED: "Zatvoreno",
};

const prioritySq: Record<PriorityLevel, string> = {
  Kritike: "Kritike",
  "E lartë": "E lartë",
  Mesatare: "Mesatare",
  "E ulët": "E ulët",
};

const priorityEn: Record<PriorityLevel, string> = {
  Kritike: "Critical",
  "E lartë": "High",
  Mesatare: "Medium",
  "E ulët": "Low",
};

const prioritySr: Record<PriorityLevel, string> = {
  Kritike: "Kritično",
  "E lartë": "Visok",
  Mesatare: "Srednji",
  "E ulët": "Nizak",
};

const sq: AdminMessages = {
  brand: "ReagoGjakovë",
  arkivistPanel: "Paneli i Arkivistit",
  municipality: "Komuna e Gjakovës",
  republic: "Republika e Kosovës",
  closeMenu: "Mbyll menynë",
  openMenu: "Hap menynë",
  searchPlaceholder: "Kërko ID, problem, rrugë…",
  notifications: "Njoftimet",
  profile: "Profili",
  logout: "Dil",
  session: "Sesioni",

  navDashboard: "Dashboard",
  navReports: "Raportet",
  navInReview: "Në shqyrtim",
  navApproved: "Të aprovuara",
  navRejected: "Të refuzuara",
  navStats: "Statistikat",
  navPanel: "Paneli",
  navNew: "Të reja",
  navInProgress: "Në proces",
  navResolved: "Të zgjidhura",

  pageDashboardTitle: "Dashboard",
  pageDashboardDesc: "Përmbledhje e përditshme e radhës së shqyrtimit",
  pageReportsTitle: "Raportet",
  pageReportsDesc: "Të gjitha raportet e qytetarëve në sistem",
  pageInReviewTitle: "Në shqyrtim",
  pageInReviewDesc: "Raporte që presin verifikim nga arkivisti",
  pageApprovedTitle: "Të aprovuara",
  pageApprovedDesc: "Raporte të dërguara te drejtoritë komunale",
  pageRejectedTitle: "Të refuzuara",
  pageRejectedDesc: "Raporte të refuzuara ose të bashkuara",
  pageStatsTitle: "Statistikat",
  pageStatsDesc: "Ngarkesa dhe shpërndarja e raporteve",
  pageReviewTitle: "Shqyrtimi i raportit",

  statNewReports: "Raporte të reja",
  statInReview: "Në shqyrtim",
  statApproved: "Të aprovuara",
  statHighPriority: "Prioritet i lartë",
  statTotal: "Totali",
  statRejected: "Të refuzuara",
  statNewToday: "Të reja sot",
  statNew: "Raporte të reja",
  statInProgress: "Në proces",
  statResolved: "Të zgjidhura",

  reviewQueueTitle: "Raporte për shqyrtim",
  reviewQueueDesc: "Verifikoni klasifikimin e AI para dërgimit te drejtoria",
  viewAll: "Shiko të gjitha",
  reportsCount: (n) => `${n} raporte`,

  colId: "ID",
  colProblem: "Problem",
  colLocation: "Lokacion",
  colCategory: "Kategoria",
  colDirectorate: "Drejtoria",
  colPriority: "Prioriteti",
  colAi: "AI",
  colStatus: "Statusi",
  colTitleCategory: "Titulli & Kategoria",
  colDateTime: "Data/Ora",
  actionReview: "Shqyrto",
  actionOpenDetails: "Hap detajet",

  filterStatus: "Statusi",
  filterPriority: "Prioriteti",
  filterCategory: "Kategoria",
  filterAll: "Të gjitha",

  emptySearchTitle: "Asnjë rezultat",
  emptySearchDesc:
    "Nuk u gjet asnjë raport që përputhet me kërkimin tuaj. Provoni një term tjetër.",
  emptyReviewTitle: "Nuk ka raporte për shqyrtim",
  emptyReviewDesc:
    "Të gjitha raportet e reja janë trajtuar. Radha e shqyrtimit është e lirë.",
  emptyApprovedTitle: "Nuk ka raporte të aprovuara",
  emptyApprovedDesc:
    "Raportet e aprovuara dhe të dërguara te drejtoritë do të shfaqen këtu.",
  emptyRejectedTitle: "Nuk ka raporte të refuzuara",
  emptyRejectedDesc:
    "Raportet e refuzuara ose të bashkuara do të shfaqen në këtë listë.",
  emptyDefaultTitle: "Nuk ka raporte",
  emptyDefaultDesc: "Nuk ka raporte për t'u shfaqur në këtë pamje.",
  emptyDirectorateTitle: "Nuk ka raporte për këtë drejtori",
  emptyDirectorateDesc: "Raportet e dërguara te kjo drejtori do të shfaqen këtu.",

  backToList: "Kthehu te lista",
  citizenDescription: "Përshkrimi i qytetarit",
  note: "Shënim",
  photo: "Fotografia",
  location: "Vendndodhja",
  aiAnalysis: "Klasifikimi",
  aiAnalysisHint: "Verifikoni dhe korrigjoni klasifikimin para aprovimit",
  confidence: "Besueshmëria",
  category: "Kategoria",
  recommendedDirectorate: "Drejtoria përgjegjëse",
  sector: "Sektori",
  priority: "Prioriteti",
  problemSummary: "Përmbledhja e problemit",
  rejectReason: "Arsyeja e refuzimit",
  mergedWith: (id) => `Bashkuar me ${id}`,

  approveSend: "Aprovo dhe dërgo te drejtoria",
  changeClassification: "Ndrysho klasifikimin",
  mergeWithExisting: "Bashko me raport ekzistues",
  rejectReport: "Refuzo raportin",

  approveDialogTitle: "Aprovo dhe dërgo te drejtoria",
  approveDialogDesc: (id, directorate, priority) =>
    `Konfirmoni dërgimin e raportit ${id} te ${directorate} me prioritet ${priority}.`,
  confirmSend: "Konfirmo dërgimin",
  cancel: "Anulo",
  editDialogTitle: "Ndrysho klasifikimin",
  editDialogDesc: "Korrigjoni kategorinë, drejtorinë ose sektorin.",
  saveChanges: "Ruaj ndryshimet",
  rejectDialogTitle: "Refuzo raportin",
  rejectDialogDesc:
    'Shkruani arsyen (p.sh. "Jashtë juridiksionit komunal", "Foto e paqartë").',
  rejectPlaceholder: "Arsyeja e refuzimit...",
  reject: "Refuzo",
  mergeDialogTitle: "Bashko me raport ekzistues",
  mergeDialogDesc:
    "Zgjidhni ID-në e raportit kryesor (GJK-XXXX) për të bashkuar duplikatet.",
  primaryReport: "Raporti kryesor",
  choose: "Zgjidhni...",
  merge: "Bashko",
  photoOf: (id) => `Foto e raportit ${id}`,

  successApproved: "Raporti u aprovua dhe u dërgua te drejtoria përkatëse.",
  successClassification:
    "Klasifikimi u përditësua. Mund të aprovoni raportin.",
  successRejected: "Raporti u refuzua me arsye.",
  successMerged: (id) => `Raporti u bashkua me ${id}.`,

  timeline: [
    "Raportuar",
    "Analizuar nga AI",
    "Në shqyrtim",
    "Drejtoria",
    "Në proces",
    "Zgjidhur",
  ],
  directorateTimeline: [
    "Raportuar",
    "Analizuar nga AI",
    "Verifikuar nga Arkivisti",
    "Dërguar te Drejtoria",
    "Në proces",
    "Zgjidhur",
    "Verifikuar",
    "Mbyllur",
  ],

  statusLabels: statusSq,
  dirStatusLabels: dirStatusSq,
  priorityLabels: prioritySq,
  directorateNames: directorateNamesSq,
  directorateDesc:
    "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  isolationNote:
    "Paneli është i izoluar për këtë drejtori. Nuk ka ndërrues drejtorish.",
  official: "Zyrtar",
  director: "Drejtori",
  byCategory: "Sipas kategorisë",
  verifiedBy: "Verifikuar nga",
  acceptReport: "Prano raportin",
  markResolved: "Shëno si të zgjidhur",
  resolveDialogTitle: "Shëno si të zgjidhur",
  resolveDialogDesc:
    "Dokumentoni punën e kryer me përshkrim dhe foto para/pas.",
  workDescription: "Përshkrimi i punës së kryer *",
  workPlaceholder: "P.sh. Gropa u mbush me asfalt dhe u rrafshua.",
  photoBefore: "Foto para ndërhyrjes",
  photoAfter: "Foto pas përfundimit",
  choosePhoto: "Ngarko foto",
  changePhoto: "Ndrysho foton",
  removePhoto: "Hiq",
  completionDate: "Data e përfundimit",
  saveResolution: "Ruaj zgjidhjen",
  resolvedBanner:
    "Raporti është shënuar si i zgjidhur dhe pret verifikimin përfundimtar nga Arkivisti.",
  completed: "Përfunduar",
  before: "Para",
  after: "Pas",
  archiveState: (state) =>
    `Raporti është në gjendje arkive (${state}). Vetëm lexim.`,
  verified: "i verifikuar",
  closed: "i mbyllur",
  notFoundTitle: "Drejtoria nuk u gjet.",
  notFoundDesc: (routeId) =>
    `Rruga /drejtoria/${routeId} nuk korrespondon me asnjë drejtori komunale (1–13).`,
  panelTitle: "Paneli i drejtorisë",
  allReports: "Të gjitha raportet",
  allReportsDesc: "Lista e raporteve të dërguara te kjo drejtori",
  successAccepted: "Raporti u pranua dhe është në proces.",
  successResolved:
    "Raporti u shënua si i zgjidhur dhe pret verifikimin e Arkivistit.",
};

const en: AdminMessages = {
  ...sq,
  brand: "ReagoGjakovë",
  arkivistPanel: "Archivist Panel",
  municipality: "Municipality of Gjakova",
  republic: "Republic of Kosovo",
  closeMenu: "Close menu",
  openMenu: "Open menu",
  searchPlaceholder: "Search ID, issue, street…",
  notifications: "Notifications",
  profile: "Profile",
  logout: "Sign out",
  session: "Session",

  navDashboard: "Dashboard",
  navReports: "Reports",
  navInReview: "Under review",
  navApproved: "Approved",
  navRejected: "Rejected",
  navStats: "Statistics",
  navPanel: "Panel",
  navNew: "New",
  navInProgress: "In progress",
  navResolved: "Resolved",

  pageDashboardTitle: "Dashboard",
  pageDashboardDesc: "Daily overview of the review queue",
  pageReportsTitle: "Reports",
  pageReportsDesc: "All citizen reports in the system",
  pageInReviewTitle: "Under review",
  pageInReviewDesc: "Reports waiting for archivist verification",
  pageApprovedTitle: "Approved",
  pageApprovedDesc: "Reports forwarded to municipal directorates",
  pageRejectedTitle: "Rejected",
  pageRejectedDesc: "Rejected or merged reports",
  pageStatsTitle: "Statistics",
  pageStatsDesc: "Workload and report distribution",
  pageReviewTitle: "Report review",

  statNewReports: "New reports",
  statInReview: "Under review",
  statApproved: "Approved",
  statHighPriority: "High priority",
  statTotal: "Total",
  statRejected: "Rejected",
  statNewToday: "New today",
  statNew: "New reports",
  statInProgress: "In progress",
  statResolved: "Resolved",

  reviewQueueTitle: "Reports for review",
  reviewQueueDesc: "Verify the AI classification before sending to the directorate",
  viewAll: "View all",
  reportsCount: (n) => `${n} reports`,

  colProblem: "Issue",
  colLocation: "Location",
  colCategory: "Category",
  colDirectorate: "Directorate",
  colPriority: "Priority",
  colStatus: "Status",
  colTitleCategory: "Title & category",
  colDateTime: "Date/Time",
  actionReview: "Review",
  actionOpenDetails: "Open details",

  filterStatus: "Status",
  filterPriority: "Priority",
  filterCategory: "Category",
  filterAll: "All",

  emptySearchTitle: "No results",
  emptySearchDesc:
    "No reports match your search. Try a different term.",
  emptyReviewTitle: "No reports to review",
  emptyReviewDesc:
    "All new reports have been handled. The review queue is clear.",
  emptyApprovedTitle: "No approved reports",
  emptyApprovedDesc:
    "Approved reports forwarded to directorates will appear here.",
  emptyRejectedTitle: "No rejected reports",
  emptyRejectedDesc:
    "Rejected or merged reports will appear in this list.",
  emptyDefaultTitle: "No reports",
  emptyDefaultDesc: "There are no reports to show in this view.",
  emptyDirectorateTitle: "No reports for this directorate",
  emptyDirectorateDesc:
    "Reports sent to this directorate will appear here.",

  backToList: "Back to list",
  citizenDescription: "Citizen description",
  note: "Note",
  photo: "Photo",
  location: "Location",
  aiAnalysis: "Classification",
  aiAnalysisHint: "Verify and correct the classification before approving",
  confidence: "Confidence",
  category: "Category",
  recommendedDirectorate: "Responsible directorate",
  sector: "Sector",
  priority: "Priority",
  problemSummary: "Problem summary",
  rejectReason: "Rejection reason",
  mergedWith: (id) => `Merged with ${id}`,

  approveSend: "Approve and send to directorate",
  changeClassification: "Change classification",
  mergeWithExisting: "Merge with existing report",
  rejectReport: "Reject report",

  approveDialogTitle: "Approve and send to directorate",
  approveDialogDesc: (id, directorate, priority) =>
    `Confirm sending report ${id} to ${directorate} with priority ${priority}.`,
  confirmSend: "Confirm send",
  cancel: "Cancel",
  editDialogTitle: "Change classification",
  editDialogDesc: "Correct the category, directorate, or sector.",
  saveChanges: "Save changes",
  rejectDialogTitle: "Reject report",
  rejectDialogDesc:
    'Enter a reason (e.g. "Outside municipal jurisdiction", "Unclear photo").',
  rejectPlaceholder: "Rejection reason...",
  reject: "Reject",
  mergeDialogTitle: "Merge with existing report",
  mergeDialogDesc:
    "Select the primary report ID (GJK-XXXX) to merge duplicates.",
  primaryReport: "Primary report",
  choose: "Choose...",
  merge: "Merge",
  photoOf: (id) => `Photo of report ${id}`,

  successApproved: "The report was approved and sent to the directorate.",
  successClassification:
    "Classification updated. You can now approve the report.",
  successRejected: "The report was rejected with a reason.",
  successMerged: (id) => `The report was merged with ${id}.`,

  timeline: [
    "Submitted",
    "AI analyzed",
    "Under review",
    "Directorate",
    "In progress",
    "Resolved",
  ],
  directorateTimeline: [
    "Submitted",
    "AI analyzed",
    "Verified by Archivist",
    "Sent to Directorate",
    "In progress",
    "Resolved",
    "Verified",
    "Closed",
  ],

  statusLabels: statusEn,
  dirStatusLabels: dirStatusEn,
  priorityLabels: priorityEn,
  directorateNames: directorateNamesEn,
  directorateDesc: "Manage and process reports assigned to your directorate.",
  isolationNote:
    "This panel is isolated to this directorate. There is no directorate switcher.",
  official: "Officer",
  director: "Directorate",
  byCategory: "By category",
  verifiedBy: "Verified by",
  acceptReport: "Accept report",
  markResolved: "Mark as resolved",
  resolveDialogTitle: "Mark as resolved",
  resolveDialogDesc:
    "Document the work completed with a description and before/after photos.",
  workDescription: "Description of work completed *",
  workPlaceholder: "E.g. The pothole was filled with asphalt and leveled.",
  photoBefore: "Photo before intervention",
  photoAfter: "Photo after completion",
  choosePhoto: "Upload photo",
  changePhoto: "Change photo",
  removePhoto: "Remove",
  completionDate: "Completion date",
  saveResolution: "Save resolution",
  resolvedBanner:
    "The report is marked as resolved and awaits final verification by the Archivist.",
  completed: "Completed",
  before: "Before",
  after: "After",
  archiveState: (state) =>
    `The report is in archive state (${state}). Read-only.`,
  verified: "verified",
  closed: "closed",
  notFoundTitle: "Directorate not found.",
  notFoundDesc: (routeId) =>
    `The path /drejtoria/${routeId} does not match any municipal directorate (1–13).`,
  panelTitle: "Directorate panel",
  allReports: "All reports",
  allReportsDesc: "List of reports sent to this directorate",
  successAccepted: "The report was accepted and is now in progress.",
  successResolved:
    "The report was marked as resolved and awaits Archivist verification.",
};

const sr: AdminMessages = {
  ...sq,
  brand: "ReagoGjakovë",
  arkivistPanel: "Panel arhiviste",
  municipality: "Opština Đakovica",
  republic: "Republika Kosovo",
  closeMenu: "Zatvori meni",
  openMenu: "Otvori meni",
  searchPlaceholder: "Pretraži ID, problem, ulicu…",
  notifications: "Obaveštenja",
  profile: "Profil",
  logout: "Odjavi se",
  session: "Sesija",

  navDashboard: "Kontrolna tabla",
  navReports: "Prijave",
  navInReview: "Na razmatranju",
  navApproved: "Odobreno",
  navRejected: "Odbijeno",
  navStats: "Statistika",
  navPanel: "Panel",
  navNew: "Nove",
  navInProgress: "U toku",
  navResolved: "Rešeno",

  pageDashboardTitle: "Kontrolna tabla",
  pageDashboardDesc: "Dnevni pregled reda za razmatranje",
  pageReportsTitle: "Prijave",
  pageReportsDesc: "Sve građanske prijave u sistemu",
  pageInReviewTitle: "Na razmatranju",
  pageInReviewDesc: "Prijave koje čekaju verifikaciju arhiviste",
  pageApprovedTitle: "Odobreno",
  pageApprovedDesc: "Prijave prosleđene opštinskim direktorijatima",
  pageRejectedTitle: "Odbijeno",
  pageRejectedDesc: "Odbijene ili spojene prijave",
  pageStatsTitle: "Statistika",
  pageStatsDesc: "Opterećenje i raspodela prijava",
  pageReviewTitle: "Razmatranje prijave",

  statNewReports: "Nove prijave",
  statInReview: "Na razmatranju",
  statApproved: "Odobreno",
  statHighPriority: "Visok prioritet",
  statTotal: "Ukupno",
  statRejected: "Odbijeno",
  statNewToday: "Nove danas",
  statNew: "Nove prijave",
  statInProgress: "U toku",
  statResolved: "Rešeno",

  reviewQueueTitle: "Prijave za razmatranje",
  reviewQueueDesc:
    "Verifikujte AI klasifikaciju pre slanja direktorijatu",
  viewAll: "Prikaži sve",
  reportsCount: (n) => `${n} prijava`,

  colProblem: "Problem",
  colLocation: "Lokacija",
  colCategory: "Kategorija",
  colDirectorate: "Direktorijat",
  colPriority: "Prioritet",
  colStatus: "Status",
  colTitleCategory: "Naslov i kategorija",
  colDateTime: "Datum/Vreme",
  actionReview: "Razmotri",
  actionOpenDetails: "Otvori detalje",

  filterStatus: "Status",
  filterPriority: "Prioritet",
  filterCategory: "Kategorija",
  filterAll: "Sve",

  emptySearchTitle: "Nema rezultata",
  emptySearchDesc:
    "Nijedna prijava ne odgovara pretrazi. Pokušajte drugi pojam.",
  emptyReviewTitle: "Nema prijava za razmatranje",
  emptyReviewDesc:
    "Sve nove prijave su obrađene. Red za razmatranje je prazan.",
  emptyApprovedTitle: "Nema odobrenih prijava",
  emptyApprovedDesc:
    "Odobrene prijave prosleđene direktorijatima pojaviće se ovde.",
  emptyRejectedTitle: "Nema odbijenih prijava",
  emptyRejectedDesc:
    "Odbijene ili spojene prijave pojaviće se na ovoj listi.",
  emptyDefaultTitle: "Nema prijava",
  emptyDefaultDesc: "Nema prijava za prikaz u ovom pogledu.",
  emptyDirectorateTitle: "Nema prijava za ovaj direktorijat",
  emptyDirectorateDesc:
    "Prijave poslate ovom direktorijatu pojaviće se ovde.",

  backToList: "Nazad na listu",
  citizenDescription: "Opis građanina",
  note: "Beleška",
  photo: "Fotografija",
  location: "Lokacija",
  aiAnalysis: "Klasifikacija",
  aiAnalysisHint: "Verifikujte i ispravite klasifikaciju pre odobrenja",
  confidence: "Pouzdanost",
  category: "Kategorija",
  recommendedDirectorate: "Nadležni direktorijat",
  sector: "Sektor",
  priority: "Prioritet",
  problemSummary: "Rezime problema",
  rejectReason: "Razlog odbijanja",
  mergedWith: (id) => `Spojeno sa ${id}`,

  approveSend: "Odobri i pošalji direktorijatu",
  changeClassification: "Izmeni klasifikaciju",
  mergeWithExisting: "Spoji sa postojećom prijavom",
  rejectReport: "Odbij prijavu",

  approveDialogTitle: "Odobri i pošalji direktorijatu",
  approveDialogDesc: (id, directorate, priority) =>
    `Potvrdite slanje prijave ${id} direktorijatu ${directorate} sa prioritetom ${priority}.`,
  confirmSend: "Potvrdi slanje",
  cancel: "Otkaži",
  editDialogTitle: "Izmeni klasifikaciju",
  editDialogDesc: "Ispravite kategoriju, direktorijat ili sektor.",
  saveChanges: "Sačuvaj izmene",
  rejectDialogTitle: "Odbij prijavu",
  rejectDialogDesc:
    'Unesite razlog (npr. "Van opštinske nadležnosti", "Nejasna fotografija").',
  rejectPlaceholder: "Razlog odbijanja...",
  reject: "Odbij",
  mergeDialogTitle: "Spoji sa postojećom prijavom",
  mergeDialogDesc:
    "Izaberite ID glavne prijave (GJK-XXXX) da spojite duplikate.",
  primaryReport: "Glavna prijava",
  choose: "Izaberite...",
  merge: "Spoji",
  photoOf: (id) => `Fotografija prijave ${id}`,

  successApproved: "Prijava je odobrena i poslata direktorijatu.",
  successClassification:
    "Klasifikacija je ažurirana. Možete odobriti prijavu.",
  successRejected: "Prijava je odbijena sa razlogom.",
  successMerged: (id) => `Prijava je spojena sa ${id}.`,

  timeline: [
    "Prijavljeno",
    "Analizirano AI",
    "Na razmatranju",
    "Direktorijat",
    "U toku",
    "Rešeno",
  ],
  directorateTimeline: [
    "Prijavljeno",
    "Analizirano AI",
    "Verifikovano od arhiviste",
    "Poslato direktorijatu",
    "U toku",
    "Rešeno",
    "Verifikovano",
    "Zatvoreno",
  ],

  statusLabels: statusSr,
  dirStatusLabels: dirStatusSr,
  priorityLabels: prioritySr,
  directorateNames: directorateNamesSr,
  directorateDesc:
    "Upravljajte i obrađujte prijave dodeljene vašem direktorijatu.",
  isolationNote:
    "Panel je izolovan za ovaj direktorijat. Nema prebacivača direktorijata.",
  official: "Službenik",
  director: "Direktorijat",
  byCategory: "Po kategoriji",
  verifiedBy: "Verifikovao/la",
  acceptReport: "Prihvati prijavu",
  markResolved: "Označi kao rešeno",
  resolveDialogTitle: "Označi kao rešeno",
  resolveDialogDesc:
    "Dokumentujte obavljeni rad opisom i fotografijama pre/posle.",
  workDescription: "Opis obavljenog rada *",
  workPlaceholder: "Npr. Rupa je popunjena asfaltom i izravnata.",
  photoBefore: "Fotografija pre intervencije",
  photoAfter: "Fotografija posle završetka",
  choosePhoto: "Otpremi fotografiju",
  changePhoto: "Promeni fotografiju",
  removePhoto: "Ukloni",
  completionDate: "Datum završetka",
  saveResolution: "Sačuvaj rešenje",
  resolvedBanner:
    "Prijava je označena kao rešena i čeka konačnu verifikaciju arhiviste.",
  completed: "Završeno",
  before: "Pre",
  after: "Posle",
  archiveState: (state) =>
    `Prijava je u arhivskom stanju (${state}). Samo čitanje.`,
  verified: "verifikovano",
  closed: "zatvoreno",
  notFoundTitle: "Direktorijat nije pronađen.",
  notFoundDesc: (routeId) =>
    `Putanja /drejtoria/${routeId} ne odgovara nijednom opštinskom direktorijatu (1–13).`,
  panelTitle: "Panel direktorijata",
  allReports: "Sve prijave",
  allReportsDesc: "Lista prijava poslatih ovom direktorijatu",
  successAccepted: "Prijava je prihvaćena i sada je u toku.",
  successResolved:
    "Prijava je označena kao rešena i čeka verifikaciju arhiviste.",
};

export const adminMessages: Record<Locale, AdminMessages> = { sq, en, sr };

export function getAdminMessages(locale: Locale): AdminMessages {
  return adminMessages[locale] ?? adminMessages.sq;
}

export const LOCALE_STORAGE_KEY = "reagigjakove-locale";
