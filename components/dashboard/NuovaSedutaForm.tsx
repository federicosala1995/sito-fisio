"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown } from "lucide-react";

interface Props {
  pazienteId: string;
}

export function NuovaSedutaForm({ pazienteId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    data: new Date().toISOString().slice(0, 10),
    trattamento: "",
    esercizi: "",
    vas_pre: "",
    vas_post: "",
    rom_note: "",
    note: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("sedute").insert({
      paziente_id: pazienteId,
      data: form.data,
      trattamento: form.trattamento || null,
      esercizi: form.esercizi || null,
      vas_pre: form.vas_pre ? parseInt(form.vas_pre) : null,
      vas_post: form.vas_post ? parseInt(form.vas_post) : null,
      rom_note: form.rom_note || null,
      note: form.note || null,
    });
    setLoading(false);
    if (!error) {
      setOpen(false);
      setForm({ data: new Date().toISOString().slice(0, 10), trattamento: "", esercizi: "", vas_pre: "", vas_post: "", rom_note: "", note: "" });
      router.refresh();
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center">
            <Plus size={15} className="text-navy/60" />
          </div>
          <span className="font-fraunces text-base font-semibold text-navy">Registra nuova seduta</span>
        </div>
        <ChevronDown size={16} className={`text-navy/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="border-t border-gray-50 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-inter text-xs font-medium text-navy/50 uppercase tracking-wide">Data</label>
              <input
                type="date"
                required
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-inter text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["vas_pre", "vas_post"].map((key) => (
                <div key={key} className="space-y-1.5">
                  <label className="font-inter text-xs font-medium text-navy/50 uppercase tracking-wide">
                    VAS {key === "vas_pre" ? "pre" : "post"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={form[key as "vas_pre" | "vas_post"]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-inter text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                    placeholder="0-10"
                  />
                </div>
              ))}
            </div>
          </div>

          {[
            { key: "trattamento", label: "Trattamento", rows: 2, placeholder: "Tecniche utilizzate, aree trattate…" },
            { key: "esercizi", label: "Esercizi prescritti", rows: 2, placeholder: "Nome esercizio, serie × ripetizioni, note…" },
            { key: "rom_note", label: "Note ROM / valutazione", rows: 1, placeholder: "Flessione anca 90°, abduzione spalla 120°…" },
            { key: "note", label: "Note cliniche", rows: 2, placeholder: "Osservazioni, progressi, cose da ricordare…" },
          ].map(({ key, label, rows, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="font-inter text-xs font-medium text-navy/50 uppercase tracking-wide">{label}</label>
              <textarea
                rows={rows}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-inter text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 resize-none"
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 font-inter text-sm text-navy/60 hover:border-gray-300 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-teal py-2.5 font-inter text-sm font-semibold text-white hover:bg-teal-600 transition-all disabled:opacity-60"
            >
              {loading ? "Salvataggio…" : "Salva seduta"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
