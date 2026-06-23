import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, UserPlus, Phone } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function PazientiPage() {
  const supabase = await createClient();
  const { data: pazienti } = await supabase
    .from("pazienti")
    .select("id, nome, cognome, telefono, patologia, stato, created_at")
    .order("cognome");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-3xl font-semibold text-navy">Pazienti</h1>
          <p className="font-inter text-sm text-navy/50 mt-1">
            {pazienti?.length ?? 0} pazienti totali
          </p>
        </div>
      </div>

      {/* Tabella */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Cerca paziente…"
              className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 font-inter text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </div>
        </div>

        {pazienti && pazienti.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {pazienti.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/pazienti/${p.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                  <span className="font-fraunces text-sm font-semibold text-teal">
                    {p.nome[0]}{p.cognome[0]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm font-medium text-navy group-hover:text-teal transition-colors">
                    {p.cognome} {p.nome}
                  </p>
                  {p.patologia && (
                    <p className="font-inter text-xs text-navy/40 truncate">{p.patologia}</p>
                  )}
                </div>

                {p.telefono && (
                  <a
                    href={`tel:${p.telefono}`}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 p-2 rounded-lg hover:bg-teal/10 transition-colors"
                    title={p.telefono}
                  >
                    <Phone size={14} className="text-navy/40" />
                  </a>
                )}

                <span
                  className={`shrink-0 font-inter text-xs px-2.5 py-1 rounded-full ${
                    p.stato === "attivo"
                      ? "bg-teal/10 text-teal"
                      : p.stato === "dimesso"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {p.stato}
                </span>

                <time className="font-inter text-xs text-navy/30 shrink-0 hidden sm:block">
                  {formatDate(p.created_at)}
                </time>
              </Link>
            ))}
          </div>
        ) : (
          <p className="font-inter text-sm text-navy/40 py-16 text-center">
            Nessun paziente ancora. Le prenotazioni online creano automaticamente il profilo.
          </p>
        )}
      </div>
    </div>
  );
}
