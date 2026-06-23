import { createClient } from "@/lib/supabase/server";
import { format, startOfWeek, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar, Users, Clock, TrendingUp, UserCheck, AlertTriangle, ClipboardList } from "lucide-react";
import Link from "next/link";
import { DashboardAgendaRealtime } from "@/components/dashboard/DashboardAgendaRealtime";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6), "yyyy-MM-dd");
  const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");

  const [
    { count: totPazienti },
    { data: oggiApp },
    { count: settimanaApp },
    { count: meseApp },
    { count: annullati },
    { count: noShow },
    { count: listaAttesa },
    { count: checkIn },
  ] = await Promise.all([
    supabase.from("pazienti").select("*", { count: "exact", head: true }),
    supabase
      .from("appuntamenti")
      .select("id, ora, stato, check_in_at, note_prenotaz, pazienti(nome, cognome)")
      .eq("data", today)
      .neq("stato", "annullato")
      .order("ora"),
    supabase
      .from("appuntamenti")
      .select("*", { count: "exact", head: true })
      .gte("data", weekStart)
      .lte("data", weekEnd)
      .neq("stato", "annullato"),
    supabase
      .from("appuntamenti")
      .select("*", { count: "exact", head: true })
      .gte("data", monthStart)
      .lte("data", today)
      .neq("stato", "annullato"),
    supabase
      .from("appuntamenti")
      .select("*", { count: "exact", head: true })
      .eq("stato", "annullato")
      .gte("data", monthStart),
    supabase
      .from("appuntamenti")
      .select("*", { count: "exact", head: true })
      .eq("stato", "no-show")
      .gte("data", monthStart),
    supabase.from("lista_attesa").select("*", { count: "exact", head: true }).eq("stato", "in-attesa"),
    supabase
      .from("appuntamenti")
      .select("*", { count: "exact", head: true })
      .not("check_in_at", "is", null)
      .gte("data", monthStart),
  ]);

  const totMese = (meseApp ?? 0) + (annullati ?? 0);
  const occupancy = totMese > 0 ? Math.round(((meseApp ?? 0) / totMese) * 100) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buongiorno";
    if (h < 18) return "Buon pomeriggio";
    return "Buonasera";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-fraunces text-3xl font-semibold text-navy">{greeting()}, Federico.</h1>
          <p className="font-inter text-navy/50 mt-1 text-sm capitalize">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: it })}
          </p>
        </div>
        <Link
          href="/dashboard/statistiche"
          className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 font-inter text-xs text-navy/60 hover:border-teal hover:text-teal transition-all"
        >
          <TrendingUp size={13} />
          Statistiche
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          label="Pazienti totali"
          value={totPazienti ?? 0}
          href="/dashboard/pazienti"
          color="teal"
        />
        <KpiCard
          icon={Calendar}
          label="Appuntamenti oggi"
          value={oggiApp?.length ?? 0}
          href="/dashboard/agenda"
          color="navy"
        />
        <KpiCard
          icon={Clock}
          label="Questa settimana"
          value={settimanaApp ?? 0}
          href="/dashboard/agenda"
          color="teal"
        />
        <KpiCard
          icon={TrendingUp}
          label="Occupancy mese"
          value={`${occupancy}%`}
          href="/dashboard/statistiche"
          color={occupancy >= 70 ? "teal" : occupancy >= 40 ? "navy" : "gray"}
        />
      </div>

      {/* Row secondaria */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UserCheck size={14} className="text-teal" />
            <span className="font-inter text-xs text-navy/40 uppercase tracking-wide">Check-in mese</span>
          </div>
          <p className="font-fraunces text-3xl font-semibold text-navy">{checkIn ?? 0}</p>
          <p className="font-inter text-xs text-navy/30">/{meseApp ?? 0} confermati</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-orange-400" />
            <span className="font-inter text-xs text-navy/40 uppercase tracking-wide">Annullati mese</span>
          </div>
          <p className="font-fraunces text-3xl font-semibold text-navy">{annullati ?? 0}</p>
          <p className="font-inter text-xs text-navy/30">no-show: {noShow ?? 0}</p>
        </div>
        <Link
          href="/dashboard/lista-attesa"
          className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-1 hover:border-teal/30 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2">
            <ClipboardList size={14} className="text-navy/40 group-hover:text-teal transition-colors" />
            <span className="font-inter text-xs text-navy/40 uppercase tracking-wide">Lista d&apos;attesa</span>
          </div>
          <p className="font-fraunces text-3xl font-semibold text-navy">{listaAttesa ?? 0}</p>
          <p className="font-inter text-xs text-teal">in attesa →</p>
        </Link>
      </div>

      {/* Agenda di oggi — realtime */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-fraunces text-xl font-semibold text-navy">Agenda di oggi</h2>
          <Link href="/dashboard/agenda" className="font-inter text-xs text-teal hover:underline">
            Vedi tutto →
          </Link>
        </div>
        <DashboardAgendaRealtime
          initialData={(oggiApp ?? []) as {
            id: string;
            ora: string;
            stato: string;
            check_in_at: string | null;
            note_prenotaz: string | null;
            pazienti: { nome: string; cognome: string } | null;
          }[]}
          today={today}
        />
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  href,
  color = "teal",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  href: string;
  color?: "teal" | "navy" | "gray";
}) {
  const iconBg =
    color === "teal" ? "bg-teal/10 text-teal" : color === "navy" ? "bg-navy/10 text-navy" : "bg-gray-100 text-gray-400";

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-100 bg-white p-5 hover:border-teal/30 hover:shadow-md transition-all"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${iconBg}`}>
        <Icon size={16} />
      </div>
      <p className="font-inter text-xs text-navy/40 uppercase tracking-wide mb-1">{label}</p>
      <p className="font-fraunces text-3xl font-semibold text-navy">{value}</p>
    </Link>
  );
}
