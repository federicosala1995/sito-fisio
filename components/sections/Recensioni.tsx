export function Recensioni() {
  return (
    <section className="py-28 bg-gray-50/80" id="recensioni">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-3">
            Cosa dicono
          </p>
          <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-navy leading-tight">
            Recensioni
          </h2>
        </div>

        {/* Placeholder GDPR-compliant */}
        <div className="max-w-2xl mx-auto rounded-3xl border-2 border-dashed border-navy/15 p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal/10 mb-2">
            <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
            </svg>
          </div>
          <p className="font-fraunces text-xl font-semibold text-navy">
            Sezione recensioni da completare
          </p>
          <p className="font-inter text-sm text-navy/50 leading-relaxed max-w-md mx-auto">
            In questa sezione vanno inserite <strong>solo recensioni reali e verificabili</strong>
            (es. link a Google Maps o dichiarazione con consenso del paziente).
            Pubblicare recensioni false o costruite è vietato dal Codice del Consumo
            e dalle linee guida dell&apos;Albo.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://g.page/r/[ID-GOOGLE-MAPS]/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-2.5 font-inter text-sm text-navy/70 hover:border-teal hover:text-teal transition-colors"
            >
              Aggiungi link Google Maps
            </a>
            <a
              href="#contatti"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-2.5 font-inter text-sm text-navy/70 hover:border-teal hover:text-teal transition-colors"
            >
              Chiedi a un paziente soddisfatto
            </a>
          </div>

          <p className="font-inter text-xs text-navy/30 pt-2">
            Template per quando avrai le recensioni reali: modifica il file{" "}
            <code className="bg-navy/5 px-1.5 py-0.5 rounded text-navy/40">
              components/sections/Recensioni.tsx
            </code>
          </p>
        </div>
      </div>
    </section>
  );
}
