'use client';

import React, { useState, useEffect } from 'react';
import AtmosphereChart from '@/components/AtmosphereChart';
import AskPsiCopilot from '@/components/AskPsiCopilot';
import { investigations } from '@/data/psi_dataset';
import { Rocket, Shield, Flame, Radio, Cpu, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function DevPreviewPage() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'live' | 'fallback'>('checking');

  useEffect(() => {
    // Ping AI API endpoint to check live connectivity
    fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'chat', message: 'ping' })
    })
      .then((res) => {
        if (res.ok) {
          setApiStatus('live');
        } else {
          setApiStatus('fallback');
        }
      })
      .catch(() => {
        setApiStatus('fallback');
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Full-Screen Dark Aerospace Header */}
      <header className="max-w-7xl mx-auto mb-6 pb-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-700 shadow-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              FLIGHT DECK STAGING // FEAT/DATA-AND-AI
            </span>
            <span className="text-xs font-mono text-slate-400">NASA SPACE APPS 2026</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Flame className="w-7 h-7 text-orange-500" />
            COSMORA — Data, AI &amp; Atmosphere Simulator Preview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Live developer verification preview for NASA Physical Sciences Informatics (PSI) flammability simulator, live Groq Llama-3.3-70B habitat briefings, and adaptive aerospace copilot.
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/90 px-3.5 py-2.5 rounded-2xl border border-slate-800 text-xs font-mono">
          {/* API Live Status Badge */}
          <div className="flex items-center gap-1.5">
            {apiStatus === 'live' && (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                <span>/API/AI: LIVE (GROQ)</span>
              </span>
            )}
            {apiStatus === 'checking' && (
              <span className="flex items-center gap-1 text-cyan-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>/API/AI: CONNECTING</span>
              </span>
            )}
            {apiStatus === 'fallback' && (
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                <span>/API/AI: CACHE ACTIVE</span>
              </span>
            )}
          </div>

          <span className="text-slate-700">•</span>

          {/* PSI Investigation Count Badge */}
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{investigations.length} PSI DATASETS</span>
          </div>

          <span className="text-slate-700">•</span>

          <div className="flex items-center gap-1.5 text-purple-300">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>CONTRACT LOCKED</span>
          </div>
        </div>
      </header>

      {/* Balanced 2-Column Desktop Grid (7 cols for simulator, 5 cols for copilot) */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Atmospheric Matrix & Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <AtmosphereChart />
        </div>

        {/* Right Column: AI Mission Control Copilot (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AskPsiCopilot />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto mt-10 pt-4 border-t border-slate-900 text-center text-xs font-mono text-slate-500">
        NASA Space Apps Challenge 2026 • Flame in Freefall • Microgravity Combustion &amp; Fire Safety Architecture
      </footer>
    </div>
  );
}
