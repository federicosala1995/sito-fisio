-- ============================================================
-- SCHEMA v2 — Sistema prenotazione avanzato
-- Esegui DOPO schema.sql nel SQL Editor di Supabase
-- ============================================================

-- ============================================================
-- 1. ESTENDI TABELLA APPUNTAMENTI
-- ============================================================

ALTER TABLE appuntamenti
  ADD COLUMN IF NOT EXISTS stato              text        NOT NULL DEFAULT 'confermato',
  ADD COLUMN IF NOT EXISTS email_paziente     text,
  ADD COLUMN IF NOT EXISTS check_in_token     text        UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  ADD COLUMN IF NOT EXISTS cancellation_token text        UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  ADD COLUMN IF NOT EXISTS check_in_at        timestamptz,
  ADD COLUMN IF NOT EXISTS notifica_24h_inv   boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notifica_2h_inv    boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fonte              text        NOT NULL DEFAULT 'online';

-- stato: confermato | annullato | no-show | in-attesa
-- fonte: online | manuale | lista-attesa

-- ============================================================
-- 2. ESTENDI TABELLA PAZIENTI
-- ============================================================

ALTER TABLE pazienti
  ADD COLUMN IF NOT EXISTS preferenza_orario text,
  ADD COLUMN IF NOT EXISTS preferenza_giorni text[],
  ADD COLUMN IF NOT EXISTS ultima_visita     date,
  ADD COLUMN IF NOT EXISTS numero_visite     int NOT NULL DEFAULT 0;

-- ============================================================
-- 3. LISTA D'ATTESA
-- ============================================================

CREATE TABLE IF NOT EXISTS lista_attesa (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        REFERENCES auth.users(id) NOT NULL,
  nome            text        NOT NULL,
  cognome         text        NOT NULL,
  telefono        text,
  email           text,
  data_preferita  date,
  fascia_oraria   text        NOT NULL DEFAULT 'qualsiasi',
  note            text,
  consenso_gdpr   boolean     NOT NULL DEFAULT false,
  stato           text        NOT NULL DEFAULT 'in-attesa',
  notifica_token  text        UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- fascia_oraria: mattina | pomeriggio | qualsiasi
-- stato: in-attesa | contattato | prenotato | scaduto

ALTER TABLE lista_attesa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lista_attesa_own" ON lista_attesa
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON lista_attesa TO authenticated;

-- ============================================================
-- 4. LOG NOTIFICHE
-- ============================================================

CREATE TABLE IF NOT EXISTS notifiche (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        REFERENCES auth.users(id),
  appuntamento_id  uuid        REFERENCES appuntamenti(id) ON DELETE SET NULL,
  tipo             text        NOT NULL,
  canale           text        NOT NULL,
  destinatario     text,
  stato            text        NOT NULL DEFAULT 'inviata',
  metadata         jsonb,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- tipo: conferma | promemoria_24h | promemoria_2h | cancellazione | check_in
-- canale: email | sms | whatsapp
-- stato: inviata | fallita | da-inviare

ALTER TABLE notifiche ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifiche_own" ON notifiche
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

GRANT SELECT, INSERT ON notifiche TO authenticated;

-- ============================================================
-- 5. FUNZIONE: slot con stato per TUTTA la settimana
--    (usata dal calendario real-time: mostra libero E occupato)
-- ============================================================

CREATE OR REPLACE FUNCTION slot_settimana(p_lunedi date)
RETURNS TABLE(giorno date, slot_ora text, libero boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tutti_slot text[] := ARRAY[
    '09:00','09:45','10:30','11:15','12:00',
    '14:00','14:45','15:30','16:15','17:00','17:45','18:30'
  ];
  d date;
BEGIN
  -- Genera Lun-Sab (6 giorni)
  FOR d IN
    SELECT generate_series(p_lunedi, p_lunedi + 5, '1 day'::interval)::date
  LOOP
    -- Salta domenica
    IF EXTRACT(DOW FROM d) <> 0 THEN
      RETURN QUERY
      SELECT
        d,
        s,
        NOT EXISTS (
          SELECT 1 FROM appuntamenti a
          WHERE a.data = d
            AND to_char(a.ora, 'HH24:MI') = s
            AND a.stato NOT IN ('annullato')
        )
      FROM UNNEST(tutti_slot) s;
    END IF;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION slot_settimana(date) TO anon, authenticated;

-- ============================================================
-- 6. AGGIORNA FUNZIONE PRENOTA — aggiunge email e restituisce tokens
-- ============================================================

CREATE OR REPLACE FUNCTION prenota(
  p_nome      text,
  p_cognome   text,
  p_telefono  text,
  p_data      date,
  p_ora       text,
  p_motivo    text  DEFAULT NULL,
  p_email     text  DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fisioid      uuid;
  pazid        uuid;
  appid        uuid;
  ora_time     time;
  checkin_tok  text;
  cancel_tok   text;
BEGIN
  SELECT id INTO fisioid FROM auth.users LIMIT 1;
  IF fisioid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Nessun account fisioterapista configurato.');
  END IF;

  BEGIN
    ora_time := p_ora::time;
  EXCEPTION WHEN others THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Formato orario non valido.');
  END;

  -- Verifica atomicità (esclude annullati)
  IF EXISTS (
    SELECT 1 FROM appuntamenti
    WHERE data = p_data AND ora = ora_time AND stato NOT IN ('annullato')
    FOR UPDATE SKIP LOCKED
  ) THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Slot appena prenotato da qualcun altro. Scegline un altro.');
  END IF;

  checkin_tok := encode(gen_random_bytes(16), 'hex');
  cancel_tok  := encode(gen_random_bytes(16), 'hex');

  INSERT INTO pazienti(user_id, nome, cognome, telefono, email, note, consenso_gdpr)
  VALUES (fisioid, p_nome, p_cognome, p_telefono, p_email, p_motivo, true)
  RETURNING id INTO pazid;

  INSERT INTO appuntamenti(
    user_id, paziente_id, data, ora, note_prenotaz,
    email_paziente, check_in_token, cancellation_token, fonte
  )
  VALUES (fisioid, pazid, p_data, ora_time, p_motivo, p_email, checkin_tok, cancel_tok, 'online')
  RETURNING id INTO appid;

  RETURN jsonb_build_object(
    'ok',                true,
    'appuntamento_id',   appid,
    'paziente_id',       pazid,
    'check_in_token',    checkin_tok,
    'cancellation_token', cancel_tok
  );
END;
$$;

-- Rinnova GRANT (la funzione è stata ricreata)
GRANT EXECUTE ON FUNCTION prenota(text, text, text, date, text, text, text) TO anon, authenticated;
-- Mantieni compatibilità con la firma senza email:
GRANT EXECUTE ON FUNCTION prenota(text, text, text, date, text, text) TO anon, authenticated;

-- ============================================================
-- 7. FUNZIONE: cancella appuntamento via token (pubblica)
-- ============================================================

CREATE OR REPLACE FUNCTION cancella_appuntamento(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app_row appuntamenti%ROWTYPE;
BEGIN
  SELECT * INTO app_row FROM appuntamenti WHERE cancellation_token = p_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Link non valido o già utilizzato.');
  END IF;

  IF app_row.stato = 'annullato' THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Appuntamento già annullato.');
  END IF;

  IF app_row.data < CURRENT_DATE THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Non è possibile annullare appuntamenti passati.');
  END IF;

  UPDATE appuntamenti SET stato = 'annullato' WHERE id = app_row.id;

  RETURN jsonb_build_object(
    'ok',   true,
    'data', to_char(app_row.data, 'DD/MM/YYYY'),
    'ora',  to_char(app_row.ora, 'HH24:MI')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION cancella_appuntamento(text) TO anon, authenticated;

-- ============================================================
-- 8. FUNZIONE: check-in digitale via token (pubblica)
-- ============================================================

CREATE OR REPLACE FUNCTION esegui_check_in(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app_row appuntamenti%ROWTYPE;
BEGIN
  SELECT * INTO app_row FROM appuntamenti WHERE check_in_token = p_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Link non valido.');
  END IF;

  IF app_row.stato = 'annullato' THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Questo appuntamento è stato annullato.');
  END IF;

  IF app_row.check_in_at IS NOT NULL THEN
    RETURN jsonb_build_object(
      'ok',             true,
      'gia_effettuato', true,
      'data',           to_char(app_row.data, 'DD/MM/YYYY'),
      'ora',            to_char(app_row.ora, 'HH24:MI')
    );
  END IF;

  UPDATE appuntamenti SET check_in_at = now() WHERE id = app_row.id;

  RETURN jsonb_build_object(
    'ok',             true,
    'gia_effettuato', false,
    'data',           to_char(app_row.data, 'DD/MM/YYYY'),
    'ora',            to_char(app_row.ora, 'HH24:MI')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION esegui_check_in(text) TO anon, authenticated;

-- ============================================================
-- 9. FUNZIONE: aggiungi a lista d'attesa (pubblica)
-- ============================================================

CREATE OR REPLACE FUNCTION aggiungi_lista_attesa(
  p_nome          text,
  p_cognome       text,
  p_telefono      text,
  p_email         text  DEFAULT NULL,
  p_data_pref     date  DEFAULT NULL,
  p_fascia        text  DEFAULT 'qualsiasi',
  p_note          text  DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fisioid uuid;
  newid   uuid;
BEGIN
  SELECT id INTO fisioid FROM auth.users LIMIT 1;
  IF fisioid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'msg', 'Sistema non configurato.');
  END IF;

  INSERT INTO lista_attesa(user_id, nome, cognome, telefono, email, data_preferita, fascia_oraria, note, consenso_gdpr)
  VALUES (fisioid, p_nome, p_cognome, p_telefono, p_email, p_data_pref, p_fascia, p_note, true)
  RETURNING id INTO newid;

  RETURN jsonb_build_object('ok', true, 'id', newid);
END;
$$;

GRANT EXECUTE ON FUNCTION aggiungi_lista_attesa(text, text, text, text, date, text, text) TO anon, authenticated;

-- ============================================================
-- 10. FUNZIONE: reminders da inviare (usata dal cron)
-- ============================================================

CREATE OR REPLACE FUNCTION appuntamenti_da_notificare(p_ore int DEFAULT 24)
RETURNS TABLE(
  app_id          uuid,
  email_paziente  text,
  nome_paziente   text,
  cognome_paziente text,
  data_app        date,
  ora_app         text,
  checkin_token   text,
  cancel_token    text,
  tipo_notifica   text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.email_paziente,
    p.nome,
    p.cognome,
    a.data,
    to_char(a.ora, 'HH24:MI'),
    a.check_in_token,
    a.cancellation_token,
    CASE WHEN p_ore = 24 THEN 'promemoria_24h' ELSE 'promemoria_2h' END
  FROM appuntamenti a
  LEFT JOIN pazienti p ON p.id = a.paziente_id
  WHERE
    a.stato = 'confermato'
    AND a.email_paziente IS NOT NULL
    AND a.data = CURRENT_DATE + INTERVAL '1 day'
    AND (
      (p_ore = 24 AND NOT a.notifica_24h_inv)
      OR (p_ore = 2 AND NOT a.notifica_2h_inv
          AND a.ora < (NOW() + INTERVAL '2 hours')::time)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION appuntamenti_da_notificare(int) TO authenticated;

-- ============================================================
-- 11. REALTIME — abilita su appuntamenti
--     ⚠️  In alternativa: Dashboard → Database → Replication → aggiungi appuntamenti
-- ============================================================

-- Esegui solo se non già abilitato:
-- ALTER PUBLICATION supabase_realtime ADD TABLE appuntamenti;

-- ============================================================
-- 12. INDICI aggiuntivi
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_app_stato            ON appuntamenti(stato);
CREATE INDEX IF NOT EXISTS idx_app_check_in_token   ON appuntamenti(check_in_token);
CREATE INDEX IF NOT EXISTS idx_app_cancel_token     ON appuntamenti(cancellation_token);
CREATE INDEX IF NOT EXISTS idx_app_email            ON appuntamenti(email_paziente);
CREATE INDEX IF NOT EXISTS idx_lista_attesa_stato   ON lista_attesa(stato);

-- ============================================================
-- Fine schema_v2.sql
-- ============================================================
