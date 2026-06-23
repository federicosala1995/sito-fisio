"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Ciao! Sono l'assistente virtuale di Federico. Posso risponderti su fisioterapia, trattamenti e come funzionano le sedute. Come posso aiutarti?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }],
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Mi dispiace, si è verificato un errore. Puoi contattarmi direttamente al +39 345 443 1758 o via WhatsApp.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Chiudi chat" : "Apri chat con l'assistente"}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl shadow-navy/20 transition-all duration-300 ${
          open ? "bg-navy rotate-0 scale-90" : "bg-teal hover:bg-teal/90 hover:scale-105"
        }`}
      >
        {open ? (
          <X size={20} className="text-white" />
        ) : (
          <MessageCircle size={22} className="text-white" />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)] rounded-3xl bg-white shadow-2xl shadow-navy/15 border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ maxHeight: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-navy px-4 py-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="font-inter text-sm font-semibold text-white leading-tight">Assistente virtuale</p>
            <p className="font-inter text-[11px] text-white/50">Federico Fisioterapista</p>
          </div>
          <div className="ml-auto flex h-2 w-2 rounded-full bg-teal animate-pulse" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm" style={{ maxHeight: "360px" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-inter text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-teal text-white rounded-br-sm"
                    : "bg-gray-50 text-navy rounded-bl-sm border border-gray-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm bg-gray-50 border border-gray-100 px-4 py-2.5 flex items-center gap-2">
                <Loader2 size={14} className="text-teal animate-spin" />
                <span className="font-inter text-xs text-navy/40">Sto scrivendo…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions (only on first message) */}
        {messages.length === 1 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {["Quant'è una seduta?", "Come funziona il check-in?", "Dove sei?"].map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); setTimeout(sendMessage, 50); setInput(""); setMessages((m) => [...m, { role: "user", content: s }]); setLoading(true);
                  fetch("/api/ai-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, { role: "user", content: s }] }) })
                    .then(r => r.json()).then(d => setMessages(m => [...m, { role: "assistant", content: d.reply }])).catch(() => {}).finally(() => setLoading(false));
                }}
                className="rounded-full border border-gray-200 px-3 py-1 font-inter text-xs text-navy/60 hover:border-teal hover:text-teal transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 px-3 py-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Scrivi un messaggio…"
            disabled={loading}
            className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 font-inter text-sm text-navy placeholder:text-gray-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 disabled:opacity-60"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-white hover:bg-teal/90 transition-all disabled:opacity-40 active:scale-95"
            aria-label="Invia"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
