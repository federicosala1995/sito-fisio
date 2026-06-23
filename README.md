# Sito Fisioterapista Federico — Guida completa

Sito web professionale con sistema di prenotazione online, area gestionale e cartella clinica.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Auth)

---

## 1. Prerequisiti

- Node.js ≥ 18 installato → [nodejs.org](https://nodejs.org)
- Account Supabase gratuito → [supabase.com](https://supabase.com)
- Account Vercel (opzionale, per il deploy) → [vercel.com](https://vercel.com)

---

## 2. Installazione locale

```bash
# Entra nella cartella del progetto
cd sito-fisio

# Installa le dipendenze
npm install

# Copia il file delle variabili d'ambiente
cp .env.local.example .env.local
```

---

## 3. Configurazione Supabase

### 3a. Crea il progetto

1. Vai su [supabase.com](https://supabase.com) → **New project**
2. Nome: `sito-fisio` (o quello che preferisci)
3. **Regione: Europe West (Frankfurt)** — obbligatorio per GDPR dati sanitari
4. Scegli una password sicura per il database (salvala)
5. Attendi la creazione (~2 minuti)

### 3b. Lancia lo schema SQL

1. Nel pannello Supabase → **SQL Editor** → **New query**
2. Copia e incolla tutto il contenuto di `supabase/schema.sql`
3. Clicca **Run** — dovresti vedere "Success. No rows returned"

### 3c. Crea l'account del fisioterapista

1. Pannello Supabase → **Authentication** → **Users** → **Add user**
2. Inserisci la tua email e una password sicura
3. Nota: questo account sarà il "proprietario" di tutti i dati

### 3d. Copia le credenziali API

1. Pannello Supabase → **Project Settings** → **API**
2. Copia:
   - **Project URL** → es. `https://abcdefghij.supabase.co`
   - **anon public key** → stringa lunga che inizia con `eyJhbGci…`
3. Incollali nel file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-...          # solo se usi la funzione Piano Seduta AI
NEXT_PUBLIC_WHATSAPP_NUMBER=393454431758
```

---

## 4. Avvio in locale

```bash
npm run dev
```

Apri il browser su `http://localhost:3000`.

- **Homepage:** `http://localhost:3000`
- **Prenotazione:** `http://localhost:3000/prenota`
- **Blog:** `http://localhost:3000/blog`
- **Login dashboard:** `http://localhost:3000/login`
- **Dashboard:** `http://localhost:3000/dashboard`

---

## 5. Deploy su Vercel

### 5a. Carica su GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# Crea un repository su github.com e poi:
git remote add origin https://github.com/TUO-UTENTE/sito-fisio.git
git push -u origin main
```

### 5b. Collega Vercel

1. Vai su [vercel.com](https://vercel.com) → **New Project**
2. Importa il repository GitHub appena creato
3. Framework: Next.js (rilevato automaticamente)
4. Aggiungi le **Environment Variables** (stesse del `.env.local`)
5. Clicca **Deploy** — in ~2 minuti il sito è online

### 5c. Dominio personalizzato

1. Pannello Vercel → **Settings** → **Domains**
2. Aggiungi il tuo dominio (es. `fisioterapistafederico.it`)
3. Segui le istruzioni per configurare i DNS nel tuo registrar

---

## 6. Personalizzazione

### Placeholder da compilare

| File | Cosa inserire |
|------|--------------|
| `components/ui/Footer.tsx` | P.IVA, indirizzo, email |
| `components/sections/ChiSono.tsx` | Foto professionale, università, corsi |
| `components/sections/Recensioni.tsx` | Recensioni reali (solo verificabili) |
| `components/sections/Contatti.tsx` | Email, indirizzo, embed Google Maps |
| `components/ui/Footer.tsx` | Link privacy policy e cookie policy |
| `app/blog/[slug]/page.tsx` | Dati autore |

### Aggiungere articoli al blog

Modifica il file `lib/blog.ts` — aggiungi un oggetto nell'array `posts` seguendo la struttura esistente.

### Modificare gli slot disponibili

Modifica l'array `tutti_slot` nella funzione `slot_liberi` in `supabase/schema.sql` e riesegui la funzione nel SQL Editor.

---

## 7. Note GDPR — IMPORTANTE

I dati clinici dei pazienti sono **categorie particolari di dati personali** ai sensi dell'art. 9 del Reg. UE 2016/679.

**Prima di raccogliere dati reali di pazienti, devi:**

- [ ] Firmare un **DPA (Data Processing Agreement)** con Supabase → [supabase.com/dpa](https://supabase.com/dpa)
- [ ] Valutare se è necessaria una **DPIA (Data Protection Impact Assessment)** — probabile, data la sensibilità dei dati
- [ ] Redigere o aggiornare l'**informativa privacy** del tuo studio, menzionando il trattamento digitale
- [ ] Verificare che il consenso GDPR raccolto in fase di prenotazione sia conforme alla normativa applicabile
- [ ] Impostare una **politica di backup** e data retention adeguata su Supabase

**Misure di sicurezza già implementate:**
- ✅ Database in regione EU (Frankfurt)
- ✅ Row Level Security su tutte le tabelle
- ✅ GRANT espliciti solo per utenti autenticati
- ✅ Utenti anonimi accedono solo tramite funzioni SECURITY DEFINER
- ✅ Chiave AI custodita solo lato server (mai nel browser)
- ✅ Consenso GDPR esplicito obbligatorio nella form di prenotazione

---

## 8. Architettura di sicurezza (schema prenotazione)

```
Paziente (anonimo)
    │
    ├── chiama supabase.rpc("slot_liberi", { giorno })
    │       └── funzione SECURITY DEFINER: ritorna solo array di orari liberi
    │           ❌ non vede pazienti, non vede appuntamenti
    │
    └── chiama supabase.rpc("prenota", { nome, ... })
            └── funzione SECURITY DEFINER:
                ├── verifica slot libero (FOR UPDATE SKIP LOCKED)
                ├── crea paziente-lead (user_id = fisioterapista)
                └── crea appuntamento (user_id = fisioterapista)
                ❌ non espone dati di altri pazienti

Fisioterapista (authenticated)
    └── accede direttamente alle tabelle
        (filtrate da RLS: user_id = auth.uid())
```

---

## 9. Struttura cartelle

```
sito-fisio/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout, font, meta
│   ├── page.tsx                # Homepage
│   ├── login/page.tsx          # Login fisioterapista
│   ├── prenota/page.tsx        # Prenotazione online
│   ├── blog/                   # Blog SEO
│   ├── dashboard/              # Area gestionale (richiede login)
│   └── api/piano-seduta/       # Edge Function AI (chiave nascosta)
├── components/
│   ├── ui/                     # Navbar, Footer, Button, Input, Card, RomArc
│   ├── sections/               # Sezioni homepage
│   ├── booking/                # CalendarPicker, SlotGrid, BookingWidget
│   └── dashboard/              # DashNav, NuovaSedutaForm, PianoSedutaButton
├── lib/
│   ├── supabase/               # Client browser/server + tipi TypeScript
│   ├── blog.ts                 # Contenuti articoli
│   └── utils.ts                # Utilities (cn, formatDate, calcAge)
├── supabase/
│   └── schema.sql              # Schema completo + RLS + funzioni
└── .env.local.example          # Template variabili d'ambiente
```
