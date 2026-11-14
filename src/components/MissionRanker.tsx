'use client';

import React, { useState } from 'react';
import { getRankedInvestigations } from '@/data/psi_dataset';
import { Investigation } from '@/types/psi';
import {
  ShieldAlert,
  Compass,
  Satellite,
  Flame,
  Activity,
  Layers,
  ArrowRight,
  Gauge,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

type MissionPreset = 'lunar' | 'iss' | 'spacesuit' | 'spinoffs';

interface MissionScenario {
  id: MissionPreset;
  callsign: string;
  name: string;
  gravityLabel: string;
  gravityValue: number; // in g
  o2Concentration: string;
  pressureRange: string;
  operationalEnvironment: string;
  primaryRiskSummary: string;
  criticality: 'CRITICAL' | 'MONITORED' | 'HIGH ENVELOPE' | 'TERRESTRIAL';
  badgeColor: string;
}

const MISSION_SCENARIOS: MissionScenario[] = [
  {
    id: 'lunar',
    callsign: 'ARTEMIS-HAB // SURFACE',
    name: 'Artemis Base Camp / Lunar Habitat',
    gravityLabel: '0.166 g (Lunar 1/6th)',
    gravityValue: 0.166,
    o2Concentration: '32.0% O2 (Exploration 30–34%)',
    pressureRange: '8.2 PSI (56.5 kPa)',
    operationalEnvironment: 'Exploration Atmosphere designed for rapid EVA staging without nitrogen pre-breathe.',
    primaryRiskSummary:
      'High O2 concentration drastically lowers ignition energy and stabilizes cool flames. Weak partial-gravity buoyancy feeds flames without carrying away heat.',
    criticality: 'CRITICAL',
    badgeColor: 'text-[#35D5E8] border-[#35D5E8]/40 bg-[#35D5E8]/10'
  },
  {
    id: 'iss',
    callsign: 'ISS-EXP // DESTINY LEO',
    name: 'ISS Shirtsleeve Microgravity',
    gravityLabel: '~10⁻⁶ g (Microgravity)',
    gravityValue: 0.000001,
    o2Concentration: '21.0% O2 (Sea-Level Baseline)',
    pressureRange: '14.7 PSI (101.3 kPa)',
    operationalEnvironment: 'Earth-sea-level equivalent cabin air within pressurized orbital laboratory modules.',
    primaryRiskSummary:
      'Natural buoyancy is absent; flames burn spherically and rely purely on diffusion or low-speed cabin ventilation fans (2–25 cm/s).',
    criticality: 'MONITORED',
    badgeColor: 'text-[#2675E8] border-[#2675E8]/40 bg-[#2675E8]/10'
  },
  {
    id: 'spacesuit',
    callsign: 'xEMU // EVA SUIT ENVELOPE',
    name: 'Extravehicular Spacesuit',
    gravityLabel: '0 g to 0.166 g (Orbital / Lunar EVA)',
    gravityValue: 0.08,
    o2Concentration: '100% Pure O2',
    pressureRange: '4.3 PSI (29.6 kPa)',
    operationalEnvironment: 'Pure oxygen environment ensuring astronaut mobility without bulky atmospheric counter-pressure.',
    primaryRiskSummary:
      'Pure O2 creates extreme flashover velocity. Materials that self-extinguish in air ignite instantly and burn with explosive intensity.',
    criticality: 'HIGH ENVELOPE',
    badgeColor: 'text-[#FF5252] border-[#FF5252]/40 bg-[#FF5252]/10'
  },
  {
    id: 'spinoffs',
    callsign: 'EARTH-OPS // COMMERCIAL',
    name: 'Terrestrial Spinoffs & Safety',
    gravityLabel: '1.0 g (Standard Earth)',
    gravityValue: 1.0,
    o2Concentration: '20.9% O2',
    pressureRange: '14.7 PSI (101.3 kPa)',
    operationalEnvironment: 'Civilian and industrial fire protection, mine safety, data centers, and advanced turnout gear.',
    primaryRiskSummary:
      'Buoyancy-dominated upward flame propagation; technology transfer from space research into clean agent suppression and ultra-sensitive detectors.',
    criticality: 'TERRESTRIAL',
    badgeColor: 'text-[#FFB547] border-[#FFB547]/40 bg-[#FFB547]/10'
  }
];

export function MissionRanker() {
  const [selectedPreset, setSelectedPreset] = useState<MissionPreset>('lunar');
  const [activeExpModal, setActiveExpModal] = useState<Investigation | null>(null);

  const activeScenario = MISSION_SCENARIOS.find((s) => s.id === selectedPreset)!;
  const rankedInvestigations = getRankedInvestigations(selectedPreset);

  return (
    <div className="w-full bg-[#0B1425] border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#2675E8]/20 text-[#35D5E8] border border-[#2675E8]/40">
              MISSION PRIORITIZATION // PREDICTIVE RANKER
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
              SIMULATED DESIGN ENVELOPES
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#2675E8]" />
            Spacecraft Mission Flammability Ranker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate and rank NASA microgravity combustion investigations dynamically mapped against operational atmospheric parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#050B18] px-3.5 py-2 rounded-xl border border-slate-800">
          <Activity className="w-4 h-4 text-[#35D5E8]" />
          <span className="text-slate-400">MODEL:</span>
          <span className="text-white font-bold">NASA-STD-6001 MULTI-VECTOR</span>
        </div>
      </div>

      {/* Scientific Accuracy Disclaimer */}
      <div className="mt-3 py-2 px-3.5 rounded-xl bg-[#050B18]/80 border border-slate-800/80 flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <Info className="w-3.5 h-3.5 text-[#35D5E8] flex-shrink-0" />
        <span>
          <strong className="text-slate-300">SCIENTIFIC ACCURACY NOTICE:</strong> Scenario values represent validated NASA engineering design envelopes (NASA-SP-2010-3407) and simulated mission profiles for combustion hazard modeling, not live vehicle telemetry downlinks.
        </span>
      </div>

      {/* Scenario Selection Grid - 4 Mission Cards */}
      <div className="mt-4">
        <div className="text-xs font-mono text-slate-400 mb-2.5 flex items-center justify-between">
          <span>SELECT SIMULATED MISSION PROFILE (4 SCENARIOS):</span>
          <span className="text-[11px] text-[#35D5E8]">CLICK CARD TO RE-RANK EXPERIMENTS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MISSION_SCENARIOS.map((scenario) => {
            const isSelected = selectedPreset === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedPreset(scenario.id)}
                className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#050B18] border-[#35D5E8] shadow-[0_0_15px_rgba(53,213,232,0.15)] ring-1 ring-[#35D5E8]'
                    : 'bg-[#080E1C] border-slate-800 hover:border-slate-700 hover:bg-[#0c1426]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono text-slate-400">{scenario.callsign}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${scenario.badgeColor}`}>
                      {scenario.criticality}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-[#35D5E8] transition-colors line-clamp-1">
                    {scenario.name}
                  </h3>

                  <div className="mt-2.5 space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Gravity:</span>
                      <span className="text-white font-medium">{scenario.gravityLabel}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Atmosphere:</span>
                      <span className="text-[#35D5E8]">{scenario.o2Concentration}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Pressure:</span>
                      <span className="text-[#FFB547]">{scenario.pressureRange}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className={`font-mono text-[10px] ${isSelected ? 'text-[#35D5E8]' : 'text-slate-500'}`}>
                    {isSelected ? '● ACTIVE PROFILE' : 'SELECT PROFILE'}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-[#35D5E8] translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Mission Profile Summary Card */}
      <div className="mt-4 p-4 rounded-xl bg-[#050B18] border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2675E8]/20 border border-[#2675E8]/60 flex items-center justify-center text-[#35D5E8]">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">ACTIVE PROFILE:</span>
                <span className="text-sm font-bold text-white">{activeScenario.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {activeScenario.callsign}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeScenario.operationalEnvironment}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-[#0B1425] border border-slate-700 text-slate-300">
              GRAVITY: <strong className="text-white">{activeScenario.gravityLabel}</strong> | ENV: <strong className="text-[#35D5E8]">{activeScenario.o2Concentration}</strong> @ <strong className="text-[#FFB547]">{activeScenario.pressureRange}</strong>
            </span>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#FFB547] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#FFB547]">Combustion Hazard Focus: </strong>
            <span>{activeScenario.primaryRiskSummary}</span>
          </div>
        </div>
      </div>

      {/* Partial-Gravity Critical Knowledge Gap Warning Callout */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#0B1425] to-[#120F24] border border-[#FFB547]/40 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFB547]/20 border border-[#FFB547]/60 flex items-center justify-center text-[#FFB547] flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono font-bold text-[#FFB547] uppercase tracking-wider text-[11px]">
                CRITICAL SCIENTIFIC KNOWLEDGE GAP // PARTIAL-GRAVITY REGIME
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#FFB547]/10 text-[#FFB547] border border-[#FFB547]/30">
                0.166g (Moon) &amp; 0.38g (Mars)
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              NASA Physical Sciences Informatics (PSI) flight investigations have thoroughly mapped <strong>0-g (ISS / Cygnus)</strong> and <strong>1-g (Earth)</strong>, but the intermediate partial-gravity realm is an urgent experimental blind spot. In partial gravity, buoyant convection is weak enough that it does not rapidly carry away heat, yet strong enough to constantly supply fresh oxygen into the combustion zone. As a result, certain materials can burn <em>more vigorously</em> on the Moon or Mars than either in 0-g or on Earth.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#35D5E8]">
              <span className="text-slate-400">UPCOMING MITIGATION PAYLOADS:</span>
              <span className="px-2 py-0.5 rounded bg-[#050B18] border border-[#35D5E8]/30">
                NASA LUCI (Lunar Combustion Investigation)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#050B18] border border-[#35D5E8]/30">
                NASA FM2 (Fire Safety in Reduced Gravity)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Investigations Telemetry Deck */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              PRIORITIZED NASA INVESTIGATIONS ({rankedInvestigations.length} TOTAL)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            PROFILE: <strong className="text-[#35D5E8]">{activeScenario.callsign}</strong>
          </span>
        </div>

        <div className="space-y-2.5">
          {rankedInvestigations.map((inv, rankIndex) => {
            const isTop3 = rankIndex < 3;
            const matchScore = Math.max(65, Math.min(99, 100 - rankIndex * 3));

            return (
              <div
                key={inv.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isTop3
                    ? 'bg-[#050B18] border-slate-700/80 shadow-md'
                    : 'bg-[#070D1A] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left: Rank, ID, Acronym & Details */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                        rankIndex === 0
                          ? 'bg-[#35D5E8]/20 text-[#35D5E8] border border-[#35D5E8]/50'
                          : rankIndex === 1
                          ? 'bg-[#2675E8]/20 text-[#2675E8] border border-[#2675E8]/50'
                          : rankIndex === 2
                          ? 'bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/50'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      #{rankIndex + 1}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                          [{inv.id}]
                        </span>
                        <h4 className="text-sm font-bold text-white hover:text-[#35D5E8] transition-colors">
                          {inv.acronym} — {inv.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-mono text-slate-400">
                        <span className="text-slate-300">
                          Pillar: <strong className="text-white">{inv.pillar}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Fuel: <strong className="text-cyan-400">{inv.fuelType}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Hardware: <strong className="text-slate-300">{inv.hardware}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-[#FFB547]">
                          O2: {inv.oxygenRangePercent[0]}%–{inv.oxygenRangePercent[1]}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Relevance Score Meter & Drilldown */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pl-10 md:pl-0">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[10px] font-mono text-slate-400">RELEVANCE:</span>
                        <span className="text-xs font-mono font-bold text-[#35D5E8]">
                          {matchScore}%
                        </span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-[#2675E8] to-[#35D5E8] rounded-full"
                          style={{ width: `${matchScore}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveExpModal(inv)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 border border-slate-700 transition-colors"
                      title="Inspect scientific investigation briefing"
                    >
                      <span>Telemetry</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Key Finding Snippet */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 pl-10 text-xs text-slate-400 line-clamp-1">
                  <span className="text-slate-500 font-mono text-[11px]">KEY EMPIRICAL FINDING: </span>
                  {inv.keyFindings}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investigation Telemetry Modal */}
      {activeExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0B1425] border border-slate-700 rounded-2xl max-w-2xl w-full p-5 md:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2675E8]/20 text-[#35D5E8] border border-[#2675E8]/40">
                    [{activeExpModal.id}]
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Pillar: {activeExpModal.pillar}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeExpModal.acronym}: {activeExpModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveExpModal(null)}
                className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#050B18] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">FUEL TYPE</span>
                <span className="text-[#35D5E8] font-bold">{activeExpModal.fuelType}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050B18] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">O2 RANGE</span>
                <span className="text-[#FFB547] font-bold">
                  {activeExpModal.oxygenRangePercent[0]}%–{activeExpModal.oxygenRangePercent[1]}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050B18] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PRESSURE</span>
                <span className="text-white font-bold">{activeExpModal.pressurePsi} PSI</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050B18] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">AIRFLOW</span>
                <span className="text-cyan-300 font-bold">
                  {activeExpModal.airflowCmPerSec[0]}–{activeExpModal.airflowCmPerSec[1]} cm/s
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-300 block mb-1">Hardware &amp; Sample Details:</span>
                <div className="p-3 rounded-lg bg-[#050B18] border border-slate-800 text-slate-300">
                  <p><strong>Hardware Facility:</strong> {activeExpModal.hardware}</p>
                  <p className="mt-1"><strong>Sample:</strong> {activeExpModal.sampleDetails}</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-300 block mb-1">Scientific Objective:</span>
                <p className="p-3 rounded-lg bg-[#050B18] border border-slate-800 text-slate-300 leading-relaxed">
                  {activeExpModal.objective}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#FFB547] block mb-1">Key Empirical Findings:</span>
                <p className="p-3 rounded-lg bg-[#050B18] border border-slate-800 text-slate-200 leading-relaxed">
                  {activeExpModal.keyFindings}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#35D5E8] block mb-1">Commercial Terrestrial Spinoff:</span>
                <p className="p-3 rounded-lg bg-[#050B18] border border-slate-800 text-slate-300 leading-relaxed">
                  {activeExpModal.earthSpinoff}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveExpModal(null)}
                className="px-4 py-2 rounded-xl bg-[#2675E8] hover:bg-[#2675E8]/80 text-white font-mono text-xs transition-colors"
              >
                Acknowledge Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissionRanker;
