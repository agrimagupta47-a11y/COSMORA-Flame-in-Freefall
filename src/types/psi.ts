export type FirePillar = 'Prevention' | 'Detection' | 'Suppression' | 'Fundamentals';

export interface Investigation {
  id: string;
  acronym: string;
  title: string;
  pillar: FirePillar;
  hardware: string;
  fuelType: 'Solid' | 'Gas' | 'Liquid Droplet' | 'Aerosol/Smoke';
  sampleDetails: string;
  oxygenRangePercent: [number, number];
  pressurePsi: number;
  airflowCmPerSec: [number, number];
  sensors: string[];
  objective: string;
  keyFindings: string;
  lunarBaseRelevance: number;
  earthSpinoff: string;
}

export interface HistoricalIncident {
  id: string;
  mission: string;
  year: number;
  oxygenPercent: number;
  pressurePsi: number;
  cause: string;
  lessonLearned: string;
}

export interface SpinoffItem {
  id: string;
  title: string;
  spinoffUrl: string;
  nasaConnection: string;
  terrestrialImpact: string;
}
