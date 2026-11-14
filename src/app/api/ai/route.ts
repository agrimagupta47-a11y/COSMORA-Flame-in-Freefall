import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { investigations, incidents, spinoffs } from '@/data/psi_dataset';

interface RequestBody {
  mode?: 'chat' | 'compare' | 'briefing';
  message?: string;
  ids?: [string, string];
  oxygenPercent?: number;
  pressurePsi?: number;
  habitatName?: string;
  role?: 'engineer' | 'student';
}

export interface BriefingResult {
  riskLevel: 'CRITICAL' | 'ELEVATED' | 'NOMINAL';
  ignitionRisk: string;
  suppressionStrategy: string;
  relevantPsiIds: string[];
  partialGravityCaveat: string;
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
- PARTIAL-GRAVITY GAPS: The partial-gravity regimes (Moon: 0.166-g; Mars: 0.38-g) represent an urgent experimental frontier. Flight safety limits are theoretically bounded between 0-g and 1-g results, creating substantial uncertainty for habitat ventilation and material ratings. NASA and international partners are targeting these gaps via the upcoming LUCI (Lunar Combustion Investigation) and FM2 (Flow Boiling and Condensation / Fire Safety in Reduced Gravity) exploration payloads.
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

function getFallbackBriefing(o2: number, psi: number, name: string): BriefingResult {
  const isHighO2 = o2 >= 28;
  const isPureO2 = o2 >= 90;
  const isHighPressure = psi >= 14.0;
  const isHypobaric = psi <= 9.0;

  let riskLevel: 'CRITICAL' | 'ELEVATED' | 'NOMINAL' = 'NOMINAL';
  if (isPureO2 || (o2 >= 40 && isHighPressure) || (o2 >= 30 && psi >= 15.0)) {
    riskLevel = 'CRITICAL';
  } else if (isHighO2 || isHypobaric) {
    riskLevel = 'ELEVATED';
  }

  let ignitionRisk = '';
  let suppressionStrategy = '';
  const relevantPsiIds: string[] = [];

  if (riskLevel === 'CRITICAL') {
    ignitionRisk = `Extremely severe flashover hazard at ${o2}% O2 and ${psi} PSI (comparable to Apollo 1 conditions). Solid polymers, wire insulation, and textiles experience near-instantaneous surface flame propagation with drastically depressed minimum ignition energies. Secondary low-temperature cool flames ([PSI-159]) can sustain smoldering combustion even after apparent extinction.`;
    suppressionStrategy = `Automated rapid cabin depressurization ([PSI-100] SAFFIRE-III) to strip oxygen below extinction limits, paired with high-volume gaseous CO2 / He total flooding ([PSI-69] FLEX). Optical detectors must be supplemented by aspirating sub-micron particle analyzers ([PSI-101] SAME-R, [node/9407]) to catch pre-combustion off-gassing before runaway.`;
    relevantPsiIds.push('PSI-159', 'PSI-98', 'PSI-69', 'PSI-100', 'PSI-101');
  } else if (riskLevel === 'ELEVATED') {
    ignitionRisk = `Elevated flammability profile at ${o2}% O2 and ${psi} PSI (typical Exploration Atmosphere / Lunar Habitat target). ACME CFI-G ([PSI-159]) proved that atmospheres >=30% O2 drastically stabilize low-temperature cool diffusion flames (400–600°C) with no visible soot. Solid materials ([PSI-25] BASS-II, [PSI-99] SAFFIRE-II) burn under low forced flows (2–15 cm/s) where terrestrial buoyant cooling does not exist.`;
    suppressionStrategy = `Zoned ventilation isolation to eliminate forced convective feeding ([PSI-25]), followed by targeted nitrogen diluent injection or portable clean-agent extinguishers ([PSI-26]). Traditional optical obscuration alarms must be augmented with high-sensitivity multi-gas CO/CO2 analyzers ([PSI-101] SAME-R).`;
    relevantPsiIds.push('PSI-159', 'PSI-25', 'PSI-99', 'PSI-69', 'PSI-101');
  } else {
    ignitionRisk = `Nominal baseline conditions at ${o2}% O2 and ${psi} PSI (standard shirtsleeve ISS / terrestrial envelope). Flammability limits conform to NASA-STD-6001 Test 1 baselines. Quiescent microgravity allows radiant heat loss to assist extinction ([PSI-26]), though low-velocity air recirculation ducts can still sustain localized burning.`;
    suppressionStrategy = `Module ventilation shutdown to eliminate air currents ([PSI-25]), standard water mist or fine gaseous suppressant discharge ([PSI-69]), and aspirating smoke detection calibration ([PSI-101] SAME-R).`;
    relevantPsiIds.push('PSI-25', 'PSI-26', 'PSI-101', 'PSI-60');
  }

  const partialGravityCaveat = `Current telemetry represents microgravity (0-g, ISS/Cygnus) and Earth (1-g) data. In lunar 1/6-g (${name}), weak buoyancy sustains continuous oxygen flow without providing strong convective cooling, representing a critical safety gap pending the upcoming NASA LUCI (Lunar Combustion Investigation) and FM2 missions.`;

  return {
    riskLevel,
    ignitionRisk,
    suppressionStrategy,
    relevantPsiIds,
    partialGravityCaveat
  };
}

function getFallbackChat(query: string, role: 'engineer' | 'student' = 'engineer'): string {
  const q = query.toLowerCase();

  if (role === 'student') {
    if (q.includes('30%') || q.includes('lunar') || q.includes('moon')) {
      return `### How Fire Behaves on a Moon Base (30% Oxygen Atmosphere)

Imagine lighting a campfire on Earth: hot smoke rises, cool air rushes in, and the flame dances into a familiar tall teardrop shape. On the Moon or in space, gravity changes the entire game!

1. **Why Moon Bases Use 30% Oxygen**:
   - Astronauts want to walk on the Moon without waiting hours in an airlock to get rid of nitrogen from their blood (decompression sickness / "the bends").
   - So NASA plans an **Exploration Atmosphere**: lower pressure (8.2 PSI) but higher oxygen (30%–34%).
   - But higher oxygen makes things burn **much faster and easier**!

2. **The Invisible "Cool Flame" Danger ([PSI-159])**:
   - In NASA's **[PSI-159]** (ACME CFI-G) experiment, scientists discovered that when oxygen is above 30%, gases can burn as invisible "cool flames" at 400–600°C without producing smoke or visible light.
   - You might have a fire right in front of you, and regular smoke alarms won't see it!

3. **Why Microgravity is Different ([PSI-25])**:
   - In freefall or low gravity, flames turn into soft, round blue spheres because oxygen diffuses equally from all directions.
   - Experiments like **[PSI-25]** (BASS-II) showed that even a gentle fan breeze can keep a fire going when it would have died on Earth.

4. **The Big Mystery: 1/6th Gravity**:
   - We know how fire works on Earth (1-g) and in freefall (0-g). But on the Moon (1/6-g), fire is still an active mystery! Upcoming missions like NASA's **LUCI** and **FM2** will test real fires on the Moon to keep future Artemis astronauts safe.`;
    }

    if (q.includes('cool flame') || q.includes('smoke detection')) {
      return `### Cool Flames & Space Smoke Alarms Explained Simply

1. **What is a "Cool Flame"?**:
   - On Earth, a candle flame burns at around 1400°C, producing bright yellow light and black soot particles.
   - In microgravity experiments like **[PSI-159]** (ACME CFI-G) and **[PSI-142]** (CFI / FLEX-2), flames can burn at just 400°C–600°C. They produce no black soot and give off barely any light.

2. **Why Smoke Alarms Fail in Space**:
   - Regular household smoke detectors look for floating soot particles or light blockage. Cool flames don't produce soot, so standard alarms stay completely silent!
   - Plus, as NASA's **[PSI-101]** (SAME-R) found, low-gravity smoke particles clump into long fluffy chains that float differently without gravity's pull.

3. **NASA's Solution ([node/9407])**:
   - NASA invented ultra-sensitive "aspirating detectors" that sniff out sub-micron chemical particles and invisible gases (like CO and formaldehyde) before flames even erupt. This technology is now used on Earth in hospitals and data centers!`;
    }
  }

  // Engineering role default responses
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
    const { mode = 'chat', message, ids, oxygenPercent, pressurePsi, habitatName, role = 'engineer' } = body;

    const apiKey = process.env.GROQ_API_KEY;
    const hasValidKey =
      typeof apiKey === 'string' &&
      apiKey.trim().length > 10 &&
      apiKey !== 'your_groq_api_key_here';

    // Handle 'briefing' mode
    if (mode === 'briefing') {
      const o2 = typeof oxygenPercent === 'number' ? oxygenPercent : 32.0;
      const psi = typeof pressurePsi === 'number' ? pressurePsi : 8.2;
      const hab = habitatName || 'Exploration Habitat';

      if (!hasValidKey) {
        return NextResponse.json(getFallbackBriefing(o2, psi, hab));
      }

      try {
        const groq = new Groq({ apiKey });
        const briefingPrompt = `Evaluate the aerospace fire safety profile for this proposed habitat atmosphere:
Habitat / Environment: ${hab}
Oxygen Concentration: ${o2}%
Total Ambient Pressure: ${psi} PSI

KNOWLEDGE CONTEXT:
${datasetContext}

Respond ONLY with a JSON object strictly matching this schema:
{
  "riskLevel": "CRITICAL" | "ELEVATED" | "NOMINAL",
  "ignitionRisk": "Rigorous analysis of flammability, ignition delay, and cool flames referencing PSI-159 (>=30% O2 cool flame stability) and PSI-25/PSI-98 (materials in forced airflow)",
  "suppressionStrategy": "Actionable suppression and detection protocol citing PSI-69 (CO2/He droplet extinction), PSI-100 (depressurization), and PSI-101 (smoke particle sizing)",
  "relevantPsiIds": ["PSI-159", "PSI-25", "PSI-69", "PSI-101"],
  "partialGravityCaveat": "Explicit note regarding the partial-gravity gap (bounded between 0g and 1g, pending LUCI and FM2 lunar missions)"
}`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'You are an expert NASA aerospace fire safety specialist evaluating life-support combustion risks. Respond strictly with JSON.'
            },
            {
              role: 'user',
              content: briefingPrompt
            }
          ],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
          temperature: 0.2
        });

        const raw = chatCompletion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.riskLevel && parsed.ignitionRisk && parsed.suppressionStrategy && Array.isArray(parsed.relevantPsiIds)) {
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.warn('Groq briefing call failed; applying deterministic fallback:', err);
      }

      return NextResponse.json(getFallbackBriefing(o2, psi, hab));
    }

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
      return NextResponse.json({ reply: getFallbackChat(userQuery, role) });
    }

    try {
      const groq = new Groq({ apiKey });
      const personaGuideline =
        role === 'student'
          ? `ADAPT TONE FOR STUDENTS & GENERAL RESEARCHERS: Use engaging physical analogies (e.g. comparing candle teardrop flames on Earth with spherical blue microgravity flames, Dr. Dennis Stocker NASA ScienceCast insights), explain why buoyant updrafts vanish in orbit, and explain physical concepts clearly without overly dense jargon while still citing PSI IDs.`
          : `ADAPT TONE FOR AEROSPACE ENGINEERS & NASA JUDGES: Use rigorous aerospace terminology: stoichiometry, Damköhler number transport, non-metallic material ratings (NASA-STD-6001), exact sensor suites, and life-support design margins.`;

      const systemPrompt = `You are the NASA Space Apps 2026 "Flame in Freefall" Aerospace Fire Safety & PSI Copilot.
You answer user questions by grounding your reasoning in the NASA Physical Sciences Informatics (PSI) experiments, historical spacecraft incidents, and terrestrial spinoffs.

AUDIENCE ROLE: ${role.toUpperCase()}
${personaGuideline}

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

    return NextResponse.json({ reply: getFallbackChat(userQuery, role) });
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
