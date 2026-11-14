'use client';

import React, { useState, useEffect } from 'react';
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
  Activity
} from 'lucide-react';

interface AtmosphereDataPoint {
  id: string;
  name: string;
  category: 'habitat' | 'incident' | 'psi';
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

export default function AtmosphereChart() {
  const [mounted, setMounted] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<AtmosphereDataPoint | null>(null);

  useEffect(() => {
    setMounted(true);
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

  const allPoints = [...habitatBenchmarks, ...historicalIncidents, ...psiPoints];

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
        Initializing NASA Exploration Atmosphere Matrix...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950/95 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              EXPLORATION ATMOSPHERES // MATRIX
            </span>
            <span className="text-xs text-slate-400">Oxygen Concentration (%) vs. Total Pressure (PSI)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Atmospheric Flammability &amp; PSI Investigation Envelopes
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 inline-block shadow-sm"></span>
            <span className="font-medium">Crew Habitats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-400 inline-block shadow-sm"></span>
            <span className="font-medium">Lunar Zone (30–40% O2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm"></span>
            <span className="font-medium">Historical Fires</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-violet-400 inline-block shadow-sm"></span>
            <span className="font-medium">PSI Experiments</span>
          </div>
        </div>
      </div>

      {/* Recharts Scatter Matrix */}
      <div className="h-[430px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 25, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            {/* Clearly Shaded Lunar Base Danger / Intermediate Zone: 30%-40% O2, 8.0-10.2 PSI */}
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
                        <Activity className="w-3 h-3" /> Click to inspect safety telemetry
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
                  setSelectedPoint(item);
                }
              }}
              className="cursor-pointer"
            >
              {allPoints.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={selectedPoint?.id === entry.id ? 3 : 1}
                  className="transition-all duration-200 hover:scale-125"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Environment Safety Analysis Panel */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        {selectedPoint ? (
          <div className="p-4 md:p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                {selectedPoint.category === 'incident' ? (
                  <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700 flex items-center justify-center text-red-400 flex-shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                ) : selectedPoint.category === 'habitat' ? (
                  <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-700 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold text-white">{selectedPoint.name}</h3>
                    <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedPoint.groupLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Selected Environment Safety Analysis</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-cyan-300 bg-cyan-950/70 px-3 py-1.5 rounded-lg border border-cyan-800">
                    O2: {selectedPoint.o2Range ? `${selectedPoint.o2Range[0]}–${selectedPoint.o2Range[1]}%` : `${selectedPoint.o2Percent}%`}
                  </span>
                  <span className="text-orange-300 bg-orange-950/70 px-3 py-1.5 rounded-lg border border-orange-800">
                    Pressure: {selectedPoint.pressurePsi} PSI
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPoint(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Deselect Point"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Atmospheric Setup &amp; Experimental Profile</span>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed text-slate-300">
                  {selectedPoint.details}
                </div>

                {selectedPoint.rawInvestigation && (
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 text-slate-400 space-y-1 text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-300">Diagnostic Sensors:</span>{' '}
                      {selectedPoint.rawInvestigation.sensors.join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold text-purple-300">Lunar Base Relevance:</span>{' '}
                      <span className="font-mono text-purple-300 font-bold">
                        {selectedPoint.rawInvestigation.lunarBaseRelevance}/10
                      </span>{' '}
                      • <span className="font-semibold text-emerald-300">Earth Spinoff:</span>{' '}
                      {selectedPoint.rawInvestigation.earthSpinoff}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Flammability Limit &amp; Combustion Dynamics</span>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed text-slate-200">
                  {selectedPoint.safetyTakeaway}
                </div>

                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200 flex items-start gap-2">
                  <Layers className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-purple-300">Exploration Gravity Boundary:</span> All orbital data is currently bounded between 0-g (ISS/Cygnus) and 1-g (Earth). The partial-gravity (1/6-g) combustion regime for Moon habitats will be mapped by upcoming NASA <strong>LUCI</strong> and <strong>FM2</strong> payloads.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-3 px-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              Click any data point on the matrix above to open its comprehensive &quot;Selected Environment Safety Analysis&quot;.
            </span>
            <span className="font-mono text-slate-500 text-[11px]">
              LUNAR ZONE (30–40% O2, 8.0–10.2 PSI) SHADED IN PURPLE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
