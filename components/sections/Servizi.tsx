"use client";

import { useRef, useEffect } from "react";
import { Activity, Bone, Zap, Heart, Scan, TrendingUp, Dumbbell, Brain, Trophy } from "lucide-react";

const services = [
  {
    icon: Bone,
    title: "Riabilitazione ortopedica",
    body: "Recupero post-frattura, protesi, tendinopatie e patologie dell'apparato muscolo-scheletrico.",
  },
  {
    icon: Activity,
    title: "Terapia manuale",
    body: "Tecniche di mobilizzazione articolare e tessuti molli per ripristinare il movimento fisiologico.",
  },
  {
    icon: Trophy,
    title: "Recupero sportivo",
    body: "Return-to-play evidence-based per atleti e sportivi amatoriali. Dalla lesione al campo in sicurezza.",
  },
  {
    icon: Heart,
    title: "Riabilitazione post-operatoria",
    body: "Protocolli specifici dopo interventi ortopedici: spalla, ginocchio, anca, caviglia.",
  },
  {
    icon: Scan,
    title: "Lombalgia e cervicalgia",
    body: "Valutazione e trattamento del dolore vertebrale acuto e cronico con tecniche validate.",
  },
  {
    icon: Zap,
    title: "Tendinopatie",
    body: "Trattamento conservativo di tendine d'Achille, rotuleo, cuffia dei rotatori e laterale al gomito.",
  },
  {
    icon: TrendingUp,
    title: "Lesioni muscolari",
    body: "Gestione e riabilitazione delle lesioni muscolari dal grado I al grado III, con protocollo progressivo.",
  },
  {
    icon: Brain,
    title: "Riabilitazione neurologica",
    body: "Supporto funzionale a pazienti con esiti neurologici: ictus, sclerosi multipla, Parkinson.",
  },
  {
    icon: Dumbbell,
    title: "Preparazione atletica",
    body: "Prevenzione degli infortuni e miglioramento delle qualità fisiche in collaborazione con l'allenatore.",
  },
];

export function Servizi() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.querySelectorAll<HTMLElement>(".srv-card").forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, i * 80);
        });
        observer.disconnect();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
  }, []);

  return (
    <section className="py-28 bg-gray-50/80" id="servizi">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-3">
            Cosa faccio
          </p>
          <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-navy leading-tight">
            Servizi
          </h2>
          <p className="font-inter text-navy/50 mt-4 leading-relaxed">
            Ogni percorso parte da una valutazione approfondita. Il trattamento viene costruito
            intorno alle tue esigenze specifiche.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((s) => (
            <div
              key={s.title}
              className="srv-card group bg-white rounded-2xl p-6 border border-gray-100 hover:border-teal/30 hover:shadow-lg transition-all duration-300 cursor-default"
              style={{ opacity: 0, transform: "translateY(16px)" }}
            >
              <div className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-teal/10 group-hover:bg-teal/20 transition-colors">
                <s.icon size={20} className="text-teal" />
              </div>
              <h3 className="font-fraunces text-lg font-semibold text-navy mb-2">{s.title}</h3>
              <p className="font-inter text-sm text-navy/55 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
