-- ============================================================
-- SCHEMA SUPABASE — Sito Fisioterapista Federico
-- Data: 2026-06-22
-- ⚠️  Esegui tutto in una volta nel SQL Editor di Supabase
-- ============================================================

-- Abilita l'estensione per UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. TABELLE
-- ============================================================

CREATE TABLE IF NOT EXISTS pazienti (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) NOT NULL,
  nome            text NOT NULL,
  cognome         text NOT NULL,
  telefono        text,
  email           text,
  data_nascita    date,
  sesso           text,
  patologia       text,
  stato           text NOT NULL DEFAULT 'attivo',  -- attivo | sospeso | dimesso
  anamnesi        text,
  diagnosi        text,
  obiettivi       text,
  vas_iniziale    smallint CHECK (vas_iniziale BETWEEN 0 AND 10),
  note            text,
  consenso_gdpr   boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appuntamenti (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) NOT NULL,
  paziente_id     uuid REFERENCES pazienti(id) ON DELETE SET NULL,
  data            date NOT NULL,
  ora             time NOT NULL,
  durata_min      smallint NOT NULL DEFAULT 45,
  tipo            text NOT NULL DEFAULT 'trattamento',  -- valutazione | trattamento | follow-up
  note_prenotaz   text,
  promemoria_inv  boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, data, ora)
);

CREATE TABLE IF NOT EXISTS sedute (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) NOT NULL,
  paziente_id     uuid REFERENCES pazienti(id) ON DELETE CASCADE NOT NULL,
  appuntamento_id uuid REFERENCES appuntamenti(id) ON DELETE SET NULL,
  data            date NOT NULL,
  trattamento     text,
  esercizi        text,
  vas_pre         smallint CHECK (vas_pre BETWEEN 0 AND 10),
  vas_post        smallint CHECK (vas_post BETWEEN 0 AND 10),
  rom_note        text,
  note            text,
  created_at      timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE pazienti      ENABLE ROW LEVEL SECURITY;
ALTER TABLE appuntamenti  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sedute        ENABLE ROW LEVEL SECURITY;

-- Policy: ogni utente authenticated vede e gestisce solo i propri dati
CREATE POLICY "pazienti_own" ON pazienti
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "appuntamenti_own" ON appuntamenti
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "sedute_own" ON sedute
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- L'utente anonimo (paziente) NON ha policy sulle tabelle:
-- accede solo tramite le funzioni SECURITY DEFINER qui sotto.


-- ============================================================
-- 3. GRANT espliciti (obbligatori da Supabase ≥ 30 mag 2026)
--    Senza questi, supabase-js restituisce errore 42501
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON pazienti      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON appuntamenti  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sedute        TO authenticated;

-- anon NON riceve GRANT sulle tabelle
-- (la prenotazione passa dalle funzioni SECURITY DEFINER)


-- ============================================================
-- 4. FUNZIONI PRENOTAZIONE (SECURITY DEFINER)
--    Vengono chiamate dal sito tramite supabase.rpc(...)
--    L'utente anonimo può eseguirle ma non vede le tabelle.
-- ============================================================

-- 4a. slot_liberi: ritorna solo gli orari liberi per un giorno dato
--     Non espone alcun dato dei pazienti.
CREATE OR REPLACE FUNCTION slot_liberi(giorno date)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tutti_slot text[] := ARRAY[
    '09:00', '09:45', '10:30', '11:15', '12:00',
    '14:00', '14:45', '15:30', '16:15', '17:00', '17:45', '18:30'
  ];
  occupati text[];
BEGIN
  -- Raccoglie gli orari già prenotati per quel giorno
  SELECT ARRAY_AGG(to_char(ora, 'HH24:MI'))
  INTO occupati
  FROM appuntamenti
  WHERE data = giorno;

  -- Ritorna solo gli slot non occupati
  RETURN ARRAY(
    SELECT s FROM UNNEST(tutti_slot) AS s
    WHERE s <> ALL(COALESCE(occupati, ARRAY[]::text[]))
  );
END;
$$;


-- 4b. prenota: crea paziente-lead + appuntamento in modo atomico
--     Verifica che lo slot sia ancora libero (FOR UPDATE SKIP LOCKED).
CREATE OR REPLACE FUNCTION prenota(
  p_nome      text,
  p_cognome   text,
  p_telefono  text,
  p_data      date,
  p_ora       text,
  p_motivo    text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fisioid   uuid;
  pazid     uuid;
  appid     uuid;
  ora_time  time;
BEGIN
  -- Recupera l'account del fisioterapista (unico utente nel sistema)
  SELECT id INTO fisioid FROM auth.users LIMIT 1;
  IF fisioid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Nessun account fisioterapista configurato.');
  END IF;

  -- Cast sicuro dell'orario
  BEGIN
    ora_time := p_ora::time;
  EXCEPTION WHEN others THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Formato orario non valido.');
  END;

  -- Verifica atomicità: lo slot deve essere ancora libero
  -- (FOR UPDATE SKIP LOCKED evita race condition su prenotazioni simultanee)
  IF EXISTS (
    SELECT 1 FROM appuntamenti
    WHERE data = p_data AND ora = ora_time
    FOR UPDATE SKIP LOCKED
  ) THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Questo orario è appena stato prenotato da qualcun altro. Scegline un altro.');
  END IF;

  -- Crea il paziente-lead con consenso GDPR registrato
  INSERT INTO pazienti (user_id, nome, cognome, telefono, note, consenso_gdpr)
  VALUES (fisioid, p_nome, p_cognome, p_telefono, p_motivo, true)
  RETURNING id INTO pazid;

  -- Crea l'appuntamento
  INSERT INTO appuntamenti (user_id, paziente_id, data, ora, note_prenotaz)
  VALUES (fisioid, pazid, p_data, ora_time, p_motivo)
  RETURNING id INTO appid;

  RETURN jsonb_build_object(
    'ok', true,
    'appuntamento_id', appid,
    'paziente_id', pazid
  );
END;
$$;


-- ============================================================
-- 5. GRANT sulle funzioni per utenti anonimi e autenticati
-- ============================================================

GRANT EXECUTE ON FUNCTION slot_liberi(date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION prenota(text, text, text, date, text, text) TO anon, authenticated;


-- ============================================================
-- 6. INDICI per performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_appuntamenti_data ON appuntamenti(data);
CREATE INDEX IF NOT EXISTS idx_appuntamenti_user  ON appuntamenti(user_id);
CREATE INDEX IF NOT EXISTS idx_pazienti_user      ON pazienti(user_id);
CREATE INDEX IF NOT EXISTS idx_sedute_paziente    ON sedute(paziente_id);


-- ============================================================
-- Fine schema
-- ============================================================
-- Dopo aver eseguito questo file:
-- 1. Vai su Authentication → Users → Add user (email del fisioterapista)
-- 2. Copia URL e anon key in .env.local
-- 3. Fai npm run dev per testare in locale
-- ============================================================
