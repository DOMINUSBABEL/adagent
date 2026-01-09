import { Platform } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Intelligence Hub', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'campaigns', label: 'Hyper-Segmenter', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
  { id: 'live', label: 'Command Center', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { id: 'data', label: 'OSINT Lab', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
];

export const MOCK_TRENDS = [
  { name: 'Polymarket: Trump Odds', value: 62.4, delta: 2.1, category: 'Politics' },
  { name: 'OSINT: COL Sentiment', value: -12, delta: -4.5, category: 'Social' },
  { name: 'COP Liquidity', value: 4105, delta: 0.8, category: 'Economy' },
  { name: 'Viral Alpha (X)', value: 98.2, delta: 15.4, category: 'Social' },
];

export const COLOMBIA_ELECTION_DATA = [
  { time: 'Week 1', value: 42, value2: 38 },
  { time: 'Week 2', value: 45, value2: 35 },
  { time: 'Week 3', value: 41, value2: 39 },
  { time: 'Week 4', value: 48, value2: 32 },
  { time: 'Week 5', value: 52, value2: 30 },
  { time: 'Week 6', value: 55, value2: 28 },
];
