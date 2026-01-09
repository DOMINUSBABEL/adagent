
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { translations } from '../translations';

interface LiveAgentProps {
  onTranscript?: (text: string) => void;
  lang: 'es' | 'en';
}

const LiveAgent: React.FC<LiveAgentProps> = ({ onTranscript, lang }) => {
  const t = translations[lang];
  const [connected, setConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Fixed: Manual implementation of encode as per @google/genai guidelines
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Fixed: Manual implementation of decode as per @google/genai guidelines
  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Fixed: Manual implementation of decodeAudioData as per @google/genai guidelines
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const connectToLive = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setActiveStream(stream);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setConnected(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length) * 50);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              // Fixed: Using sessionPromise.then to avoid race conditions and stale closures
              sessionPromise.then(s => s.sendRealtimeInput({ media: blob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
               setIsTalking(true);
               const ctx = outputAudioContextRef.current!;
               // Fixed: Track nextStartTime for gapless playback
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
               const source = ctx.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(ctx.destination);
               source.onended = () => {
                 sourcesRef.current.delete(source);
                 if (sourcesRef.current.size === 0) setIsTalking(false);
               };
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               sourcesRef.current.add(source);
            }
          },
          onclose: () => setConnected(false),
          onerror: () => setConnected(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: `Eres un director creativo publicitario experto. Responde estrictamente en ${lang === 'es' ? 'ESPAÑOL' : 'INGLÉS'}.`,
        }
      });
    } catch (e) { console.error(e); }
  };

  const disconnect = () => {
    if (activeStream) activeStream.getTracks().forEach(t => t.stop());
    setConnected(false);
    setIsTalking(false);
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-pink-500"><i className="fas fa-microphone-lines"></i></span>
            {t.liveDirector}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{t.speakToGemini}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${connected ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
          {connected ? t.liveConnection : t.offline}
        </div>
      </div>

      <div className="flex flex-col items-center py-8">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${connected ? 'scale-100' : 'opacity-50 grayscale'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isTalking ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`}>
            <i className={`fas fa-brain text-4xl ${isTalking ? 'text-white' : 'text-slate-600'}`}></i>
          </div>
          {connected && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" style={{ animationDuration: '3s' }}></div>
          )}
        </div>
        
        <div className="mt-8 flex gap-4">
          {!connected ? (
            <button 
              onClick={connectToLive}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all flex items-center gap-2"
            >
              <i className="fas fa-play"></i> {t.connectLive}
            </button>
          ) : (
            <button 
              onClick={disconnect}
              className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-full font-bold transition-all flex items-center gap-2"
            >
              <i className="fas fa-stop"></i> {t.endSession}
            </button>
          )}
        </div>
      </div>
      
      {connected && (
        <div className="mt-4 flex flex-col items-center">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                    className="bg-blue-500 h-full transition-all duration-75"
                    style={{ width: `${Math.min(100, volume)}%` }}
                ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">
                {isTalking ? t.agentSpeaking : t.listening}
            </p>
        </div>
      )}
    </div>
  );
};

// Fixed: Added default export
export default LiveAgent;
