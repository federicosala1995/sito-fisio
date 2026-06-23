interface ICalData {
  nome: string;
  data: string;   // "yyyy-MM-dd"
  ora: string;    // "HH:mm"
  indirizzo?: string;
}

function fmtICS(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateICS(data: ICalData): string {
  const start = new Date(`${data.data}T${data.ora}:00`);
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const uid = `${data.data}-${data.ora}-fisiofederico@castrezzato`;
  const location = data.indirizzo ?? "Castrezzato (BS), Franciacorta";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Federico Fisioterapista//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${fmtICS(start)}`,
    `DTEND:${fmtICS(end)}`,
    `SUMMARY:Appuntamento fisioterapia — Federico`,
    `LOCATION:${location}`,
    `DESCRIPTION:Fisioterapista Federico — Castrezzato (BS). Portare documentazione medica disponibile. Info: +39 345 443 1758`,
    `STATUS:CONFIRMED`,
    `TRANSP:OPAQUE`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function googleCalendarUrl(data: ICalData): string {
  const start = new Date(`${data.data}T${data.ora}:00`);
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Fisioterapia — Federico",
    dates: `${fmt(start)}/${fmt(end)}`,
    location: data.indirizzo ?? "Castrezzato (BS)",
    details: "Appuntamento di fisioterapia con Federico. Portare documentazione medica disponibile.",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(data: ICalData): string {
  const start = new Date(`${data.data}T${data.ora}:00`);
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: "Fisioterapia — Federico",
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    location: data.indirizzo ?? "Castrezzato (BS)",
    body: "Appuntamento di fisioterapia con Federico.",
  });
  return `https://outlook.live.com/calendar/0/action/compose?${params}`;
}
