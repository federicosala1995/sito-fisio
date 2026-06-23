import { createClient } from "@/lib/supabase/server";
import { format, addDays, startOfToday } from "date-fns";
import { it } from "date-fns/locale";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export default async function AgendaPage() {
  const supabase = await createClient();
  const today = startOfToday();
  const endDate = format(addDays(today, 14), "yyyy-MM-dd");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: appuntamenti } = await (supabase as any)
    .from("appuntamenti")
    .select("id, data, ora, tipo, note_prenotaz, pazienti(id, nome, cognome, telefono)")
    .gte("data", format(today, "yyyy-MM-dd"))
    .lte("data", endDate)
    .order("data")
    .order("ora") as { data: { id: string; data: string; ora: string; tipo: string; note_prenotaz?: string; pazienti?: { id: string; nome: string; cognome: string; telefono?: string } }[] | null };

  type AppRow = { id: string; data: string; ora: string; tipo: string; note_prenotaz?: string; pazienti?: { id: string; nome: string; cognome: string; telefono?: string } };

  // Raggruppa per data
  const grouped = (appuntamenti ?? []).reduce<Record<string, AppRow[]>>((acc, app) => {
    if (!app) return acc;
    const key = (app as AppRow).data;
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(app as AppRow);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-3xl font-semibold text-navy">Agenda</h1>
          <p className="font-inter text-sm text-navy/50 mt-1">Prossimi 14 giorni</p>
        </div>
        <Link
          href="/prenota"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-inter text-sm font-semibold text-white hover:bg-teal-600 transition-all"
        >
          <CalendarCheck size={15} />
          Apri prenotazione
        </Link>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200">
          <p className="font-inter text-navy/40">Nessun appuntamento nei prossimi 14 giorni.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateStr, apps]) => (
            <div key={dateStr}>
              <h2 className="font-fraunces text-lg font-semibold text-navy mb-3 capitalize">
                {format(new Date(dateStr + "T12:00"), "EEEE d MMMM", { locale: it })}
              </h2>
              <div className="space-y-3">
                {apps?.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 hover:border-teal/30 transition-all"
                  >
                    <div className="w-14 text-center shrink-0">
                      <p className="font-fraunces text-2xl font-semibold text-teal leading-none">
                        {app.ora.slice(0, 5)}
                      </p>
                      <p className="font-inter text-xs text-navy/30 mt-0.5">45 min</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      {app.pazienti ? (
                        <Link
                          href={`/dashboard/pazienti/${(app.pazienti as {id: string}).id}`}
                          className="font-inter text-sm font-medium text-navy hover:text-teal transition-colors"
                        >
                          {(app.pazienti as {nome: string; cognome: string}).nome} {(app.pazienti as {nome: string; cognome: string}).cognome}
                        </Link>
                      ) : (
                        <p className="font-inter text-sm text-navy/40">Paziente non trovato</p>
                      )}
                      {app.note_prenotaz && (
                        <p className="font-inter text-xs text-navy/45 mt-0.5 truncate">{app.note_prenotaz}</p>
                      )}
                    </div>
                    <span className="font-inter text-xs text-navy/40 bg-gray-50 px-3 py-1 rounded-full capitalize shrink-0">
                      {app.tipo}
                    </span>
                    {app.pazienti && (app.pazienti as {telefono?: string}).telefono && (
                      <a
                        href={`https://wa.me/39${(app.pazienti as {telefono: string}).telefono.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center hover:bg-[#25D366]/20 transition-colors"
                        title="WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.122 1.524 5.855L0 24l6.335-1.524A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.005-1.37l-.36-.214-3.727.896.908-3.636-.234-.372A9.818 9.818 0 1112 21.818z" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
