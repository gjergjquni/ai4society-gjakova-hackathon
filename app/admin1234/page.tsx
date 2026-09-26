import type { Metadata } from "next";
import ArkivistApp from "@/components/arkivist/arkivist-app";

export const metadata: Metadata = {
  title: "Arkivist · ReagoGjakovë · Komuna e Gjakovës",
  description:
    "Paneli i Arkivistit për verifikimin, korrigjimin dhe dërgimin e raporteve te drejtoria.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ArkivistAdminPage() {
  return <ArkivistApp />;
}
