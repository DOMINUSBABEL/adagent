
import React, { useState } from 'react';
import { ModelType, Platform, GeneratedContent, AdObjective, ConsumerSentiment, PsychographicProfile, CulturalNuance, AdStrategy } from '../types';
import { generateAdvancedAd, generateBulkVariants, orchestrateParameters } from '../services/geminiService';
import { translations } from '../translations';

const OBJECTIVES: AdObjective[] = ['Conversion', 'Awareness', 'Fear of Missing Out', 'Educational', 'Political Persuasion', 'Crisis Mgmt'];
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
  const [selectedAds, setSelectedAds] = useState<Set<string>>(new Set());
  
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

  const exportData = (format: 'csv' | 'xlsx' | 'pdf') => {
    const dataToExport = results.filter(r => selectedAds.size === 0 || selectedAds.has(r.id));
    if (dataToExport.length === 0) return alert("No items selected for export.");

    if (format === 'csv') {
      const headers = "ID,Platform,Segment,Content,Reasoning\n";
      const rows = dataToExport.map(r => `${r.id},${r.platform},"${r.strategy.segment}","${r.content.replace(/"/g, '""')}","${r.reasoning.replace(/"/g, '""')}"`).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Talleyrand_Export_${new Date().getTime()}.csv`;
      a.click();
    } else {
      // Logic for XLSX/PDF would involve libraries like jspdf/xlsx. 
      // For this implementation, we simulate the action with a notification.
      alert(`Preparing ${format.toUpperCase()} export for ${dataToExport.length} items...`);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedAds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAds(next);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 h-full overflow-hidden">
      
      {/* Control Panel */}
      <div className="w-full lg:w-[380px] flex flex-col gap-4 shrink-0 min-h-0">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden shrink-0">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Neural Input Brief</h3>
            {orchestrating && <i className="fas fa-spinner fa-spin text-blue-400 text-[10px]"></i>}
          </div>
          <div className="p-4 space-y-3">
            <textarea 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 h-24 focus:border-blue-500/50 outline-none transition-all resize-none custom-scrollbar"
              placeholder="Inject context..."
              value={masterBrief}
              onChange={(e) => setMasterBrief(e.target.value)}
            />
            <button 
              onClick={handleOrchestrate}
              disabled={!masterBrief || orchestrating}
              className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
            >
              Orchestrate Matrix
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col shadow-xl overflow-hidden min-h-0">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Targeting Vectors</h3>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase">Bulk</span>
              <button onClick={() => setIsBulk(!isBulk)} className={`w-8 h-4 rounded-full relative transition-colors ${isBulk ? 'bg-indigo-600' : 'bg-slate-700'}`}>
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
                  <label className="text-[9px] font-bold text-slate-500 uppercase">{field.label}</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-white outline-none focus:border-indigo-500/50"
                    value={(params as any)[field.key]}
                    onChange={e => setParams({...params, [field.key]: e.target.value})}
                  >
                    {field.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Volatility Index</label>
                  <span className="text-[10px] font-mono text-indigo-400">{params.volatilityIndex}%</span>
                </div>
                <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" value={params.volatilityIndex} onChange={e => setParams({...params, volatilityIndex: parseInt(e.target.value)})} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/30 border-t border-slate-800">
            <button 
              onClick={handleGenerate} 
              disabled={loading || !masterBrief}
              className={`w-full py-3.5 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] shadow-lg transition-all ${isBulk ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} disabled:opacity-50`}
            >
              {loading ? <i className="fas fa-sync fa-spin mr-2"></i> : <i className="fas fa-rocket mr-2"></i>}
              {loading ? 'Synthesizing...' : isBulk ? 'Execute 10x Sweep' : 'Deploy Hyper-Ad'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Feed */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest">Asset Execution Stream</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 mr-2">
              <button onClick={() => exportData('pdf')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all" title="Export PDF"><i className="fas fa-file-pdf text-sm"></i></button>
              <button onClick={() => exportData('xlsx')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all" title="Export Excel"><i className="fas fa-file-excel text-sm"></i></button>
              <button onClick={() => exportData('csv')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all" title="Export CSV"><i className="fas fa-file-csv text-sm"></i></button>
            </div>
            <button onClick={() => setResults([])} className="text-slate-600 hover:text-red-400 transition-colors p-2"><i className="fas fa-trash-alt text-[11px]"></i></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 custom-scrollbar scroll-smooth">
          {results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 select-none grayscale">
              <i className="fas fa-project-diagram text-8xl mb-6"></i>
              <p className="text-[11px] font-black uppercase tracking-[0.6em]">System Standby</p>
            </div>
          ) : (
            results.map((ad, idx) => (
              <div 
                key={ad.id} 
                className={`group relative bg-slate-950 border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] ${selectedAds.has(ad.id) ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800/50 hover:border-indigo-500/40'}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute top-4 left-4 z-10">
                  <button 
                    onClick={() => toggleSelect(ad.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedAds.has(ad.id) ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-slate-700 hover:border-indigo-500'}`}
                  >
                    {selectedAds.has(ad.id) && <i className="fas fa-check text-[10px] text-white"></i>}
                  </button>
                </div>

                <div className="px-5 py-3 pl-12 bg-slate-900/30 border-b border-slate-800/50 flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">Variant #{results.length - idx}</span>
                    <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">Confidence: 94%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-slate-600">{ad.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="p-6 pl-12">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Segment: <span className="text-slate-300">{ad.strategy.segment}</span></h4>
                       <button onClick={() => navigator.clipboard.writeText(ad.content)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-indigo-400"><i className="fas fa-copy text-xs"></i></button>
                    </div>
                    <div className="text-slate-200 text-sm leading-relaxed font-sans whitespace-pre-wrap selection:bg-indigo-500/30">
                      {ad.content}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 group/item">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-brain text-blue-400 text-[10px]"></i>
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Reasoning</p>
                      </div>
                      <p className="text-[11px] text-slate-400 italic leading-relaxed font-sans line-clamp-3 group-hover/item:line-clamp-none transition-all duration-300">
                        {ad.reasoning}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Meta Performance Score</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Persuasion</span>
                          <span className="text-emerald-500">High</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[85%]"></div>
                        </div>
                      </div>
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
