
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
    try {
      const suggested = await orchestrateParameters(masterBrief);
      setParams(prev => ({ ...prev, ...suggested }));
    } finally {
      setOrchestrating(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { content, reasoning } = await generateAdvancedAd(Platform.META, params, masterBrief, ModelType.PRO, lang);
      setResults([{
        id: Math.random().toString(36).substr(2, 9),
        platform: Platform.META,
        strategy: params,
        content,
        reasoning,
        hashtags: ['#AI', '#Talleyrand'],
        timestamp: new Date()
      }, ...results]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full pb-10">
      <div className="xl:col-span-5 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Talleyrand Signature Branding */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">Consultora Talleyrand</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600">MOD-9.D_v2.5</span>
        </div>

        {/* Neural Input Area */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <i className="fas fa-brain text-blue-400"></i>
                {lang === 'es' ? 'Brief Maestro Contextual' : 'Master Contextual Brief'}
              </h3>
              {orchestrating && <span className="text-[10px] text-blue-400 animate-pulse font-mono">CALCULATING_VECTORS...</span>}
            </div>
            <textarea 
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-300 h-32 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none placeholder:text-slate-700"
              placeholder={lang === 'es' ? "Ingresa los objetivos de la campaña o señales de mercado..." : "Enter campaign goals or market signals..."}
              value={masterBrief}
              onChange={(e) => setMasterBrief(e.target.value)}
            />
            <button 
              onClick={handleAIOrchestration} 
              disabled={orchestrating || !masterBrief}
              className="mt-4 w-full py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <i className={`fas ${orchestrating ? 'fa-sync fa-spin' : 'fa-microchip'} mr-2`}></i>
              {lang === 'es' ? 'Orquestar Matriz 9D' : 'Orchestrate 9D Matrix'}
            </button>
          </div>
        </div>

        {/* Matrix Dashboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Latent Targeting Space</h3>
            <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded border border-emerald-500/20">Active Grounding</span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
             {/* Dynamic Fields */}
             <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <i className="fas fa-bullseye text-[8px]"></i> {t.objective}
                </label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors" value={params.objective} onChange={e => setParams({...params, objective: e.target.value as AdObjective})}>
                  {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
                </select>
             </div>

             <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <i className="fas fa-fingerprint text-[8px]"></i> Psychographic
                </label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none" value={params.psychographic} onChange={e => setParams({...params, psychographic: e.target.value as PsychographicProfile})}>
                  {PSYCHOGRAPHICS.map(p => <option key={p}>{p}</option>)}
                </select>
             </div>

             <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <i className="fas fa-globe-americas text-[8px]"></i> Cultural Nuance
                </label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none" value={params.culturalNuance} onChange={e => setParams({...params, culturalNuance: e.target.value as CulturalNuance})}>
                  {CULTURES.map(c => <option key={c}>{c}</option>)}
                </select>
             </div>

             <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <i className="fas fa-bolt text-[8px]"></i> Volatility ({params.volatilityIndex}%)
                </label>
                <input 
                  type="range" 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                  value={params.volatilityIndex} 
                  onChange={e => setParams({...params, volatilityIndex: parseInt(e.target.value)})} 
                />
             </div>
          </div>

          <div className="pt-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase block mb-2">Primary Target Segment</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-blue-500/50"
              value={params.segment} 
              onChange={e => setParams({...params, segment: e.target.value})}
            />
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={loading || !masterBrief} 
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-black text-[11px] text-white uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-rocket"></i>}
            {loading ? 'Synthesizing Hyper-Assets...' : 'Execute Deployment'}
          </button>
        </div>
      </div>

      {/* Output Feed */}
      <div className="xl:col-span-7 space-y-6 overflow-y-auto max-h-[85vh] pr-4 custom-scrollbar pb-10">
        {results.length === 0 && (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-slate-800/50 rounded-[2.5rem] p-12 transition-all">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800 group-hover:scale-110 transition-transform">
              <i className="fas fa-satellite text-3xl opacity-30"></i>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-2">{t.neuralReady}</h3>
            <p className="text-[10px] text-slate-500 max-w-xs text-center leading-relaxed">System waiting for dimensional mapping from Talleyrand's cognitive core.</p>
          </div>
        )}

        {results.map(ad => (
          <div key={ad.id} className="relative group animate-fade-in">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full uppercase border border-indigo-500/20 tracking-tighter">
                    {ad.strategy.objective}
                  </span>
                  <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full uppercase border border-emerald-500/20 tracking-tighter">
                    {ad.strategy.psychographic}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-slate-500 font-mono">{ad.timestamp.toLocaleTimeString()}</span>
                  <button className="text-slate-500 hover:text-white transition-colors"><i className="fas fa-copy text-xs"></i></button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 text-slate-200 text-sm leading-relaxed font-sans whitespace-pre-wrap selection:bg-indigo-500/30">
                  {ad.content}
                </div>
                
                <div className="mt-8 flex items-start gap-5 p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 group-hover:bg-indigo-500/10 transition-colors">
                  <div className="w-10 h-10 shrink-0 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <i className="fas fa-microchip text-indigo-400"></i>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">{t.dataReasoning}</h4>
                    <p className="text-[11px] text-slate-400 italic leading-relaxed">{ad.reasoning}</p>
                    <div className="mt-3 flex gap-2">
                      {ad.hashtags.map(tag => <span key={tag} className="text-[9px] text-slate-600">#{tag.replace('#','')}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignBuilder;
