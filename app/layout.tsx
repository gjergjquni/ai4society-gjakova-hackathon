import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Komuna e Gjakovës",
  description:
    "Raportoni probleme komunale në Gjakovë — harta, prioriteti dhe agjentët e komunës.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#04408b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sq"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
