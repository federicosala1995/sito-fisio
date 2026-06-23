"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, Loader2 } from "lucide-react";

interface SlotGridProps {
  date: string; // "yyyy-MM-dd"
  onSelect: (slot: string) => void;
}

export function SlotGrid({ date, onSelect }: SlotGridProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    supabase
      .rpc("slot_liberi", { giorno: date })
      .then(({ data, error: rpcError }) => {
        if (cancelled) return;
        if (rpcError) {
          setError("Impossibile caricare gli orari. Riprova.");
          return;
        }
        // Filtra slot già passati se il giorno è oggi
        const now = new Date();
        const isToday = date === now.toISOString().slice(0, 10);
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const available = ((data as string[]) ?? []).filter((slot) => {
          if (!isToday) return true;
          const [h, m] = slot.split(":").map(Number);
          return h * 60 + m > nowMinutes + 30; // Buffer 30 min
        });

        setSlots(available);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [date]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-3 text-navy/50">
        <Loader2 size={18} className="animate-spin" />
        <span className="font-inter text-sm">Carico gli orari disponibili…</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center font-inter text-sm text-red-500 py-8">{error}</p>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-10 space-y-2">
        <p className="font-inter text-navy/60">Nessun orario disponibile per questo giorno.</p>
        <p className="font-inter text-sm text-navy/40">Prova un altro giorno o contattami su WhatsApp.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-sm mx-auto">
      {slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className="group flex items-center justify-center gap-1.5 rounded-xl border border-gray-100 bg-white px-3 py-3.5 font-inter text-sm font-medium text-navy hover:border-teal hover:bg-teal hover:text-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Clock size={13} className="text-teal group-hover:text-white transition-colors" />
          {slot}
        </button>
      ))}
    </div>
  );
}
