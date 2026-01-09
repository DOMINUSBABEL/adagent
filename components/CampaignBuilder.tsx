
import React, { useState } from 'react';
import { ModelType, Platform, GeneratedContent, AdObjective, ConsumerSentiment, PsychographicProfile, CulturalNuance, AdStrategy } from '../types';
import { generateAdvancedAd, generateBulkVariants, orchestrateParameters } from '../services/geminiService';
import { translations } from '../translations';

const OBJECTIVES: AdObjective[] = ['Conversion', 'Awareness', 'Fear of Missing Out', 'Educational', 'Political Persuasion', 'Crisis Mgmt'];
const SENTIMENTS: ConsumerSentiment[] = ['Anxious', 'Optimistic', 'Skeptical', 'Apathetic', 'Urgent'];
const PSYCHOGRAPHICS: PsychographicProfile[] = ['Analytical', 'Impulsive', 'Status-Driven', 'Community-Oriented', 'Risk-Averse'];
const CULTURES: CulturalNuance[] = ['Globalist', 'Hyper-Local', 'Techno-Optimist', 'Traditionalist'];

const VECTOR_TIPS: Record<string, string> = {
  objective: "Defines the core CTA and conversion funnel logic.",
  psychographic: "Triggers specific cognitive biases (e.g. Scarcity for Impulsive).",
  cultural: "Adjusts idiom and local relevance filters.",
  volatilityIndex: "Determines how much real-time market news is injected."
};

const CampaignBuilder: React.FC<{lang: 'es' | 'en'}> = ({ lang }) => {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
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

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (isBulk) {
        const { variants } = await generateBulkVariants(params, masterBrief, 10, lang);
        const newResults = variants.map(v => ({
          id: Math.random().toString(36).substr(2, 9),
          platform: Platform.META,
          strategy: { ...params, segment: v.segment },
          content: v.content,
          reasoning: v.reasoning,
          hashtags: ['#BulkAI', '#Talleyrand'],
          timestamp: new Date()
        }));
        setResults([...newResults, ...results]);
      } else {
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
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrchestrate = async () => {
    if (!masterBrief) return;
    setOrchestrating(true);
    try {
      const suggested = await orchestrateParameters(masterBrief);
      setParams(prev => ({ ...prev, ...suggested }));
    } finally {
      setOrchestrating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 h-full overflow-hidden">
      
      {/* Control Panel - Left Side */}
      <div className="w-full lg:w-[380px] flex flex-col gap-4 shrink-0 min-h-0">
        
        {/* Briefing Window */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden shrink-0">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Neural Input Brief</h3>
            {orchestrating && <i className="fas fa-spinner fa-spin text-blue-400 text-[10px]"></i>}
          </div>
          <div className="p-4 space-y-3">
            <textarea 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 h-24 focus:border-blue-500/50 outline-none transition-all resize-none custom-scrollbar"
              placeholder="Inject context (e.g. 'Campaign for high-end crypto wallet in Zurich')..."
              value={masterBrief}
              onChange={(e) => setMasterBrief(e.target.value)}
            />
            <button 
              onClick={handleOrchestrate}
              disabled={!masterBrief || orchestrating}
              className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
            >
              Orchestrate Matrix
            </button>
          </div>
        </div>

        {/* Parameters Window */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col shadow-xl overflow-hidden min-h-0">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Targeting Vectors</h3>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase">Bulk Sweep</span>
              <button 
                onClick={() => setIsBulk(!isBulk)}
                className={`w-8 h-4 rounded-full relative transition-colors ${isBulk ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isBulk ? 'left-4.5' : 'left-0.5'}`}></div>
              </button>
            </div>
          </div>
          
          <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Objective', key: 'objective', options: OBJECTIVES },
                { label: 'Psychographic', key: 'psychographic', options: PSYCHOGRAPHICS },
                { label: 'Cultural Nuance', key: 'culturalNuance', options: CULTURES }
              ].map(field => (
                <div key={field.key} className="space-y-1.5 group relative">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      {field.label}
                    </label>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 -top-1 bg-slate-800 text-[8px] px-2 py-1 rounded border border-slate-700 text-slate-400 z-10 pointer-events-none">
                      {VECTOR_TIPS[field.key]}
                    </div>
                  </div>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-white outline-none focus:border-indigo-500/50"
                    value={(params as any)[field.key]}
                    onChange={e => setParams({...params, [field.key]: e.target.value})}
                  >
                    {field.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Volatility Index</label>
                  <span className="text-[10px] font-mono text-indigo-400">{params.volatilityIndex}%</span>
                </div>
                <input 
                  type="range" 
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                  value={params.volatilityIndex} 
                  onChange={e => setParams({...params, volatilityIndex: parseInt(e.target.value)})} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Specific Target Segment</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 outline-none focus:border-indigo-500/50"
                  value={params.segment} 
                  onChange={e => setParams({...params, segment: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/30 border-t border-slate-800 shrink-0">
            <button 
              onClick={handleGenerate} 
              disabled={loading || !masterBrief}
              className={`w-full py-3.5 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] shadow-lg transition-all active:scale-[0.98] ${isBulk ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} disabled:opacity-50 disabled:grayscale`}
            >
              {loading ? <i className="fas fa-sync fa-spin mr-2"></i> : <i className="fas fa-rocket mr-2"></i>}
              {loading ? 'Synthesizing...' : isBulk ? 'Execute 10x Sweep' : 'Deploy Hyper-Ad'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Feed - Right Side */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest">Asset Execution Stream</h2>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[9px] font-bold text-slate-500 uppercase">{results.length} Nodes Generated</span>
             <button onClick={() => setResults([])} className="text-slate-600 hover:text-red-400 transition-colors">
               <i className="fas fa-trash-alt text-[10px]"></i>
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 custom-scrollbar scroll-smooth">
          {results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 select-none grayscale">
              <i className="fas fa-project-diagram text-8xl mb-6"></i>
              <p className="text-[11px] font-black uppercase tracking-[0.6em]">System Standby</p>
            </div>
          ) : (
            results.map(ad => (
              <div key={ad.id} className="bg-slate-950 border border-slate-800/50 rounded-2xl overflow-hidden animate-fade-in hover:border-indigo-500/40 transition-all duration-300">
                <div className="px-5 py-3 bg-slate-900/30 border-b border-slate-800/50 flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">{ad.strategy.objective}</span>
                    <span className="text-[8px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 uppercase">{ad.strategy.segment}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-600">{ad.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="p-6">
                  <div className="text-slate-200 text-sm leading-relaxed mb-6 font-sans selection:bg-indigo-500/30 whitespace-pre-wrap">
                    {ad.content}
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 group">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <i className="fas fa-brain text-[10px]"></i>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5">Talleyrand Tactical Logic</p>
                      <p className="text-[11px] text-slate-400 italic leading-relaxed font-sans">{ad.reasoning}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default CampaignBuilder;
