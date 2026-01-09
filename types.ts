
export enum ModelType {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview',
  LIVE = 'gemini-2.5-flash-native-audio-preview-12-2025'
}

export enum Platform {
  META = 'Meta (FB/Insta)',
  WHATSAPP = 'WhatsApp Business',
  X = 'X (Twitter)',
  LINKEDIN = 'LinkedIn',
  TIKTOK = 'TikTok Ads',
  GOOGLE_SEARCH = 'Google Search (SEM)',
  PROGRAMMATIC = 'Programmatic Display'
}

export type AdObjective = 'Conversion' | 'Awareness' | 'Fear of Missing Out' | 'Educational' | 'Political Persuasion' | 'Crisis Mgmt';
export type ConsumerSentiment = 'Anxious' | 'Optimistic' | 'Skeptical' | 'Apathetic' | 'Urgent';
export type PsychographicProfile = 'Analytical' | 'Impulsive' | 'Status-Driven' | 'Community-Oriented' | 'Risk-Averse';
export type CulturalNuance = 'Globalist' | 'Hyper-Local' | 'Techno-Optimist' | 'Traditionalist';

export interface AdStrategy {
  objective: AdObjective;
  sentiment: ConsumerSentiment;
  segment: string;
  externalSignal: string; 
  // Nuevos parámetros (250% de aumento analítico)
  psychographic: PsychographicProfile;
  culturalNuance: CulturalNuance;
  volatilityIndex: number; // 0-100 (derivado de Polymarket/OSINT)
  riskPropensity: 'Low' | 'Medium' | 'High';
  temporalUrgency: 'Immediate' | 'Strategic' | 'Evergreen';
}

export interface GeneratedContent {
  id: string;
  platform: Platform;
  strategy: AdStrategy;
  content: string;
  reasoning: string;
  hashtags: string[];
  imageUrl?: string;
  timestamp: Date;
}

export interface TrendMetric {
  name: string;
  value: number;
  delta: number;
  category: string;
}

export interface DataPoint {
  time: string;
  value: number;
  value2?: number;
}
