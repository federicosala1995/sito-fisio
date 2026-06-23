"use client";

import Link from "next/link";
import { MessageCircle, CalendarCheck } from "lucide-react";
import { RomArc } from "@/components/ui/RomArc";
import { useEffect, useRef } from "react";

export function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const els = [headingRef.current, subRef.current, ctaRef.current, trustRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 200 + i * 140);
    });
  }, []);

  return (
    <section className="relative min-h-screen bg-navy overflow-hidden flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#0a1f35]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#15B8A615_0%,transparent_60%)]" />

      {/* ROM Arc — decorativo */}
      <div className="absolute right-0 bottom-0 md:right-8 md:bottom-4 opacity-20 md:opacity-30 pointer-events-none select-none">
        <RomArc size={520} animated variant="hero" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-28 pb-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
            <span className="font-inter text-xs text-teal/90 font-medium tracking-wide">
              Fisioterapista · Castrezzato, Franciacorta
            </span>
          </div>

          <h1
            ref={headingRef}
            className="font-fraunces text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.08] tracking-tight mb-6"
          >
            Recupera il tuo{" "}
            <span className="text-teal italic">movimento</span>.
          </h1>

          <p
            ref={subRef}
            className="font-inter text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-lg"
          >
            Riabilitazione ortopedica, terapia manuale e recupero sportivo su misura.
            Valutazione individuale, approccio evidence-based, percorso personalizzato.
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <Link
              href="/prenota"
              className="inline-flex items-center gap-2.5 rounded-full bg-teal px-8 py-4 font-inter text-base font-semibold text-white shadow-xl shadow-teal/30 transition-all duration-200 hover:bg-teal-600 hover:shadow-teal/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              <CalendarCheck size={18} />
              Prenota online
            </Link>
            <a
              href="https://wa.me/393454431758?text=Ciao%20Federico%2C%20vorrei%20informazioni%20per%20una%20visita"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/20 px-8 py-4 font-inter text-base font-semibold text-white/90 transition-all duration-200 hover:border-white/40 hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>

          {/* Trust line */}
          <div
            ref={trustRef}
            className="mt-12 flex flex-wrap items-center gap-6 text-white/40"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-inter text-sm">Iscritto all&apos;Albo TSRM-PSTRP</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-inter text-sm">Riceve su appuntamento</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-inter text-sm">Approccio evidence-based</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
