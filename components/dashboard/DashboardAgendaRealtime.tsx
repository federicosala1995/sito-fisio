"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserCheck, Clock, AlertCircle, User } from "lucide-react";

interface AppRow {
  id: string;
  ora: string;
  stato: string;
  check_in_at: string | null;
  note_prenotaz: string | null;
  pazienti: { nome: string; cognome: string } | null;
}

interface Props {
  initialData: AppRow[];
  today: string;
}

export function DashboardAgendaRealtime({ initialData, today }: Props) {
  const [data, setData] = useState<AppRow[]>(initialData);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("agenda-today")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appuntamenti", filter: `data=eq.${today}` },
        async () => {
          const { data: fresh } = await supabase
            .from("appuntamenti")
            .select("id, ora, stato, check_in_at, note_prenotaz, pazienti(nome, cognome)")
            .eq("data", today)
            .neq("stato", "annullato")
            .order("ora");
          if (fresh) setData(fresh as AppRow[]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [today]);

  if (data.length === 0) {
    return (
      <p className="font-inter text-sm text-navy/40 py-8 text-center">
        Nessun appuntamento per oggi.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {data.map((app) => {
        const hasCheckin = !!app.check_in_at;
        const isNoShow = app.stato === "no-show";
        return (
          <div
            key={app.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              hasCheckin
                ? "bg-teal/5 border-teal/20"
                : isNoShow
                ? "bg-orange-50 border-orange-100"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            {/* Orario */}
            <div className="text-center shrink-0 w-14">
              <p className={`font-fraunces text-xl font-semibold ${hasCheckin ? "text-teal" : "text-navy"}`}>
                {app.ora.slice(0, 5)}
              </p>
            </div>

            {/* Paziente */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-navy/30 shrink-0" />
                <p className="font-inter text-sm font-medium text-navy truncate">
                  {app.pazienti ? `${app.pazienti.nome} ${app.pazienti.cognome}` : "Paziente"}
                </p>
              </div>
              {app.note_prenotaz && (
                <p className="font-inter text-xs text-navy/40 truncate mt-0.5">{app.note_prenotaz}</p>
              )}
            </div>

            {/* Status badge */}
            <div className="shrink-0">
              {hasCheckin ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-3 py-1 font-inter text-xs font-medium text-teal">
                  <UserCheck size={11} />
                  Check-in
                </span>
              ) : isNoShow ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 font-inter text-xs font-medium text-orange-600">
                  <AlertCircle size={11} />
                  No-show
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 font-inter text-xs font-medium text-navy/40">
                  <Clock size={11} />
                  Confermato
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
