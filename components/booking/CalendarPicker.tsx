"use client";

import { addDays, format, isSunday, isToday, startOfToday } from "date-fns";
import { it } from "date-fns/locale";

interface CalendarPickerProps {
  onSelect: (date: Date) => void;
}

export function CalendarPicker({ onSelect }: CalendarPickerProps) {
  const today = startOfToday();
  // Genera i prossimi 14 giorni escludendo le domeniche
  const days = Array.from({ length: 21 }, (_, i) => addDays(today, i + 1))
    .filter((d) => !isSunday(d))
    .slice(0, 14);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
      {days.map((day) => (
        <button
          key={day.toISOString()}
          onClick={() => onSelect(day)}
          className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-4 py-4 text-center hover:border-teal hover:bg-teal/5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <span className="font-inter text-xs text-gray-400 uppercase tracking-wide mb-1 group-hover:text-teal/70 transition-colors">
            {format(day, "EEE", { locale: it })}
          </span>
          <span className="font-fraunces text-2xl font-semibold text-navy group-hover:text-teal transition-colors">
            {format(day, "d")}
          </span>
          <span className="font-inter text-xs text-gray-400 mt-0.5 group-hover:text-teal/70 transition-colors">
            {format(day, "MMM", { locale: it })}
          </span>
        </button>
      ))}
    </div>
  );
}
