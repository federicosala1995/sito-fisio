"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { RomArc } from "@/components/ui/RomArc";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Credenziali non valide. Controlla email e password.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,#15B8A610_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <RomArc variant="mini" className="text-teal mx-auto" />
          <h1 className="font-fraunces text-3xl font-semibold text-white">Area riservata</h1>
          <p className="font-inter text-sm text-white/40">Accesso per Federico — Fisioterapista</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-5"
        >
          <div className="space-y-1.5">
            <label className="font-inter text-sm font-medium text-white/70">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff" }}
                className="w-full rounded-xl border border-white/20 pl-10 pr-4 py-3 font-inter placeholder:text-white/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                placeholder="la@tua.email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-inter text-sm font-medium text-white/70">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff" }}
                className="w-full rounded-xl border border-white/20 pl-10 pr-4 py-3 font-inter placeholder:text-white/30 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="font-inter text-sm text-red-400 bg-red-500/10 px-4 py-2.5 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-teal py-3.5 font-inter text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:bg-teal-600 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Accesso in corso…" : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}
