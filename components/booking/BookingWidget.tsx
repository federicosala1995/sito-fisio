"use client";

import { useState } from "react";
import { CalendarPicker } from "./CalendarPicker";
import { SlotGrid } from "./SlotGrid";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";

type Step = "giorno" | "ora" | "dati" | "conferma" | "ok" | "errore";

const WHATSAPP_FALLBACK = "https://wa.me/393454431758?text=Ciao%20Federico%2C%20vorrei%20prenotare%20una%20visita";

export function BookingWidget() {
  const [step, setStep] = useState<Step>("giorno");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", cognome: "", telefono: "", motivo: "" });
  const [gdpr, setGdpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://XXXXXXXXXX.supabase.co";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    if (!gdpr) { setError("Devi accettare il consenso al trattamento dei dati."); return; }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("prenota", {
        p_nome: form.nome,
        p_cognome: form.cognome,
        p_telefono: form.telefono,
        p_data: format(selectedDate, "yyyy-MM-dd"),
        p_ora: selectedSlot,
        p_motivo: form.motivo || undefined,
      });

      if (rpcError) throw rpcError;

      const result = data as { ok: boolean; msg?: string };
      if (!result.ok) {
        setError(result.msg ?? "Slot non più disponibile. Scegline un altro.");
        setStep("ora");
      } else {
        setStep("ok");
      }
    } catch {
      setError("Errore di connessione. Riprova o contattami su WhatsApp.");
      setStep("errore");
    } finally {
      setLoading(false);
    }
  }

  // Fallback se Supabase non è ancora configurato
  if (!supabaseConfigured) {
    return (
      <div className="max-w-md mx-auto text-center p-8 rounded-3xl border-2 border-dashed border-navy/15 space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
          <AlertCircle size={24} className="text-amber-500" />
        </div>
        <div>
          <h3 className="font-fraunces text-xl font-semibold text-navy mb-2">
            Sistema di prenotazione non ancora attivo
          </h3>
          <p className="font-inter text-sm text-navy/50">
            Configura le variabili d'ambiente Supabase (vedi README) per abilitare le prenotazioni online.
            Nel frattempo puoi contattarmi su WhatsApp.
          </p>
        </div>
        <a
          href={WHATSAPP_FALLBACK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-inter text-base font-semibold text-white shadow-lg hover:bg-[#20c05a] active:scale-95 transition-all"
        >
          <MessageCircle size={18} />
          Prenota su WhatsApp
        </a>
      </div>
    );
  }

  if (step === "ok") {
    return (
      <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-teal/5 border border-teal/20 space-y-4">
        <CheckCircle2 size={48} className="text-teal mx-auto" />
        <h3 className="font-fraunces text-2xl font-semibold text-navy">Prenotazione confermata!</h3>
        <p className="font-inter text-navy/60">
          Appuntamento il{" "}
          <strong>{selectedDate && format(selectedDate, "EEEE d MMMM", { locale: it })}</strong>{" "}
          alle <strong>{selectedSlot}</strong>.<br />
          Ti contatterò per confermare.
        </p>
        <a
          href={`https://wa.me/393454431758?text=Ho%20appena%20prenotato%20per%20il%20${format(selectedDate!, "d%2FM")}%20alle%20${selectedSlot?.replace(":", "%3A")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#20c05a] transition-all"
        >
          <MessageCircle size={15} />
          Conferma su WhatsApp
        </a>
      </div>
    );
  }

  if (step === "errore") {
    return (
      <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-red-50 border border-red-100 space-y-4">
        <AlertCircle size={40} className="text-red-400 mx-auto" />
        <h3 className="font-fraunces text-xl font-semibold text-navy">Qualcosa non ha funzionato</h3>
        <p className="font-inter text-sm text-navy/60">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setStep("giorno"); setError(null); }}
            className="rounded-full border border-navy/20 px-5 py-2.5 font-inter text-sm text-navy/70 hover:border-teal hover:text-teal transition-colors"
          >
            Riprova
          </button>
          <a
            href={WHATSAPP_FALLBACK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-inter text-sm font-semibold text-white"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {(["giorno", "ora", "dati"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-inter text-sm font-semibold transition-all ${
                step === s
                  ? "bg-teal text-white shadow-lg shadow-teal/30"
                  : ["giorno", "ora", "dati"].indexOf(step) > i
                  ? "bg-navy text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {step === "giorno" && (
        <div className="text-center space-y-6">
          <div>
            <h3 className="font-fraunces text-2xl font-semibold text-navy mb-1">Scegli il giorno</h3>
            <p className="font-inter text-sm text-navy/50">Prossimi 14 giorni disponibili</p>
          </div>
          <CalendarPicker
            onSelect={(date) => {
              setSelectedDate(date);
              setStep("ora");
            }}
          />
        </div>
      )}

      {step === "ora" && selectedDate && (
        <div className="text-center space-y-6">
          <div>
            <button
              onClick={() => setStep("giorno")}
              className="font-inter text-sm text-teal hover:underline mb-2"
            >
              ← Cambia giorno
            </button>
            <h3 className="font-fraunces text-2xl font-semibold text-navy mb-1">
              {format(selectedDate, "EEEE d MMMM", { locale: it })}
            </h3>
            <p className="font-inter text-sm text-navy/50">Seleziona un orario disponibile</p>
          </div>
          {error && (
            <p className="text-sm text-red-500 font-inter bg-red-50 px-4 py-2 rounded-xl">{error}</p>
          )}
          <SlotGrid
            date={format(selectedDate, "yyyy-MM-dd")}
            onSelect={(slot) => {
              setSelectedSlot(slot);
              setError(null);
              setStep("dati");
            }}
          />
        </div>
      )}

      {step === "dati" && selectedDate && selectedSlot && (
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={() => setStep("ora")}
              className="font-inter text-sm text-teal hover:underline mb-2"
            >
              ← Cambia orario
            </button>
            <h3 className="font-fraunces text-2xl font-semibold text-navy mb-1">I tuoi dati</h3>
            <p className="font-inter text-sm text-navy/50">
              {format(selectedDate, "EEEE d MMMM", { locale: it })} alle{" "}
              <strong>{selectedSlot}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nome *"
                id="nome"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Mario"
              />
              <Input
                label="Cognome *"
                id="cognome"
                required
                value={form.cognome}
                onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                placeholder="Rossi"
              />
            </div>
            <Input
              label="Telefono *"
              id="telefono"
              type="tel"
              required
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="+39 333 000 0000"
            />
            <div className="space-y-1.5">
              <label htmlFor="motivo" className="text-sm font-medium text-navy font-inter">
                Motivo della visita (facoltativo)
              </label>
              <textarea
                id="motivo"
                rows={3}
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-inter text-navy placeholder:text-gray-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 resize-none text-sm"
                placeholder="Es: dolore al ginocchio da 2 settimane, post-operatorio spalla…"
              />
            </div>

            {/* GDPR — obbligatorio */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={gdpr}
                onChange={(e) => setGdpr(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal"
              />
              <span className="font-inter text-xs text-navy/55 leading-relaxed">
                Acconsento al trattamento dei miei dati personali ai sensi del Reg. UE 2016/679 (GDPR)
                per la gestione dell&apos;appuntamento. I dati non verranno ceduti a terzi.{" "}
                <a href="/privacy" className="text-teal underline">Privacy Policy</a>.{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-500 font-inter bg-red-50 px-4 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !gdpr}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-4 font-inter text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all duration-200 hover:bg-teal-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Prenotazione in corso…" : "Conferma prenotazione"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
