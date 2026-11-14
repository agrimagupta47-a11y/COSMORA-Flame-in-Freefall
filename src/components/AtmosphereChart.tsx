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
import { investigations, incidents } from '@/data/psi_dataset';
import { Investigation } from '@/types/psi';
import { Flame, ShieldAlert, Sparkles, CheckCircle2, Info, Compass } from 'lucide-react';

interface AtmosphereDataPoint {
  id: string;
  name: string;
  category: 'psi' | 'benchmark' | 'incident';
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

  // Benchmarks & Historic points
  const benchmarks: AtmosphereDataPoint[] = [
    {
      id: 'EARTH-SEA-LEVEL',
      name: 'Earth Sea Level Atmosphere',
      category: 'benchmark',
      o2Percent: 21.0,
      pressurePsi: 14.7,
      color: '#38bdf8', // sky-400
      details: 'Nominal terrestrial sea-level atmosphere (21% O2, 79% N2 at 1.0 atm / 101.3 kPa).',
      safetyTakeaway:
        'Normal 1-g buoyant convection carries heated gases upward, cooling the fuel bed and drawing fresh oxygen. Terrestrial NASA-STD-6001 fire testing assumes this buoyant regime.'
    },
    {
      id: 'LUNAR-HABITAT-TARGET',
      name: 'Planned Moon Base / Pressurized Rover Target',
      category: 'benchmark',
      o2Percent: 32.0,
      o2Range: [30.0, 34.0],
      pressurePsi: 8.2,
      color: '#c084fc', // purple-400
      details: 'Target Exploration Atmosphere (30-34% O2, 8.2-10.2 PSI / 56.5-70.3 kPa) planned for Artemis Base Camp and pressurized rovers.',
      safetyTakeaway:
        'Reduced pressure minimizes cabin decompression sickness risk for frequent EVAs. However, elevated oxygen (>30%) significantly expands flammability limits and lowers material ignition energy.'
    },
    {
      id: 'EVA-SPACESUIT',
      name: 'xEMU Spacesuit Operational Envelope',
      category: 'benchmark',
      o2Percent: 100.0,
      pressurePsi: 4.3,
      color: '#34d399', // emerald-400
      details: '100% pure oxygen at 4.3 PSI (29.6 kPa) to maintain physiological oxygen partial pressure without rigid suit joint stiffening.',
      safetyTakeaway:
        'Pure oxygen eliminates nitrogen narcosis and bends during spacewalks, but makes materials susceptible to rapid electrical or static arc ignition.'
    },
    {
      id: 'APOLLO-1-DISASTER',
      name: 'Apollo 1 Launch Pad Flash Fire (1967)',
      category: 'incident',
      o2Percent: 100.0,
      pressurePsi: 16.7,
      color: '#f87171', // red-400
      details: '100% O2 pressurized to 16.7 PSI (115 kPa) during pre-flight plugs-out simulation.',
      safetyTakeaway:
        'Catastrophic high-pressure pure-oxygen fire. Proved that normally non-flammable or slow-burning polymers turn into explosive fire accelerants above 21% O2 and high pressure.'
    },
    {
      id: 'MIR-INCIDENT',
      name: 'Mir Space Station Fire (1997)',
      category: 'incident',
      o2Percent: 22.0,
      pressurePsi: 14.7,
      color: '#fb923c', // orange-400
      details: 'Solid fuel oxygen generator (perchlorate candle) torch rupture in Kvant-1 module.',
      safetyTakeaway:
        'Fire in microgravity created zero-buoyancy smoke balling, blinded cosmonauts, and proved that conventional fire extinguishers induce physical push-back in 0-g.'
    }
  ];

  // Map PSI investigations into plot points
  const psiPoints: AtmosphereDataPoint[] = investigations.map((inv) => {
    const o2Avg = (inv.oxygenRangePercent[0] + inv.oxygenRangePercent[1]) / 2;
    let color = '#38bdf8';
    if (inv.pillar === 'Prevention') color = '#60a5fa'; // blue
    if (inv.pillar === 'Detection') color = '#fbbf24'; // amber
    if (inv.pillar === 'Suppression') color = '#f87171'; // red
    if (inv.pillar === 'Fundamentals') color = '#a78bfa'; // violet

    return {
      id: inv.id,
      name: `[${inv.id}] ${inv.acronym}`,
      category: 'psi',
      o2Percent: o2Avg,
      o2Range: inv.oxygenRangePercent,
      pressurePsi: inv.pressurePsi,
      pillar: inv.pillar,
      hardware: inv.hardware,
      fuelType: inv.fuelType,
      details: `${inv.title} — Testing ${inv.fuelType} (${inv.sampleDetails}) inside ${inv.hardware}. Airflow: ${inv.airflowCmPerSec[0]}-${inv.airflowCmPerSec[1]} cm/s.`,
      safetyTakeaway: inv.keyFindings,
      color,
      rawInvestigation: inv
    };
  });

  const allPoints = [...benchmarks, ...psiPoints];

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
        Initializing NASA Atmospheric Envelopes Chart...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
              NASA PSI TELEMETRY
            </span>
            <span className="text-xs text-slate-400">Oxygen Index vs. Ambient Pressure</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Microgravity & Exploration Atmosphere Safety Matrix
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 inline-block"></span>
            <span>Earth Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-400 inline-block"></span>
            <span>Lunar Zone (&ge;30% O2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            <span>Spacesuit EVA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
            <span>Hazard / Incident</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-violet-400 inline-block"></span>
            <span>PSI Investigation</span>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="h-[420px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 25, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            {/* Shaded exploration target zone (30-35% O2, 7.5-10.5 PSI) */}
            <ReferenceArea
              x1={30}
              x2={36}
              y1={7.5}
              y2={10.5}
              fill="#9333ea"
              fillOpacity={0.18}
              stroke="#a855f7"
              strokeDasharray="4 4"
            />

            {/* 1.0 Atm Reference Line */}
            <ReferenceLine
              y={14.7}
              stroke="#475569"
              strokeDasharray="4 4"
              label={{
                value: '1.0 atm (14.7 psi)',
                fill: '#94a3b8',
                position: 'top',
                fontSize: 11
              }}
            />

            {/* Earth O2 21% Line */}
            <ReferenceLine
              x={21}
              stroke="#38bdf8"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{
                value: 'Earth 21% O2',
                fill: '#38bdf8',
                position: 'insideTopLeft',
                fontSize: 11
              }}
            />

            {/* Lunar Habitat 30% Threshold Line */}
            <ReferenceLine
              x={30}
              stroke="#c084fc"
              strokeDasharray="4 4"
              strokeOpacity={0.7}
              label={{
                value: 'Lunar Base Threshold (30% O2)',
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
              ticks={[0, 4.3, 8.2, 10.2, 11.5, 14.7, 16.7]}
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

            <ZAxis range={[120, 180]} />

            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as AtmosphereDataPoint;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl max-w-xs text-xs">
                      <p className="font-bold text-white mb-1">{data.name}</p>
                      <div className="flex items-center gap-2 text-slate-300 mb-1">
                        <span className="font-mono text-cyan-400">
                          {data.o2Range
                            ? `${data.o2Range[0]}–${data.o2Range[1]}% O2`
                            : `${data.o2Percent}% O2`}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-orange-400">{data.pressurePsi} PSI</span>
                      </div>
                      <p className="text-slate-400 line-clamp-2">{data.details}</p>
                      <p className="text-cyan-400 mt-2 font-medium">Click point to view safety analysis</p>
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
                const item = (entry as unknown as { payload?: AtmosphereDataPoint })?.payload ?? (entry as unknown as AtmosphereDataPoint);
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
                  strokeWidth={selectedPoint?.id === entry.id ? 2.5 : 1}
                  className="transition-all duration-200 hover:scale-125"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Point Inline Safety Card */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        {selectedPoint ? (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {selectedPoint.category === 'incident' ? (
                  <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                ) : selectedPoint.category === 'benchmark' ? (
                  <Compass className="w-5 h-5 text-purple-400 flex-shrink-0" />
                ) : (
                  <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                )}
                <h3 className="text-base font-semibold text-white">{selectedPoint.name}</h3>
                {selectedPoint.pillar && (
                  <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Pillar: {selectedPoint.pillar}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/60">
                  O2: {selectedPoint.o2Range ? `${selectedPoint.o2Range[0]}–${selectedPoint.o2Range[1]}%` : `${selectedPoint.o2Percent}%`}
                </span>
                <span className="text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded border border-orange-800/60">
                  P: {selectedPoint.pressurePsi} PSI
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs text-slate-300">
              <div>
                <p className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" /> Operational Context & Setup
                </p>
                <p className="leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  {selectedPoint.details}
                </p>
                {selectedPoint.rawInvestigation && (
                  <div className="mt-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Lunar Habitat Relevance:</span>{' '}
                    <span className="text-purple-400 font-mono">
                      {selectedPoint.rawInvestigation.lunarBaseRelevance}/10
                    </span>{' '}
                    • <span className="font-semibold text-slate-300">Earth Spinoff:</span>{' '}
                    {selectedPoint.rawInvestigation.earthSpinoff}
                  </div>
                )}
              </div>

              <div>
                <p className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Flammability Limit & Safety Takeaway
                </p>
                <p className="leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 text-slate-200">
                  {selectedPoint.safetyTakeaway}
                </p>
                <div className="mt-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-amber-300">Exploration Note:</span> Partial gravity (1/6-g) combustion data gap will be closed by NASA&apos;s upcoming LUCI &amp; FM2 missions.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-3 px-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              Click any atmospheric data point or experiment marker on the matrix above to view its detailed flammability limit profile.
            </span>
            <span className="font-mono text-slate-500">12 PSI INVESTIGATIONS • 3 INCIDENTS • 3 BENCHMARKS</span>
          </div>
        )}
      </div>
    </div>
  );
}
