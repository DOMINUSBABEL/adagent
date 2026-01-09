
import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ModelType, Platform, AdFormat, GeneratedContent, AdObjective, PsychographicProfile, CulturalNuance, AdStrategy } from '../types';
import { generateAdvancedAd, generateBulkVariants, orchestrateParameters } from '../services/geminiService';
import { translations } from '../translations';

const OBJECTIVES: AdObjective[] = ['Conversion', 'Awareness', 'Fear of Missing Out', 'Educational', 'Political Persuasion', 'Crisis Mgmt'];
const PSYCHOGRAPHICS: PsychographicProfile[] = ['Analytical', 'Impulsive', 'Status-Driven', 'Community-Oriented', 'Risk-Averse'];
const CULTURES: CulturalNuance[] = ['Globalist', 'Hyper-Local', 'Techno-Optimist', 'Traditionalist'];
const FORMATS: AdFormat[] = ['Static Image', 'Video', 'Carousel', 'Story', 'Native'];
const PLATFORMS = Object.values(Platform);

const VECTOR_TIPS: Record<string, { desc: string, impact: string, color: string }> = {
  objective: { desc: "Defines the core CTA and conversion funnel logic.", impact: "High", color: "text-blue-400" },
  psychographic: { desc: "Triggers specific cognitive biases for target persona.", impact: "Very High", color: "text-purple-400" },
  culturalNuance: { desc: "Adjusts idiom and local relevance filters.", impact: "Medium", color: "text-emerald-400" },
  volatilityIndex: { desc: "Sensitivity to real-time market news injection.", impact: "Dynamic", color: "text-amber-400" }
};

const CampaignBuilder: React.FC<{lang: 'es' | 'en'}> = ({ lang }) => {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [orchestrating, setOrchestrating] = useState(false);
  const [masterBrief, setMasterBrief] = useState('');
  const [selectedAds, setSelectedAds] = useState<Set<string>>(new Set());
  const [showGuide, setShowGuide] = useState(false);
  
  const [params, setParams] = useState<AdStrategy>({
    objective: 'Conversion',
    sentiment: 'Optimistic',
    psychographic: 'Analytical',
    culturalNuance: 'Globalist',
    riskPropensity: 'Medium',
    temporalUrgency: 'Strategic',
    volatilityIndex: 50,
    segment: 'Global Audience',
    externalSignal: 'Polymarket: General',
    platform: Platform.META,
    format: 'Static Image'
  });

  const [results, setResults] = useState<GeneratedContent[]>([]);

  // Real-time validation
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!masterBrief.trim()) errors.push("Brief is required");
    if (params.volatilityIndex > 90) errors.push("Extreme volatility may cause high hallucination risk");
    if (!params.segment.trim()) errors.push("Target segment cannot be empty");
    return errors;
  }, [masterBrief, params]);

  // Radar data visualization of the 9D Strategy
  const radarData = useMemo(() => [
    { subject: 'Psychographic', A: PSYCHOGRAPHICS.indexOf(params.psychographic) * 20 + 20, fullMark: 100 },
    { subject: 'Volatility', A: params.volatilityIndex, fullMark: 100 },
    { subject: 'Culture', A: CULTURES.indexOf(params.culturalNuance) * 25 + 25, fullMark: 100 },
    { subject: 'Risk', A: params.riskPropensity === 'High' ? 100 : params.riskPropensity === 'Medium' ? 60 : 30, fullMark: 100 },
    { subject: 'Urgency', A: params.temporalUrgency === 'Immediate' ? 100 : params.temporalUrgency === 'Strategic' ? 60 : 20, fullMark: 100 },
    { subject: 'Objective', A: OBJECTIVES.indexOf(params.objective) * 15 + 20, fullMark: 100 },
  ], [params]);

  const handleGenerate = async () => {
    if (validationErrors.length > 0) return;
    setLoading(true);
    try {
      if (isBulk) {
        const { variants } = await generateBulkVariants(params, masterBrief, 10, lang);
        const newResults = variants.map(v => ({
          id: Math.random().toString(36).substr(2, 9),
          platform: params.platform,
          strategy: { ...params, segment: v.segment },
          content: v.content,
          reasoning: v.reasoning,
          hashtags: ['#BulkAI', '#Talleyrand'],
          timestamp: new Date()
        }));
        setResults([...newResults, ...results]);
      } else {
        const { content, reasoning } = await generateAdvancedAd(params.platform, params, masterBrief, ModelType.PRO, lang);
        setResults([{
          id: Math.random().toString(36).substr(2, 9),
          platform: params.platform,
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

  const exportData = async (format: 'csv' | 'xlsx' | 'pdf') => {
    const dataToExport = results.filter(r => selectedAds.size === 0 || selectedAds.has(r.id));
    if (dataToExport.length === 0) return alert("No items selected for export.");
    const fileName = `AdArchitect_Export_${new Date().getTime()}`;

    if (format === 'csv') {
      const headers = "ID,Platform,Format,Segment,Content,Reasoning,Timestamp\n";
      const rows = dataToExport.map(r => 
        `${r.id},${r.platform},${r.strategy.format},"${r.strategy.segment}","${r.content.replace(/"/g, '""')}","${r.reasoning.replace(/"/g, '""')}",${r.timestamp.toISOString()}`
      ).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.csv`;
      link.click();
    } else if (format === 'xlsx') {
      const worksheet = (window as any).XLSX.utils.json_to_sheet(dataToExport.map(r => ({
        ID: r.id,
        Platform: r.platform,
        Format: r.strategy.format,
        Segment: r.strategy.segment,
        Content: r.content,
        Reasoning: r.reasoning
      })));
      const workbook = (window as any).XLSX.utils.book_new();
      (window as any).XLSX.utils.book_append_sheet(workbook, worksheet, "Ads");
      (window as any).XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } else if (format === 'pdf') {
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF();
      doc.text("AdArchitect Strategy Report", 20, 20);
      dataToExport.forEach((r, i) => {
        doc.text(`Variant ${i+1}: ${r.strategy.segment} [${r.platform}]`, 20, 40 + (i * 30));
      });
      doc.save(`${fileName}.pdf`);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedAds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAds(next);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 h-full overflow-hidden relative">
      
      {showGuide && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 lg:p-10 flex items-center justify-center animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-10 max-w-3xl w-full shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar border-t-4 border-t-indigo-500">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Vector Handbook</h2>
                <button onClick={() => setShowGuide(false)} className="text-slate-400 hover:text-white"><i className="fas fa-times"></i></button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(VECTOR_TIPS).map(([key, val]) => (
                  <div key={key} className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className={`text-[10px] font-black uppercase mb-1 ${val.color}`}>{key}</p>
                    <p className="text-xs text-slate-400">{val.desc}</p>
                  </div>
                ))}
             </div>
             <button onClick={() => setShowGuide(false)} className="mt-8 w-full py-4 bg-indigo-600 rounded-xl font-bold uppercase text-xs tracking-widest">Close Guide</button>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4 shrink-0 min-h-0">
        
        {/* Radar Visualizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl shrink-0 h-48 relative overflow-hidden">
          <div className="absolute top-2 left-4 z-10">
            <h4 className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Strategy Geometry</h4>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 8, fontWeight: 'bold' }} />
              <Radar name="Strategy" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Inputs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col shadow-xl overflow-hidden min-h-0">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration Matrix</h3>
            <button onClick={() => setShowGuide(true)} className="text-[9px] font-black text-indigo-400 uppercase underline">Guide</button>
          </div>
          
          <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Master Brief</label>
              <textarea 
                className={`w-full bg-slate-950 border rounded-lg p-2.5 text-[11px] text-white outline-none h-20 resize-none ${masterBrief ? 'border-slate-800' : 'border-amber-500/30'}`}
                placeholder="The 'What' and 'Why'..."
                value={masterBrief}
                onChange={e => setMasterBrief(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Platform</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] text-white outline-none" value={params.platform} onChange={e => setParams({...params, platform: e.target.value as Platform})}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Ad Format</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] text-white outline-none" value={params.format} onChange={e => setParams({...params, format: e.target.value as AdFormat})}>
                  {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Objective', key: 'objective', options: OBJECTIVES },
                { label: 'Psychographic', key: 'psychographic', options: PSYCHOGRAPHICS },
                { label: 'Cultural Nuance', key: 'culturalNuance', options: CULTURES }
              ].map(field => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">{field.label}</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] text-white outline-none" value={(params as any)[field.key]} onChange={e => setParams({...params, [field.key]: e.target.value})}>
                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Volatility Index</label>
                <span className={`text-[10px] font-mono ${params.volatilityIndex > 80 ? 'text-rose-500' : 'text-indigo-400'}`}>{params.volatilityIndex}%</span>
              </div>
              <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" value={params.volatilityIndex} onChange={e => setParams({...params, volatilityIndex: parseInt(e.target.value)})} />
            </div>

            {validationErrors.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                {validationErrors.map((err, i) => (
                  <p key={i} className="text-[8px] font-bold text-rose-400 uppercase flex items-center gap-1">
                    <i className="fas fa-exclamation-circle"></i> {err}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-950/30 border-t border-slate-800">
            <button 
              onClick={handleGenerate} 
              disabled={loading || validationErrors.length > 0}
              className={`w-full py-4 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:grayscale disabled:opacity-30`}
            >
              {loading ? <i className="fas fa-sync fa-spin mr-2"></i> : <i className="fas fa-rocket mr-2"></i>}
              {loading ? 'Processing...' : 'Deploy Hyper-Ad'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Feed */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest">Execution Stream</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 shadow-inner">
              <button onClick={() => exportData('pdf')} className="p-2 text-slate-400 hover:text-white rounded-md transition-all"><i className="fas fa-file-pdf"></i></button>
              <button onClick={() => exportData('xlsx')} className="p-2 text-slate-400 hover:text-white rounded-md transition-all"><i className="fas fa-file-excel"></i></button>
              <button onClick={() => exportData('csv')} className="p-2 text-slate-400 hover:text-white rounded-md transition-all"><i className="fas fa-file-csv"></i></button>
            </div>
            <button onClick={() => setResults([])} className="text-slate-600 hover:text-red-400 p-2"><i className="fas fa-trash-alt"></i></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 custom-scrollbar scroll-smooth">
          {results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <i className="fas fa-layer-group text-8xl mb-6"></i>
              <p className="text-[11px] font-black uppercase tracking-[0.5em]">Terminal Empty</p>
            </div>
          ) : (
            results.map((ad) => (
              <div key={ad.id} className="bg-slate-950 border border-slate-800/50 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">{ad.platform}</span>
                    <span className="text-[8px] font-black text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase">{ad.strategy.format}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-600">{ad.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-200 text-sm leading-relaxed mb-6 font-sans whitespace-pre-wrap">{ad.content}</div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <i className="fas fa-brain"></i> Neural Logic
                  </p>
                  <p className="text-[11px] text-slate-400 italic leading-relaxed">{ad.reasoning}</p>
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
