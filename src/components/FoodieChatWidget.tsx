import React, { useState, useEffect, useRef } from 'react';
import { useFoodieHub } from '../context/FoodieHubContext';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Minimize2,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const N8N_CHAT_WEBHOOK_URL =
  'https://afrozaha57.app.n8n.cloud/webhook/452fcf18-58e1-4fae-af49-0bf6f375ad25/chat';

export const FoodieChatWidget: React.FC = () => {
  const { cart, currentView } = useFoodieHub();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('foodiehub_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: "👋 Hi there! I'm **FoodieBot**, your AI food concierge.\n\nI can help you discover dishes, find verified coupons, check delivery fees, or recommend restaurants. How can I treat your cravings today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [sessionId] = useState<string>(() => {
    try {
      let sid = sessionStorage.getItem('foodiehub_chat_session_id');
      if (!sid) {
        sid = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('foodiehub_chat_session_id', sid);
      }
      return sid;
    } catch {
      return `session-${Date.now()}`;
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Persist messages in session
  useEffect(() => {
    try {
      sessionStorage.setItem('foodiehub_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);
    setLastFailedQuery(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000);

    try {
      const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        signal: controller.signal,
        body: JSON.stringify({
          chatInput: query,
          message: query,
          action: 'sendMessage',
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const rawText = await response.text();
      let botResponseText = '';

      try {
        const parsed = JSON.parse(rawText);
        if (typeof parsed === 'string') {
          botResponseText = parsed;
        } else if (Array.isArray(parsed)) {
          const first = parsed[0];
          botResponseText =
            first?.output ||
            first?.text ||
            first?.message ||
            first?.response ||
            (typeof first === 'string' ? first : JSON.stringify(first));
        } else if (parsed && typeof parsed === 'object') {
          botResponseText =
            parsed.output ||
            parsed.text ||
            parsed.message ||
            parsed.response ||
            parsed.answer ||
            (parsed.data && (parsed.data.output || parsed.data.text)) ||
            JSON.stringify(parsed);
        }
      } catch {
        botResponseText = rawText || "Here's what I found for you!";
      }

      if (!botResponseText) {
        botResponseText = "Got it! How else can I help you with FoodieHub today?";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('FoodieBot error:', err);
      setLastFailedQuery(query);
      const isTimeout = err.name === 'AbortError';

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        isError: true,
        text: isTimeout
          ? "Our kitchen brain took a little longer than usual to respond. Please click 'Retry' below!"
          : "I'm having a brief connection hiccup reaching the server. Please check your connection or click 'Retry'.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    const welcome: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: "Chat cleared! How can I help you discover something delicious today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
    setLastFailedQuery(null);
    try {
      sessionStorage.removeItem('foodiehub_chat_history');
    } catch {
      // ignore
    }
  };

  const formatInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-stone-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Simple Markdown renderer for bolding, bullet points, headers, and code
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');

    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-extrabold text-stone-900 text-xs mt-2 mb-1">
            {formatInline(line.replace('### ', ''))}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-extrabold text-stone-900 text-sm mt-2 mb-1">
            {formatInline(line.replace('## ', ''))}
          </h3>
        );
      }

      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const isNumbered = /^\d+\.\s/.test(line.trim());

      if (isBullet || isNumbered) {
        const cleaned = isBullet
          ? line.trim().replace(/^[-*]\s/, '')
          : line.trim().replace(/^\d+\.\s/, '');

        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5">
            <span className="text-orange-500 font-bold shrink-0">
              {isBullet ? '•' : line.trim().match(/^\d+\./)?.[0]}
            </span>
            <span>{formatInline(cleaned)}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5 leading-relaxed">
          {formatInline(line)}
        </p>
      );
    });
  };

  const quickPrompts = [
    '🍛 Best biryani?',
    '🏷️ Active coupons?',
    '🍕 Best pizza in town?',
    '🥗 Pure veg dishes?',
  ];

  const hasBottomCartBar = cart.length > 0 && currentView === 'restaurant_detail';

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <div
          className={`fixed z-50 flex items-center gap-2 group transition-all duration-300 ${
            hasBottomCartBar ? 'bottom-20 sm:bottom-6 right-4 sm:right-6' : 'bottom-5 right-5'
          }`}
        >
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold shadow-lg shadow-black/20 animate-bounce duration-1000 border border-stone-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask FoodieBot AI</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open FoodieBot AI Assistant"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 via-amber-600 to-orange-500 text-white shadow-xl shadow-orange-600/35 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer relative ring-4 ring-white"
          >
            <Bot className="w-7 h-7" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </button>
        </div>
      )}

      {/* Slide-in Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 w-[95vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 ${
            hasBottomCartBar ? 'bottom-20 sm:bottom-6 right-2 sm:right-6' : 'bottom-4 right-4 sm:bottom-6 sm:right-6'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-orange-950 text-white p-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-stone-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">FoodieBot AI</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                    Live Agent
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · Powered by n8n Agent
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-stone-50 border-b border-stone-200/70 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-orange-700 border border-stone-200 whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]/60 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-stone-900 text-white'
                        : msg.isError
                        ? 'bg-red-500 text-white'
                        : 'bg-orange-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : msg.isError ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                      isUser
                        ? 'bg-orange-600 text-white rounded-tr-xs'
                        : msg.isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-xs'
                        : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs'
                    }`}
                  >
                    <div className="text-[12px] leading-relaxed">
                      {isUser ? msg.text : renderFormattedText(msg.text)}
                    </div>

                    {msg.isError && lastFailedQuery && (
                      <button
                        onClick={() => handleSendMessage(lastFailedQuery)}
                        className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry query
                      </button>
                    )}

                    <span
                      className={`text-[9px] block mt-1 ${
                        isUser ? 'text-orange-200 text-right' : 'text-stone-400 text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-stone-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-stone-200/80">
            <div className="flex items-center gap-2 bg-stone-100/80 rounded-2xl p-1.5 border border-stone-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about dishes, deals, delivery..."
                disabled={loading}
                className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden disabled:opacity-60"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="w-8 h-8 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-stone-400 px-1">
              <span>Enter to send · Shift+Enter for newline</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
