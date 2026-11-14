import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { investigations, incidents, spinoffs } from '@/data/psi_dataset';

interface RequestBody {
  mode?: 'chat' | 'compare';
  message?: string;
  ids?: [string, string];
}

const datasetContext = `
NASA PHYSICAL SCIENCES INFORMATICS (PSI) DATASET:
${investigations
  .map(
    (inv) => `
- ID: [${inv.id}]
  Acronym: ${inv.acronym}
  Title: ${inv.title}
  Pillar: ${inv.pillar}
  Hardware: ${inv.hardware}
  Fuel: ${inv.fuelType} (${inv.sampleDetails})
  O2 Range: ${inv.oxygenRangePercent[0]}% - ${inv.oxygenRangePercent[1]}%
  Pressure: ${inv.pressurePsi} PSI
  Airflow: ${inv.airflowCmPerSec[0]} - ${inv.airflowCmPerSec[1]} cm/s
  Sensors: ${inv.sensors.join(', ')}
  Objective: ${inv.objective}
  Key Findings: ${inv.keyFindings}
  Lunar Relevance (1-10): ${inv.lunarBaseRelevance}
  Earth Spinoff: ${inv.earthSpinoff}
`
  )
  .join('\n')}

HISTORICAL SPACE FIRE INCIDENTS:
${incidents
  .map(
    (inc) => `
- ${inc.mission} (${inc.year}): ${inc.oxygenPercent}% O2, ${inc.pressurePsi} PSI.
  Cause: ${inc.cause}
  Lesson Learned: ${inc.lessonLearned}
`
  )
  .join('\n')}

EARTH SPINOFFS:
${spinoffs
  .map(
    (sp) => `
- [${sp.id}] ${sp.title} (${sp.spinoffUrl})
  NASA Link: ${sp.nasaConnection}
  Terrestrial Impact: ${sp.terrestrialImpact}
`
  )
  .join('\n')}

CRITICAL AEROSPACE FIRE SAFETY KNOWLEDGE & GAPS:
- Normal Earth gravity (1-g) relies heavily on natural buoyancy-driven convective flow.
- Microgravity (0-g, tested on ISS and Cygnus) eliminates buoyant upward draft; flames become spherical and can starve of oxygen or linger silently as low-temperature "cool flames" (e.g. [PSI-159], [PSI-142]).
- PARTIAL-GRAVITY GAPS: Partial gravity regimes (Moon: 0.166-g; Mars: 0.38-g) represent dangerous intermediate regimes where weak buoyancy can supply fresh oxygen to a smoldering fire without carrying heat away rapidly. NASA and international partners are addressing these gaps through upcoming lunar exploration missions, specifically LUCI (Lunar Combustion Investigation) and FM2 (Fire Safety / Flow Boiling in Microgravity and Partial Gravity).
`;

function getFallbackComparison(id1: string, id2: string) {
  const inv1 = investigations.find((i) => i.id.toUpperCase() === id1.toUpperCase()) || investigations[0];
  const inv2 = investigations.find((i) => i.id.toUpperCase() === id2.toUpperCase()) || investigations[1];

  return {
    summary: `Comparison between [${inv1.id}] (${inv1.acronym}) and [${inv2.id}] (${inv2.acronym}). While ${inv1.acronym} concentrates on ${inv1.fuelType.toLowerCase()} combustion in ${inv1.hardware}, ${inv2.acronym} addresses ${inv2.fuelType.toLowerCase()} phenomena in ${inv2.hardware}.`,
    similarities: [
      `Both investigations support NASA's spacecraft fire safety framework under the "${inv1.pillar === inv2.pillar ? inv1.pillar : `${inv1.pillar} and ${inv2.pillar}`}" pillars.`,
      `Both explore low-flow microgravity convective environments (airflow up to ${Math.max(inv1.airflowCmPerSec[1], inv2.airflowCmPerSec[1])} cm/s) where terrestrial buoyant cooling does not exist.`,
      `Both provide foundational data bridging standard 1-g screening (NASA-STD-6001) to exploration life-support envelopes.`
    ],
    differences: [
      `Fuel and state: [${inv1.id}] tests ${inv1.fuelType} (${inv1.sampleDetails}) whereas [${inv2.id}] investigates ${inv2.fuelType} (${inv2.sampleDetails}).`,
      `Operating oxygen range: [${inv1.id}] operates at ${inv1.oxygenRangePercent[0]}–${inv1.oxygenRangePercent[1]}% O2, compared to ${inv2.oxygenRangePercent[0]}–${inv2.oxygenRangePercent[1]}% O2 for [${inv2.id}].`,
      `Testing platform: [${inv1.id}] utilizes ${inv1.hardware}, whereas [${inv2.id}] was deployed on ${inv2.hardware}.`
    ],
    lunarSafetyTakeaway: `For a 30–34% O2 lunar habitat at 8.2–10.2 PSI, [${inv1.id}] (relevance ${inv1.lunarBaseRelevance}/10) and [${inv2.id}] (relevance ${inv2.lunarBaseRelevance}/10) highlight that partial gravity and elevated oxygen dramatically alter extinction limits. Complete qualification will require validation from the upcoming LUCI (Lunar Combustion Investigation) and FM2 missions to resolve partial-gravity (1/6-g) transport kinetics.`
  };
}

function getFallbackChat(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('30%') || q.includes('lunar') || q.includes('moon')) {
    return `For a planned 30%–34% O2 Lunar Base (operating at ~8.2–10.2 PSI to facilitate rapid EVA egress), the primary applicable NASA PSI investigations are **[PSI-159]** (ACME CFI-G) and **[PSI-99]** (SAFFIRE-II).

- **[PSI-159] (ACME CFI-G)** demonstrated that elevated oxygen concentrations (tested up to 85% O2) drastically stabilize low-temperature cool flames. In an enriched 30% O2 lunar habitat, flammable gases from battery off-gassing or pyrolyzing electronics can sustain invisible cool combustion at 400–600°C.
- **[PSI-99] (SAFFIRE-II)** proved that materials passing terrestrial NASA-STD-6001 flammability tests burn readily under forced convective flow in low gravity.
- **Critical Partial-Gravity Gap**: All current PSI data is measured in 0-g (ISS/Cygnus) or 1-g (Earth). The 1/6th-g lunar environment presents a unique buoyant-diffusion balance where buoyant flow is too weak to quench flames radiatively, but strong enough to supply continuous oxygen. Resolving this gap awaits the upcoming NASA **LUCI** (Lunar Combustion Investigation) and **FM2** missions.`;
  }

  if (q.includes('cool flame') || q.includes('smoke detection') || q.includes('cfi')) {
    return `Cool flames observed in **[PSI-159]** (ACME CFI-G) and **[PSI-142]** (CFI / FLEX-2) introduce severe challenges for conventional spacecraft smoke detection:

1. **Absence of Carbonaceous Soot**: Cool flames burn at 400–600°C via low-temperature peroxide chain branching, producing virtually zero soot particles. Conventional optical obscuration smoke detectors fail to detect them.
2. **Nanoparticle Size Discrepancies**: As demonstrated by **[PSI-101]** (SAME-R), low-gravity pyrolyzed aerosols agglomerate differently than in 1-g. Without buoyant lift, pre-combustion volatile aerosols linger near the floor and equipment ducts.
3. **Detection Solution**: Early warning requires aspirating pre-combustion detectors such as NASA Spinoff **[node/9407]**, combined with high-sensitivity gas analyzers detecting CO/CO2 and formaldehyde intermediates before thermal runaway occurs.
4. **Knowledge Gap**: Transition dynamics between cool flames and secondary hot-flame re-ignition under lunar 1/6-g are currently unmapped, pending the **LUCI** mission.`;
  }

  if (q.includes('bass') || q.includes('saffire') || q.includes('material')) {
    return `Comparing **[PSI-25]** (BASS-II) and **[PSI-98]** (SAFFIRE-I) for spacecraft and cabin material safety:

- **[PSI-25] (BASS-II)**: Conducted inside the ISS Microgravity Science Glovebox (MSG) on small-scale PMMA rods and cotton swatches under low-speed forced flows (0–50 cm/s). It proved that materials extinguish at different low-speed airflow regimes than predicted by 1-g NASA-STD-6001 tests, and low flow actually delays radiative extinction.
- **[PSI-98] (SAFFIRE-I)**: Performed in the unmanned Cygnus resupply vehicle on a large 40.6 x 94 cm SIBAL fabric sheet. It proved that large-scale fires generate self-induced convective currents that accelerate flame front propagation far beyond small-scale glovebox predictions.
- **Cabin Design Takeaway**: Small-sample flammability testing severely underestimates real spacecraft fire propagation. Furthermore, both were microgravity tests; partial gravity data for lunar habitats must be established by the **LUCI** and **FM2** exploration campaigns.`;
  }

  return `Based on the NASA Physical Sciences Informatics (PSI) repository, spacecraft fire safety is governed by the four pillars: **Prevention** (e.g. **[PSI-25]**, **[PSI-98]**, **[PSI-99]**), **Detection** (e.g. **[PSI-101]**, **[PSI-60]**), **Suppression** (e.g. **[PSI-26]**, **[PSI-69]**, **[PSI-100]**), and **Fundamentals** (e.g. **[PSI-159]**, **[PSI-10]**, **[PSI-142]**).

In reduced gravity, the absence of natural buoyant updraft radically shifts extinction limits and allows invisible cool flames (**[PSI-159]**) to persist. Furthermore, historical accidents such as Apollo 1 (100% O2, 16.7 PSI) and Mir (solid-fuel oxygen generator fire) prove that oxygen concentration and ventilation dynamics dictate survivability. For upcoming Lunar Base habitats (30% O2, 8.2–10.2 PSI), partial gravity (1/6-g) combustion data remains an active frontier being addressed by upcoming **LUCI** and **FM2** missions.`;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { mode = 'chat', message, ids } = body;

    const apiKey = process.env.GROQ_API_KEY;
    const hasValidKey = apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.trim().length > 10;

    // Handle 'compare' mode
    if (mode === 'compare') {
      const id1 = ids?.[0] || 'PSI-25';
      const id2 = ids?.[1] || 'PSI-98';

      if (!hasValidKey) {
        return NextResponse.json(getFallbackComparison(id1, id2));
      }

      try {
        const groq = new Groq({ apiKey });
        const inv1 = investigations.find((i) => i.id.toUpperCase() === id1.toUpperCase());
        const inv2 = investigations.find((i) => i.id.toUpperCase() === id2.toUpperCase());

        const prompt = `Compare these two NASA Physical Sciences Informatics (PSI) investigations:
Experiment 1: ${JSON.stringify(inv1 || id1)}
Experiment 2: ${JSON.stringify(inv2 || id2)}

Return a valid JSON object strictly matching this schema:
{
  "summary": "Brief executive summary comparing their focus, hardware, and mission role",
  "similarities": ["bullet 1", "bullet 2", "bullet 3"],
  "differences": ["bullet 1", "bullet 2", "bullet 3"],
  "lunarSafetyTakeaway": "Actionable takeaway for Lunar Base (30% O2, 8.2-10.2 PSI), noting partial-gravity knowledge gaps pending LUCI and FM2 missions"
}`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are an expert NASA aerospace combustion and fire safety engineer specializing in the Physical Sciences Informatics (PSI) dataset. Respond only with JSON.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
          temperature: 0.2
        });

        const raw = chatCompletion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          return NextResponse.json(parsed);
        }
      } catch (err) {
        console.warn('Groq compare call failed, using grounded fallback:', err);
      }

      return NextResponse.json(getFallbackComparison(id1, id2));
    }

    // Handle 'chat' mode
    const userQuery = message || 'Overview of NASA PSI investigations';

    if (!hasValidKey) {
      return NextResponse.json({ reply: getFallbackChat(userQuery) });
    }

    try {
      const groq = new Groq({ apiKey });
      const systemPrompt = `You are the NASA Space Apps 2026 "Flame in Freefall" Aerospace Fire Safety & PSI Copilot.
You answer user questions by grounding your reasoning in the NASA Physical Sciences Informatics (PSI) experiments, historical spacecraft incidents, and terrestrial spinoffs.

KNOWLEDGE BASE:
${datasetContext}

INSTRUCTIONS:
1. Always cite specific NASA PSI investigation IDs in brackets, e.g. [PSI-159], [PSI-25], [PSI-101], when discussing findings, hardware, or protocols.
2. When discussing Lunar Base safety (30–34% O2, 8.2–10.2 PSI), highlight that oxygen enrichment accelerates flame spread and cool flame stability ([PSI-159]).
3. Crucially note the PARTIAL-GRAVITY KNOWLEDGE GAP: while microgravity (0-g on ISS/Cygnus) and Earth gravity (1-g) are mapped by PSI, 1/6-g lunar gravity and 3/8-g Martian gravity remain experimental frontiers with ongoing and planned missions like LUCI (Lunar Combustion Investigation) and FM2 (Flow Boiling and Condensation / Fire Safety in Reduced Gravity).
4. Keep explanations rigorous, clear, and mission-critical. Format your responses with structured markdown, bold headings, and bullet points.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userQuery
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 1024
      });

      const reply = chatCompletion.choices[0]?.message?.content || getFallbackChat(userQuery);
      return NextResponse.json({ reply });
    } catch (err) {
      console.warn('Groq chat call failed, falling back to grounded dataset generator:', err);
      return NextResponse.json({ reply: getFallbackChat(userQuery) });
    }
  } catch (error) {
    console.error('API /api/ai error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request', details: (error as Error).message },
      { status: 500 }
    );
  }
}
