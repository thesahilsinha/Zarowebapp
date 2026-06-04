"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "What's freshly baked today?",
  "Do you deliver to my area?",
  "What are your bestsellers?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "Hi! I'm here to help you with anything about Zaro Bakehouse — our products, delivery, or anything else. What can I help you with?",
      }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    setInput("");
    setShowStarters(false);
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col"
            style={{ maxHeight: "520px" }}
          >
            {/* Header */}
            <div className="bg-forest-800 px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm font-playfair">Z</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Zaro Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <p className="text-white/60 text-xs">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-white/70" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-cream-200/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-forest-800 text-white rounded-br-sm"
                      : "bg-white text-foreground border border-border rounded-bl-sm shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick starters */}
              {showStarters && messages.length === 1 && (
                <div className="flex flex-col gap-2 mt-2">
                  {STARTERS.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="text-left text-xs bg-white border border-border hover:border-brand-400 hover:bg-brand-50 text-foreground px-3 py-2 rounded-xl transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-white flex-shrink-0">
              <div className="flex items-center gap-2 bg-cream-200 rounded-xl px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 text-sm bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 bg-forest-800 rounded-lg flex items-center justify-center disabled:opacity-40 transition-opacity hover:bg-forest-700 flex-shrink-0"
                >
                  {loading ? (
                    <Loader size={12} className="text-white animate-spin" />
                  ) : (
                    <Send size={12} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-forest-800 hover:bg-forest-700 text-white rounded-full shadow-card-hover flex items-center justify-center transition-colors"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-forest-800 animate-ping opacity-20" />
        )}
      </motion.button>
    </>
  );
}