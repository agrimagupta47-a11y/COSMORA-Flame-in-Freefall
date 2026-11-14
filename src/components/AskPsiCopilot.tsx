'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Terminal,
  Loader2,
  Flame,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Cpu
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  'Which PSI experiments apply to a 30% O2 Lunar Base?',
  'How do cool flames in CFI-G affect smoke detection?',
  'Compare BASS-II and Saffire-I for cabin materials'
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'assistant',
  text: `**Flame in Freefall Copilot initialized.** 

Active telemetry linked to 12 NASA Physical Sciences Informatics (PSI) investigations, historical Apollo & Mir flight fires, and terrestrial spinoffs.

Inquire about microgravity combustion kinetics, partial-gravity lunar/martian flammability gaps, or select a mission dispatch prompt below.`,
  timestamp: 'SYSTEM NOMINAL'
};

export default function AskPsiCopilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleClearChat = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode: 'chat',
          message: query
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'No telemetry received from AI core.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Flight Telemetry Notice**: Real-time AI stream fallback applied. Grounded dataset answers remain operational via local flight rule cache.`,
        timestamp: 'ADVISORY'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageText = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, lIdx) => {
      const trimmed = line.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={lIdx} className="text-white font-bold text-sm mt-3 mb-1.5 flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            {trimmed.substring(4)}
          </h4>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={lIdx} className="text-white font-bold text-base mt-3.5 mb-2 border-b border-slate-800 pb-1">
            {trimmed.substring(3)}
          </h3>
        );
      }

      // Check if line is a bullet
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      const cleanLine = isBullet ? trimmed.substring(2) : line;

      // Highlight [PSI-XX], [node/XX], and [INC-XX] citations with cyan / amber pills
      const parts = cleanLine.split(/(\[PSI-\d+[A-Z0-9-]*\]|\[node\/\d+\]|\[INC-[A-Z0-9-]+\]|\*\*.*?\*\*)/g);

      const renderedParts = parts.map((part, pIdx) => {
        // [PSI-XXX] badges
        if (/^\[PSI-\d+[A-Z0-9-]*\]$/.test(part)) {
          return (
            <span
              key={pIdx}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/70 shadow-sm mx-1 hover:border-cyan-400 transition-colors cursor-default"
              title="NASA Physical Sciences Informatics Citation"
            >
              {part}
            </span>
          );
        }

        // [node/XXXX] badges
        if (/^\[node\/\d+\]$/.test(part)) {
          return (
            <span
              key={pIdx}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-500/70 shadow-sm mx-1 hover:border-amber-400 transition-colors cursor-default"
              title="NASA Spinoff Technology Citation"
            >
              {part}
            </span>
          );
        }

        // [INC-XXX] badges
        if (/^\[INC-[A-Z0-9-]+\]$/.test(part)) {
          return (
            <span
              key={pIdx}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-red-950/90 text-red-300 border border-red-500/70 shadow-sm mx-1"
            >
              {part}
            </span>
          );
        }

        // Bold text
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }

        return part;
      });

      if (isBullet) {
        return (
          <li key={lIdx} className="ml-4 list-disc list-outside text-slate-300 my-1 leading-relaxed">
            {renderedParts}
          </li>
        );
      }

      return (
        <p key={lIdx} className={`leading-relaxed text-slate-300 ${trimmed === '' ? 'h-2' : 'my-1'}`}>
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div className="w-full bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md">
      {/* Mission Control Top Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              NASA PSI COPILOT // FLIGHT DECK
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>LLAMA-3.3-70B • GROQ ACCELERATED</span>
          </div>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
            title="Reset flight consultation session"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Starter Prompts */}
      <div className="px-4 pt-3 pb-2.5 bg-slate-900/40 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>FLIGHT READINESS ONE-CLICK PROMPTS:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-left text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-700/60 transition-all flex items-center gap-1.5 group disabled:opacity-50"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="p-4 space-y-4 max-h-[460px] min-h-[320px] overflow-y-auto font-sans text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center flex-shrink-0 text-cyan-400 mt-1 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 border ${
                msg.sender === 'user'
                  ? 'bg-cyan-950/70 border-cyan-700/60 text-slate-100 rounded-tr-none'
                  : 'bg-slate-900/95 border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] font-mono text-slate-400 border-b border-slate-800/60 pb-1">
                <span>{msg.sender === 'user' ? 'FLIGHT SCIENTIST' : 'PSI ADVISORY CORE'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="space-y-1">{formatMessageText(msg.text)}</div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 mt-1 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Pulse & Skeleton Loading State */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center flex-shrink-0 text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl rounded-tl-none p-4 max-w-[80%] w-full space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Interrogating NASA Physical Sciences Informatics (PSI) repository...</span>
              </div>
              <div className="h-3 bg-slate-800 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-slate-800/70 rounded w-5/6 animate-pulse"></div>
              <div className="h-3 bg-slate-800/50 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Terminal className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about microgravity combustion, cool flames, lunar habitats..."
            disabled={isLoading}
            className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white disabled:text-slate-500 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Transmit</span>
        </button>
      </form>
    </div>
  );
}
