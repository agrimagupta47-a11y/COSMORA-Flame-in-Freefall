'use client';

import React from 'react';
import AtmosphereChart from '@/components/AtmosphereChart';
import AskPsiCopilot from '@/components/AskPsiCopilot';
import { Rocket, Shield, Flame, Radio } from 'lucide-react';

export default function DevPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Dev Header */}
      <header className="max-w-7xl mx-auto mb-8 pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-700">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              DEV PREVIEW STAGING // FEAT/DATA-AND-AI
            </span>
            <span className="text-xs font-mono text-slate-500">NASA SPACE APPS 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Flame className="w-8 h-8 text-orange-500" />
            Flame in Freefall — Telemetry &amp; AI Flight Deck
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Live developer verification preview for NASA Physical Sciences Informatics (PSI) microgravity flammability matrix and Groq Llama-3.3-70B AI copilot.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-3 rounded-2xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>CONTRACT: LOCKED</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span>12 PSI DATASETS</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Atmospheric Matrix */}
        <div className="xl:col-span-7 space-y-6">
          <AtmosphereChart />
        </div>

        {/* Right Column: AI Mission Control Copilot */}
        <div className="xl:col-span-5 space-y-6">
          <AskPsiCopilot />
        </div>
      </main>
    </div>
  );
}
