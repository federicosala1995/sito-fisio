import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmail, sendReminderEmail } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, to, nome, data, ora, checkinToken, cancelToken } = body;

    if (!tipo || !to || !nome || !data || !ora) {
      return NextResponse.json({ ok: false, msg: "Parametri mancanti." }, { status: 400 });
    }

    let sent = false;

    if (tipo === "conferma") {
      sent = await sendConfirmationEmail({ to, nome, data, ora, checkinToken, cancelToken });
    } else if (tipo === "promemoria_24h") {
      sent = await sendReminderEmail({ to, nome, data, ora, checkinToken, cancelToken, tipo: "24h" });
    } else if (tipo === "promemoria_2h") {
      sent = await sendReminderEmail({ to, nome, data, ora, checkinToken, cancelToken, tipo: "2h" });
    } else {
      return NextResponse.json({ ok: false, msg: "Tipo non valido." }, { status: 400 });
    }

    return NextResponse.json({ ok: sent });
  } catch (err) {
    console.error("[NOTIFICATIONS API]", err);
    return NextResponse.json({ ok: false, msg: "Errore interno." }, { status: 500 });
  }
}
