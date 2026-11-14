import { Investigation, HistoricalIncident, SpinoffItem } from '@/types/psi';

export const investigations: Investigation[] = [
  {
    id: 'PSI-25',
    acronym: 'BASS-II',
    title: 'Burning and Suppression of Solids - II',
    pillar: 'Prevention',
    hardware: 'Microgravity Science Glovebox (MSG)',
    fuelType: 'Solid',
    sampleDetails: 'Cotton-fiberglass fabric strips (10 cm x 2 cm), flat PMMA slabs (10 cm x 1.2–2 cm x 1–2 mm thick), and acrylic rods (6.35 mm diameter)',
    oxygenRangePercent: [14.0, 25.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [0.0, 50.0],
    sensors: [
      'Dual high-resolution color video cameras',
      'Broadband radiometers (1–11 µm)',
      'Hot-wire airflow anemometers',
      'Fine-wire K-type thermocouples'
    ],
    objective: 'Examine burning and extinction limits of solid materials in low-speed forced flows to bridge NASA-STD-6001 ground testing to microgravity.',
    keyFindings: 'Discovered that solid materials extinguish at different low-speed airflow regimes than predicted by 1-g tests; low forced flow (2–5 cm/s) supplies fresh oxygen without cooling the flame, sustaining combustion at lower oxygen concentrations than on Earth.',
    lunarBaseRelevance: 9,
    earthSpinoff: 'Advanced flammability screening standards for commercial aircraft cabin textiles and enclosed mine safety ventilation systems.'
  },
  {
    id: 'PSI-26',
    acronym: 'BASS',
    title: 'Burning and Suppression of Solids',
    pillar: 'Suppression',
    hardware: 'Microgravity Science Glovebox (MSG)',
    fuelType: 'Solid',
    sampleDetails: 'Cast PMMA cylindrical rods (1.27 cm diameter x 10 cm), flat PMMA slabs (10 cm x 2 cm x 2 mm), and Nomex-blend fabrics',
    oxygenRangePercent: [16.0, 21.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [1.0, 35.0],
    sensors: [
      'Nikon D2Xs digital still camera',
      'Color video camcorder',
      'Chamber pressure transducers',
      'Duct pitot velocity probes'
    ],
    objective: 'Characterize flame growth, spread rates, and nitrogen-quenching extinction limits of solid spacecraft materials in quiescent and low-flow microgravity.',
    keyFindings: 'Demonstrated that absence of buoyant flow allows radiant cooling to extinguish flames without external suppressant, but moderate forced airflow dramatically accelerates solid fuel flame spread.',
    lunarBaseRelevance: 8,
    earthSpinoff: 'Enhanced computational fluid dynamics (CFD) modeling for warehouse fire sprinkler arrays and commercial structural fire ratings.'
  },
  {
    id: 'PSI-98',
    acronym: 'SAFFIRE-I',
    title: 'Spacecraft Fire Safety Demonstration - I',
    pillar: 'Prevention',
    hardware: 'Cygnus Pressurized Cargo Module (Autonomous Flow Duct)',
    fuelType: 'Solid',
    sampleDetails: 'Large SIBAL cloth sheet (75% cotton / 25% fiberglass blend, 40.6 cm wide x 94.0 cm long x 0.3 mm thick)',
    oxygenRangePercent: [21.0, 21.5],
    pressurePsi: 14.7,
    airflowCmPerSec: [20.0, 25.0],
    sensors: [
      'Calibrated video imaging array',
      'Thermocouple rake (18 type-K sensors)',
      'Dual radiometers',
      'Differential pressure transducers',
      'O2/CO2 gas analyzers'
    ],
    objective: 'Conduct the first realistic, large-scale intentional fire aboard an unmanned commercial resupply vehicle post-unberthing from the ISS.',
    keyFindings: 'Flame spread steadily up the large fabric sample in concurrent flow, showing flame speeds and thermal release rates substantially greater than small-scale sample tests predicted.',
    lunarBaseRelevance: 9,
    earthSpinoff: 'Direct input into large-scale aircraft interior fire propagation standards (FAA) and high-rise evacuation time models.'
  },
  {
    id: 'PSI-99',
    acronym: 'SAFFIRE-II',
    title: 'Spacecraft Fire Safety Demonstration - II',
    pillar: 'Prevention',
    hardware: 'Cygnus Pressurized Cargo Module',
    fuelType: 'Solid',
    sampleDetails: '9 discrete material cards (5 cm x 30 cm each): Nomex swatches, PMMA slabs (10–25 mm thickness), silicone sheets, and SIBAL fabric blends',
    oxygenRangePercent: [20.5, 21.5],
    pressurePsi: 14.7,
    airflowCmPerSec: [15.0, 25.0],
    sensors: [
      'Multi-angle HD video cameras',
      'IR thermography camera',
      'Smoke obscuration laser sensors',
      'CO/CO2 electrochemical sensors'
    ],
    objective: 'Determine low-gravity flammability limits and burning behavior for multiple practical spacecraft engineering materials side-by-side.',
    keyFindings: 'Established that materials passing standard Earth flammability screening (NASA-STD-6001 Test 1) can burn sustainably in microgravity forced convective flow.',
    lunarBaseRelevance: 10,
    earthSpinoff: 'Formulated next-generation aerospace textile fire barrier certifications and marine hull fire safety guidelines.'
  },
  {
    id: 'PSI-100',
    acronym: 'SAFFIRE-III',
    title: 'Spacecraft Fire Safety Demonstration - III',
    pillar: 'Suppression',
    hardware: 'Cygnus Pressurized Cargo Module',
    fuelType: 'Solid',
    sampleDetails: 'Full-scale SIBAL fabric burn (40.6 cm wide x 94.0 cm long) under high forced flow and cabin depressurization dynamics',
    oxygenRangePercent: [20.5, 21.5],
    pressurePsi: 11.5,
    airflowCmPerSec: [20.0, 30.0],
    sensors: [
      'High-speed video cameras',
      'Non-dispersive infrared CO/CO2 analyzers',
      'Laser smoke opacity meters',
      'Heat flux radiometers'
    ],
    objective: 'Quantify smoke generation, combustion product transport, and rapid cabin depressurization cleanup dynamics during an active spacecraft blaze.',
    keyFindings: 'Smoke aerosol density peaked within 180 seconds, obscuring optical navigation; rapid depressurization was verified as an effective suppressive countermeasure without structural damage.',
    lunarBaseRelevance: 9,
    earthSpinoff: 'Optimized rapid-purge ventilation protocols for high-occupancy subways, tunnels, and naval submarine compartments.'
  },
  {
    id: 'PSI-159',
    acronym: 'ACME CFI-G',
    title: 'Cool Flames Investigation with Gases',
    pillar: 'Fundamentals',
    hardware: 'Combustion Integrated Rack (CIR)',
    fuelType: 'Gas',
    sampleDetails: 'Spherical porous bronze burner (6.35 mm diameter) emitting propane (C3H8), n-butane (C4H10), and n-pentane (C5H12) gases',
    oxygenRangePercent: [21.0, 85.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [0.0, 5.0],
    sensors: [
      'Low-light intensified ICCD camera',
      'Narrowband OH* (310 nm) and CH* (430 nm) chemiluminescence filters',
      'Broadband radiometers',
      'Chamber pressure sensors'
    ],
    objective: 'Investigate low-temperature quasi-steady cool diffusion flames in gaseous fuels at elevated oxygen concentrations up to 85%.',
    keyFindings: 'Observed steady gaseous cool flames burning at 400–600°C without visible soot or hot flame emission; confirmed that oxygen-rich environments (>30% O2) drastically enhance cool flame stability.',
    lunarBaseRelevance: 10,
    earthSpinoff: 'Low-temperature clean combustion kinetics for ultra-low emission internal combustion and gas turbine engines.'
  },
  {
    id: 'PSI-10',
    acronym: 'ACME Flame Design',
    title: 'Flame Design - Soot-Free and Radiative Extinction',
    pillar: 'Fundamentals',
    hardware: 'Combustion Integrated Rack (CIR)',
    fuelType: 'Gas',
    sampleDetails: 'Spherical porous burner (6.35 mm diameter) emitting ethylene (C2H4) and methane (CH4) diluted in CO2/N2',
    oxygenRangePercent: [18.0, 40.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [0.0, 5.0],
    sensors: [
      'UV-sensitive chemiluminescence cameras',
      'Dual-wavelength soot laser attenuation diagnostic (He-Ne laser)',
      'Gas chromatograph'
    ],
    objective: 'Explore flame design methods to tailor combustion atmospheres that prevent soot inception while maintaining robust flame structure.',
    keyFindings: 'Identified critical stoichiometric and dilution boundaries where soot formation is completely suppressed while combustion efficiency remains near 99%.',
    lunarBaseRelevance: 8,
    earthSpinoff: 'Soot-free burner design methodologies for industrial petrochemical furnaces and clean heating systems.'
  },
  {
    id: 'PSI-69',
    acronym: 'FLEX',
    title: 'Flame Extinguishment Experiment',
    pillar: 'Suppression',
    hardware: 'CIR / Multi-User Droplet Combustion Apparatus (MDCA)',
    fuelType: 'Liquid Droplet',
    sampleDetails: 'Suspended free and SiC-fiber tethered droplets of pure heptane, methanol, and decane (1.5–3.0 mm initial diameter)',
    oxygenRangePercent: [15.0, 40.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [0.0, 2.0],
    sensors: [
      'Dual backlit orthogonal high-speed digital cameras (100 fps)',
      'Fast-response silicon photodiode radiometers',
      'Piezo-actuated ignition spark electrodes'
    ],
    objective: 'Study the effectiveness of gaseous suppressants (CO2, N2, He) on spherical droplet combustion and discover extinction limits.',
    keyFindings: 'Discovered two-stage combustion where hot flame extinction was followed by invisible, self-sustained low-temperature "cool flame" burning before final extinction.',
    lunarBaseRelevance: 9,
    earthSpinoff: 'Refined inert gas fire extinguishing systems for data centers, museum archives, and cleanrooms.'
  },
  {
    id: 'PSI-142',
    acronym: 'CFI / FLEX-2',
    title: 'Cool Flames Investigation / FLEX-2',
    pillar: 'Fundamentals',
    hardware: 'CIR / Multi-User Droplet Combustion Apparatus (MDCA)',
    fuelType: 'Liquid Droplet',
    sampleDetails: 'Single and binary alkane fuel droplets (n-decane, n-hexadecane, 1.5–5.0 mm initial diameter)',
    oxygenRangePercent: [18.0, 35.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [0.0, 1.0],
    sensors: [
      'ICCD intensified video camera',
      '14-bit cooled color CCD camera',
      'Mid-wave IR thermal detector',
      'Dual radiometers'
    ],
    objective: 'Isolate the chemical kinetics governing transition from hot buoyant-free flames to low-temperature cool droplet flames.',
    keyFindings: 'Proved cool flames can consume remaining liquid fuel silently without thermal signature or visible light, representing a hidden re-ignition hazard for enclosed spaces.',
    lunarBaseRelevance: 10,
    earthSpinoff: 'HCCI (Homogeneous Charge Compression Ignition) automotive engines and anti-knock fuel formulation.'
  },
  {
    id: 'PSI-101',
    acronym: 'SAME-R',
    title: 'Smoke and Aerosol Measurement Experiment-Reflight',
    pillar: 'Detection',
    hardware: 'ISS Destiny Laboratory Glovebox',
    fuelType: 'Aerosol/Smoke',
    sampleDetails: 'Thermally pyrolyzed 5 cm wire swatches and insulation materials: Kapton film, PTFE Teflon insulation, Cellulose paper, and Silicone rubber',
    oxygenRangePercent: [21.0, 21.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [5.0, 15.0],
    sensors: [
      'Differential Mobility Spectrometer (DMS, 15–1000 nm)',
      'Condensation Particle Counter (CPC)',
      'Multi-angle laser photometer'
    ],
    objective: 'Measure particle size distribution and morphology of smoke aerosols generated by overheated aerospace materials in microgravity.',
    keyFindings: 'Microgravity smoke particles agglomerate into significantly larger, fluffy chain-like structures compared to compact 1-g smoke, rendering terrestrial smoke alarms prone to false alarms or slow detection.',
    lunarBaseRelevance: 9,
    earthSpinoff: 'Very-early warning aspirating smoke detection systems (ASD) for semiconductor fabrication and hospital ICUs.'
  },
  {
    id: 'PSI-60',
    acronym: 'SPICE',
    title: 'Smoke Point In Co-flow Experiment',
    pillar: 'Detection',
    hardware: 'Microgravity Science Glovebox (MSG) Flow Duct',
    fuelType: 'Gas',
    sampleDetails: 'Gaseous ethylene (C2H4), propane (C3H8), and methane (CH4) laminar round jet flames (1.6 mm nozzle diameter) in air co-flow',
    oxygenRangePercent: [21.0, 30.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [5.0, 40.0],
    sensors: [
      'High-speed CCD color video cameras',
      'He-Ne laser line-of-sight extinction soot probe',
      'Calibrated K-type thermocouple array'
    ],
    objective: 'Determine the smoke point (maximum flame height before soot escapes flame tip) in co-flowing microgravity streams.',
    keyFindings: 'Microgravity smoke points occur at significantly lower fuel flow rates and flame lengths than in 1-g because prolonged residence times allow immense soot accumulation.',
    lunarBaseRelevance: 8,
    earthSpinoff: 'Industrial flare stack monitoring and soot-emission reduction systems in oil refining.'
  },
  {
    id: 'PSI-62',
    acronym: 'SLICE & E-FIELD / DAFT',
    title: 'Structure & Liftoff in Combustion / Electric-Field Flames',
    pillar: 'Detection',
    hardware: 'Combustion Integrated Rack & MSG',
    fuelType: 'Gas',
    sampleDetails: 'Gaseous methane and ethylene micro-jet diffusion flames (1.0 mm burner) exposed to AC/DC electric fields up to 10 kV; lunar regolith aerosol simulants (JSC-1A)',
    oxygenRangePercent: [21.0, 25.0],
    pressurePsi: 14.7,
    airflowCmPerSec: [0.0, 10.0],
    sensors: [
      'High-voltage electrode probe grid',
      'Keithley picoammeter ion current detector',
      'Schlieren optical imaging',
      'Laser sheet scattering'
    ],
    objective: 'Examine ionic wind actuation on flame stability and validate partial-gravity aerodynamic flame simulation.',
    keyFindings: 'Demonstrated electrostatic fields can manipulate flame shape, suppress soot, and accelerate flame extinction without physical suppressants; mapped lunar dust aerosol impact.',
    lunarBaseRelevance: 7,
    earthSpinoff: 'Electrostatic particulate scrubbers for clean manufacturing and electric-field combustion efficiency control.'
  }
];

export const incidents: HistoricalIncident[] = [
  {
    id: 'INC-APOLLO-1',
    mission: 'Apollo 1 (AS-204)',
    year: 1967,
    oxygenPercent: 100.0,
    pressurePsi: 16.7,
    cause: 'Electrical arcing from damaged wiring ignited flammable Velcro and nylon netting in a 100% pure oxygen environment at 16.7 psi pre-launch test pressure.',
    lessonLearned: 'Prohibited pure high-pressure oxygen environments during ground tests; established rigorous non-metallic material flammability screening (NASA-STD-6001) and rapid cabin hatch release designs.'
  },
  {
    id: 'INC-APOLLO-13',
    mission: 'Apollo 13',
    year: 1970,
    oxygenPercent: 100.0,
    pressurePsi: 14.7,
    cause: 'Damaged Teflon wire insulation in cryogenic Oxygen Tank #2 sparked an electrical short, causing rapid combustion of aluminum casing inside the supercritical oxygen tank.',
    lessonLearned: 'Redesigned spacecraft oxygen tanks to eliminate immersion heaters with exposed wiring, added redundant telemetry, and isolated cryogenic storage from cabin supply manifolds.'
  },
  {
    id: 'INC-MIR-1997',
    mission: 'Mir Space Station',
    year: 1997,
    oxygenPercent: 22.0,
    pressurePsi: 14.7,
    cause: 'Defective solid-fuel oxygen generator (Vika / TGK perchlorate candle) ruptured, producing an open torch flame and dense toxic smoke filling the Kvant-1 module.',
    lessonLearned: 'Demonstrated difficulty of firefighting in microgravity due to smoke obscuration, zero-g fire extinguisher recoil, and lack of buoyant convective ventilation; proved need for rapid modular isolation and multi-mask respirators.'
  }
];

export const spinoffs: SpinoffItem[] = [
  {
    id: 'node/9407',
    title: 'Pre-Combustion Early-Warning Fire Detector',
    spinoffUrl: 'https://spinoff.nasa.gov/Spinoff2020/ps_1.html',
    nasaConnection: 'Developed directly from SAME and SAME-R microgravity smoke aerosol sizing experiments on ISS, which mapped pre-combustion nanoparticle emissions before flames erupt.',
    terrestrialImpact: 'Commercialized as ultra-sensitive aspirating smoke and sub-micron particle detection systems used worldwide in data centers, cleanrooms, and historic museums.'
  },
  {
    id: 'node/9582',
    title: 'Lightweight Composite Firefighter Air Tanks',
    spinoffUrl: 'https://spinoff.nasa.gov/Spinoff2021/cg_3.html',
    nasaConnection: 'Engineered using NASA rocket motor casing filament-winding and lightweight composite pressure vessel technology developed for manned spacecraft life-support systems.',
    terrestrialImpact: 'Reduced structural weight of firefighter SCBA (Self-Contained Breathing Apparatus) air cylinders by over 35% (shaving 13 lbs off a 20-lb pack), drastically decreasing cardiac fatigue and heat stress for urban firefighters.'
  },
  {
    id: 'node/9918',
    title: 'Advanced Thermal-Protective Firefighter Turnout Gear',
    spinoffUrl: 'https://spinoff.nasa.gov/Spinoff2022/ps_2.html',
    nasaConnection: 'Derived from BASS and Saffire flame-resistant textile research and spacecraft reentry thermal protection composites (polybenzimidazole and aluminized Nomex matrices).',
    terrestrialImpact: 'Equips municipal and airport emergency rescue firefighters with lightweight, breathable turnout jackets resistant to flashover temperatures exceeding 1000°C.'
  }
];

/**
 * Dynamically scores and ranks investigations according to operational scenarios:
 * - 'lunar': Exploration Atmosphere (>=30% O2, <=10.2 psi). Prioritizes high-O2 gas/solid tests (e.g. PSI-159, PSI-25, PSI-99).
 * - 'iss': Nominal microgravity shirtsleeve environment (21% O2, 14.7 psi, MSG & CIR racks).
 * - 'spacesuit': 100% O2 extreme flammability & droplet/flash extinction regimes.
 * - 'spinoffs': Ranked by commercial terrestrial safety impact.
 */
export function getRankedInvestigations(preset: 'lunar' | 'iss' | 'spacesuit' | 'spinoffs'): Investigation[] {
  const scored = [...investigations].map((inv) => {
    let score = 0;

    switch (preset) {
      case 'lunar': {
        // Base weight from lunar relevance (1-10)
        score += inv.lunarBaseRelevance * 12;

        // Boost high oxygen envelope capability (>=30% O2)
        if (inv.oxygenRangePercent[1] >= 30) {
          score += 35;
        }

        // Boost cool flames & low airflow forced convection (critical in lunar habitat air loops)
        if (inv.id === 'PSI-159') score += 50; // ACME CFI-G: 85% O2 cool flames
        if (inv.id === 'PSI-25') score += 40;  // BASS-II: low-speed forced flow solids
        if (inv.id === 'PSI-99') score += 30;  // SAFFIRE-II: multi-material flammability
        if (inv.id === 'PSI-142') score += 25; // CFI-2: cool droplet flames
        break;
      }

      case 'iss': {
        // Nominal ISS: 21% O2, 14.7 psi shirtsleeve environment
        if (inv.oxygenRangePercent[0] <= 21 && inv.oxygenRangePercent[1] >= 21) {
          score += 40;
        }
        if (inv.hardware.includes('MSG') || inv.hardware.includes('ISS')) {
          score += 25;
        }
        if (inv.pillar === 'Detection' || inv.pillar === 'Suppression') {
          score += 20;
        }
        if (inv.id === 'PSI-101') score += 30; // SAME-R smoke detection on ISS
        if (inv.id === 'PSI-26') score += 25;  // BASS suppression
        break;
      }

      case 'spacesuit': {
        // High O2 envelope (EVA is 100% O2, 4.3 psi)
        score += (inv.oxygenRangePercent[1] / 100) * 60;
        if (inv.pillar === 'Suppression' || inv.pillar === 'Prevention') {
          score += 25;
        }
        if (inv.fuelType === 'Liquid Droplet' || inv.fuelType === 'Solid') {
          score += 15;
        }
        if (inv.id === 'PSI-159') score += 35; // tested up to 85% O2
        if (inv.id === 'PSI-69') score += 30;  // droplet extinction limits
        if (inv.id === 'PSI-98') score += 25;  // large-scale fabric burn
        break;
      }

      case 'spinoffs': {
        // Direct earth spinoff impact
        const hasSpinoff = inv.earthSpinoff && inv.earthSpinoff.length > 10;
        score += hasSpinoff ? 40 : 0;
        if (inv.id === 'PSI-101') score += 45; // SAME-R -> node/9407 aspirating detectors
        if (inv.id === 'PSI-25') score += 35;  // BASS-II -> turnout gear & mine safety
        if (inv.id === 'PSI-98') score += 30;  // SAFFIRE-I -> FAA aircraft safety
        if (inv.id === 'PSI-69') score += 25;  // FLEX -> clean agent suppression
        if (inv.id === 'PSI-142') score += 20; // CFI-2 -> HCCI automotive engines
        score += inv.lunarBaseRelevance * 3;
        break;
      }
    }

    return { inv, score };
  });

  return scored.sort((a, b) => b.score - a.score).map((item) => item.inv);
}
