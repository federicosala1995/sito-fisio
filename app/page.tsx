import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { Perche } from "@/components/sections/Perche";
import { Servizi } from "@/components/sections/Servizi";
import { ChiSono } from "@/components/sections/ChiSono";
import { Percorso } from "@/components/sections/Percorso";
import { Recensioni } from "@/components/sections/Recensioni";
import { Contatti } from "@/components/sections/Contatti";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Perche />
        <Servizi />
        <ChiSono />
        <Percorso />
        <Recensioni />

        {/* CTA prenotazione inline */}
        <section className="py-20 bg-white text-center">
          <div className="container mx-auto px-4 space-y-5">
            <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold">
              Pronto a iniziare?
            </p>
            <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-navy">
              Prenota la tua prima seduta
            </h2>
            <p className="font-inter text-navy/50 max-w-md mx-auto">
              Seleziona il giorno e l'orario direttamente online. Zero code d'attesa.
            </p>
            <Link
              href="/prenota"
              className="inline-flex items-center gap-2.5 rounded-full bg-teal px-8 py-4 font-inter text-base font-semibold text-white shadow-xl shadow-teal/30 transition-all hover:bg-teal-600 hover:shadow-teal/40 active:scale-95"
            >
              <CalendarCheck size={18} />
              Prenota online
            </Link>
          </div>
        </section>

        <Contatti />
      </main>
      <Footer />
    </>
  );
}
