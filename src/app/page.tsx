'use client';

import React, { useState, useEffect } from 'react';
import MissionRanker from '@/components/MissionRanker';
import AtmosphereChart from '@/components/AtmosphereChart';
import ExperimentMatrix from '@/components/ExperimentMatrix';
import HistoryAndSpinoffs from '@/components/HistoryAndSpinoffs';
import AskPsiCopilot from '@/components/AskPsiCopilot';
import {
  Flame,
  Radio,
  Satellite,
  Activity,
  Layers,
  Compass,
  History,
  Bot,
  Gauge,
  ShieldAlert,
  Clock,
  Terminal,
  Info
} from 'lucide-react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>('00:00:00 UTC');
  const [missionElapsedHours, setMissionElapsedHours] = useState<number>(142);
  const [missionElapsedMinutes, setMissionElapsedMinutes] = useState<number>(18);
  const [missionElapsedSeconds, setMissionElapsedSeconds] = useState<number>(44);
  const [activeSection, setActiveSection] = useState<string>('all');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC');
      setMissionElapsedSeconds((prev) => {
        if (prev >= 59) {
          setMissionElapsedMinutes((m) => (m >= 59 ? 0 : m + 1));
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const metString = `T+${String(missionElapsedHours).padStart(3, '0')}:${String(
    missionElapsedMinutes
  ).padStart(2, '0')}:${String(missionElapsedSeconds).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 font-sans selection:bg-[#35D5E8] selection:text-black antialiased flex flex-col">
      {/* AEROSPACE TOP HUD BAR */}
      <header className="sticky top-0 z-40 bg-[#070E1E]/95 border-b border-slate-800 backdrop-blur-md px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Branding & Mission Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2675E8]/20 border border-[#2675E8]/70 flex items-center justify-center text-[#35D5E8] shadow-md flex-shrink-0">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2675E8]/20 text-[#35D5E8] border border-[#2675E8]/40">
                  NASA SPACE APPS 2026 // FLAME IN FREEFALL
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60">
                  SIMULATED FLIGHT ENVELOPE
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                COSMORA — Flame in Freefall
                <span className="text-xs font-mono font-normal text-slate-400 border-l border-slate-700 pl-2 hidden sm:inline">
                  Spacecraft Combustion &amp; Flammability Telemetry Deck
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Flight Deck Time & Live System Link */}
          <div className="flex items-center gap-2.5 self-end md:self-auto text-xs font-mono">
            <div className="bg-[#050B18] px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#35D5E8]" />
              <span className="text-slate-500">MET:</span>
              <span className="text-white font-bold">{metString}</span>
            </div>

            <div className="bg-[#050B18] px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 hidden sm:flex items-center gap-2">
              <span className="text-slate-500">UTC:</span>
              <span className="text-[#35D5E8] font-bold">{currentTime}</span>
            </div>

            <div className="bg-[#050B18] px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 hidden sm:inline">DATASET:</span>
              <span className="text-emerald-400 font-bold">12 PSI INVESTIGATIONS</span>
            </div>
          </div>
        </div>

        {/* SCIENTIFICALLY CONSISTENT MISSION SIMULATION QUICK-STRIP */}
        <div className="max-w-7xl mx-auto mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="flex items-center justify-between px-3 py-1.5 rounded bg-[#050B18]/70 border border-slate-800">
            <span className="text-slate-400">BASELINE PROFILE:</span>
            <span className="text-[#35D5E8] font-bold">ARTEMIS LUNAR HAB</span>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 rounded bg-[#050B18]/70 border border-slate-800">
            <span className="text-slate-400">GRAVITY ACCEL:</span>
            <span className="text-white font-bold">0.166 g (LUNAR 1/6th)</span>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 rounded bg-[#050B18]/70 border border-slate-800">
            <span className="text-slate-400">CABIN ATMOSPHERE:</span>
            <span className="text-[#FFB547] font-bold">32.0% O2 @ 8.2 PSI</span>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 rounded bg-[#050B18]/70 border border-slate-800">
            <span className="text-slate-400">FIRE SUPPRESSION:</span>
            <span className="text-emerald-400 font-bold">STANDBY NOMINAL</span>
          </div>
        </div>

        {/* WORKSTATION VIEW FILTER BAR */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-slate-500 text-[11px] uppercase mr-1 hidden md:inline">
            DISPATCH VIEW:
          </span>
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              activeSection === 'all'
                ? 'bg-[#2675E8] border-[#2675E8] text-white font-bold shadow-sm'
                : 'bg-[#050B18] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Workstations
          </button>
          <button
            onClick={() => setActiveSection('ranker')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              activeSection === 'ranker'
                ? 'bg-[#2675E8] border-[#2675E8] text-white font-bold shadow-sm'
                : 'bg-[#050B18] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Mission Ranker
          </button>
          <button
            onClick={() => setActiveSection('atmosphere')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              activeSection === 'atmosphere'
                ? 'bg-[#2675E8] border-[#2675E8] text-white font-bold shadow-sm'
                : 'bg-[#050B18] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Atmosphere Matrix
          </button>
          <button
            onClick={() => setActiveSection('matrix')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              activeSection === 'matrix'
                ? 'bg-[#2675E8] border-[#2675E8] text-white font-bold shadow-sm'
                : 'bg-[#050B18] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Experiment Matrix
          </button>
          <button
            onClick={() => setActiveSection('history')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              activeSection === 'history'
                ? 'bg-[#2675E8] border-[#2675E8] text-white font-bold shadow-sm'
                : 'bg-[#050B18] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            History &amp; Spinoffs
          </button>
          <button
            onClick={() => setActiveSection('copilot')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              activeSection === 'copilot'
                ? 'bg-[#2675E8] border-[#2675E8] text-white font-bold shadow-sm'
                : 'bg-[#050B18] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            AI PSI Copilot
          </button>
        </div>
      </header>

      {/* MAIN MISSION CONTROL CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-8">
        {/* WORKSTATION 1: Mission Ranker */}
        {(activeSection === 'all' || activeSection === 'ranker') && (
          <section id="mission-ranker">
            <MissionRanker />
          </section>
        )}

        {/* WORKSTATION 2 & 5 DUAL LAYOUT: Atmosphere Chart & AI Copilot */}
        {(activeSection === 'all' || activeSection === 'atmosphere' || activeSection === 'copilot') && (
          <section id="atmosphere-and-copilot" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Atmosphere Chart Component */}
            {(activeSection === 'all' || activeSection === 'atmosphere') && (
              <div className={activeSection === 'all' ? 'xl:col-span-7' : 'xl:col-span-12'}>
                <AtmosphereChart />
              </div>
            )}

            {/* AskPsiCopilot Component */}
            {(activeSection === 'all' || activeSection === 'copilot') && (
              <div className={activeSection === 'all' ? 'xl:col-span-5' : 'xl:col-span-12'}>
                <AskPsiCopilot />
              </div>
            )}
          </section>
        )}

        {/* WORKSTATION 3: Experiment Matrix & Side-by-Side Comparator */}
        {(activeSection === 'all' || activeSection === 'matrix') && (
          <section id="experiment-matrix">
            <ExperimentMatrix />
          </section>
        )}

        {/* WORKSTATION 4: Historical Incidents & NASA Spinoffs */}
        {(activeSection === 'all' || activeSection === 'history') && (
          <section id="history-and-spinoffs">
            <HistoryAndSpinoffs />
          </section>
        )}
      </main>

      {/* MISSION CONTROL FOOTER */}
      <footer className="mt-auto bg-[#070E1E] border-t border-slate-800 py-6 px-4 md:px-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#35D5E8]"></span>
            <span>COSMORA — FLAME IN FREEFALL // NASA SPACE APPS CHALLENGE 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>NASA PSI DATASET (12 FLIGHT EXPERIMENTS)</span>
            <span>•</span>
            <span>GROQ LLAMA-3.3-70B AI TELEMETRY</span>
            <span>•</span>
            <span>NASA-STD-6001 COMPLIANCE</span>
          </div>

          <div className="text-slate-600">
            AEROSPACE RESEARCH &amp; FLAMMABILITY PREDICTION WORKSTATION
          </div>
        </div>
      </footer>
    </div>
  );
}
