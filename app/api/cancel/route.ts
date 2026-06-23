import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendCancellationEmail } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ ok: false, msg: "Token mancante." }, { status: 400 });
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("cancella_appuntamento", { p_token: token });

  if (error) {
    console.error("[CANCEL]", error);
    return NextResponse.json({ ok: false, msg: "Errore di sistema." }, { status: 500 });
  }

  const res = data as { ok: boolean; data?: string; ora?: string; msg?: string };

  if (res.ok) {
    const supabase2 = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: appData } = await (supabase2 as any)
      .from("appuntamenti")
      .select("email_paziente, pazienti(nome)")
      .eq("cancellation_token", token)
      .single();

    if (appData?.email_paziente) {
      const paziente = appData.pazienti as { nome: string } | null;
      sendCancellationEmail({
        to: appData.email_paziente,
        nome: paziente?.nome ?? "Paziente",
        data: res.data ?? "",
        ora: res.ora ?? "",
      }).catch(() => {});
    }
  }

  return NextResponse.json(res);
}
