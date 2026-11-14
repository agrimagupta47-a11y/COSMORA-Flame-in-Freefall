'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  CartesianGrid,
  Cell
} from 'recharts';
import { investigations } from '@/data/psi_dataset';
import { Investigation } from '@/types/psi';
import {
  Flame,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Info,
  Compass,
  X,
  Layers,
  Activity,
  Sliders,
  Cpu,
  Loader2,
  Zap,
  RotateCcw
} from 'lucide-react';

interface AtmosphereDataPoint {
  id: string;
  name: string;
  category: 'habitat' | 'incident' | 'psi' | 'custom';
  groupLabel: string;
  o2Percent: number;
  o2Range?: [number, number];
  pressurePsi: number;
  pillar?: string;
  hardware?: string;
  fuelType?: string;
  details: string;
  safetyTakeaway: string;
  color: string;
  rawInvestigation?: Investigation;
}

interface BriefingResult {
  riskLevel: 'CRITICAL' | 'ELEVATED' | 'NOMINAL';
  ignitionRisk: string;
  suppressionStrategy: string;
  relevantPsiIds: string[];
  partialGravityCaveat: string;
}

export default function AtmosphereChart() {
  const [mounted, setMounted] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<AtmosphereDataPoint | null>(null);

  // Custom Habitat Simulator State
  const [showSimulator, setShowSimulator] = useState(true);
  const [customO2, setCustomO2] = useState<number>(32.0);
  const [customPressure, setCustomPressure] = useState<number>(8.2);

  // Live AI Briefing State
  const [briefing, setBriefing] = useState<BriefingResult | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch AI Habitat Briefing
  const fetchAiBriefing = useCallback(async (o2: number, psi: number, name: string) => {
    setIsBriefingLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'briefing',
          oxygenPercent: o2,
          pressurePsi: psi,
          habitatName: name
        })
      });

      if (res.ok) {
        const data: BriefingResult = await res.json();
        setBriefing(data);
      }
    } catch (err) {
      console.warn('Failed to fetch AI briefing:', err);
    } finally {
      setIsBriefingLoading(false);
    }
  }, []);

  // Benchmarks & Historic Points
  const habitatBenchmarks: AtmosphereDataPoint[] = [
    {
      id: 'EARTH-SEA-LEVEL',
      name: 'Earth Sea Level Atmosphere',
      category: 'habitat',
      groupLabel: 'Crew Habitat',
      o2Percent: 21.0,
      pressurePsi: 14.7,
      color: '#38bdf8', // sky-400
      details: 'Nominal terrestrial sea-level atmosphere (21% O2, 79% N2 at 1.0 atm / 101.3 kPa). Standard NASA-STD-6001 ground testing baseline.',
      safetyTakeaway:
        'Normal 1-g buoyant convective plumes lift hot gases away from the flame zone and draw fresh oxygen. This buoyant cooling mechanism disappears in low gravity.'
    },
    {
      id: 'LUNAR-HABITAT-TARGET',
      name: 'Planned Artemis Lunar Base / Pressurized Rover',
      category: 'habitat',
      groupLabel: 'Crew Habitat',
      o2Percent: 32.0,
      o2Range: [30.0, 34.0],
      pressurePsi: 8.2,
      color: '#c084fc', // purple-400
      details: 'Target Exploration Atmosphere (30%–34% O2, 8.2–10.2 PSI / 56.5–70.3 kPa). Designed to eliminate multi-hour pre-breathe times before lunar EVAs.',
      safetyTakeaway:
        'CRITICAL ENVELOPE: Higher oxygen concentration lowers minimum ignition energy and widens flammability boundaries. Low-temperature cool flames ([PSI-159]) and polymer flame spread are drastically enhanced.'
    },
    {
      id: 'EVA-SPACESUIT',
      name: 'xEMU Spacesuit Operational Envelope',
      category: 'habitat',
      groupLabel: 'Crew Habitat',
      o2Percent: 100.0,
      pressurePsi: 4.3,
      color: '#34d399', // emerald-400
      details: '100% pure oxygen at 4.3 PSI (29.6 kPa) to maintain physiological oxygen partial pressure without joint stiffness during EVA.',
      safetyTakeaway:
        'Pure oxygen eliminates decompression sickness risks during surface operations, but materials exhibit near-instantaneous flash fire propagation if ignited.'
    }
  ];

  const historicalIncidents: AtmosphereDataPoint[] = [
    {
      id: 'APOLLO-1-DISASTER',
      name: 'Apollo 1 Pad Fire (1967)',
      category: 'incident',
      groupLabel: 'Historical Fire',
      o2Percent: 100.0,
      pressurePsi: 16.7,
      color: '#ef4444', // red-500
      details: '100% O2 pressurized to 16.7 PSI (115 kPa) during pre-flight plugs-out simulation. Damaged wire sparked in cabin interior.',
      safetyTakeaway:
        'High-pressure pure oxygen caused rapid flashover in <15 seconds. Catalyzed strict NASA non-metallic materials flammability screening (NASA-STD-6001) and rapid-egress hatch designs.'
    },
    {
      id: 'MIR-INCIDENT',
      name: 'Mir Space Station Fire (1997)',
      category: 'incident',
      groupLabel: 'Historical Fire',
      o2Percent: 22.0,
      pressurePsi: 14.7,
      color: '#f97316', // orange-500
      details: 'Solid fuel oxygen generator (Vika candle) rupture in Kvant-1 module, producing an open torch flame and dense smoke in microgravity.',
      safetyTakeaway:
        'Demonstrated that zero-gravity smoke balling blinds crew rapidly and fire extinguisher jet recoil creates hazardous physical pushback. Underlined the need for clean inert gas suppression.'
    }
  ];

  // Map PSI investigations into plot points
  const psiPoints: AtmosphereDataPoint[] = investigations.map((inv) => {
    const o2Avg = (inv.oxygenRangePercent[0] + inv.oxygenRangePercent[1]) / 2;
    let color = '#60a5fa'; // blue-400 (Prevention)
    if (inv.pillar === 'Detection') color = '#fbbf24'; // amber-400
    if (inv.pillar === 'Suppression') color = '#f43f5e'; // rose-500
    if (inv.pillar === 'Fundamentals') color = '#a78bfa'; // violet-400

    return {
      id: inv.id,
      name: `[${inv.id}] ${inv.acronym}`,
      category: 'psi',
      groupLabel: `PSI: ${inv.pillar}`,
      o2Percent: o2Avg,
      o2Range: inv.oxygenRangePercent,
      pressurePsi: inv.pressurePsi,
      pillar: inv.pillar,
      hardware: inv.hardware,
      fuelType: inv.fuelType,
      details: `${inv.title} — Fuel: ${inv.fuelType} (${inv.sampleDetails}). Facility: ${inv.hardware}. Convective Flow: ${inv.airflowCmPerSec[0]}–${inv.airflowCmPerSec[1]} cm/s.`,
      safetyTakeaway: inv.keyFindings,
      color,
      rawInvestigation: inv
    };
  });

  // Custom Simulator Point
  const customSimulatorPoint: AtmosphereDataPoint = {
    id: 'CUSTOM-SIMULATOR-POINT',
    name: `Custom Habitat Atmosphere (${customO2}% O2 / ${customPressure} PSI)`,
    category: 'custom',
    groupLabel: 'User Simulation',
    o2Percent: customO2,
    pressurePsi: customPressure,
    color: '#ec4899', // pink-500
    details: `User-defined atmospheric envelope dialed to ${customO2}% Oxygen and ${customPressure} PSI ambient pressure. Evaluating against lunar flammability envelopes.`,
    safetyTakeaway:
      customO2 >= 30
        ? 'Exceeds the 30% oxygen threshold: elevated flame spread rates and enhanced cool flame stability ([PSI-159]).'
        : 'Below 30% oxygen: within manageable terrestrial flammability limits, but partial gravity convection remains unverified.'
  };

  const allPoints = [...habitatBenchmarks, ...historicalIncidents, ...psiPoints, customSimulatorPoint];

  const handleSelectPoint = (point: AtmosphereDataPoint) => {
    setSelectedPoint(point);
    fetchAiBriefing(point.o2Percent, point.pressurePsi, point.name);
  };

  const applyPreset = (o2: number, psi: number, name: string) => {
    setCustomO2(o2);
    setCustomPressure(psi);
    const simulatedPoint: AtmosphereDataPoint = {
      ...customSimulatorPoint,
      o2Percent: o2,
      pressurePsi: psi,
      name: `${name} (${o2}% O2 / ${psi} PSI)`
    };
    setSelectedPoint(simulatedPoint);
    fetchAiBriefing(o2, psi, name);
  };

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
        Initializing NASA Exploration Atmosphere Matrix...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950/95 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              EXPLORATION ATMOSPHERES // SIMULATOR
            </span>
            <span className="text-xs text-slate-400">Oxygen Concentration (%) vs. Total Pressure (PSI)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Atmospheric Flammability &amp; PSI Investigation Matrix
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
            <span>Habitats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block"></span>
            <span>Lunar Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span>Fires</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block"></span>
            <span>PSI Tests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block ring-2 ring-pink-400/40"></span>
            <span className="text-pink-400 font-bold">Simulator</span>
          </div>
        </div>
      </div>

      {/* Simulator Control Deck */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>INTERACTIVE HABITAT ATMOSPHERE DIAL:</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Target: <strong className="text-pink-400">{customO2}% O2</strong> @ <strong className="text-cyan-400">{customPressure} PSI</strong>
          </span>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyPreset(21.0, 14.7, 'Earth Sea Level')}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 hover:text-white transition-all font-mono text-[11px]"
          >
            Earth Sea Level (21% / 14.7 psi)
          </button>
          <button
            onClick={() => applyPreset(32.0, 8.2, 'Artemis Lunar Base')}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800 hover:border-purple-500 text-purple-200 hover:text-white transition-all font-mono text-[11px]"
          >
            Artemis Lunar Base (32% / 8.2 psi)
          </button>
          <button
            onClick={() => applyPreset(30.0, 10.2, 'Pressurized Rover')}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500 text-slate-300 hover:text-white transition-all font-mono text-[11px]"
          >
            Pressurized Rover (30% / 10.2 psi)
          </button>
          <button
            onClick={() => applyPreset(100.0, 4.3, 'EVA Spacesuit')}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 hover:border-emerald-500 text-emerald-200 hover:text-white transition-all font-mono text-[11px]"
          >
            EVA Spacesuit (100% / 4.3 psi)
          </button>
          <button
            onClick={() => applyPreset(100.0, 16.7, 'Apollo 1 Pad Hazard')}
            className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800 hover:border-red-500 text-red-200 hover:text-white transition-all font-mono text-[11px]"
          >
            Apollo 1 Pad Hazard (100% / 16.7 psi)
          </button>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
              <span>Oxygen Concentration:</span>
              <span className="text-pink-400 font-bold">{customO2}% O2</span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={1}
              value={customO2}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCustomO2(val);
                fetchAiBriefing(val, customPressure, 'Custom Atmosphere');
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
              <span>Ambient Pressure:</span>
              <span className="text-cyan-400 font-bold">{customPressure} PSI</span>
            </div>
            <input
              type="range"
              min={3.0}
              max={18.0}
              step={0.1}
              value={customPressure}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCustomPressure(val);
                fetchAiBriefing(customO2, val, 'Custom Atmosphere');
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Recharts Scatter Matrix */}
      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 25, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            {/* Shaded Lunar Base Danger / Intermediate Zone: 30%-40% O2, 8.0-10.2 PSI */}
            <ReferenceArea
              x1={30}
              x2={40}
              y1={8.0}
              y2={10.2}
              fill="#9333ea"
              fillOpacity={0.28}
              stroke="#c084fc"
              strokeDasharray="4 4"
            />

            {/* Reference Line for 1.0 ATM (14.7 PSI) */}
            <ReferenceLine
              y={14.7}
              stroke="#64748b"
              strokeDasharray="4 4"
              label={{
                value: 'Standard Sea Level (14.7 PSI)',
                fill: '#94a3b8',
                position: 'top',
                fontSize: 11
              }}
            />

            {/* Reference Line for Lunar Maximum Pressure (10.2 PSI) */}
            <ReferenceLine
              y={10.2}
              stroke="#a855f7"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{
                value: 'Lunar Max (10.2 PSI)',
                fill: '#c084fc',
                position: 'right',
                fontSize: 10
              }}
            />

            {/* Reference Line for Lunar Minimum Pressure (8.0 PSI) */}
            <ReferenceLine
              y={8.0}
              stroke="#a855f7"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{
                value: 'Lunar Min (8.0 PSI)',
                fill: '#c084fc',
                position: 'right',
                fontSize: 10
              }}
            />

            {/* Reference Line for Earth 21% O2 */}
            <ReferenceLine
              x={21}
              stroke="#38bdf8"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={{
                value: 'Earth 21% O2',
                fill: '#38bdf8',
                position: 'insideTopLeft',
                fontSize: 11
              }}
            />

            {/* Reference Line for Lunar Base 30% O2 Threshold */}
            <ReferenceLine
              x={30}
              stroke="#c084fc"
              strokeDasharray="4 4"
              strokeOpacity={0.8}
              label={{
                value: 'Lunar Base Zone (≥30% O2)',
                fill: '#c084fc',
                position: 'insideTopRight',
                fontSize: 11
              }}
            />

            <XAxis
              type="number"
              dataKey="o2Percent"
              name="Oxygen Concentration"
              unit="%"
              domain={[10, 105]}
              ticks={[15, 21, 30, 40, 60, 80, 100]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              label={{
                value: 'Oxygen Concentration (% by volume)',
                position: 'insideBottom',
                offset: -15,
                fill: '#94a3b8',
                fontSize: 12
              }}
            />

            <YAxis
              type="number"
              dataKey="pressurePsi"
              name="Ambient Pressure"
              unit=" psi"
              domain={[0, 18]}
              ticks={[0, 4.3, 8.0, 10.2, 11.5, 14.7, 16.7]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              label={{
                value: 'Ambient Pressure (PSI)',
                angle: -90,
                position: 'insideLeft',
                offset: 5,
                fill: '#94a3b8',
                fontSize: 12
              }}
            />

            <ZAxis range={[140, 220]} />

            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as AtmosphereDataPoint;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl max-w-xs text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-white truncate">{data.name}</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {data.groupLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 mb-1.5">
                        <span className="font-mono text-cyan-400">
                          {data.o2Range
                            ? `${data.o2Range[0]}–${data.o2Range[1]}% O2`
                            : `${data.o2Percent}% O2`}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-orange-400">{data.pressurePsi} PSI</span>
                      </div>
                      <p className="text-slate-400 line-clamp-2 leading-relaxed">{data.details}</p>
                      <p className="text-cyan-400 mt-2 font-medium flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Click to trigger live AI safety briefing
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Scatter
              name="Atmosphere Points"
              data={allPoints}
              onClick={(entry) => {
                const item =
                  (entry as unknown as { payload?: AtmosphereDataPoint })?.payload ??
                  (entry as unknown as AtmosphereDataPoint);
                if (item && item.id) {
                  handleSelectPoint(item);
                }
              }}
              className="cursor-pointer"
            >
              {allPoints.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.category === 'custom' ? '#f43f5e' : '#ffffff'}
                  strokeWidth={selectedPoint?.id === entry.id || entry.category === 'custom' ? 3 : 1}
                  className="transition-all duration-200 hover:scale-125"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Micro-diagram: 1-g Teardrop vs 0-g Spherical Flame */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
            {/* 1g Teardrop Flame SVG */}
            <div className="flex flex-col items-center">
              <svg width="34" height="42" viewBox="0 0 34 42" className="overflow-visible">
                <defs>
                  <radialGradient id="flame1g" cx="50%" cy="80%" r="60%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="40%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </radialGradient>
                </defs>
                {/* Buoyancy flow arrows */}
                <path d="M 5,38 L 5,14 M 5,14 L 3,18 M 5,14 L 7,18" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 29,38 L 29,14 M 29,14 L 27,18 M 29,14 L 31,18" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                {/* Teardrop body */}
                <path
                  d="M 17,2 C 17,2 7,18 7,27 C 7,33 11,38 17,38 C 23,38 27,33 27,27 C 27,18 17,2 17,2 Z"
                  fill="url(#flame1g)"
                  opacity="0.9"
                />
              </svg>
              <span className="text-[10px] font-mono text-slate-400 mt-1">1-g Earth</span>
            </div>

            <span className="text-slate-600 font-mono text-xs">vs</span>

            {/* 0g Spherical Flame SVG */}
            <div className="flex flex-col items-center">
              <svg width="38" height="42" viewBox="0 0 38 42">
                <defs>
                  <radialGradient id="flame0g" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.3" />
                    <stop offset="65%" stopColor="#3b82f6" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
                  </radialGradient>
                </defs>
                {/* Radial diffusion arrows */}
                <circle cx="19" cy="20" r="14" fill="url(#flame0g)" stroke="#93c5fd" strokeWidth="1.2" strokeDasharray="2 2" />
                <circle cx="19" cy="20" r="3" fill="#60a5fa" />
              </svg>
              <span className="text-[10px] font-mono text-cyan-400 mt-1">0-g Freefall</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Buoyancy vs. Diffusion Combustion Physics</span>
              <span className="text-[10px] font-mono font-normal text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                NASA ScienceCast
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl mt-0.5">
              Dr. Dennis Stocker (NASA GRC): In 1-g Earth gravity, natural buoyancy pulls heated air upward into a tall teardrop. In freefall (0-g), buoyant convection vanishes completely. Flames burn as calm, translucent blue spheres fed purely by molecular oxygen diffusion.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchAiBriefing(customO2, customPressure, 'Custom Dialed Atmosphere')}
          disabled={isBriefingLoading}
          className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
        >
          {isBriefingLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Kinetics...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              <span>Generate AI Briefing</span>
            </>
          )}
        </button>
      </div>

      {/* Live AI Fire Safety & Suppression Briefing Panel */}
      <div className="pt-2">
        {selectedPoint || briefing ? (
          <div className="p-4 md:p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2 space-y-4">
            {/* Briefing Top Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold text-white">
                      {selectedPoint ? selectedPoint.name : `Simulated Atmosphere (${customO2}% O2 / ${customPressure} PSI)`}
                    </h3>
                    {briefing && (
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-full border ${
                          briefing.riskLevel === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                            : briefing.riskLevel === 'ELEVATED'
                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        }`}
                      >
                        RISK: {briefing.riskLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">AI Fire Safety &amp; Extinguishment Briefing</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-cyan-300 bg-cyan-950/70 px-3 py-1 rounded-lg border border-cyan-800">
                    O2: {selectedPoint ? selectedPoint.o2Percent : customO2}%
                  </span>
                  <span className="text-orange-300 bg-orange-950/70 px-3 py-1 rounded-lg border border-orange-800">
                    P: {selectedPoint ? selectedPoint.pressurePsi : customPressure} PSI
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedPoint(null);
                    setBriefing(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Close Briefing"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Briefing Content */}
            {isBriefingLoading ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-cyan-400 text-xs font-mono">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating mission briefing via Groq Llama-3.3-70B AI core...</span>
              </div>
            ) : briefing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Left Card: Ignition Risk */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Ignition &amp; Cool Flame Hazard Assessment</span>
                  </div>
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed text-slate-200">
                    {briefing.ignitionRisk}
                  </div>

                  {briefing.relevantPsiIds && briefing.relevantPsiIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-mono text-slate-400">Cited Experiments:</span>
                      {briefing.relevantPsiIds.map((id, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700"
                        >
                          [{id}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Card: Suppression Protocol */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Suppression &amp; Detection Strategy</span>
                  </div>
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed text-slate-200">
                    {briefing.suppressionStrategy}
                  </div>

                  {/* Partial Gravity Caveat */}
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-[11px] text-purple-200 flex items-start gap-2">
                    <Layers className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-purple-300">Exploration Partial-Gravity Caveat:</span>{' '}
                      {briefing.partialGravityCaveat}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="py-3 px-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              Click any point on the matrix or use the atmosphere dial above to generate an immediate AI Fire Safety &amp; Suppression Briefing.
            </span>
            <span className="font-mono text-slate-500 text-[11px]">
              GROUNDED IN 12 NASA PHYSICAL SCIENCES INFORMATICS DATASETS
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
