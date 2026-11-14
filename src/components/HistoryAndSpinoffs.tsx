'use client';

import React, { useState } from 'react';
import { incidents, spinoffs } from '@/data/psi_dataset';
import { HistoricalIncident, SpinoffItem } from '@/types/psi';
import {
  History,
  ShieldAlert,
  Flame,
  ExternalLink,
  Video,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Clock,
  Compass,
  AlertTriangle,
  Lightbulb,
  Radio
} from 'lucide-react';

export function HistoryAndSpinoffs() {
  const [selectedIncident, setSelectedIncident] = useState<HistoricalIncident>(incidents[0]);
  const [selectedSpinoff, setSelectedSpinoff] = useState<SpinoffItem>(spinoffs[0]);

  return (
    <div className="w-full bg-[#0B1425] border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md space-y-8">
      {/* Top Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF5252]/20 text-[#FF5252] border border-[#FF5252]/40">
              FLIGHT FORENSICS &amp; EARTH SPINOFFS
            </span>
            <span className="text-xs font-mono text-slate-400">
              Historical Incidents &amp; Dual-Use Technology Transfer
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <History className="w-6 h-6 text-[#FF5252]" />
            Spaceflight Fire Incidents &amp; NASA Terrestrial Spinoffs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracing how fatal launch pad flashovers, cryogenic tank ruptures, and orbital station fires catalyzed modern spacecraft safety standards and lifesaving Earth technologies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#050B18] px-3.5 py-2 rounded-xl border border-slate-800">
          <Radio className="w-4 h-4 text-[#35D5E8]" />
          <span className="text-slate-400">STANDARDS:</span>
          <span className="text-white font-bold">NASA-STD-6001 / NFPA</span>
        </div>
      </div>

      {/* SECTION 1: Historical Incidents Timeline (Apollo 1, Apollo 13, Mir) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF5252]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              HISTORICAL SPACECRAFT FIRE INCIDENT TIMELINE
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">3 CRITICAL TURNING POINTS</span>
        </div>

        {/* Timeline Horizontal / Grid Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {incidents.map((inc) => {
            const isSelected = selectedIncident.id === inc.id;
            return (
              <button
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#050B18] border-[#FF5252] shadow-[0_0_15px_rgba(255,82,82,0.15)] ring-1 ring-[#FF5252]'
                    : 'bg-[#080E1C] border-slate-800 hover:border-slate-700 hover:bg-[#0c1426]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800 font-bold">
                      YEAR {inc.year}
                    </span>
                    <span className="text-slate-400">[{inc.id}]</span>
                  </div>

                  <h4 className="text-base font-bold text-white line-clamp-1">{inc.mission}</h4>

                  <div className="mt-2.5 flex items-center gap-3 text-[11px] font-mono">
                    <span className="text-[#35D5E8]">O2: {inc.oxygenPercent}%</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[#FFB547]">Pressure: {inc.pressurePsi} PSI</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-[#FF5252]' : 'text-slate-500'}>
                    {isSelected ? '● INVESTIGATING' : 'SELECT INCIDENT'}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-[#FF5252] translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Incident Telemetry Detail Card */}
        <div className="mt-4 p-5 rounded-xl bg-[#050B18] border border-slate-800 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700 flex items-center justify-center text-red-400 flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedIncident.mission} ({selectedIncident.year}) — Forensic Failure Analysis
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  Cabin Environment: {selectedIncident.oxygenPercent}% O2 @ {selectedIncident.pressurePsi} PSI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded bg-[#0B1425] border border-red-900/60 text-red-300 font-bold">
                INCIDENT ID: {selectedIncident.id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-red-400 font-mono text-[11px]">
                <Flame className="w-3.5 h-3.5" /> ROOT CAUSE &amp; IGNITION MECHANISM
              </div>
              <div className="p-3.5 rounded-xl bg-[#080E1C] border border-slate-800 text-slate-300 leading-relaxed">
                {selectedIncident.cause}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#35D5E8] font-mono text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" /> ENGINEERING SAFETY LESSON LEARNED
              </div>
              <div className="p-3.5 rounded-xl bg-[#080E1C] border border-slate-800 text-slate-200 leading-relaxed">
                {selectedIncident.lessonLearned}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: NASA ScienceCast Video Embed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#35D5E8]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              NASA SCIENCECAST: FLAME IN FREEFALL (MICROGRAVITY COMBUSTION)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#35D5E8]">OFFICIAL NASA SCIENCE BRIEFING</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Responsive HUD Video Frame */}
          <div className="lg:col-span-8 bg-[#050B18] border border-slate-800 rounded-xl overflow-hidden p-2 flex flex-col justify-center">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/BxxqCLxx53M?rel=0&modestbranding=1"
                title="NASA ScienceCast: Flame in Freefall"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-2 px-2 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>SOURCE: NASA SCIENCE MISSION DIRECTORATE</span>
              <a
                href="https://www.youtube.com/watch?v=BxxqCLxx53M"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#35D5E8] hover:underline flex items-center gap-1"
              >
                <span>Direct NASA Video Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Scientific Briefing Side-Panel */}
          <div className="lg:col-span-4 bg-[#050B18] border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-xs space-y-3">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#35D5E8] font-bold mb-2 pb-1 border-b border-slate-800">
                <Sparkles className="w-3.5 h-3.5" /> MICROGRAVITY COMBUSTION PRINCIPLES
              </div>

              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">Absence of Buoyant Convection:</strong> On Earth, hot gases rise rapidly, feeding oxygen to the base and producing teardrop flames. In microgravity, flames become spherical, burning cooler and slower.
                </p>
                <p>
                  <strong className="text-white">Discovery of Cool Flames:</strong> In NASA's FLEX experiments, heptane fuel droplets extinguished their visible hot flames, only to continue burning silently at 400°C–600°C via low-temperature radical kinetics.
                </p>
                <p>
                  <strong className="text-white">Spacecraft Ventilation Hazard:</strong> Without buoyancy, forced air circulation loops (2–25 cm/s) in habitats like the ISS or lunar base can supply steady oxidizer while failing to sweep away heat.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#080E1C] border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-[#FFB547] block font-bold mb-0.5">FLIGHT SAFETY TAKEAWAY:</span>
              Detection must pair optical sensors with aspirating sub-micron particle sniffers to catch soot-free cool flame fires.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Three NASA Terrestrial Spinoff Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FFB547]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              NASA TERRESTRIAL SPINOFF TECHNOLOGIES (3 BENEFITING HUMANITY)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#FFB547]">COMMERCIAL TECHNOLOGY TRANSFER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spinoffs.map((sp) => {
            const isSelected = selectedSpinoff.id === sp.id;
            return (
              <div
                key={sp.id}
                onClick={() => setSelectedSpinoff(sp)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#050B18] border-[#FFB547] shadow-[0_0_15px_rgba(255,181,71,0.15)] ring-1 ring-[#FFB547]'
                    : 'bg-[#080E1C] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">
                      [{sp.id}]
                    </span>
                    <a
                      href={sp.spinoffUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <span>NASA Publication</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">{sp.title}</h4>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-[#35D5E8] block uppercase">
                        NASA Flight Research Origin:
                      </span>
                      <p className="text-slate-300 leading-relaxed mt-0.5 line-clamp-3">
                        {sp.nasaConnection}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-mono text-emerald-400 block uppercase">
                        Terrestrial Fire Safety Impact:
                      </span>
                      <p className="text-slate-200 leading-relaxed mt-0.5 line-clamp-3">
                        {sp.terrestrialImpact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-[#FFB547]">
                  <span>SPINOFF VERIFIED</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HistoryAndSpinoffs;

