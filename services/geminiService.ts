
import { GoogleGenAI, Type } from "@google/genai";
import { ModelType, Platform, AdStrategy, AdObjective, ConsumerSentiment, PsychographicProfile, CulturalNuance } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const fetchLiveSignalData = async (topic: string): Promise<{
  signal: string;
  sources: { title: string; uri: string }[];
  suggestedParams: Partial<AdStrategy>;
}> => {
  const prompt = `Search for real-time data on: "${topic}". Focus on Polymarket odds, OSINT sentiment, and economic indicators. Provide a summary.`;
  try {
    const response = await ai.models.generateContent({
      model: ModelType.PRO,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.filter(chunk => chunk.web).map(chunk => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || ''
    }));
    return { signal: response.text || "", sources, suggestedParams: { externalSignal: topic } };
  } catch (error) { throw error; }
};

export const orchestrateParameters = async (brief: string): Promise<Partial<AdStrategy>> => {
  const prompt = `
    Analyze this brief and return a JSON mapping for our High-Dimensional Targeting Matrix (9 parameters):
    Brief: "${brief}"
    JSON structure:
    {
      "objective": "Conversion|Awareness|Fear of Missing Out|Educational|Political Persuasion|Crisis Mgmt",
      "sentiment": "Anxious|Optimistic|Skeptical|Apathetic|Urgent",
      "psychographic": "Analytical|Impulsive|Status-Driven|Community-Oriented|Risk-Averse",
      "culturalNuance": "Globalist|Hyper-Local|Techno-Optimist|Traditionalist",
      "riskPropensity": "Low|Medium|High",
      "temporalUrgency": "Immediate|Strategic|Evergreen",
      "volatilityIndex": 0-100,
      "segment": "string",
      "externalSignal": "string"
    }
  `;
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
  const prompt = `
    ROLE: Quantum Growth Architect.
    TASK: Generate a hyper-personalized ad for ${platform}.
    
    HIGH-DIMENSIONAL MATRIX:
    - Objective/Sentiment: ${strategy.objective} / ${strategy.sentiment}
    - Psychographic: ${strategy.psychographic}
    - Cultural Nuance: ${strategy.culturalNuance}
    - Volatility/Risk: ${strategy.volatilityIndex}% / ${strategy.riskPropensity}
    - Urgency: ${strategy.temporalUrgency}
    - External Signal: ${strategy.externalSignal}

    CONTEXT: ${userContext}

    Apply Deep Reasoning to bridge market volatility with psychographic triggers.
    [AD COPY]
    ...content...
    [STRATEGIC REASONING]
    ...deep analysis...
  `;
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
      reasoning: parts[1]?.trim() || "Calculated based on 9-dimensional vector space."
    };
  } catch (error) { throw error; }
};
