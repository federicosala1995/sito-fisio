import { Resend } from "resend";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM ?? "Federico Fisioterapista <prenotazioni@fisioterapistafederico.it>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

interface BookingEmailData {
  to: string;
  nome: string;
  data: string;       // "yyyy-MM-dd"
  ora: string;        // "HH:mm"
  checkinToken: string;
  cancelToken: string;
}

interface ReminderEmailData extends BookingEmailData {
  tipo: "24h" | "2h";
}

function formatDataIT(dateStr: string) {
  try {
    return format(new Date(dateStr + "T12:00"), "EEEE d MMMM yyyy", { locale: it });
  } catch {
    return dateStr;
  }
}

function emailShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
    <div style="background:#0E2A45;padding:32px 40px;text-align:center;">
      <p style="margin:0;color:#15B8A6;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Federico · Fisioterapista</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:24px;font-weight:600;">${title}</h1>
    </div>
    <div style="padding:40px;">
      ${body}
    </div>
    <div style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;color:#999;font-size:12px;">
        Castrezzato (BS) · Franciacorta<br/>
        <a href="tel:+393454431758" style="color:#15B8A6;">+39 345 443 1758</a>
      </p>
      <p style="margin:8px 0 0;color:#ccc;font-size:11px;">
        Hai ricevuto questa email perché hai prenotato un appuntamento.
        Se non sei stato tu, <a href="${BASE_URL}/cancel/${"{cancelToken}"}" style="color:#999;">clicca qui per annullare</a>.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  if (!resend) {
    console.log("[NOTIFICATIONS] Resend non configurato — email non inviata:", data);
    return false;
  }

  const dataFormatted = formatDataIT(data.data);
  const checkinUrl = `${BASE_URL}/checkin/${data.checkinToken}`;
  const cancelUrl = `${BASE_URL}/cancel/${data.cancelToken}`;
  const icalUrl = `${BASE_URL}/api/ical?checkin=${data.checkinToken}`;
  const googleUrl = buildGoogleCalendarUrl(data);

  const body = `
    <p style="color:#555;font-size:16px;line-height:1.6;">Ciao <strong>${data.nome}</strong>,</p>
    <p style="color:#555;font-size:16px;line-height:1.6;">
      La tua prenotazione è confermata. Ti aspetto!
    </p>

    <div style="background:#f0faf9;border-left:4px solid #15B8A6;border-radius:8px;padding:20px 24px;margin:28px 0;">
      <p style="margin:0 0 6px;color:#15B8A6;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Appuntamento</p>
      <p style="margin:0;color:#0E2A45;font-size:22px;font-weight:700;">${data.ora}</p>
      <p style="margin:4px 0 0;color:#444;font-size:15px;">${dataFormatted}</p>
      <p style="margin:4px 0 0;color:#888;font-size:13px;">Durata: 45 minuti · Castrezzato (BS)</p>
    </div>

    <table cellspacing="0" cellpadding="0" style="width:100%;margin:24px 0;">
      <tr>
        <td style="padding-right:8px;">
          <a href="${checkinUrl}" style="display:block;text-align:center;background:#15B8A6;color:#fff;font-size:14px;font-weight:600;padding:14px;border-radius:50px;text-decoration:none;">
            ✓ Check-in digitale
          </a>
        </td>
        <td style="padding-left:8px;">
          <a href="${cancelUrl}" style="display:block;text-align:center;background:#fff;color:#0E2A45;font-size:14px;font-weight:600;padding:14px;border-radius:50px;text-decoration:none;border:2px solid #e5e5e5;">
            Annulla appuntamento
          </a>
        </td>
      </tr>
    </table>

    <p style="color:#888;font-size:13px;text-align:center;">Aggiungi al calendario:</p>
    <table cellspacing="0" cellpadding="0" style="width:100%;">
      <tr>
        <td style="padding:4px;"><a href="${googleUrl}" target="_blank" style="display:block;text-align:center;color:#15B8A6;font-size:13px;padding:10px;border:1px solid #e5e5e5;border-radius:8px;text-decoration:none;">📅 Google</a></td>
        <td style="padding:4px;"><a href="${icalUrl}" style="display:block;text-align:center;color:#15B8A6;font-size:13px;padding:10px;border:1px solid #e5e5e5;border-radius:8px;text-decoration:none;">🍎 Apple</a></td>
        <td style="padding:4px;"><a href="${icalUrl}" style="display:block;text-align:center;color:#15B8A6;font-size:13px;padding:10px;border:1px solid #e5e5e5;border-radius:8px;text-decoration:none;">📧 Outlook</a></td>
      </tr>
    </table>

    <p style="color:#aaa;font-size:12px;margin-top:28px;line-height:1.6;">
      Ricorda di portare documentazione medica eventualmente disponibile.<br/>
      Per info: <a href="tel:+393454431758" style="color:#15B8A6;">+39 345 443 1758</a> oppure WhatsApp.
    </p>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Appuntamento confermato — ${data.ora} · ${dataFormatted}`,
      html: emailShell("Appuntamento confermato", body).replace("{cancelToken}", data.cancelToken),
    });
    return true;
  } catch (err) {
    console.error("[NOTIFICATIONS] Errore invio conferma:", err);
    return false;
  }
}

export async function sendReminderEmail(data: ReminderEmailData): Promise<boolean> {
  if (!resend) return false;

  const dataFormatted = formatDataIT(data.data);
  const checkinUrl = `${BASE_URL}/checkin/${data.checkinToken}`;
  const cancelUrl = `${BASE_URL}/cancel/${data.cancelToken}`;
  const label = data.tipo === "24h" ? "domani" : "tra poco";
  const titlePrefix = data.tipo === "24h" ? "Ricordati: domani c'è il tuo appuntamento" : "Il tuo appuntamento è tra 2 ore";

  const body = `
    <p style="color:#555;font-size:16px;line-height:1.6;">Ciao <strong>${data.nome}</strong>,</p>
    <p style="color:#555;font-size:16px;line-height:1.6;">
      Ti ricordo che hai un appuntamento <strong>${label}</strong>:
    </p>

    <div style="background:#f0faf9;border-left:4px solid #15B8A6;border-radius:8px;padding:20px 24px;margin:28px 0;">
      <p style="margin:0;color:#0E2A45;font-size:22px;font-weight:700;">${data.ora}</p>
      <p style="margin:4px 0 0;color:#444;font-size:15px;">${dataFormatted}</p>
      <p style="margin:4px 0 0;color:#888;font-size:13px;">Federico · Fisioterapista · Castrezzato (BS)</p>
    </div>

    <table cellspacing="0" cellpadding="0" style="width:100%;margin:24px 0;">
      <tr>
        <td style="padding-right:8px;">
          <a href="${checkinUrl}" style="display:block;text-align:center;background:#15B8A6;color:#fff;font-size:14px;font-weight:600;padding:14px;border-radius:50px;text-decoration:none;">
            ✓ Conferma presenza (check-in)
          </a>
        </td>
        <td style="padding-left:8px;">
          <a href="${cancelUrl}" style="display:block;text-align:center;background:#fff;color:#0E2A45;font-size:14px;font-weight:600;padding:14px;border-radius:50px;text-decoration:none;border:2px solid #e5e5e5;">
            Annulla / sposta
          </a>
        </td>
      </tr>
    </table>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: titlePrefix,
      html: emailShell(titlePrefix, body).replace("{cancelToken}", data.cancelToken),
    });
    return true;
  } catch (err) {
    console.error("[NOTIFICATIONS] Errore invio reminder:", err);
    return false;
  }
}

export async function sendCancellationEmail(data: { to: string; nome: string; data: string; ora: string }): Promise<boolean> {
  if (!resend) return false;

  const dataFormatted = formatDataIT(data.data);
  const body = `
    <p style="color:#555;font-size:16px;line-height:1.6;">Ciao <strong>${data.nome}</strong>,</p>
    <p style="color:#555;font-size:16px;line-height:1.6;">
      Il tuo appuntamento del <strong>${dataFormatted} alle ${data.ora}</strong> è stato annullato con successo.
    </p>
    <p style="color:#555;font-size:15px;line-height:1.6;">
      Per prenotare un nuovo appuntamento visita <a href="${BASE_URL}/prenota" style="color:#15B8A6;">${BASE_URL}/prenota</a>
      o scrivimi su WhatsApp.
    </p>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: "Appuntamento annullato",
      html: emailShell("Appuntamento annullato", body).replace("{cancelToken}", ""),
    });
    return true;
  } catch (err) {
    console.error("[NOTIFICATIONS] Errore invio cancellazione:", err);
    return false;
  }
}

function buildGoogleCalendarUrl(data: BookingEmailData): string {
  const start = new Date(`${data.data}T${data.ora}:00`);
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Fisioterapia+Federico&dates=${fmt(start)}/${fmt(end)}&location=Castrezzato+(BS)&details=Appuntamento+di+fisioterapia`;
}
