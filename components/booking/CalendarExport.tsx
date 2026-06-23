"use client";

import { googleCalendarUrl, outlookCalendarUrl } from "@/lib/ical";
import { Calendar, Apple, Mail, Download } from "lucide-react";

interface Props {
  nome: string;
  data: string;
  ora: string;
}

export function CalendarExport({ nome, data, ora }: Props) {
  const gUrl = googleCalendarUrl({ nome, data, ora });
  const oUrl = outlookCalendarUrl({ nome, data, ora });
  const icalUrl = `/api/ical?data=${data}&ora=${encodeURIComponent(ora)}&nome=${encodeURIComponent(nome)}`;

  return (
    <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
      <p className="font-inter text-xs text-navy/40 uppercase tracking-wide font-semibold">
        Aggiungi al calendario
      </p>
      <div className="grid grid-cols-3 gap-2">
        <a
          href={gUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 p-3 hover:border-teal hover:text-teal transition-colors text-navy/60"
        >
          <Calendar size={18} />
          <span className="font-inter text-xs font-medium">Google</span>
        </a>
        <a
          href={icalUrl}
          download={`appuntamento-${data}.ics`}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 p-3 hover:border-teal hover:text-teal transition-colors text-navy/60"
        >
          <Apple size={18} />
          <span className="font-inter text-xs font-medium">Apple</span>
        </a>
        <a
          href={oUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 p-3 hover:border-teal hover:text-teal transition-colors text-navy/60"
        >
          <Mail size={18} />
          <span className="font-inter text-xs font-medium">Outlook</span>
        </a>
      </div>
      <a
        href={icalUrl}
        download={`appuntamento-${data}.ics`}
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-100 py-2.5 font-inter text-xs text-navy/50 hover:border-teal hover:text-teal transition-colors"
      >
        <Download size={13} />
        Scarica file .ics
      </a>
    </div>
  );
}
