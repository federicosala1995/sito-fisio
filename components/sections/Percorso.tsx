"use client";

import { useRef, useEffect } from "react";
import { ClipboardList, Stethoscope, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "1",
    title: "Valutazione",
    body: "Prima seduta dedicata all'anamnesi, alla valutazione posturale, funzionale e del movimento. Ascolto attivo e misurazione clinica (ROM, forza, test ortopedici). Definizione degli obiettivi insieme.",
    duration: "Prima seduta",
  },
  {
    icon: Stethoscope,
    step: "2",
    title: "Trattamento",
    body: "Sedute personalizzate con terapia manuale, esercizio terapeutico e tecniche specifiche. La progressione è calibrata sul tuo stato clinico, non su un protocollo rigido. Feedback costante.",
    duration: "Percorso attivo",
  },
  {
    icon: TrendingUp,
    step: "3",
    title: "Recupero e prevenzione",
    body: "Raggiunto l'obiettivo, costruiamo un piano di mantenimento e prevenzione degli infortuni. Esercizi autonomi, strategie quotidiane e follow-up programmato se necessario.",
    duration: "Lungo termine",
  },
];

export function Percorso() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.querySelectorAll<HTMLElement>(".step-card").forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, i * 180);
        });
        observer.disconnect();
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
  }, []);

  return (
    <section className="py-28 bg-white" id="percorso">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-3">
            Come lavoro
          </p>
          <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-navy leading-tight">
            Il tuo percorso
          </h2>
        </div>

        <div ref={ref} className="relative">
          {/* Connective line */}
          <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-teal/20 via-teal to-teal/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className="step-card relative text-center"
                style={{ opacity: 0, transform: "translateY(24px)" }}
              >
                {/* Icon bubble */}
                <div className="relative inline-flex items-center justify-center mb-8">
                  <div className="w-28 h-28 rounded-full bg-teal/8 flex items-center justify-center border-2 border-teal/20">
                    <s.icon size={32} className="text-teal" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-teal text-white font-inter text-sm font-bold flex items-center justify-center shadow-lg">
                    {s.step}
                  </span>
                </div>

                <span className="inline-block font-inter text-xs font-semibold text-teal/80 bg-teal/8 px-3 py-1 rounded-full mb-3">
                  {s.duration}
                </span>
                <h3 className="font-fraunces text-2xl font-semibold text-navy mb-3">{s.title}</h3>
                <p className="font-inter text-sm text-navy/55 leading-relaxed max-w-xs mx-auto">{s.body}</p>

                {/* Arrow between steps on mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-8 text-teal/40">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
