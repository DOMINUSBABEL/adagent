
import { GoogleGenAI, Type } from "@google/genai";
import { ModelType, Platform, AdStrategy, AdObjective, ConsumerSentiment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analiza un link de red social para extraer estilo, audiencia y temas clave.
 */
export const analyzeSocialContext = async (url: string): Promise<{
  insights: string;
  suggestedSegment: string;
  suggestedTone: ConsumerSentiment;
}> => {
  const prompt = `
    Analyze the following social media URL: "${url}".
    Using your search tools, identify:
    1. The core audience or community interacting with this content.
    2. The prevailing sentiment and linguistic style (slang, formal, aggressive, etc.).
    3. The top 3 recurring themes or pain points discussed.

    Summarize this into a "Social Intelligence Report" and suggest a Targeting Segment and Consumer Sentiment.
    Return the response in a structured format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: ModelType.PRO,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    // Inferir sentimiento basado en el texto analizado
    let tone: ConsumerSentiment = 'Optimistic';
    if (text.toLowerCase().includes('anxious') || text.toLowerCase().includes('preocupación')) tone = 'Anxious';
    if (text.toLowerCase().includes('skeptical') || text.toLowerCase().includes('escéptico')) tone = 'Skeptical';
    if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('urgente')) tone = 'Urgent';

    return {
      insights: text,
      suggestedSegment: "Community of " + url.split('/')[2], // Fallback simple
      suggestedTone: tone
    };
  } catch (error) {
    console.error("Social Analysis Error:", error);
    throw error;
  }
};

export const fetchLiveSignalData = async (topic: string): Promise<{
  signal: string;
  sources: { title: string; uri: string }[];
  suggestedParams: Partial<AdStrategy>;
}> => {
  const prompt = `
    Search for real-time data on the following topic: "${topic}".
    Focus specifically on:
    1. Polymarket betting odds (if applicable).
    2. Latest OSINT sentiment or news trends.
    3. Verifiable economic or political indicators.

    Summarize the "Live Signal" in 2 sentences. 
    Also, suggest the best AdObjective and ConsumerSentiment for this context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: ModelType.PRO,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || ''
      }));

    const text = response.text || "";
    
    return {
      signal: text,
      sources: sources,
      suggestedParams: {
        externalSignal: text.substring(0, 100) + "..."
      }
    };
  } catch (error) {
    console.error("Live Signal Error:", error);
    throw error;
  }
};

export const orchestrateParameters = async (brief: string): Promise<Partial<AdStrategy>> => {
  const prompt = `
    Analyze the following advertising brief and suggest the optimal parameters for our targeting engine.
    Brief: "${brief}"

    Return ONLY a JSON object with these fields:
    - objective (must be one of: Conversion, Awareness, Fear of Missing Out, Educational, Political Persuasion, Crisis Mgmt)
    - sentiment (must be one of: Anxious, Optimistic, Skeptical, Apathetic, Urgent)
    - segment (string, concise target audience)
    - externalSignal (string, what specific topic to search in Polymarket or OSINT)
  `;

  try {
    const response = await ai.models.generateContent({
      model: ModelType.FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Orchestration error:", e);
    return {};
  }
};

export const generateAdvancedAd = async (
  platform: Platform,
  strategy: AdStrategy,
  userContext: string,
  model: ModelType = ModelType.PRO,
  language: 'es' | 'en' = 'es'
): Promise<{content: string, reasoning: string}> => {
  const prompt = `
    ROLE: World-Class Growth Hacker & Data Scientist.
    TASK: Create a hyper-personalized advertisement for ${platform} in ${language === 'es' ? 'SPANISH' : 'ENGLISH'}.
    
    STRATEGIC PARAMETERS:
    - Objective: ${strategy.objective}
    - Targeted Consumer Sentiment: ${strategy.sentiment}
    - Specific Segment: ${strategy.segment}
    - External Signal Focus: ${strategy.externalSignal}.

    USER CONTEXT:
    ${userContext}

    INSTRUCTIONS:
    1. Use Google Search tool to find current Polymarket odds or OSINT data related to "${strategy.externalSignal}".
    2. Adjust the ad copy's psychological trigger based on those odds.
    3. Provide the result in ${language === 'es' ? 'SPANISH' : 'ENGLISH'}.

    FORMAT:
    Return exactly:
    [AD COPY]
    ...content...
    [STRATEGIC REASONING]
    ...why it works...
  `;

  try {
    const config: any = {
      systemInstruction: `You are an AI that masters context-aware advertising. Respond strictly in ${language === 'es' ? 'Spanish' : 'English'}.`,
      tools: [{ googleSearch: {} }],
      temperature: 0.7,
    };

    if (model === ModelType.PRO) {
      config.thinkingConfig = { thinkingBudget: 16384 };
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config
    });

    const text = response.text || "";
    const parts = text.split('[STRATEGIC REASONING]');
    return {
      content: (parts[0] || "").replace('[AD COPY]', '').trim(),
      reasoning: (parts[1] || "").trim() || "Analysis based on real-time market signals."
    };
  } catch (error) {
    console.error("Advanced Gen Error:", error);
    throw error;
  }
};
