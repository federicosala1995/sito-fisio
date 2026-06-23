import { createClient } from "@/lib/supabase/server";
import { format, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { Bell, MessageCircle } from "lucide-react";

export default async function PromemoriáPage() {
  const supabase = await createClient();
  const domani = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const { data: appDomani } = await supabase
    .from("appuntamenti")
    .select("id, ora, promemoria_inv, note_prenotaz, pazienti(id, nome, cognome, telefono)")
    .eq("data", domani)
    .order("ora");

  function buildWaMsg(nome: string, ora: string): string {
    return `Ciao ${nome}! Ti ricordo il tuo appuntamento di fisioterapia domani alle ${ora.slice(0, 5)}. Se hai bisogno di spostarlo contattami pure. A presto!`;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-fraunces text-3xl font-semibold text-navy">Promemoria</h1>
        <p className="font-inter text-sm text-navy/50 mt-1">
          Appuntamenti di domani — {format(addDays(new Date(), 1), "EEEE d MMMM", { locale: it })}
        </p>
      </div>

      {appDomani && appDomani.length > 0 ? (
        <div className="space-y-4">
          {appDomani.map((app) => {
            const paz = app.pazienti as { id: string; nome: string; cognome: string; telefono: string | null } | null;
            const msg = paz ? buildWaMsg(paz.nome, app.ora) : "";
            const waUrl = paz?.telefono
              ? `https://wa.me/39${paz.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`
              : null;

            return (
              <div
                key={app.id}
                className={`rounded-2xl border p-5 flex items-center gap-5 transition-all ${
                  app.promemoria_inv
                    ? "border-teal/20 bg-teal/5"
                    : "border-gray-100 bg-white"
                }`}
              >
                {/* Ora */}
                <div className="text-center shrink-0 w-14">
                  <p className="font-fraunces text-2xl font-semibold text-teal leading-none">
                    {app.ora.slice(0, 5)}
                  </p>
                </div>

                {/* Info paziente */}
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm font-medium text-navy">
                    {paz ? `${paz.nome} ${paz.cognome}` : "Paziente non trovato"}
                  </p>
                  {paz?.telefono && (
                    <p className="font-inter text-xs text-navy/40">{paz.telefono}</p>
                  )}
                  {app.note_prenotaz && (
                    <p className="font-inter text-xs text-navy/35 truncate mt-0.5">{app.note_prenotaz}</p>
                  )}
                </div>

                {/* Status badge */}
                {app.promemoria_inv && (
                  <span className="shrink-0 inline-flex items-center gap-1.5 font-inter text-xs text-teal bg-teal/10 px-3 py-1 rounded-full">
                    <Bell size={11} />
                    Inviato
                  </span>
                )}

                {/* WhatsApp button con messaggio precompilato */}
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-inter text-sm font-medium text-white hover:bg-[#20c05a] active:scale-95 transition-all"
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200">
          <Bell size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="font-inter text-navy/40">Nessun appuntamento per domani.</p>
        </div>
      )}
    </div>
  );
}
