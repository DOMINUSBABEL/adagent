
import React, { useState } from 'react';
import { ModelType, Platform, GeneratedContent, AdObjective, ConsumerSentiment, PsychographicProfile, CulturalNuance, AdStrategy } from '../types';
import { generateAdvancedAd, orchestrateParameters, fetchLiveSignalData, analyzeSocialContext } from '../services/geminiService';
import { translations } from '../translations';

const OBJECTIVES: AdObjective[] = ['Conversion', 'Awareness', 'Fear of Missing Out', 'Educational', 'Political Persuasion', 'Crisis Mgmt'];
const SENTIMENTS: ConsumerSentiment[] = ['Anxious', 'Optimistic', 'Skeptical', 'Apathetic', 'Urgent'];
const PSYCHOGRAPHICS: PsychographicProfile[] = ['Analytical', 'Impulsive', 'Status-Driven', 'Community-Oriented', 'Risk-Averse'];
const CULTURES: CulturalNuance[] = ['Globalist', 'Hyper-Local', 'Techno-Optimist', 'Traditionalist'];

const CampaignBuilder: React.FC<{lang: 'es' | 'en'}> = ({ lang }) => {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [orchestrating, setOrchestrating] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [masterBrief, setMasterBrief] = useState('');
  
  const [params, setParams] = useState<AdStrategy>({
    objective: 'Conversion',
    sentiment: 'Optimistic',
    psychographic: 'Analytical',
    culturalNuance: 'Globalist',
    riskPropensity: 'Medium',
    temporalUrgency: 'Strategic',
    volatilityIndex: 50,
    segment: 'Global Audience',
    externalSignal: 'Polymarket: General'
  });

  const [results, setResults] = useState<GeneratedContent[]>([]);

  const handleAIOrchestration = async () => {
    if (!masterBrief) return;
    setOrchestrating(true);
    const suggested = await orchestrateParameters(masterBrief);
    setParams(prev => ({ ...prev, ...suggested }));
    setOrchestrating(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const { content, reasoning } = await generateAdvancedAd(Platform.META, params, masterBrief, ModelType.PRO, lang);
    setResults([{
      id: Math.random().toString(36).substr(2, 9),
      platform: Platform.META,
      strategy: params,
      content,
      reasoning,
      hashtags: ['#AI', '#DataDriven'],
      timestamp: new Date()
    }, ...results]);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full pb-10">
      <div className="xl:col-span-5 space-y-4">
        {/* Brief Area */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5">
          <textarea 
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white h-24 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Input campaign brief..."
            value={masterBrief}
            onChange={(e) => setMasterBrief(e.target.value)}
          />
          <button onClick={handleAIOrchestration} className="mt-2 w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest">
            {orchestrating ? 'Orchestrating Matrix...' : 'Compute 9D Matrix'}
          </button>
        </div>

        {/* High Density Matrix UI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Targeting Matrix (9 Vectors)</h3>
          
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Objective</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={params.objective} onChange={e => setParams({...params, objective: e.target.value as AdObjective})}>
                  {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Psychographic</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={params.psychographic} onChange={e => setParams({...params, psychographic: e.target.value as PsychographicProfile})}>
                  {PSYCHOGRAPHICS.map(p => <option key={p}>{p}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Cultural Nuance</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={params.culturalNuance} onChange={e => setParams({...params, culturalNuance: e.target.value as CulturalNuance})}>
                  {CULTURES.map(c => <option key={c}>{c}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Volatility (Live)</label>
                <input type="range" className="w-full accent-blue-500" value={params.volatilityIndex} onChange={e => setParams({...params, volatilityIndex: parseInt(e.target.value)})} />
             </div>
          </div>

          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">
            {loading ? 'Synthesizing...' : 'Execute Deployment'}
          </button>
        </div>
      </div>

      <div className="xl:col-span-7 space-y-6">
        {results.map(ad => (
          <div key={ad.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-fade-in">
             <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                {[ad.strategy.objective, ad.strategy.psychographic, ad.strategy.culturalNuance, `${ad.strategy.volatilityIndex}% Vol`].map(v => (
                  <span key={v} className="text-[9px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 whitespace-nowrap">{v}</span>
                ))}
             </div>
             <div className="bg-slate-950 p-4 rounded-xl text-slate-200 text-sm whitespace-pre-wrap mb-4 font-sans">{ad.content}</div>
             <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Matrix Reasoning:</p>
                <p className="text-[11px] text-slate-400 italic">{ad.reasoning}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignBuilder;
