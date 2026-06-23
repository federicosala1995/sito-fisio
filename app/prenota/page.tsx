import type { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { BookingCalendarAdvanced } from "@/components/booking/BookingCalendarAdvanced";
import { BookingQRCode } from "@/components/booking/BookingQRCode";
import { RomArc } from "@/components/ui/RomArc";

export const metadata: Metadata = {
  title: "Prenota online — Fisioterapista Federico Castrezzato",
  description:
    "Prenota la tua seduta di fisioterapia a Castrezzato (BS). Calendario real-time, promemoria automatici e check-in digitale.",
};

export default function PrenotaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24 bg-white">
        {/* Header */}
        <section className="relative overflow-hidden bg-navy py-20 mb-16">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none select-none">
            <RomArc size={400} animated={false} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-3">
              Prenota online
            </p>
            <h1 className="font-fraunces text-4xl md:text-5xl font-semibold text-white mb-4">
              Scegli il tuo appuntamento
            </h1>
            <p className="font-inter text-white/55 max-w-md mx-auto">
              Disponibilità aggiornata in tempo reale. Conferma immediata, promemoria automatico via email.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {["Conferma immediata", "Promemoria email", "Check-in digitale", "Annullamento facile"].map((f) => (
                <span key={f} className="rounded-full border border-white/15 px-3 py-1.5 font-inter text-xs text-white/60">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Layout: calendar + sidebar */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 max-w-5xl mx-auto">
            {/* Calendario avanzato */}
            <div>
              <BookingCalendarAdvanced />
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <BookingQRCode />

              <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
                <p className="font-inter text-xs text-navy/40 uppercase tracking-wide font-semibold">Info studio</p>
                <ul className="font-inter text-sm text-navy/60 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                    Castrezzato (BS), Franciacorta
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                    Lun–Sab, 9:00–19:00
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                    Durata seduta: 45 min
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                    Prima seduta: porta referti e lastre
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                    In caso di rinuncia: avvisa 24h prima
                  </li>
                </ul>
                <a
                  href="tel:+393454431758"
                  className="block mt-2 rounded-full bg-navy text-center py-2.5 font-inter text-sm font-semibold text-white hover:bg-navy/90 transition-all"
                >
                  +39 345 443 1758
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
