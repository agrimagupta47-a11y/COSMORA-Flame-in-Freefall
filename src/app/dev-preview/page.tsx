'use client';

import React from 'react';
import AtmosphereChart from '@/components/AtmosphereChart';
import AskPsiCopilot from '@/components/AskPsiCopilot';
import { Rocket, Shield, Flame, Radio, Activity, Compass, Cpu } from 'lucide-react';

export default function DevPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Dev Header */}
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
            Flame in Freefall — Telemetry, Physics &amp; AI Flight Deck
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Live developer verification preview for the NASA Physical Sciences Informatics (PSI) flammability simulator, live Groq Llama-3.3-70B habitat briefings, and adaptive aerospace copilot.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/90 px-3.5 py-2.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>CONTRACT LOCKED</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>LLAMA-3.3-70B</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-purple-400">
            <Rocket className="w-3.5 h-3.5" />
            <span>12 PSI DATASETS</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Atmospheric Matrix & Simulator */}
        <div className="xl:col-span-7 space-y-6">
          <AtmosphereChart />
        </div>

        {/* Right Column: AI Mission Control Copilot */}
        <div className="xl:col-span-5 space-y-6">
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
