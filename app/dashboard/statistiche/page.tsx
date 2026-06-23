import { createClient } from "@/lib/supabase/server";
import { format, startOfMonth, endOfMonth, subMonths, getDay } from "date-fns";
import { it } from "date-fns/locale";
import { TrendingUp, Clock, Users, CalendarCheck, XCircle } from "lucide-react";

export const revalidate = 0;

const ALL_SLOTS = ["09:00","09:45","10:30","11:15","12:00","14:00","14:45","15:30","16:15","17:00","17:45","18:30"];
const GIORNI = ["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];

export default async function StatistichePage() {
  const supabase = await createClient();
  const now = new Date();

  // Ultimi 3 mesi per grafico
  const months = [0, 1, 2].map((i) => {
    const d = subMonths(now, i);
    return {
      label: format(d, "MMM", { locale: it }),
      start: format(startOfMonth(d), "yyyy-MM-dd"),
      end: format(endOfMonth(d), "yyyy-MM-dd"),
    };
  }).reverse();

  const monthCounts = await Promise.all(
    months.map(async (m) => {
      const [{ count: confermati }, { count: ann }] = await Promise.all([
        supabase.from("appuntamenti").select("*", { count: "exact", head: true }).gte("data", m.start).lte("data", m.end).eq("stato", "confermato"),
        supabase.from("appuntamenti").select("*", { count: "exact", head: true }).gte("data", m.start).lte("data", m.end).eq("stato", "annullato"),
      ]);
      return { label: m.label, confermati: confermati ?? 0, annullati: ann ?? 0 };
    })
  );

  // Fasce orarie più frequenti (mese corrente)
  const mStart = format(startOfMonth(now), "yyyy-MM-dd");
  const mEnd = format(endOfMonth(now), "yyyy-MM-dd");

  const { data: appMese } = await supabase
    .from("appuntamenti")
    .select("ora, data")
    .gte("data", mStart)
    .lte("data", mEnd)
    .neq("stato", "annullato");

  // Conta per slot
  const slotCount: Record<string, number> = {};
  const dayCount: Record<number, number> = {};

  (appMese ?? []).forEach((a: { ora: string; data: string }) => {
    const ora = a.ora.slice(0, 5);
    slotCount[ora] = (slotCount[ora] ?? 0) + 1;

    const dow = getDay(new Date(a.data + "T12:00"));
    dayCount[dow] = (dayCount[dow] ?? 0) + 1;
  });

  const maxSlot = Math.max(1, ...Object.values(slotCount));
  const maxDay = Math.max(1, ...Object.values(dayCount));
  const maxMonth = Math.max(1, ...monthCounts.map((m) => m.confermati + m.annullati));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-fraunces text-3xl font-semibold text-navy">Statistiche</h1>
        <p className="font-inter text-navy/50 mt-1 text-sm">
          Analisi degli appuntamenti per ottimizzare il tuo studio
        </p>
      </div>

      {/* Grafico mensile */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={16} className="text-teal" />
          <h2 className="font-fraunces text-lg font-semibold text-navy">Andamento ultimi 3 mesi</h2>
        </div>

        <div className="flex items-end gap-6 h-48">
          {monthCounts.map((m) => {
            const total = m.confermati + m.annullati;
            const pct = total / maxMonth;
            const confPct = m.confermati / maxMonth;
            return (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "140px" }}>
                  {/* Annullati (sopra) */}
                  {m.annullati > 0 && (
                    <div
                      className="w-full rounded-t-lg bg-orange-100 border border-orange-200 flex items-center justify-center"
                      style={{ height: `${Math.max(4, ((m.annullati / maxMonth) * 100))}%` }}
                    >
                      {m.annullati > 0 && (
                        <span className="font-inter text-[10px] text-orange-500 font-medium">{m.annullati}</span>
                      )}
                    </div>
                  )}
                  {/* Confermati (sotto) */}
                  <div
                    className="w-full rounded-t-lg bg-teal flex items-end justify-center pb-1"
                    style={{ height: `${Math.max(8, (confPct * 100))}%`, borderRadius: m.annullati > 0 ? "0 0 8px 8px" : "8px 8px 0 0" }}
                  >
                    <span className="font-inter text-xs font-semibold text-white">{m.confermati}</span>
                  </div>
                </div>
                <span className="font-inter text-xs text-navy/50 capitalize">{m.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-teal" />
            <span className="font-inter text-xs text-navy/50">Confermati</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200" />
            <span className="font-inter text-xs text-navy/50">Annullati</span>
          </div>
        </div>
      </div>

      {/* Fasce orarie di punta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={16} className="text-teal" />
            <h2 className="font-fraunces text-lg font-semibold text-navy">Fasce orarie di punta</h2>
          </div>
          <div className="space-y-2">
            {ALL_SLOTS.map((slot) => {
              const count = slotCount[slot] ?? 0;
              const pct = maxSlot > 0 ? (count / maxSlot) * 100 : 0;
              return (
                <div key={slot} className="flex items-center gap-3">
                  <span className="font-inter text-xs text-navy/50 w-12 shrink-0">{slot}</span>
                  <div className="flex-1 h-5 rounded-lg bg-gray-50 overflow-hidden">
                    <div
                      className="h-full rounded-lg bg-teal/70 transition-all"
                      style={{ width: `${pct}%`, minWidth: count > 0 ? "8px" : "0" }}
                    />
                  </div>
                  <span className="font-inter text-xs font-medium text-navy/60 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Giorni della settimana */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <CalendarCheck size={16} className="text-teal" />
            <h2 className="font-fraunces text-lg font-semibold text-navy">Giorni più richiesti</h2>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((dow) => {
              const count = dayCount[dow] ?? 0;
              const pct = maxDay > 0 ? (count / maxDay) * 100 : 0;
              return (
                <div key={dow} className="flex items-center gap-3">
                  <span className="font-inter text-xs text-navy/50 w-8 shrink-0">{GIORNI[dow]}</span>
                  <div className="flex-1 h-6 rounded-lg bg-gray-50 overflow-hidden">
                    <div
                      className="h-full rounded-lg bg-navy/60 transition-all flex items-center pl-2"
                      style={{ width: `${pct}%`, minWidth: count > 0 ? "20px" : "0" }}
                    >
                      {count > 0 && (
                        <span className="font-inter text-[10px] font-semibold text-white">{count}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="font-inter text-xs text-navy/30 mt-4">Mese corrente</p>
        </div>
      </div>
    </div>
  );
}
