import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, calcAge } from "@/lib/utils";
import { ArrowLeft, Phone, MessageCircle, Calendar } from "lucide-react";
import { PianoSedutaButton } from "@/components/dashboard/PianoSedutaButton";
import { NuovaSedutaForm } from "@/components/dashboard/NuovaSedutaForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CartellaPazientePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: paziente }, { data: sedute }, { data: prossApp }] = await Promise.all([
    supabase.from("pazienti").select("*").eq("id", id).single(),
    supabase.from("sedute").select("*").eq("paziente_id", id).order("data", { ascending: false }),
    supabase
      .from("appuntamenti")
      .select("data, ora, tipo")
      .eq("paziente_id", id)
      .gte("data", new Date().toISOString().slice(0, 10))
      .order("data")
      .limit(3),
  ]);

  if (!paziente) notFound();

  const waMsg = `Ciao ${paziente.nome}, ti ricordo l'appuntamento di fisioterapia di domani. A presto!`;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/dashboard/pazienti" className="inline-flex items-center gap-1 font-inter text-sm text-navy/40 hover:text-teal mb-3">
            <ArrowLeft size={13} />
            Pazienti
          </Link>
          <h1 className="font-fraunces text-3xl font-semibold text-navy">
            {paziente.nome} {paziente.cognome}
          </h1>
          {paziente.data_nascita && (
            <p className="font-inter text-sm text-navy/50 mt-1">
              {calcAge(paziente.data_nascita)} anni · {formatDate(paziente.data_nascita)}
            </p>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          {paziente.telefono && (
            <>
              <a
                href={`tel:${paziente.telefono}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 font-inter text-sm text-navy/70 hover:border-teal hover:text-teal transition-all"
              >
                <Phone size={14} />
                Chiama
              </a>
              <a
                href={`https://wa.me/39${paziente.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-inter text-sm font-medium text-white hover:bg-[#20c05a] transition-all"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Anagrafica */}
        <div className="md:col-span-1 space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
            <h2 className="font-fraunces text-lg font-semibold text-navy">Anagrafica</h2>
            {[
              { label: "Telefono", value: paziente.telefono },
              { label: "Email", value: paziente.email },
              { label: "Sesso", value: paziente.sesso },
              { label: "Patologia", value: paziente.patologia },
              { label: "Stato", value: paziente.stato },
            ].map(({ label, value }) =>
              value ? (
                <div key={label}>
                  <p className="font-inter text-xs text-navy/35 uppercase tracking-wide">{label}</p>
                  <p className="font-inter text-sm text-navy mt-0.5">{value}</p>
                </div>
              ) : null
            )}
          </div>

          {/* Prossimi appuntamenti */}
          {prossApp && prossApp.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-3">
              <h2 className="font-fraunces text-base font-semibold text-navy flex items-center gap-2">
                <Calendar size={15} className="text-teal" />
                Prossimi appuntamenti
              </h2>
              {prossApp.map((app, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-fraunces text-lg font-semibold text-teal">{app.ora.slice(0, 5)}</span>
                  <span className="font-inter text-xs text-navy/50">{formatDate(app.data)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cartella clinica */}
        <div className="md:col-span-2 space-y-5">
          {/* Valutazione iniziale */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-lg font-semibold text-navy">Valutazione iniziale</h2>
              {paziente.vas_iniziale !== null && (
                <span className="font-inter text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full">
                  VAS iniziale: {paziente.vas_iniziale}/10
                </span>
              )}
            </div>
            {[
              { label: "Anamnesi", value: paziente.anamnesi },
              { label: "Diagnosi", value: paziente.diagnosi },
              { label: "Obiettivi terapeutici", value: paziente.obiettivi },
              { label: "Note generali", value: paziente.note },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-inter text-xs text-navy/35 uppercase tracking-wide mb-1">{label}</p>
                <p className="font-inter text-sm text-navy/70 leading-relaxed whitespace-pre-wrap">
                  {value ?? <span className="italic text-navy/25">Non compilato</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Piano seduta AI */}
          <PianoSedutaButton pazienteId={id} />

          {/* Nuova seduta */}
          <NuovaSedutaForm pazienteId={id} />

          {/* Diario sedute */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="font-fraunces text-lg font-semibold text-navy mb-5">Diario sedute</h2>
            {sedute && sedute.length > 0 ? (
              <div className="space-y-5">
                {sedute.map((s) => (
                  <div key={s.id} className="border-l-2 border-teal/30 pl-5 py-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <time className="font-fraunces text-sm font-semibold text-teal">{formatDate(s.data)}</time>
                      {s.vas_pre !== null && (
                        <span className="font-inter text-xs text-navy/40">VAS pre: {s.vas_pre}</span>
                      )}
                      {s.vas_post !== null && (
                        <span className="font-inter text-xs text-teal/70">VAS post: {s.vas_post}</span>
                      )}
                    </div>
                    {s.trattamento && (
                      <p className="font-inter text-sm text-navy/70"><strong>Trattamento:</strong> {s.trattamento}</p>
                    )}
                    {s.esercizi && (
                      <p className="font-inter text-sm text-navy/70"><strong>Esercizi:</strong> {s.esercizi}</p>
                    )}
                    {s.note && (
                      <p className="font-inter text-sm text-navy/55 italic">{s.note}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-inter text-sm text-navy/35 text-center py-8">
                Nessuna seduta registrata ancora.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
