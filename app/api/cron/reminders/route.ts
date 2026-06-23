import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendReminderEmail } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createClient() as any;
  let sent24 = 0;
  let sent2 = 0;

  type NotifyRow = {
    app_id: string;
    email_paziente: string;
    nome_paziente: string;
    data_app: string;
    ora_app: string;
    checkin_token: string;
    cancel_token: string;
  };

  // Promemoria 24h
  const { data: rows24, error: e24 } = await supabase.rpc("appuntamenti_da_notificare", { p_ore: 24 });

  if (!e24 && rows24) {
    for (const row of rows24 as NotifyRow[]) {
      const ok = await sendReminderEmail({
        to: row.email_paziente,
        nome: row.nome_paziente,
        data: row.data_app,
        ora: row.ora_app,
        checkinToken: row.checkin_token,
        cancelToken: row.cancel_token,
        tipo: "24h",
      });
      if (ok) {
        await supabase.from("appuntamenti").update({ notifica_24h_inv: true }).eq("id", row.app_id);
        sent24++;
      }
    }
  }

  // Promemoria 2h
  const { data: rows2, error: e2 } = await supabase.rpc("appuntamenti_da_notificare", { p_ore: 2 });

  if (!e2 && rows2) {
    for (const row of rows2 as NotifyRow[]) {
      const ok = await sendReminderEmail({
        to: row.email_paziente,
        nome: row.nome_paziente,
        data: row.data_app,
        ora: row.ora_app,
        checkinToken: row.checkin_token,
        cancelToken: row.cancel_token,
        tipo: "2h",
      });
      if (ok) {
        await supabase.from("appuntamenti").update({ notifica_2h_inv: true }).eq("id", row.app_id);
        sent2++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent_24h: sent24, sent_2h: sent2, timestamp: new Date().toISOString() });
}
