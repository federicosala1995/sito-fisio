"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Clock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckInPage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");
  const [appData, setAppData] = useState<{ data?: string; ora?: string; msg?: string } | null>(null);

  useEffect(() => {
    async function doCheckIn() {
      try {
        const res = await fetch("/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: params.token }),
        });
        const data = await res.json();

        if (!data.ok) {
          setAppData({ msg: data.msg });
          setStatus("error");
        } else if (data.gia_effettuato) {
          setAppData({ data: data.data, ora: data.ora });
          setStatus("already");
        } else {
          setAppData({ data: data.data, ora: data.ora });
          setStatus("success");
        }
      } catch {
        setStatus("error");
        setAppData({ msg: "Errore di connessione. Riprova o contattaci." });
      }
    }

    doCheckIn();
  }, [params.token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/brand */}
        <div className="text-center mb-8">
          <p className="font-inter text-xs text-teal font-semibold tracking-widest uppercase">Federico · Fisioterapista</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg shadow-navy/5 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-navy px-8 py-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock size={18} className="text-teal" />
              <h1 className="font-fraunces text-xl font-semibold text-white">Check-in digitale</h1>
            </div>
          </div>

          <div className="px-8 py-10 text-center space-y-6">
            {status === "loading" && (
              <>
                <Loader2 size={40} className="text-teal animate-spin mx-auto" />
                <p className="font-inter text-navy/60">Elaborazione check-in in corso…</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} className="text-teal" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-fraunces text-2xl font-semibold text-navy">Check-in effettuato!</h2>
                  <p className="font-inter text-navy/60">
                    La tua presenza è stata registrata.
                  </p>
                  {appData?.data && appData?.ora && (
                    <div className="inline-block bg-teal/8 rounded-xl px-4 py-2.5 mt-2">
                      <p className="font-inter text-teal font-semibold">{appData.ora}</p>
                      <p className="font-inter text-navy/50 text-sm">{appData.data}</p>
                    </div>
                  )}
                </div>
                <p className="font-inter text-sm text-navy/50">
                  Ti aspettiamo! Lo studio è in via Castrezzato (BS).
                </p>
              </>
            )}

            {status === "already" && (
              <>
                <div className="w-20 h-20 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} className="text-teal" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-fraunces text-2xl font-semibold text-navy">Già registrato</h2>
                  <p className="font-inter text-navy/60">
                    Hai già effettuato il check-in per questo appuntamento.
                  </p>
                  {appData?.data && appData?.ora && (
                    <div className="inline-block bg-gray-50 rounded-xl px-4 py-2.5 mt-2">
                      <p className="font-inter text-navy font-semibold">{appData.ora}</p>
                      <p className="font-inter text-navy/50 text-sm">{appData.data}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto">
                  <AlertCircle size={36} className="text-red-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-fraunces text-2xl font-semibold text-navy">Errore</h2>
                  <p className="font-inter text-navy/60">
                    {appData?.msg ?? "Link non valido o scaduto."}
                  </p>
                </div>
                <a
                  href="tel:+393454431758"
                  className="inline-block rounded-full bg-teal px-6 py-3 font-inter text-sm font-semibold text-white hover:bg-teal/90 transition-all"
                >
                  Chiama +39 345 443 1758
                </a>
              </>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-1.5 font-inter text-sm text-navy/40 hover:text-teal transition-colors">
            <ArrowLeft size={14} />
            Torna al sito
          </Link>
        </div>
      </div>
    </div>
  );
}
