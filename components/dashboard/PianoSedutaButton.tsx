"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";

interface Props {
  pazienteId: string;
}

export function PianoSedutaButton({ pazienteId }: Props) {
  const [loading, setLoading] = useState(false);
  const [piano, setPiano] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleGenera() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/piano-seduta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pazienteId }),
      });
      if (!res.ok) throw new Error("Errore API");
      const { piano: text } = await res.json();
      setPiano(text);
      setOpen(true);
    } catch {
      setError("Impossibile generare il piano. Controlla la chiave API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-teal/20 bg-teal/5 overflow-hidden">
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal/15 flex items-center justify-center">
            <Sparkles size={16} className="text-teal" />
          </div>
          <div>
            <p className="font-fraunces text-base font-semibold text-navy">Piano seduta AI</p>
            <p className="font-inter text-xs text-navy/40">
              Suggerimenti evidence-based per la prossima seduta
            </p>
          </div>
        </div>
        <button
          onClick={piano ? () => setOpen(!open) : handleGenera}
          disabled={loading}
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-inter text-sm font-semibold text-white hover:bg-teal-600 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? "Generazione…" : piano ? (
            <>
              <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
              {open ? "Nascondi" : "Mostra"}
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Genera
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="px-5 pb-4 font-inter text-sm text-red-500">{error}</p>
      )}

      {piano && open && (
        <div className="border-t border-teal/10 p-5">
          <div
            className="font-inter text-sm text-navy/70 leading-relaxed whitespace-pre-wrap prose-sm"
            dangerouslySetInnerHTML={{ __html: piano.replace(/\n/g, "<br />") }}
          />
        </div>
      )}
    </div>
  );
}
