import { NextRequest, NextResponse } from "next/server";
import { generateICS } from "@/lib/ical";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data") ?? "";
  const ora = searchParams.get("ora") ?? "";
  const nome = searchParams.get("nome") ?? "Paziente";

  if (!data || !ora) {
    return new NextResponse("Parametri mancanti", { status: 400 });
  }

  const ics = generateICS({ nome, data, ora });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="appuntamento-${data}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
