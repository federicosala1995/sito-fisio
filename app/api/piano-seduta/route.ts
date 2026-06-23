import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Auth check — solo il fisioterapista loggato
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { pazienteId } = await req.json();
  if (!pazienteId) {
    return NextResponse.json({ error: "pazienteId mancante" }, { status: 400 });
  }

  // Recupera dati clinici del paziente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ data: paziente }, { data: sedute }] = await Promise.all([
    (supabase as any).from("pazienti").select("nome, cognome, patologia, diagnosi, obiettivi, anamnesi, vas_iniziale").eq("id", pazienteId).single(),
    (supabase as any).from("sedute").select("data, trattamento, esercizi, vas_pre, vas_post, note").eq("paziente_id", pazienteId).order("data", { ascending: false }).limit(3),
  ]) as [{ data: { nome: string; cognome: string; patologia?: string; diagnosi?: string; obiettivi?: string; anamnesi?: string; vas_iniziale?: number } | null }, { data: { data: string; trattamento?: string; esercizi?: string; vas_pre?: number; vas_post?: number; note?: string }[] | null }];

  if (!paziente) {
    return NextResponse.json({ error: "Paziente non trovato" }, { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chiave API non configurata" }, { status: 503 });
  }

  const prompt = `Sei un assistente per fisioterapisti. Analizza il seguente quadro clinico e suggerisci un piano per la prossima seduta, basato sull'evidenza scientifica. Rispondi in italiano, in modo conciso e strutturato.

PAZIENTE: ${paziente.nome} ${paziente.cognome}
PATOLOGIA/DIAGNOSI: ${paziente.patologia ?? "non specificata"} — ${paziente.diagnosi ?? ""}
OBIETTIVI: ${paziente.obiettivi ?? "non specificati"}
ANAMNESI: ${paziente.anamnesi ?? "non disponibile"}
VAS INIZIALE: ${paziente.vas_iniziale ?? "non rilevato"}/10

ULTIME SEDUTE:
${sedute && sedute.length > 0
  ? sedute.map((s) => `- ${s.data}: ${s.trattamento ?? ""} | Esercizi: ${s.esercizi ?? ""} | VAS pre: ${s.vas_pre} → post: ${s.vas_post} | Note: ${s.note ?? ""}`).join("\n")
  : "Nessuna seduta precedente registrata."}

COMPITO: Suggerisci per la prossima seduta:
1. Obiettivo principale della seduta
2. Tecniche/trattamenti consigliati (con razionale evidence-based)
3. Esercizi terapeutici (nome, parametri, progressione)
4. Criteri di progressione e segnali di attenzione
5. Eventuale homework per il paziente`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const piano = data.content?.[0]?.text ?? "Nessuna risposta generata.";

    return NextResponse.json({ piano });
  } catch (err) {
    console.error("Piano seduta error:", err);
    return NextResponse.json({ error: "Errore generazione piano" }, { status: 500 });
  }
}
