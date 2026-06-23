"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

const WA = "https://wa.me/393454431758?text=Ciao%20Federico%2C%20vorrei%20prenotare%20un%20nuovo%20appuntamento";

export default function CancelPage({ params }: { params: { token: string } }) {
  const [step, setStep] = useState<"confirm" | "loading" | "success" | "error">("confirm");
  const [appData, setAppData] = useState<{ data?: string; ora?: string; msg?: string } | null>(null);

  async function handleCancel() {
    setStep("loading");

    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token }),
      });
      const data = await res.json();

      if (!data.ok) {
        setAppData({ msg: data.msg });
        setStep("error");
      } else {
        setAppData({ data: data.data, ora: data.ora });
        setStep("success");
      }
    } catch {
      setAppData({ msg: "Errore di connessione. Riprova o contattaci." });
      setStep("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <p className="font-inter text-xs text-teal font-semibold tracking-widest uppercase">Federico · Fisioterapista</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg shadow-navy/5 border border-gray-100 overflow-hidden">
          <div className="bg-navy px-8 py-6 text-center">
            <h1 className="font-fraunces text-xl font-semibold text-white">Annulla appuntamento</h1>
          </div>

          <div className="px-8 py-10 text-center space-y-6">
            {step === "confirm" && (
              <>
                <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center mx-auto">
                  <AlertCircle size={36} className="text-orange-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-fraunces text-xl font-semibold text-navy">Sei sicuro?</h2>
                  <p className="font-inter text-navy/60 text-sm leading-relaxed">
                    Stai per annullare il tuo appuntamento. Questa azione non può essere annullata.
                    Se vuoi solo spostare l&apos;appuntamento, contattaci direttamente.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleCancel}
                    className="w-full rounded-full bg-red-500 py-3.5 font-inter text-sm font-semibold text-white hover:bg-red-600 transition-all"
                  >
                    Sì, annulla l&apos;appuntamento
                  </button>
                  <a
                    href={WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-full border-2 border-teal py-3.5 font-inter text-sm font-semibold text-teal hover:bg-teal hover:text-white transition-all"
                  >
                    <MessageCircle size={15} />
                    Sposta via WhatsApp
                  </a>
                </div>
              </>
            )}

            {step === "loading" && (
              <>
                <Loader2 size={40} className="text-teal animate-spin mx-auto" />
                <p className="font-inter text-navy/60">Annullamento in corso…</p>
              </>
            )}

            {step === "success" && (
              <>
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} className="text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-fraunces text-2xl font-semibold text-navy">Appuntamento annullato</h2>
                  <p className="font-inter text-navy/60">
                    Il tuo appuntamento del{" "}
                    <strong>
                      {appData?.data} alle {appData?.ora}
                    </strong>{" "}
                    è stato annullato con successo.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/prenota"
                    className="block rounded-full bg-teal py-3.5 font-inter text-sm font-semibold text-white hover:bg-teal/90 transition-all"
                  >
                    Prenota un nuovo appuntamento
                  </Link>
                  <a
                    href={WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-full border border-gray-200 py-3 font-inter text-sm text-navy/60 hover:border-teal hover:text-teal transition-all"
                  >
                    <MessageCircle size={14} />
                    Scrivi su WhatsApp
                  </a>
                </div>
              </>
            )}

            {step === "error" && (
              <>
                <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto">
                  <AlertCircle size={36} className="text-red-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-fraunces text-2xl font-semibold text-navy">Impossibile annullare</h2>
                  <p className="font-inter text-navy/60">
                    {appData?.msg ?? "Il link non è valido o l'appuntamento non esiste."}
                  </p>
                </div>
                <a
                  href="tel:+393454431758"
                  className="inline-block rounded-full bg-navy px-6 py-3 font-inter text-sm font-semibold text-white hover:bg-navy/90 transition-all"
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
