"use client";

import { useRef, useEffect } from "react";
import { RomArc } from "@/components/ui/RomArc";

const points = [
  {
    n: "01",
    title: "Approccio evidence-based",
    body: "Ogni valutazione e trattamento si basa su protocolli clinici validati dalla letteratura scientifica. Nessuna tecnica di moda, solo ciò che funziona davvero.",
  },
  {
    n: "02",
    title: "Valutazione su misura",
    body: "Prima seduta sempre dedicata all'ascolto e alla valutazione posturale, funzionale e del movimento. Il piano di trattamento parte da te, non da un protocollo generico.",
  },
  {
    n: "03",
    title: "Autonomia del paziente",
    body: "L'obiettivo non è solo togliere il dolore, ma darti gli strumenti per mantenerti in salute. Esercizi, strategie e consapevolezza del tuo corpo per il lungo termine.",
  },
];

export function Perche() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.querySelectorAll<HTMLElement>(".animate-card").forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, i * 150);
        });
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
  }, []);

  return (
    <section className="py-28 bg-white" id="perche">
      <div ref={ref} className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-16">
          {/* Left: heading + arc */}
          <div className="md:w-2/5 space-y-6">
            <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold">
              Perché scegliermi
            </p>
            <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-navy leading-tight">
              Una fisioterapia che rispetta il tuo tempo e il tuo corpo.
            </h2>
            <div className="pt-4">
              <RomArc variant="mini" className="text-teal" />
            </div>
          </div>

          {/* Right: cards */}
          <div className="md:w-3/5 space-y-6">
            {points.map((p) => (
              <div
                key={p.n}
                className="animate-card flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-teal/30 hover:shadow-md transition-all duration-300"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <span className="font-fraunces text-3xl font-semibold text-teal/20 shrink-0 leading-none">
                  {p.n}
                </span>
                <div>
                  <h3 className="font-fraunces text-xl font-semibold text-navy mb-2">{p.title}</h3>
                  <p className="font-inter text-navy/60 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
