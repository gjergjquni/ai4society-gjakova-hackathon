export type DirectorateId =
  | "ADM"
  | "FIN"
  | "SHP"
  | "INF"
  | "SHS"
  | "ARS"
  | "KRS"
  | "ZHE"
  | "URB"
  | "BUJ"
  | "KAD"
  | "MSH"
  | "INS";

export interface Directorate {
  id: DirectorateId;
  routeId: number;
  name: string;
  description: string;
}

export const DIRECTORATES: Directorate[] = [
  {
    id: "ADM",
    routeId: 1,
    name: "Drejtoria e Administratës",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "FIN",
    routeId: 2,
    name: "Drejtoria për Buxhet dhe Financa",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "SHP",
    routeId: 3,
    name: "Drejtoria për Shërbime Publike",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "INF",
    routeId: 4,
    name: "Drejtoria për Infrastrukturë",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "SHS",
    routeId: 5,
    name: "Drejtoria për Shëndetësi dhe Mirëqenie Sociale",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "ARS",
    routeId: 6,
    name: "Drejtoria për Arsim",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "KRS",
    routeId: 7,
    name: "Drejtoria për Kulturë, Rini dhe Sport",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "ZHE",
    routeId: 8,
    name: "Drejtoria për Zhvillim Ekonomik",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "URB",
    routeId: 9,
    name: "Drejtoria për Urbanizëm dhe Mbrojtje të Mjedisit",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "BUJ",
    routeId: 10,
    name: "Drejtoria për Bujqësi, Pylltari dhe Zhvillim Rural",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "KAD",
    routeId: 11,
    name: "Drejtoria për Gjeodezi, Kadastër dhe Pronë",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "MSH",
    routeId: 12,
    name: "Drejtoria për Mbrojtje dhe Shpëtim",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
  {
    id: "INS",
    routeId: 13,
    name: "Drejtoria për Inspektime",
    description:
      "Menaxhoni dhe trajtoni raportet e caktuara për drejtorinë tuaj.",
  },
];

export function getDirectorateByRouteId(
  routeId: number,
): Directorate | undefined {
  return DIRECTORATES.find((d) => d.routeId === routeId);
}

export function getDirectorateById(
  id: DirectorateId,
): Directorate | undefined {
  return DIRECTORATES.find((d) => d.id === id);
}

export const DIRECTORATE_TIMELINE = [
  "Raportuar",
  "Analizuar nga AI",
  "Verifikuar nga Arkivisti",
  "Dërguar te Drejtoria",
  "Në proces",
  "Zgjidhur",
  "Verifikuar",
  "Mbyllur",
] as const;

export type DirectorateTimelineStep = (typeof DIRECTORATE_TIMELINE)[number];
