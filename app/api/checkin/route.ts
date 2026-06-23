import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ ok: false, msg: "Token mancante." }, { status: 400 });
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("esegui_check_in", { p_token: token });

  if (error) {
    console.error("[CHECKIN]", error);
    return NextResponse.json({ ok: false, msg: "Errore di sistema." }, { status: 500 });
  }

  return NextResponse.json(data);
}
