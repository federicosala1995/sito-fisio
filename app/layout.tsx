import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AiChatWidget } from "@/components/AiChatWidget";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Federico — Fisioterapista a Castrezzato, Franciacorta",
    template: "%s | Federico Fisioterapista",
  },
  description:
    "Fisioterapista a Castrezzato (BS), zona Franciacorta. Riabilitazione ortopedica, terapia manuale e recupero sportivo. Prenota online.",
  keywords: [
    "fisioterapista Castrezzato",
    "fisioterapista Franciacorta",
    "fisioterapia Brescia",
    "riabilitazione ortopedica",
    "recupero sportivo",
    "terapia manuale",
    "prenota fisioterapista online",
  ],
  authors: [{ name: "Federico — Fisioterapista" }],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Federico Fisioterapista",
    title: "Federico — Fisioterapista a Castrezzato, Franciacorta",
    description:
      "Riabilitazione ortopedica, terapia manuale e recupero sportivo. Prenota la tua seduta online.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-inter antialiased bg-white text-navy">
        {children}
        <AiChatWidget />
      </body>
    </html>
  );
}
