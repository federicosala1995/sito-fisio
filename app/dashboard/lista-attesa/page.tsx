import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ClipboardList, Phone, Mail, Calendar, Clock } from "lucide-react";

export const revalidate = 0;

interface WaitlistRow {
  id: string;
  nome: string;
  cognome: string;
  telefono: string | null;
  email: string | null;
  data_preferita: string | null;
  fascia_oraria: string;
  note: string | null;
  stato: string;
  created_at: string;
}

const fasceLabel: Record<string, string> = {
  mattina: "Mattina",
  pomeriggio: "Pomeriggio",
  qualsiasi: "Qualsiasi",
};

const statoColors: Record<string, string> = {
  "in-attesa": "bg-orange-100 text-orange-600",
  contattato: "bg-blue-100 text-blue-600",
  prenotato: "bg-teal/15 text-teal",
  scaduto: "bg-gray-100 text-gray-400",
};

export default async function ListaAttesaPage() {
  const supabase = await createClient();

  const { data: lista } = await supabase
    .from("lista_attesa")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (lista ?? []) as WaitlistRow[];
  const inAttesa = rows.filter((r) => r.stato === "in-attesa");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-3xl font-semibold text-navy">Lista d&apos;attesa</h1>
          <p className="font-inter text-navy/50 mt-1 text-sm">
            {inAttesa.length} pazienti in attesa di uno slot
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-teal/10 px-4 py-2">
          <ClipboardList size={16} className="text-teal" />
          <span className="font-inter text-sm font-semibold text-teal">{inAttesa.length}</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <ClipboardList size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="font-inter text-navy/40">Nessun paziente in lista d&apos;attesa.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Info paziente */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-inter text-sm font-semibold text-navy">
                    {row.nome} {row.cognome}
                  </p>
                  <span className={`rounded-full px-2.5 py-0.5 font-inter text-xs font-medium ${statoColors[row.stato] ?? "bg-gray-100 text-gray-400"}`}>
                    {row.stato}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {row.telefono && (
                    <a href={`tel:${row.telefono}`} className="flex items-center gap-1.5 font-inter text-xs text-navy/60 hover:text-teal transition-colors">
                      <Phone size={11} />
                      {row.telefono}
                    </a>
                  )}
                  {row.email && (
                    <a href={`mailto:${row.email}`} className="flex items-center gap-1.5 font-inter text-xs text-navy/60 hover:text-teal transition-colors">
                      <Mail size={11} />
                      {row.email}
                    </a>
                  )}
                  <div className="flex items-center gap-1.5 font-inter text-xs text-navy/40">
                    <Clock size={11} />
                    {fasceLabel[row.fascia_oraria] ?? row.fascia_oraria}
                  </div>
                  {row.data_preferita && (
                    <div className="flex items-center gap-1.5 font-inter text-xs text-navy/40">
                      <Calendar size={11} />
                      {format(new Date(row.data_preferita + "T12:00"), "d MMM", { locale: it })}
                    </div>
                  )}
                </div>

                {row.note && (
                  <p className="font-inter text-xs text-navy/40 italic">{row.note}</p>
                )}
              </div>

              {/* Data iscrizione */}
              <div className="shrink-0 text-right">
                <p className="font-inter text-xs text-navy/30">
                  {format(new Date(row.created_at), "d MMM yyyy", { locale: it })}
                </p>
                {row.telefono && (
                  <a
                    href={`https://wa.me/${row.telefono.replace(/\D/g, "")}?text=Ciao%20${encodeURIComponent(row.nome)}%2C%20si%20%C3%A8%20liberato%20uno%20slot!%20Vuoi%20prenotare%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 px-3 py-1.5 font-inter text-xs font-medium text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                  >
                    WhatsApp →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
