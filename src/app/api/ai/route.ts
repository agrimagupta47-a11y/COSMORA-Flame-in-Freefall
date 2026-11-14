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
- PARTIAL-GRAVITY GAPS: The partial-gravity regimes (Moon: 0.166-g; Mars: 0.38-g) represent an urgent experimental frontier. Currently, flight safety limits are theoretically bounded between 0-g and 1-g results, creating substantial uncertainty for habitat ventilation and material ratings. NASA and international partners are targeting these gaps via the upcoming LUCI (Lunar Combustion Investigation) and FM2 (Flow Boiling and Condensation / Fire Safety in Reduced Gravity) exploration payloads.
`;

function getFallbackComparison(id1: string, id2: string) {
  const inv1 = investigations.find((i) => i.id.toUpperCase() === id1.toUpperCase()) || investigations[0];
  const inv2 = investigations.find((i) => i.id.toUpperCase() === id2.toUpperCase()) || investigations[1];

  return {
    summary: `Technical comparison between [${inv1.id}] (${inv1.acronym}) and [${inv2.id}] (${inv2.acronym}). While ${inv1.acronym} concentrates on ${inv1.fuelType.toLowerCase()} behavior in the ${inv1.hardware}, ${inv2.acronym} investigates ${inv2.fuelType.toLowerCase()} phenomena using ${inv2.hardware}.`,
    similarities: [
      `Both experiments evaluate spacecraft fire safety under the NASA "${inv1.pillar === inv2.pillar ? inv1.pillar : `${inv1.pillar} & ${inv2.pillar}`}" architecture.`,
      `Both explore forced convective airflow (operating between ${Math.min(inv1.airflowCmPerSec[0], inv2.airflowCmPerSec[0])} and ${Math.max(inv1.airflowCmPerSec[1], inv2.airflowCmPerSec[1])} cm/s) where natural 1-g buoyant cooling is completely absent.`,
      `Both yield critical empirical data bridging standard ground screening (NASA-STD-6001) to flight vehicle life-support envelopes.`
    ],
    differences: [
      `Combustion fuel & geometry: [${inv1.id}] evaluates ${inv1.fuelType} (${inv1.sampleDetails}), whereas [${inv2.id}] investigates ${inv2.fuelType} (${inv2.sampleDetails}).`,
      `Oxygen envelope: [${inv1.id}] operates across ${inv1.oxygenRangePercent[0]}%–${inv1.oxygenRangePercent[1]}% O2, while [${inv2.id}] tests across ${inv2.oxygenRangePercent[0]}%–${inv2.oxygenRangePercent[1]}% O2.`,
      `Experimental facility & diagnostic suite: [${inv1.id}] was conducted in ${inv1.hardware} with sensors including ${inv1.sensors.slice(0, 2).join(', ')}, whereas [${inv2.id}] used ${inv2.hardware}.`
    ],
    lunarSafetyTakeaway: `For an Artemis Lunar Base operating at an Exploration Atmosphere of 30%–34% O2 and 8.2–10.2 PSI, [${inv1.id}] (relevance ${inv1.lunarBaseRelevance}/10) and [${inv2.id}] (relevance ${inv2.lunarBaseRelevance}/10) prove that material flammability and low-temperature combustion kinetics deviate radically from Earth-bound predictions. However, because both were tested in microgravity (0-g), their findings represent a physical boundary rather than a full lunar model. The partial-gravity (1/6-g) knowledge gap remains pending verification on upcoming NASA LUCI and FM2 lunar missions.`
  };
}

function getFallbackChat(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('30%') || q.includes('lunar') || q.includes('moon') || q.includes('artemis')) {
    return `### Lunar Base Flammability Analysis (30% O2 / 8.2–10.2 PSI)

Operating an Artemis Lunar Habitat at an enriched 30%–34% O2 and reduced 8.2–10.2 PSI atmosphere prevents hypoxia while eliminating decompression sickness before EVAs. However, this environment creates severe combustion risks grounded in NASA PSI data:

1. **Invisible Low-Temperature Cool Flames [PSI-159]**:
   - The ACME CFI-G investigation (**[PSI-159]**) proved that oxygen concentrations $\\ge 30\\%$ drastically stabilize low-temperature cool flames burning at 400–600°C.
   - Off-gassed hydrocarbons or battery electrolytes can burn silently without visible light or carbonaceous soot, bypassing traditional optical fire detectors.

2. **Accelerated Material Spread in Forced Airflow [PSI-25] & [PSI-99]**:
   - BASS-II (**[PSI-25]**) and SAFFIRE-II (**[PSI-99]**) demonstrated that solid polymers passing terrestrial NASA-STD-6001 Test 1 flammability burn vigorously in low-velocity forced convective loops (2–25 cm/s).
   - In 30% O2, flame spread speeds increase by up to 180% compared to 21% sea-level air.

3. **Critical Partial-Gravity Knowledge Gap**:
   - While PSI experiments map 0-g (ISS) and 1-g (Earth), lunar 1/6th-g is an uncharted intermediate regime. In 1/6th-g, weak buoyancy sustains continuous oxygen flow to a flame bed without providing the high radiative convective cooling seen on Earth.
   - NASA is actively preparing the **LUCI** (Lunar Combustion Investigation) and **FM2** flight missions to resolve this boundary for Artemis habitats.`;
  }

  if (q.includes('cool flame') || q.includes('smoke detection') || q.includes('cfi') || q.includes('detector')) {
    return `### Impact of Cool Flames on Spacecraft Smoke Detection

Observations from **[PSI-159]** (ACME CFI-G) and **[PSI-142]** (CFI / FLEX-2) reveal profound challenges for spacecraft fire detection:

1. **Zero Soot Formation**:
   - Cool diffusion flames burn via low-temperature radical chain branching (peroxide chemistry) between 400°C and 600°C. They produce carbon monoxide, formaldehyde, and vapor without generating carbon soot.
   - Traditional optical obscuration and ionization detectors fail completely to detect active cool combustion.

2. **Aerosol Particle Agglomeration [PSI-101]**:
   - The SAME-R experiment (**[PSI-101]**) showed that pyrolyzed aerosols in low gravity agglomerate into larger, elongated open chains. Without buoyant lift, these pre-combustion particles diffuse slowly and pool along air return grilles.

3. **Early Warning Mitigations & Spinoffs**:
   - To counter this, NASA developed the sub-micron aspirating detection technology commercialized in **[node/9407]** (Pre-Combustion Early-Warning Fire Detector). It pairs high-sensitivity aerosol sampling with multi-gas CO/CO2 spectrometry.

4. **Partial-Gravity Boundary**:
   - Extinction boundaries and transition dynamics from cool flames to hot re-ignition under lunar 1/6-g are currently unknown, pending payload results from the **LUCI** campaign.`;
  }

  if (q.includes('bass') || q.includes('saffire') || q.includes('material') || q.includes('fabric')) {
    return `### Spacecraft Cabin Materials: [PSI-25] BASS-II vs. [PSI-98] SAFFIRE-I

Comparing small-scale glovebox research with vehicle-scale fire safety demonstrations:

- **[PSI-25] (BASS-II)**:
  - Conducted in the ISS Microgravity Science Glovebox on PMMA slabs and cotton strips under 0–50 cm/s airflow.
  - *Key Finding*: Revealed that low forced airflow delays radiant extinction and sustains burning down to lower O2 limits than observed in standard 1-g NASA-STD-6001 ground testing.

- **[PSI-98] (SAFFIRE-I)**:
  - Conducted aboard the unmanned Cygnus cargo vehicle on a large 40.6 x 94 cm SIBAL fabric swatch.
  - *Key Finding*: Proved that large-scale fires develop self-sustaining thermal plumes and flame front accelerations substantially higher than small-scale sample tests indicate.

- **Design Takeaway**:
  - Cabin interior certification cannot rely on small-scale coupon tests alone.
  - Furthermore, all current data is bounded between 0-g and 1-g. The upcoming **LUCI** and **FM2** missions will measure partial-gravity spread rates to establish certified Moon and Mars habitat standards.`;
  }

  if (q.includes('apollo') || q.includes('mir') || q.includes('incident') || q.includes('history')) {
    return `### Historical Spaceflight Fire Lessons Grounded in PSI

Historical flight fires have driven NASA's current fire safety philosophy across the 4 pillars:

1. **Apollo 1 (1967)**:
   - 100% pure O2 at 16.7 PSI during pre-flight pad test. An electrical arc ignited Velcro and nylon netting, causing flashover in under 15 seconds.
   - *Lesson*: Established NASA-STD-6001 non-metallic material screening and banned high-pressure pure O2 cabin testing.

2. **Apollo 13 (1970)**:
   - Pure cryogenic O2 tank short circuit.
   - *Lesson*: Separation of high-energy electrical lines from oxygen systems and complete redesign of cryogenic pressure vessels (which spun off **[node/9582]** lightweight composite SCBA tanks).

3. **Mir Space Station (1997)**:
   - Solid fuel perchlorate oxygen generator canister fire producing open torch flames and dense smoke in microgravity.
   - *Lesson*: Microgravity extinguishment requires rapid module isolation and clean agent suppression without recoil (**[PSI-26]**, **[PSI-69]**).`;
  }

  return `### NASA Physical Sciences Informatics (PSI) Fire Safety Architecture

NASA's spacecraft combustion safety framework is structured across four interlinked pillars:

1. **Prevention**: Validating materials under low-flow convective microgravity (**[PSI-25]** BASS-II, **[PSI-98]** SAFFIRE-I, **[PSI-99]** SAFFIRE-II).
2. **Detection**: Mapping sub-micron smoke particle sizes and smoke point limits (**[PSI-101]** SAME-R, **[PSI-60]** SPICE, **[PSI-62]** SLICE).
3. **Suppression**: Extinction limits using inert diluents and rapid depressurization (**[PSI-26]** BASS, **[PSI-69]** FLEX, **[PSI-100]** SAFFIRE-III).
4. **Fundamentals**: Low-temperature cool flames and soot-free combustion design (**[PSI-159]** ACME CFI-G, **[PSI-10]** Flame Design, **[PSI-142]** CFI / FLEX-2).

**Exploration Partial-Gravity Gap**: All current PSI orbital data is obtained in 0-g (ISS/Cygnus) or 1-g (Earth). For the Artemis Moon Base (30% O2, 8.2–10.2 PSI, 1/6-g), combustion and cool flame kinetics remain bounded between these two extremes. The upcoming **LUCI** (Lunar Combustion Investigation) and **FM2** flight missions will directly bridge this partial-gravity gap.`;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json().catch(() => ({}));
    const { mode = 'chat', message, ids } = body;

    const apiKey = process.env.GROQ_API_KEY;
    const hasValidKey =
      typeof apiKey === 'string' &&
      apiKey.trim().length > 10 &&
      apiKey !== 'your_groq_api_key_here';

    // Handle 'compare' mode
    if (mode === 'compare') {
      const id1 = ids?.[0] || 'PSI-25';
      const id2 = ids?.[1] || 'PSI-98';

      if (!hasValidKey) {
        return NextResponse.json(getFallbackComparison(id1, id2));
      }

      try {
        const groq = new Groq({ apiKey });
        const inv1 = investigations.find((i) => i.id.toUpperCase() === id1.toUpperCase()) || investigations[0];
        const inv2 = investigations.find((i) => i.id.toUpperCase() === id2.toUpperCase()) || investigations[1];

        const prompt = `Compare these two NASA Physical Sciences Informatics (PSI) investigations:
Experiment 1: ${JSON.stringify(inv1)}
Experiment 2: ${JSON.stringify(inv2)}

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
              content:
                'You are an expert NASA aerospace combustion and fire safety engineer specializing in the Physical Sciences Informatics (PSI) dataset. Respond ONLY with valid JSON.'
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
          if (parsed.summary && parsed.similarities && parsed.differences && parsed.lunarSafetyTakeaway) {
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.warn('Groq compare call failed or rate-limited; applying deterministic fallback:', err);
      }

      return NextResponse.json(getFallbackComparison(id1, id2));
    }

    // Handle 'chat' mode
    const userQuery = message && message.trim().length > 0 ? message.trim() : 'Overview of NASA PSI investigations';

    if (!hasValidKey) {
      return NextResponse.json({ reply: getFallbackChat(userQuery) });
    }

    try {
      const groq = new Groq({ apiKey });
      const systemPrompt = `You are the NASA Space Apps 2026 "Flame in Freefall" Aerospace Fire Safety & PSI Copilot.
You answer user questions by grounding your reasoning in the NASA Physical Sciences Informatics (PSI) experiments, historical spacecraft incidents, and terrestrial spinoffs.

KNOWLEDGE BASE:
${datasetContext}

STRICT INSTRUCTIONS:
1. ALWAYS cite specific NASA PSI investigation IDs in brackets, e.g. [PSI-159], [PSI-25], [PSI-101], when discussing findings, hardware, flammability limits, or protocols.
2. When discussing Lunar Base safety (30–34% O2, 8.2–10.2 PSI), highlight that oxygen enrichment accelerates flame spread and cool flame stability ([PSI-159]).
3. CRITICALLY NOTE THE PARTIAL-GRAVITY KNOWLEDGE GAP: while microgravity (0-g on ISS/Cygnus) and Earth gravity (1-g) are mapped by PSI, 1/6-g lunar gravity and 3/8-g Martian gravity remain experimental frontiers bounded by 0g and 1g extremes. Explicitly mention the pending NASA LUCI (Lunar Combustion Investigation) and FM2 (Flow Boiling and Condensation / Fire Safety in Reduced Gravity) exploration payloads designed to bridge this gap.
4. Format your responses with structured markdown, bold headings, and bullet points.`;

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

      const reply = chatCompletion.choices[0]?.message?.content;
      if (reply && reply.trim().length > 0) {
        return NextResponse.json({ reply });
      }
    } catch (err) {
      console.warn('Groq chat call failed or rate-limited; applying deterministic fallback:', err);
    }

    return NextResponse.json({ reply: getFallbackChat(userQuery) });
  } catch (error) {
    console.error('Fatal API /api/ai handler error:', error);
    return NextResponse.json(
      {
        reply: getFallbackChat('Overview of NASA PSI investigations')
      },
      { status: 200 }
    );
  }
}
