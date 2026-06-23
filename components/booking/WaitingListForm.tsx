"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  onSuccess?: () => void;
}

export function WaitingListForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    nome: "", cognome: "", telefono: "", email: "",
    data_preferita: "", fascia: "qualsiasi", note: "",
  });
  const [gdpr, setGdpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gdpr) { setError("Devi accettare il consenso GDPR."); return; }
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: rpcErr } = await (supabase as any).rpc("aggiungi_lista_attesa", {
        p_nome: form.nome,
        p_cognome: form.cognome,
        p_telefono: form.telefono,
        p_email: form.email || null,
        p_data_pref: form.data_preferita || null,
        p_fascia: form.fascia,
        p_note: form.note || null,
      });

      if (rpcErr) throw rpcErr;
      const res = data as { ok: boolean; msg?: string };
      if (!res.ok) {
        setError(res.msg ?? "Errore durante l'iscrizione.");
      } else {
        setDone(true);
        onSuccess?.();
      }
    } catch {
      setError("Errore di connessione. Riprova o contattaci via WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-teal/5 border border-teal/20 p-6 text-center space-y-2">
        <CheckCircle2 size={28} className="text-teal mx-auto" />
        <p className="font-fraunces text-lg font-semibold text-navy">Iscrizione ricevuta!</p>
        <p className="font-inter text-sm text-navy/60">
          Ti contatterò appena si libera uno slot compatibile con le tue preferenze.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 p-6 space-y-4 bg-white">
      <p className="font-fraunces text-base font-semibold text-navy">Lista d&apos;attesa</p>
      <p className="font-inter text-sm text-navy/55">
        Inserisci i tuoi dati e ti avviserò appena si libera un posto.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Nome *" id="wl-nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Mario" />
        <Input label="Cognome *" id="wl-cogn" required value={form.cognome} onChange={(e) => setForm({ ...form, cognome: e.target.value })} placeholder="Rossi" />
      </div>
      <Input label="Telefono *" id="wl-tel" type="tel" required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+39 333 000 0000" />
      <Input label="Email" id="wl-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="mario@esempio.it" />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="font-inter text-sm font-medium text-navy">Data preferita</label>
          <input
            type="date"
            value={form.data_preferita}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setForm({ ...form, data_preferita: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 font-inter text-sm text-navy focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-inter text-sm font-medium text-navy">Fascia oraria</label>
          <select
            value={form.fascia}
            onChange={(e) => setForm({ ...form, fascia: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 font-inter text-sm text-navy focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 bg-white"
          >
            <option value="qualsiasi">Qualsiasi</option>
            <option value="mattina">Mattina (9–13)</option>
            <option value="pomeriggio">Pomeriggio (14–19)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-inter text-sm font-medium text-navy">Note</label>
        <textarea
          rows={2}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 font-inter text-sm text-navy placeholder:text-gray-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 resize-none"
          placeholder="Eventuali preferenze o motivazione…"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" required checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal" />
        <span className="font-inter text-xs text-navy/55 leading-relaxed">
          Acconsento al trattamento dei dati per essere ricontattato (Reg. UE 2016/679).{" "}
          <a href="/privacy" className="text-teal underline">Privacy Policy</a>. <span className="text-red-500">*</span>
        </span>
      </label>

      {error && (
        <p className="font-inter text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !gdpr}
        className="w-full rounded-full bg-navy py-3.5 font-inter text-sm font-semibold text-white hover:bg-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? "Invio in corso…" : "Iscriviti alla lista d'attesa"}
      </button>
    </form>
  );
}
