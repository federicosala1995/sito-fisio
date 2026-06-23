"use client";

import { useRef, useEffect } from "react";
import { RomArc } from "@/components/ui/RomArc";

export function ChiSono() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.querySelectorAll<HTMLElement>(".chi-anim").forEach((e, i) => {
          setTimeout(() => {
            e.style.transition = "opacity 0.7s ease, transform 0.7s ease";
            e.style.opacity = "1";
            e.style.transform = "translateY(0)";
          }, i * 120);
        });
        observer.disconnect();
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
  }, []);

  return (
    <section className="py-28 bg-navy relative overflow-hidden" id="chi-sono">
      {/* Decorative arc */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
        <RomArc size={480} animated={false} />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Photo placeholder */}
          <div
            className="chi-anim relative"
            style={{ opacity: 0, transform: "translateY(24px)" }}
          >
            <div className="aspect-[3/4] max-w-sm mx-auto rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="font-inter text-xs text-white/30 text-center px-8">
                Inserisci qui la tua foto professionale
                <br />
                (consigliato: 600×800 px, sfondo neutro)
              </p>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-teal rounded-2xl px-5 py-3 shadow-xl shadow-teal/30 text-white whitespace-nowrap">
              <p className="font-inter text-xs text-white/70">Specializzato in</p>
              <p className="font-fraunces text-sm font-semibold">Recupero sportivo</p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6">
            <div className="chi-anim" style={{ opacity: 0, transform: "translateY(24px)" }}>
              <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-3">
                Chi sono
              </p>
              <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-white leading-tight">
                Federico,<br />fisioterapista.
              </h2>
            </div>

            <div className="chi-anim space-y-4" style={{ opacity: 0, transform: "translateY(24px)" }}>
              <p className="font-inter text-white/65 leading-relaxed">
                Sono un fisioterapista libero professionista con circa 3 anni di attività clinica,
                con sede a Castrezzato in provincia di Brescia, cuore della Franciacorta.
                Laureato in Fisioterapia e iscritto all&apos;Albo TSRM-PSTRP, mi occupo principalmente
                di riabilitazione ortopedica, terapia manuale e recupero sportivo.
              </p>
              <p className="font-inter text-white/65 leading-relaxed">
                Sono anche calciatore agonistico amatoriale: conosco dall&apos;interno le esigenze degli
                sportivi, le pressioni del campo e l&apos;importanza di un ritorno all&apos;attività
                <em> sicuro</em> e <em>progressivo</em>. Questo mi permette di impostare percorsi
                di recupero realmente su misura per chi fa sport a qualsiasi livello.
              </p>
              <p className="font-inter text-white/65 leading-relaxed">
                Il mio approccio è evidence-based: ogni scelta terapeutica si basa sulla letteratura
                scientifica aggiornata, integrata con l&apos;ascolto attivo del paziente e la valutazione
                funzionale individuale.
              </p>
            </div>

            {/* Formation placeholder */}
            <div
              className="chi-anim border-t border-white/10 pt-6 space-y-3"
              style={{ opacity: 0, transform: "translateY(24px)" }}
            >
              <p className="font-inter text-xs uppercase tracking-widest text-teal/70 font-semibold">
                Formazione
              </p>
              <div className="space-y-2">
                {[
                  "Laurea in Fisioterapia — [Università da inserire]",
                  "Iscrizione Albo TSRM-PSTRP — [Ordine provinciale]",
                  "[Corso di specializzazione da inserire]",
                  "[Altro titolo / certificazione]",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                    <p className="font-inter text-sm text-white/55">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
