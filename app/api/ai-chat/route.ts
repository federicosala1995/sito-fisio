import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const SYSTEM_PROMPT = `Sei l'assistente virtuale del fisioterapista Federico, con studio a Castrezzato (BS) in Franciacorta.

Informazioni sullo studio:
- Fisioterapista: Federico (laurea in fisioterapia, specializzato in fisioterapia muscoloscheletrica)
- Sede: Castrezzato, Brescia – Franciacorta
- Telefono: +39 345 443 1758
- WhatsApp disponibile
- Prenotazioni online su /prenota
- Orari: Lun–Sab, 9:00–19:00 (con pausa 12:00–14:00)
- Durata seduta: 45 minuti
- Specialità: dolori schiena, ginocchio, spalla, caviglia, fisioterapia post-operatoria, riabilitazione sportiva, cervicale, postura

Cosa puoi fare:
- Rispondere a domande sulla fisioterapia e sui trattamenti
- Spiegare come funzionano le sedute e il sistema di prenotazione
- Fornire informazioni generali su sintomi comuni (senza diagnosi medica)
- Indicare come prenotare un appuntamento

Cosa NON fare:
- Non fare diagnosi mediche precise
- Non prescrivere farmaci
- Non inventare informazioni non fornite
- Per domande mediche specifiche, suggerisci sempre di consultare il fisioterapista o un medico

Stile: cordiale, professionale, conciso. Rispondi in italiano. Tieni le risposte brevi (max 3-4 frasi salvo necessità).
Se non sai rispondere, invita a contattare Federico direttamente.`;

export async function POST(req: NextRequest) {
  if (!client) {
    return NextResponse.json(
      { reply: "L'assistente AI non è al momento disponibile. Puoi contattarci direttamente al +39 345 443 1758 o via WhatsApp." },
      { status: 200 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Limite anti-abuse: max 20 messaggi nella cronologia
    const recentMessages = messages.slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: String(m.content).slice(0, 1000),
    }));

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: recentMessages,
    });

    const reply =
      response.content[0]?.type === "text" ? response.content[0].text : "Non ho potuto elaborare la risposta.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[AI-CHAT]", err);
    return NextResponse.json(
      { reply: "Mi dispiace, si è verificato un problema. Contatta Federico al +39 345 443 1758." },
      { status: 200 }
    );
  }
}
