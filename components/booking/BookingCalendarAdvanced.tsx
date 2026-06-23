"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { format, addDays, startOfWeek, isBefore, isToday, addWeeks, subWeeks } from "date-fns";
import { it } from "date-fns/locale";
import { Input } from "@/components/ui/Input";
import { CalendarExport } from "./CalendarExport";
import { WaitingListForm } from "./WaitingListForm";
import {
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle,
  MessageCircle, Loader2, Clock, Lock, Calendar, ArrowLeft,
} from "lucide-react";

// ─── types ───────────────────────────────────────────────────────────────────

type SlotStatus = "libero" | "occupato" | "passato";

interface WeekData {
  [date: string]: Record<string, SlotStatus>;
}

interface BookingResult {
  ok: boolean;
  checkinToken?: string;
  cancelToken?: string;
  msg?: string;
}

const ALL_SLOTS = [
  "09:00","09:45","10:30","11:15","12:00",
  "14:00","14:45","15:30","16:15","17:00","17:45","18:30",
];

const DAYS_IT = ["Lun","Mar","Mer","Gio","Ven","Sab"];
const WA_FALLBACK = "https://wa.me/393454431758?text=Ciao%20Federico%2C%20vorrei%20prenotare%20una%20visita";

// ─── utils ────────────────────────────────────────────────────────────────────

function getMondayOf(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function classifySlot(slotOra: string, giorno: Date, libero: boolean): SlotStatus {
  if (!libero) return "occupato";
  const now = new Date();
  const [h, m] = slotOra.split(":").map(Number);
  const slotTime = new Date(giorno);
  slotTime.setHours(h, m, 0, 0);
  if (isBefore(slotTime, new Date(now.getTime() + 30 * 60 * 1000))) return "passato";
  return "libero";
}

// ─── hook real-time ───────────────────────────────────────────────────────────

const isSupabaseConfigured = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("XXXXXXXXXX"));

function useWeekSlots(weekStart: Date) {
  const [data, setData] = useState<WeekData>({});
  const [loading, setLoading] = useState(true);
  // Only create client if Supabase is configured (avoids crash during SSR without env vars)
  const supabase = isSupabaseConfigured() ? createClient() : null;

  const load = useCallback(async () => {
    setLoading(true);
    const monday = format(weekStart, "yyyy-MM-dd");

    if (!isSupabaseConfigured()) {
      // Fallback: mostra tutto libero per demo
      const demo: WeekData = {};
      for (let i = 0; i < 6; i++) {
        const d = addDays(weekStart, i);
        if (d.getDay() === 0) continue;
        const key = format(d, "yyyy-MM-dd");
        demo[key] = {};
        ALL_SLOTS.forEach((s) => { demo[key][s] = classifySlot(s, d, true); });
      }
      setData(demo);
      setLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rows, error } = await (supabase as any).rpc("slot_settimana", { p_lunedi: monday });
      if (error) throw error;

      const built: WeekData = {};
      (rows as { giorno: string; slot_ora: string; libero: boolean }[]).forEach((r) => {
        if (!built[r.giorno]) built[r.giorno] = {};
        const d = new Date(r.giorno + "T12:00");
        built[r.giorno][r.slot_ora] = classifySlot(r.slot_ora, d, r.libero);
      });
      setData(built);
    } catch {
      // fallback: mostra tutto libero se Supabase non risponde
      const fallback: WeekData = {};
      for (let i = 0; i < 6; i++) {
        const d = addDays(weekStart, i);
        if (d.getDay() === 0) continue;
        const key = format(d, "yyyy-MM-dd");
        fallback[key] = {};
        ALL_SLOTS.forEach((s) => { fallback[key][s] = classifySlot(s, d, true); });
      }
      setData(fallback);
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    load();

    if (!supabase) return;

    const channel = supabase
      .channel(`slots-${format(weekStart, "yyyy-MM-dd")}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "appuntamenti" }, () => load())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [weekStart, load]);

  return { data, loading, reload: load };
}

// ─── main component ───────────────────────────────────────────────────────────

export function BookingCalendarAdvanced() {
  const [weekStart, setWeekStart] = useState<Date>(getMondayOf(new Date()));
  const [activeDay, setActiveDay] = useState(0);         // mobile: giorno attivo 0-5
  const [selected, setSelected] = useState<{ date: string; ora: string } | null>(null);
  const [step, setStep] = useState<"calendar" | "form" | "success" | "error">("calendar");
  const [result, setResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [form, setForm] = useState({ nome: "", cognome: "", telefono: "", email: "", motivo: "" });
  const [gdpr, setGdpr] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const { data: weekData, loading: slotsLoading, reload } = useWeekSlots(weekStart);

  // Calcola i giorni della settimana (Lun-Sab, escludi domenica)
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = addDays(weekStart, i);
    return { date: d, key: format(d, "yyyy-MM-dd"), isToday: isToday(d) };
  });

  const isPastWeek = isBefore(addDays(weekStart, 5), new Date());
  const canGoPrev = !isBefore(weekStart, getMondayOf(new Date()));

  function handleSlotClick(dateKey: string, ora: string) {
    setSelected({ date: dateKey, ora });
    setStep("form");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    if (!gdpr) { setFormError("Devi accettare il consenso GDPR."); return; }
    setLoading(true);
    setFormError(null);

    if (!isSupabaseConfigured()) {
      setFormError("Sistema di prenotazione non configurato. Contattaci via WhatsApp.");
      setLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = createClient() as any;
      const { data, error } = await supabase.rpc("prenota", {
        p_nome: form.nome,
        p_cognome: form.cognome,
        p_telefono: form.telefono,
        p_data: selected.date,
        p_ora: selected.ora,
        p_motivo: form.motivo || null,
        p_email: form.email || null,
      });

      if (error) throw error;
      const res = data as { ok: boolean; msg?: string; check_in_token?: string; cancellation_token?: string };

      if (!res.ok) {
        setFormError(res.msg ?? "Slot non disponibile. Scegline un altro.");
        reload();
      } else {
        setResult({ ok: true, checkinToken: res.check_in_token, cancelToken: res.cancellation_token });
        setStep("success");
        reload();

        // Trigger email di conferma in background
        if (form.email) {
          fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo: "conferma",
              to: form.email,
              nome: form.nome,
              data: selected.date,
              ora: selected.ora,
              checkinToken: res.check_in_token,
              cancelToken: res.cancellation_token,
            }),
          }).catch(() => {});
        }
      }
    } catch {
      setStep("error");
    } finally {
      setLoading(false);
    }
  }

  // ── SUCCESS ──────────────────────────────────────────────────────────────────
  if (step === "success" && selected && result?.ok) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="rounded-3xl bg-teal/5 border border-teal/20 p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal flex items-center justify-center shadow-lg shadow-teal/30">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <div>
            <h3 className="font-fraunces text-2xl font-semibold text-navy">Prenotazione confermata!</h3>
            <p className="font-inter text-navy/60 mt-2">
              {format(new Date(selected.date + "T12:00"), "EEEE d MMMM", { locale: it })} alle <strong>{selected.ora}</strong>
            </p>
            {form.email && (
              <p className="font-inter text-sm text-teal mt-1">
                Conferma inviata a {form.email}
              </p>
            )}
          </div>
        </div>

        {/* Export calendario */}
        <CalendarExport nome={form.nome} data={selected.date} ora={selected.ora} />

        {/* Check-in e cancellazione */}
        {result.checkinToken && (
          <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
            <p className="font-inter text-xs text-navy/40 uppercase tracking-wide font-semibold">Check-in digitale</p>
            <p className="font-inter text-sm text-navy/60">
              Il giorno dell'appuntamento, clicca questo pulsante per comunicare il tuo arrivo.
            </p>
            <a
              href={`${baseUrl}/checkin/${result.checkinToken}`}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-inter text-sm font-semibold text-white hover:bg-navy/90 transition-all"
            >
              <Clock size={14} />
              Check-in digitale
            </a>
            {result.cancelToken && (
              <p className="font-inter text-xs text-navy/35">
                Vuoi annullare?{" "}
                <a href={`${baseUrl}/cancel/${result.cancelToken}`} className="text-teal hover:underline">
                  Clicca qui
                </a>
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => { setStep("calendar"); setSelected(null); setForm({ nome:"",cognome:"",telefono:"",email:"",motivo:"" }); setGdpr(false); }}
          className="w-full font-inter text-sm text-navy/50 hover:text-teal transition-colors"
        >
          Prenota un altro appuntamento →
        </button>
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-red-50 border border-red-100 space-y-4">
        <AlertCircle size={40} className="text-red-400 mx-auto" />
        <h3 className="font-fraunces text-xl font-semibold text-navy">Errore di connessione</h3>
        <p className="font-inter text-sm text-navy/60">Non è stato possibile completare la prenotazione.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setStep("form")} className="rounded-full border border-navy/20 px-5 py-2.5 font-inter text-sm text-navy/70 hover:border-teal hover:text-teal transition-colors">
            Riprova
          </button>
          <a href={WA_FALLBACK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-inter text-sm font-semibold text-white">
            <MessageCircle size={14} /> WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── HEADER settimana ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => { setWeekStart(subWeeks(weekStart, 1)); setActiveDay(0); }}
          disabled={!canGoPrev}
          className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:border-teal hover:text-teal transition-all"
          aria-label="Settimana precedente"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center">
          <p className="font-fraunces text-lg font-semibold text-navy capitalize">
            {format(weekStart, "MMMM yyyy", { locale: it })}
          </p>
          <p className="font-inter text-xs text-navy/40">
            {format(weekStart, "d")} – {format(addDays(weekStart, 5), "d MMM", { locale: it })}
          </p>
        </div>

        <button
          onClick={() => { setWeekStart(addWeeks(weekStart, 1)); setActiveDay(0); }}
          className="p-2 rounded-xl border border-gray-200 hover:border-teal hover:text-teal transition-all"
          aria-label="Settimana successiva"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── MOBILE: selettore giorno ────────────────────────────────────────── */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-1 -mx-1">
        {weekDays.map((day, i) => (
          <button
            key={day.key}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 flex flex-col items-center rounded-xl px-3 py-2.5 border transition-all ${
              activeDay === i
                ? "bg-teal border-teal text-white"
                : day.isToday
                ? "border-teal/40 text-teal bg-teal/5"
                : "border-gray-100 text-navy/70 bg-white"
            }`}
          >
            <span className="font-inter text-[10px] uppercase">{DAYS_IT[i]}</span>
            <span className="font-fraunces text-xl font-semibold leading-tight">{format(day.date, "d")}</span>
          </button>
        ))}
      </div>

      {slotsLoading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-navy/40">
          <Loader2 size={20} className="animate-spin" />
          <span className="font-inter text-sm">Carico la disponibilità…</span>
        </div>
      ) : (
        <>
          {/* ── DESKTOP: griglia settimana ────────────────────────────────── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-16 py-3 font-inter text-xs text-navy/30 font-normal" />
                  {weekDays.map((day, i) => (
                    <th key={day.key} className="py-3 px-1 text-center">
                      <span className={`font-inter text-xs uppercase block ${day.isToday ? "text-teal" : "text-navy/40"}`}>
                        {DAYS_IT[i]}
                      </span>
                      <span className={`font-fraunces text-xl font-semibold ${day.isToday ? "text-teal" : "text-navy"}`}>
                        {format(day.date, "d")}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_SLOTS.map((slot) => (
                  <tr key={slot} className="group">
                    <td className="py-1 pr-2 text-right font-inter text-xs text-navy/30 w-16 align-middle">{slot}</td>
                    {weekDays.map((day) => {
                      const status = weekData[day.key]?.[slot] ?? "passato";
                      return (
                        <td key={day.key} className="py-1 px-1 align-middle">
                          <SlotButton
                            status={status}
                            onClick={() => handleSlotClick(day.key, slot)}
                            selected={selected?.date === day.key && selected?.ora === slot}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE: lista slot del giorno attivo ────────────────────── */}
          <div className="md:hidden grid grid-cols-3 gap-2">
            {ALL_SLOTS.map((slot) => {
              const day = weekDays[activeDay];
              if (!day) return null;
              const status = weekData[day.key]?.[slot] ?? "passato";
              return (
                <SlotButton
                  key={slot}
                  status={status}
                  label={slot}
                  onClick={() => handleSlotClick(day.key, slot)}
                  selected={selected?.date === day.key && selected?.ora === slot}
                  showLabel
                />
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex items-center gap-5 justify-center">
            {(["libero", "occupato", "passato"] as const).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${s === "libero" ? "bg-teal/20 border border-teal" : s === "occupato" ? "bg-gray-100 border border-gray-200" : "bg-gray-50 border border-gray-100"}`} />
                <span className="font-inter text-xs text-navy/40 capitalize">{s}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── FORM prenotazione ────────────────────────────────────────────────── */}
      {step === "form" && selected && (
        <div ref={formRef} className="rounded-3xl border border-teal/20 bg-white shadow-xl shadow-teal/5 overflow-hidden">
          {/* Header slot selezionato */}
          <div className="bg-teal/8 border-b border-teal/15 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center">
                <Calendar size={16} className="text-white" />
              </div>
              <div>
                <p className="font-fraunces text-base font-semibold text-navy">
                  {format(new Date(selected.date + "T12:00"), "EEEE d MMMM", { locale: it })}
                </p>
                <p className="font-inter text-sm text-teal font-medium">{selected.ora} · 45 minuti</p>
              </div>
            </div>
            <button onClick={() => { setStep("calendar"); setSelected(null); }} className="p-2 rounded-xl hover:bg-navy/5 transition-colors text-navy/40 hover:text-navy">
              <ArrowLeft size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nome *" id="b-nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Mario" />
              <Input label="Cognome *" id="b-cogn" required value={form.cognome} onChange={(e) => setForm({ ...form, cognome: e.target.value })} placeholder="Rossi" />
            </div>
            <Input label="Telefono *" id="b-tel" type="tel" required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+39 333 000 0000" />
            <Input label="Email (per promemoria e conferma)" id="b-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="mario@esempio.it" />
            <div className="space-y-1.5">
              <label className="font-inter text-sm font-medium text-navy">Motivo della visita (facoltativo)</label>
              <textarea rows={2} value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 font-inter text-sm text-navy placeholder:text-gray-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 resize-none" placeholder="Es: dolore al ginocchio, post-operatorio…" />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal" />
              <span className="font-inter text-xs text-navy/55 leading-relaxed">
                Acconsento al trattamento dei miei dati personali per la gestione dell&apos;appuntamento (Reg. UE 2016/679).{" "}
                <a href="/privacy" className="text-teal underline">Privacy Policy</a>. <span className="text-red-500">*</span>
              </span>
            </label>

            {formError && (
              <p className="font-inter text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{formError}</p>
            )}

            <button type="submit" disabled={loading || !gdpr} className="w-full rounded-full bg-teal py-4 font-inter text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-600 active:scale-95 disabled:opacity-50">
              {loading ? "Prenotazione in corso…" : "Conferma prenotazione"}
            </button>
          </form>
        </div>
      )}

      {/* ── LISTA D'ATTESA ───────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 pt-6 text-center space-y-3">
        <p className="font-inter text-sm text-navy/50">
          Non trovi l&apos;orario giusto?
        </p>
        <button
          onClick={() => setShowWaitlist(!showWaitlist)}
          className="font-inter text-sm text-teal hover:underline font-medium"
        >
          {showWaitlist ? "Chiudi" : "Iscriviti alla lista d'attesa →"}
        </button>
        {showWaitlist && (
          <div className="mt-4 text-left">
            <WaitingListForm onSuccess={() => setShowWaitlist(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SlotButton ───────────────────────────────────────────────────────────────

function SlotButton({
  status,
  onClick,
  selected = false,
  label,
  showLabel = false,
}: {
  status: SlotStatus;
  onClick: () => void;
  selected?: boolean;
  label?: string;
  showLabel?: boolean;
}) {
  if (status === "passato") {
    return (
      <div className={`h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center ${showLabel ? "py-3" : ""}`}>
        {showLabel && label && <span className="font-inter text-xs text-gray-300">{label}</span>}
      </div>
    );
  }

  if (status === "occupato") {
    return (
      <div className={`h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center cursor-not-allowed ${showLabel ? "py-3" : ""}`} title="Occupato">
        {showLabel && label ? (
          <span className="font-inter text-xs text-gray-400">{label}</span>
        ) : (
          <Lock size={10} className="text-gray-300" />
        )}
      </div>
    );
  }

  // libero
  return (
    <button
      onClick={onClick}
      className={`h-8 w-full rounded-lg border transition-all duration-150 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
        selected
          ? "bg-teal border-teal text-white shadow-md shadow-teal/30"
          : "bg-teal/10 border-teal/30 text-teal hover:bg-teal hover:text-white hover:border-teal hover:shadow-md hover:shadow-teal/20 active:scale-95"
      } ${showLabel ? "py-3 h-auto" : ""}`}
      title={`Prenota alle ${label ?? ""}`}
    >
      {showLabel && label ? (
        <span className="font-inter text-xs font-medium">{label}</span>
      ) : (
        <div className="w-2 h-2 rounded-full bg-current" />
      )}
    </button>
  );
}
