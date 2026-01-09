
import { GoogleGenAI, Type } from "@google/genai";
import { ModelType, Platform, AdStrategy, AdObjective, ConsumerSentiment, PsychographicProfile, CulturalNuance } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performDeepOSINT = async (topic: string): Promise<{
  analysis: string;
  signals: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[];
  sources: { title: string; uri: string }[];
}> => {
  const prompt = `Perform a professional OSINT analysis on: "${topic}". 
  Include: 
  1. Current market sentiment.
  2. Key economic indicators related.
  3. Social media trend velocity.
  Return a structured professional report.`;
  
  try {
    const response = await ai.models.generateContent({
      model: ModelType.PRO,
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 8000 }
      },
    });
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks.filter(c => c.web).map(c => ({ title: c.web?.title || 'OSINT Source', uri: c.web?.uri || '' }));
    
    return {
      analysis: response.text || "Analysis unavailable.",
      signals: [
        { label: 'Volatility', value: 'High', trend: 'up' },
        { label: 'Sentiment', value: 'Bullish', trend: 'up' }
      ],
      sources
    };
  } catch (error) { throw error; }
};

export const generateBulkVariants = async (
  strategy: AdStrategy,
  userContext: string,
  count: number = 5,
  lang: 'es' | 'en' = 'es'
): Promise<{variants: {content: string, reasoning: string, segment: string}[]}> => {
  const prompt = `
    Generate ${count} distinct ad variants based on this 9D matrix: ${JSON.stringify(strategy)}.
    Context: ${userContext}
    For each variant, slightly shift one sub-vector (e.g. change psychographic from Analytical to Impulsive) to cover the full spectrum of the target.
    
    Return as a JSON array of objects with keys: "content", "reasoning", "segment".
  `;
  try {
    const response = await ai.models.generateContent({
      model: ModelType.FLASH,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        systemInstruction: `You are the Talleyrand Bulk Synthesis Engine. Response in ${lang === 'es' ? 'Spanish' : 'English'}.`
      }
    });
    const data = JSON.parse(response.text || '{"variants": []}');
    return data;
  } catch (e) { return { variants: [] }; }
};

export const analyzeSocialContext = async (url: string): Promise<{
  insights: string;
  suggestedSegment: string;
  suggestedTone: ConsumerSentiment;
}> => {
  const prompt = `Analyze social media URL: "${url}". Identify core community, linguistic style, and recurring themes. Suggest targeting segment and sentiment.`;
  try {
    const response = await ai.models.generateContent({
      model: ModelType.PRO,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const text = response.text || "";
    let tone: ConsumerSentiment = 'Optimistic';
    if (text.toLowerCase().includes('anxious')) tone = 'Anxious';
    return { insights: text, suggestedSegment: "Community: " + url.split('/')[2], suggestedTone: tone };
  } catch (error) { throw error; }
};

export const orchestrateParameters = async (brief: string): Promise<Partial<AdStrategy>> => {
  const prompt = `Analyze this brief and return a JSON mapping for our High-Dimensional Targeting Matrix (9 parameters): "${brief}"`;
  try {
    const response = await ai.models.generateContent({
      model: ModelType.FLASH,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { return {}; }
};

export const generateAdvancedAd = async (
  platform: Platform,
  strategy: AdStrategy,
  userContext: string,
  model: ModelType = ModelType.PRO,
  language: 'es' | 'en' = 'es'
): Promise<{content: string, reasoning: string}> => {
  const prompt = `Execute 9D matrix synthesis for ${platform}. Matrix: ${JSON.stringify(strategy)}. Context: ${userContext}`;
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: `Expert in multi-variant context engineering. Response in ${language === 'es' ? 'Spanish' : 'English'}.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 16384 }
      }
    });
    const text = response.text || "";
    const parts = text.split('[STRATEGIC REASONING]');
    return {
      content: parts[0].replace('[AD COPY]', '').trim(),
      reasoning: parts[1]?.trim() || "Calculated via Talleyrand 9D Engine."
    };
  } catch (error) { throw error; }
};
