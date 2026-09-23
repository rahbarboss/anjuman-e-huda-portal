import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const WhatsAppFloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const defaultPhone = '919876543210';

  const handleOpenWhatsApp = (customMsg?: string) => {
    const text = encodeURIComponent(
      customMsg ||
        "Assalamu Alaikum ANJUMAN-E-HUDA Secretariat, I would like to inquire about union activities and programs."
    );
    window.open(`https://wa.me/${defaultPhone}?text=${text}`, '_blank');
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;
    handleOpenWhatsApp(userMsg);
    setUserMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-up Chat Dialog Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="whatsapp-chat-popup"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="mb-3 w-80 sm:w-88 bg-stone-900 border border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden text-stone-100"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight">ANJUMAN-E-HUDA Helpdesk</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online • Secretariat Desk
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-100 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-stone-950 space-y-3 text-xs">
              <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-300 leading-relaxed font-sans">
                <p className="font-semibold text-emerald-400 mb-1">Assalamu Alaikum!</p>
                Have a query regarding union elections, program registrations, or grievance submissions?
                Connect directly with our secretariat desk on WhatsApp.
              </div>

              <form onSubmit={handleSendPrompt} className="space-y-2">
                <input
                  type="text"
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Start Chat on WhatsApp</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <button
        id="whatsapp-chat-float-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 p-3.5 sm:px-4 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/80 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40"
        title="Chat on WhatsApp with ANJUMAN-E-HUDA"
      >
        {/* Pulse beacon */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-stone-950" />
        </span>

        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Chat with Secretariat
        </span>
      </button>
    </div>
  );
};
