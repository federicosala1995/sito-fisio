"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function Contatti() {
  const [form, setForm] = useState({ nome: "", email: "", messaggio: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Placeholder: in produzione invia via API route o servizio email
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  }

  return (
    <section className="py-28 bg-navy relative overflow-hidden" id="contatti">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,#15B8A608_0%,transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-3">
            Parliamo
          </p>
          <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-white leading-tight">
            Contatti
          </h2>
          <p className="font-inter text-white/50 mt-4">
            Per informazioni, disponibilità o qualsiasi domanda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Info */}
          <div className="space-y-6">
            {[
              {
                icon: Phone,
                label: "Telefono / WhatsApp",
                value: "+39 345 443 1758",
                href: "tel:+393454431758",
              },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "Scrivimi su WhatsApp",
                href: "https://wa.me/393454431758?text=Ciao%20Federico%2C%20vorrei%20informazioni",
              },
              {
                icon: Mail,
                label: "Email",
                value: "[EMAIL DA INSERIRE]",
                href: "mailto:[email]",
              },
              {
                icon: MapPin,
                label: "Studio",
                value: "Castrezzato (BS) — [INDIRIZZO DA INSERIRE]",
                href: undefined,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <item.icon size={16} className="text-teal" />
                </div>
                <div>
                  <p className="font-inter text-xs text-white/30 uppercase tracking-wide mb-1">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="font-inter text-white/80 hover:text-teal transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-inter text-white/80">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 h-48 flex items-center justify-center">
              <p className="font-inter text-xs text-white/25 text-center px-4">
                Integra qui Google Maps embed<br />
                (Settings → Maps → Embed codice iframe)
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-8">
                <div className="w-14 h-14 rounded-full bg-teal/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-fraunces text-xl font-semibold text-white">Messaggio inviato!</h3>
                <p className="font-inter text-sm text-white/50">Ti rispondo entro 24 ore.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-inter text-sm font-medium text-white/70">Nome</label>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 font-inter text-white placeholder:text-white/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-sm font-medium text-white/70">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 font-inter text-white placeholder:text-white/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                    placeholder="la@tua.email"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-inter text-sm font-medium text-white/70">Messaggio</label>
                  <textarea
                    required
                    rows={4}
                    value={form.messaggio}
                    onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 font-inter text-white placeholder:text-white/25 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 resize-none"
                    placeholder="Di cosa hai bisogno?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 font-inter text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all duration-200 hover:bg-teal-600 active:scale-95 disabled:opacity-60"
                >
                  <Send size={16} />
                  {loading ? "Invio in corso…" : "Invia messaggio"}
                </button>
                <p className="font-inter text-xs text-white/25 text-center">
                  Questo form è per informazioni generali. Per prenotare usa il sistema dedicato.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
