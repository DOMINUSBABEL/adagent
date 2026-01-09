
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
  const [analyzingSocial, setAnalyzingSocial] = useState(false);
  const [masterBrief, setMasterBrief] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  
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

  const handleSocialAnalysis = async () => {
    if (!socialUrl) return;
    setAnalyzingSocial(true);
    try {
      const data = await analyzeSocialContext(socialUrl);
      setParams(p => ({ ...p, sentiment: data.suggestedTone, segment: data.suggestedSegment }));
      setMasterBrief(prev => prev + (prev ? "\n\n" : "") + "[SOCIAL_INTEL]: " + data.insights);
    } finally {
      setAnalyzingSocial(false);
    }
  };

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
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4 animate-fade-in">
      
      {/* Top Signaling Toolbar */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-2 flex items-center gap-4 shadow-lg">
        <div className="flex items-center gap-2 px-4 border-r border-slate-800">
          <i className="fas fa-satellite-dish text-emerald-500 animate-pulse text-xs"></i>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Ingest</span>
        </div>
        <div className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="Paste Social URL (X, LinkedIn...) for context extraction"
            className="flex-1 bg-transparent border-none text-xs text-slate-300 placeholder:text-slate-600 outline-none"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
          />
          <button 
            onClick={handleSocialAnalysis}
            disabled={analyzingSocial || !socialUrl}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 border border-slate-700"
          >
            {analyzingSocial ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt"></i>}
            {lang === 'es' ? 'Analizar Link' : 'Analyze Link'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Panel: Configuration (4 cols) */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          
          {/* Briefing Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden shrink-0">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Neural Briefing</h3>
              <i className="fas fa-keyboard text-slate-600 text-xs"></i>
            </div>
            <div className="p-4">
              <textarea 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 h-28 focus:border-blue-500/50 outline-none transition-all resize-none"
                placeholder="Describe your objective..."
                value={masterBrief}
                onChange={(e) => setMasterBrief(e.target.value)}
              />
              <button 
                onClick={handleAIOrchestration}
                className="w-full mt-3 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
              >
                {orchestrating ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-microchip mr-2"></i>}
                {lang === 'es' ? 'Auto-Calibrar 9D' : 'Auto-Calibrate 9D'}
              </button>
            </div>
          </div>

          {/* Matrix Controls Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col shadow-xl overflow-hidden min-h-0">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Matrix Parameters</h3>
              <span className="text-[9px] font-mono text-emerald-500">STABLE</span>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Objective</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-white" value={params.objective} onChange={e => setParams({...params, objective: e.target.value as AdObjective})}>
                    {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Psychographic</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-white" value={params.psychographic} onChange={e => setParams({...params, psychographic: e.target.value as PsychographicProfile})}>
                    {PSYCHOGRAPHICS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Culture</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-white" value={params.culturalNuance} onChange={e => setParams({...params, culturalNuance: e.target.value as CulturalNuance})}>
                    {CULTURES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Urgency</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-white" value={params.temporalUrgency} onChange={e => setParams({...params, temporalUrgency: e.target.value as any})}>
                    <option value="Immediate">Immediate</option>
                    <option value="Strategic">Strategic</option>
                    <option value="Evergreen">Evergreen</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Volatility Index</label>
                  <span className="text-[10px] font-mono text-indigo-400">{params.volatilityIndex}%</span>
                </div>
                <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" value={params.volatilityIndex} onChange={e => setParams({...params, volatilityIndex: parseInt(e.target.value)})} />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Micro-Segment Target</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-slate-300" value={params.segment} onChange={e => setParams({...params, segment: e.target.value})} />
              </div>

              <button 
                onClick={handleGenerate} 
                disabled={loading || !masterBrief}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10 transition-all mt-4"
              >
                {loading ? <i className="fas fa-sync fa-spin mr-2"></i> : <i className="fas fa-rocket mr-2"></i>}
                {loading ? 'Synthesizing...' : 'Deploy Campaign'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Output Feed (8 cols) */}
        <div className="col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden min-h-0">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Deployment Feed</h2>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500">Live Agent Sync: Active</div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {results.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                <div className="w-24 h-24 mb-6 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center">
                  <i className="fas fa-satellite text-4xl"></i>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Vector Execution</p>
              </div>
            ) : (
              results.map(ad => (
                <div key={ad.id} className="bg-slate-950 border border-slate-800/50 rounded-2xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                  <div className="px-5 py-3 bg-slate-900/50 border-b border-slate-800/50 flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 uppercase">{ad.strategy.objective}</span>
                      <span className="text-[8px] font-black text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 uppercase">{ad.strategy.psychographic}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-600">{ad.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans selection:bg-indigo-500/20">{ad.content}</p>
                    <div className="flex items-start gap-4 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0">
                        <i className="fas fa-microchip text-xs"></i>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Talleyrand Strategic Reasoning</p>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed">{ad.reasoning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampaignBuilder;
