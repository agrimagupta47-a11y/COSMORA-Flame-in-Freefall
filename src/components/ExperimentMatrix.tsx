'use client';

import React, { useState, useMemo } from 'react';
import { investigations } from '@/data/psi_dataset';
import { Investigation, FirePillar } from '@/types/psi';
import {
  Search,
  Filter,
  Layers,
  ArrowRightLeft,
  Bot,
  Loader2,
  Sparkles,
  Flame,
  CheckCircle2,
  X,
  Gauge,
  ShieldCheck,
  AlertCircle,
  Cpu,
  Info,
  RotateCcw
} from 'lucide-react';

interface AIComparisonResponse {
  summary: string;
  similarities: string[];
  differences: string[];
  lunarSafetyTakeaway: string;
}

export default function ExperimentMatrix() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [selectedHardware, setSelectedHardware] = useState<string>('All');

  // Multi-selection for 2-experiment comparison
  const [compareIds, setCompareIds] = useState<string[]>(['PSI-25', 'PSI-98']);

  // AI comparison state
  const [aiAnalysis, setAiAnalysis] = useState<AIComparisonResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filtered investigations
  const filteredInvestigations = useMemo(() => {
    return investigations.filter((inv) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        inv.id.toLowerCase().includes(q) ||
        inv.acronym.toLowerCase().includes(q) ||
        inv.title.toLowerCase().includes(q) ||
        inv.hardware.toLowerCase().includes(q) ||
        inv.fuelType.toLowerCase().includes(q) ||
        inv.sampleDetails.toLowerCase().includes(q) ||
        inv.keyFindings.toLowerCase().includes(q);

      const matchesPillar = selectedPillar === 'All' || inv.pillar === selectedPillar;
      const matchesFuel = selectedFuel === 'All' || inv.fuelType === selectedFuel;
      const matchesHardware =
        selectedHardware === 'All' ||
        (selectedHardware === 'MSG' && inv.hardware.includes('MSG')) ||
        (selectedHardware === 'CIR' && inv.hardware.includes('CIR')) ||
        (selectedHardware === 'Cygnus' && inv.hardware.includes('Cygnus')) ||
        (selectedHardware === 'Glovebox' && (inv.hardware.includes('MSG') || inv.hardware.includes('Glovebox')));

      return matchesSearch && matchesPillar && matchesFuel && matchesHardware;
    });
  }, [searchQuery, selectedPillar, selectedFuel, selectedHardware]);

  // Handle toggling experiment for comparison
  const toggleCompare = (id: string) => {
    setAiAnalysis(null);
    setAiError(null);
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[0], id];
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
    setAiAnalysis(null);
    setAiError(null);
  };

  const exp1 = investigations.find((i) => i.id === compareIds[0]);
  const exp2 = investigations.find((i) => i.id === compareIds[1]);

  // Execute AI Comparative Risk Analysis with POST /api/ai
  const handleRunAiComparison = async () => {
    if (!exp1 || !exp2) return;

    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'compare',
          ids: [exp1.id, exp2.id]
        })
      });

      if (!res.ok) {
        throw new Error(`AI Gateway responded with status: ${res.status}`);
      }

      const data: AIComparisonResponse = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error('Error running comparative analysis:', err);
      setAiError('Real-time AI connection interrupted. Deterministic scientific fallback engaged.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0B1425] border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#35D5E8]/20 text-[#35D5E8] border border-[#35D5E8]/40">
              EXPERIMENT MATRIX // DATABASE &amp; COMPARATOR
            </span>
            <span className="text-xs font-mono text-slate-400">12 NASA PSI Flight Datasets</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#35D5E8]" />
            NASA Combustion Experiment Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Search, filter, and cross-compare microgravity combustion kinetics across flight payloads and diagnostic facilities.
          </p>
        </div>

        {/* Selected Comparator Counter & Reset */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 bg-[#050B18] px-3.5 py-2 rounded-xl border border-slate-800">
            <ArrowRightLeft className="w-4 h-4 text-[#35D5E8]" />
            <span className="text-slate-400">COMPARATOR:</span>
            <span className={`font-bold ${compareIds.length === 2 ? 'text-[#35D5E8]' : 'text-[#FFB547]'}`}>
              {compareIds.length} / 2 SELECTED
            </span>
          </div>

          {compareIds.length > 0 && (
            <button
              onClick={clearCompare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="Clear comparator slots"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="mt-5 p-4 rounded-xl bg-[#050B18] border border-slate-800 space-y-3">
        {/* Search input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by experiment ID, acronym (e.g. BASS-II, SAFFIRE), fuel, material, hardware..."
            className="w-full bg-[#080E1C] text-slate-200 placeholder-slate-500 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#35D5E8] focus:ring-1 focus:ring-[#35D5E8] transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono">
          {/* Pillar Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#35D5E8]" /> Pillar:
            </span>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="bg-[#080E1C] text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#35D5E8] text-xs flex-1"
            >
              <option value="All">All Pillars (4)</option>
              <option value="Prevention">Prevention</option>
              <option value="Detection">Detection</option>
              <option value="Suppression">Suppression</option>
              <option value="Fundamentals">Fundamentals</option>
            </select>
          </div>

          {/* Fuel Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Fuel:</span>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="bg-[#080E1C] text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#35D5E8] text-xs flex-1"
            >
              <option value="All">All Fuel Types</option>
              <option value="Solid">Solid</option>
              <option value="Gas">Gas</option>
              <option value="Liquid Droplet">Liquid Droplet</option>
              <option value="Aerosol/Smoke">Aerosol / Smoke</option>
            </select>
          </div>

          {/* Hardware Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Hardware:</span>
            <select
              value={selectedHardware}
              onChange={(e) => setSelectedHardware(e.target.value)}
              className="bg-[#080E1C] text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#35D5E8] text-xs flex-1"
            >
              <option value="All">All Facilities</option>
              <option value="MSG">MSG (Microgravity Glovebox)</option>
              <option value="CIR">CIR (Combustion Rack)</option>
              <option value="Cygnus">Cygnus (Saffire Module)</option>
              <option value="Glovebox">ISS Gloveboxes (All)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Database Table / Grid */}
      <div className="mt-4 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#080E1C]">
            <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
              <thead className="bg-[#050B18] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-3.5 py-3 w-16 text-center">
                    Compare
                  </th>
                  <th scope="col" className="px-4 py-3">
                    ID &amp; Acronym
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Pillar
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Hardware
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Fuel &amp; Sample
                  </th>
                  <th scope="col" className="px-4 py-3">
                    O2 Range
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Pressure
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Airflow
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredInvestigations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-mono text-xs">
                      No NASA PSI investigations matched the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvestigations.map((inv) => {
                    const isSelected = compareIds.includes(inv.id);
                    return (
                      <tr
                        key={inv.id}
                        className={`hover:bg-[#0E182E] transition-colors ${
                          isSelected ? 'bg-[#2675E8]/10' : ''
                        }`}
                      >
                        <td className="px-3.5 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCompare(inv.id)}
                            aria-label={`Select ${inv.acronym} for comparison`}
                            className="rounded border-slate-700 text-[#2675E8] focus:ring-[#2675E8] bg-slate-900 cursor-pointer h-4 w-4"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] text-[#35D5E8]">[{inv.id}]</span>
                            <span className="font-bold">{inv.acronym}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[220px]">
                            {inv.title}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] border ${
                              inv.pillar === 'Prevention'
                                ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                                : inv.pillar === 'Detection'
                                ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                                : inv.pillar === 'Suppression'
                                ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                                : 'bg-purple-950/60 text-purple-300 border-purple-800'
                            }`}
                          >
                            {inv.pillar}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300 text-[11px]">
                          {inv.hardware}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <span className="font-mono text-[#35D5E8] text-[11px] font-semibold block">
                            {inv.fuelType}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">
                            {inv.sampleDetails}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[#FFB547] text-[11px]">
                          {inv.oxygenRangePercent[0]}%–{inv.oxygenRangePercent[1]}%
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300 text-[11px]">
                          {inv.pressurePsi} PSI
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300 text-[11px]">
                          {inv.airflowCmPerSec[0]}–{inv.airflowCmPerSec[1]} cm/s
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Two-Experiment Side-by-Side Comparison Module */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#35D5E8]" />
              <h3 className="text-base font-bold text-white">
                Dual-Experiment Technical Comparison Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side empirical contrast of environmental limits, sensor telemetry, and combustion dynamics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAiComparison}
              disabled={!exp1 || !exp2 || isAiLoading}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2675E8] to-[#35D5E8] text-white hover:opacity-90 disabled:opacity-50 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>ANALYZING WITH AI CORE...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Comparative Risk Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {exp1 && exp2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Experiment 1 Card */}
            <div className="p-4 rounded-xl bg-[#050B18] border border-slate-800 relative">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-[#35D5E8] font-bold">
                  EXP 1: [{exp1.id}] {exp1.acronym}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {exp1.pillar}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2">{exp1.title}</h4>

              <div className="mt-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Hardware Facility:</span>
                  <span className="text-slate-300 text-right">{exp1.hardware}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Fuel &amp; Phase:</span>
                  <span className="text-[#35D5E8] text-right font-bold">{exp1.fuelType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Sample Specification:</span>
                  <span className="text-slate-300 text-right line-clamp-1 max-w-[240px] font-sans">
                    {exp1.sampleDetails}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Oxygen Range:</span>
                  <span className="text-[#FFB547] text-right font-bold">
                    {exp1.oxygenRangePercent[0]}%–{exp1.oxygenRangePercent[1]}%
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Ambient Pressure:</span>
                  <span className="text-slate-200 text-right">{exp1.pressurePsi} PSI</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Forced Airflow Range:</span>
                  <span className="text-cyan-300 text-right">
                    {exp1.airflowCmPerSec[0]}–{exp1.airflowCmPerSec[1]} cm/s
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Sensors Deployed:</span>
                  <span className="text-slate-400 text-right line-clamp-1 max-w-[240px] font-sans">
                    {exp1.sensors.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Lunar Relevance Score:</span>
                  <span className="text-purple-400 text-right font-bold">
                    {exp1.lunarBaseRelevance} / 10
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-[#080E1C] border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
                <span className="font-semibold text-slate-200 block mb-0.5">Empirical Findings:</span>
                {exp1.keyFindings}
              </div>
            </div>

            {/* Experiment 2 Card */}
            <div className="p-4 rounded-xl bg-[#050B18] border border-slate-800 relative">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-[#2675E8] font-bold">
                  EXP 2: [{exp2.id}] {exp2.acronym}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {exp2.pillar}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2">{exp2.title}</h4>

              <div className="mt-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Hardware Facility:</span>
                  <span className="text-slate-300 text-right">{exp2.hardware}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Fuel &amp; Phase:</span>
                  <span className="text-[#35D5E8] text-right font-bold">{exp2.fuelType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Sample Specification:</span>
                  <span className="text-slate-300 text-right line-clamp-1 max-w-[240px] font-sans">
                    {exp2.sampleDetails}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Oxygen Range:</span>
                  <span className="text-[#FFB547] text-right font-bold">
                    {exp2.oxygenRangePercent[0]}%–{exp2.oxygenRangePercent[1]}%
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Ambient Pressure:</span>
                  <span className="text-slate-200 text-right">{exp2.pressurePsi} PSI</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Forced Airflow Range:</span>
                  <span className="text-cyan-300 text-right">
                    {exp2.airflowCmPerSec[0]}–{exp2.airflowCmPerSec[1]} cm/s
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Sensors Deployed:</span>
                  <span className="text-slate-400 text-right line-clamp-1 max-w-[240px] font-sans">
                    {exp2.sensors.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Lunar Relevance Score:</span>
                  <span className="text-purple-400 text-right font-bold">
                    {exp2.lunarBaseRelevance} / 10
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-[#080E1C] border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
                <span className="font-semibold text-slate-200 block mb-0.5">Empirical Findings:</span>
                {exp2.keyFindings}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[#050B18] border border-dashed border-slate-800 text-center text-xs font-mono text-slate-400 space-y-1">
            <p className="text-slate-300">
              {compareIds.length === 1
                ? `1 of 2 selected: [${compareIds[0]}]. Select 1 more investigation from the table above to activate comparison.`
                : 'Select 2 investigations from the table above using their checkboxes to activate the side-by-side technical comparator.'}
            </p>
            <p className="text-slate-500 text-[11px]">
              Tip: Compare experiments with different fuels (e.g. Solid [PSI-25] vs Gas [PSI-159]) to evaluate contrasting flammability limits.
            </p>
          </div>
        )}

        {/* AI Comparative Risk Analysis Panel */}
        {aiAnalysis && (
          <div className="mt-4 p-5 rounded-xl bg-[#050B18] border border-[#2675E8]/60 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2675E8]/20 border border-[#2675E8] flex items-center justify-center text-[#35D5E8]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    AI Comparative Combustion Dynamics Briefing
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-[#35D5E8] border border-slate-700">
                      GROQ LLAMA-3.3-70B
                    </span>
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    Evaluation Matrix: [{exp1?.id}] vs. [{exp2?.id}]
                  </span>
                </div>
              </div>

              <button
                onClick={() => setAiAnalysis(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                title="Dismiss AI Briefing"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Executive Summary */}
            <div className="text-xs text-slate-300 leading-relaxed bg-[#080E1C] p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-1 font-mono text-[11px] text-[#35D5E8]">
                EXECUTIVE SUMMARY:
              </span>
              {aiAnalysis.summary}
            </div>

            {/* Similarities & Differences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#080E1C] border border-slate-800 space-y-2">
                <span className="font-bold text-white block font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SHARED FLIGHT DYNAMICS
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {aiAnalysis.similarities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080E1C] border border-slate-800 space-y-2">
                <span className="font-bold text-white block font-mono text-[11px] text-[#FFB547] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> OPERATIONAL DIVERGENCES
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {aiAnalysis.differences.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-[#FFB547] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lunar Safety Takeaway & Knowledge Gap */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0C1226] to-[#160E2A] border border-purple-800/60 text-xs text-purple-200">
              <span className="font-bold text-purple-300 block mb-1 font-mono text-[11px] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> ARTEMIS LUNAR HABITAT SAFETY &amp; KNOWLEDGE GAP TAKEAWAY:
              </span>
              <p className="leading-relaxed">{aiAnalysis.lunarSafetyTakeaway}</p>
            </div>
          </div>
        )}

        {aiError && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{aiError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
