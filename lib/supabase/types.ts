export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      pazienti: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          cognome: string;
          telefono: string | null;
          email: string | null;
          data_nascita: string | null;
          sesso: string | null;
          patologia: string | null;
          stato: string;
          anamnesi: string | null;
          diagnosi: string | null;
          obiettivi: string | null;
          vas_iniziale: number | null;
          note: string | null;
          consenso_gdpr: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pazienti"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["pazienti"]["Insert"]>;
      };
      appuntamenti: {
        Row: {
          id: string;
          user_id: string;
          paziente_id: string | null;
          data: string;
          ora: string;
          durata_min: number;
          tipo: string;
          note_prenotaz: string | null;
          promemoria_inv: boolean;
          // v2 columns
          stato: string;
          email_paziente: string | null;
          check_in_token: string | null;
          cancellation_token: string | null;
          check_in_at: string | null;
          notifica_24h_inv: boolean;
          notifica_2h_inv: boolean;
          fonte: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["appuntamenti"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["appuntamenti"]["Insert"]>;
      };
      lista_attesa: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          cognome: string;
          telefono: string | null;
          email: string | null;
          data_preferita: string | null;
          fascia_oraria: string;
          note: string | null;
          consenso_gdpr: boolean;
          stato: string;
          notifica_token: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lista_attesa"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["lista_attesa"]["Insert"]>;
      };
      notifiche: {
        Row: {
          id: string;
          user_id: string | null;
          appuntamento_id: string | null;
          tipo: string;
          canale: string;
          destinatario: string | null;
          stato: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifiche"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifiche"]["Insert"]>;
      };
      sedute: {
        Row: {
          id: string;
          user_id: string;
          paziente_id: string;
          appuntamento_id: string | null;
          data: string;
          trattamento: string | null;
          esercizi: string | null;
          vas_pre: number | null;
          vas_post: number | null;
          rom_note: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sedute"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["sedute"]["Insert"]>;
      };
    };
    Functions: {
      slot_liberi: {
        Args: { giorno: string };
        Returns: string[];
      };
      slot_settimana: {
        Args: { p_lunedi: string };
        Returns: { giorno: string; slot_ora: string; libero: boolean }[];
      };
      prenota: {
        Args: {
          p_nome: string;
          p_cognome: string;
          p_telefono: string;
          p_data: string;
          p_ora: string;
          p_motivo?: string;
          p_email?: string;
        };
        Returns: Json;
      };
      cancella_appuntamento: {
        Args: { p_token: string };
        Returns: Json;
      };
      esegui_check_in: {
        Args: { p_token: string };
        Returns: Json;
      };
      aggiungi_lista_attesa: {
        Args: {
          p_nome: string;
          p_cognome: string;
          p_telefono: string;
          p_email?: string;
          p_data_pref?: string;
          p_fascia?: string;
          p_note?: string;
        };
        Returns: Json;
      };
      appuntamenti_da_notificare: {
        Args: { p_ore?: number };
        Returns: {
          app_id: string;
          email_paziente: string;
          nome_paziente: string;
          cognome_paziente: string;
          data_app: string;
          ora_app: string;
          checkin_token: string;
          cancel_token: string;
          tipo_notifica: string;
        }[];
      };
    };
  };
}

export type Paziente = Database["public"]["Tables"]["pazienti"]["Row"];
export type Appuntamento = Database["public"]["Tables"]["appuntamenti"]["Row"];
export type Seduta = Database["public"]["Tables"]["sedute"]["Row"];
