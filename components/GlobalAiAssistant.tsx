
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  lang: 'ru' | 'en';
}

const StructuredText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        if (line.startsWith('###')) {
          return <h4 key={idx} className="text-pink-500 font-black uppercase text-sm mt-4">{line.replace('###', '').trim()}</h4>;
        }
        let formattedLine: any = line;
        if (line.includes('**')) {
          const parts = line.split('**');
          formattedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part);
        }
        if (line.includes('public class') || line.includes('Telemetry') || line.includes('hardwareMap')) {
          return (
            <div key={idx} className="bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-[11px] text-blue-300 my-2 overflow-x-auto">
              {line}
            </div>
          );
        }
        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-pink-600">•</span>
              <p className="text-slate-200 text-sm">{formattedLine.toString().replace(/^[-*]\s?/, '')}</p>
            </div>
          );
        }
        return line.trim() === '' ? <br key={idx} /> : <p key={idx} className="text-slate-200 text-sm leading-relaxed">{formattedLine}</p>;
      })}
    </div>
  );
};

const GlobalAiAssistant: React.FC<Props> = ({ isOpen, onClose, t, lang }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await chatWithAssistant(userMsg, history, lang);
    setMessages(prev => [...prev, { role: 'model', text: response || '...' }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#050505] border-l border-pink-500/20 z-[100] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-pink-500/10 flex items-center justify-between bg-pink-600/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-600/30">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-sm tracking-tighter pink-text-glow">Neura Hub AI</h3>
            <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest leading-none">{t.aiReady}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/40">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <Bot size={48} className="text-pink-500" />
            <p className="text-sm text-slate-400 font-medium italic max-w-[250px]">
              {lang === 'ru' ? 'Задайте любой технический вопрос. Я предоставлю структурированный ответ с кодом и пояснениями.' : 'Ask any technical question. I will provide a structured response with code and explanations.'}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-800' : 'bg-pink-600/20 border border-pink-500/30'}`}>
                {msg.role === 'user' ? <User size={16} className="text-slate-400" /> : <Sparkles size={16} className="text-pink-500" />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-slate-900 text-slate-100 rounded-tr-none' 
                : 'bg-white/[0.03] border border-white/5 text-slate-200 rounded-tl-none shadow-2xl'
              }`}>
                {msg.role === 'model' ? <StructuredText text={msg.text} /> : <p className="text-sm">{msg.text}</p>}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-pink-600/5 border border-pink-500/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-pink-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">{t.aiThinking}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-pink-500/10 bg-black">
        <div className="relative">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t.aiPlaceholder}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-white text-sm focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[9px] text-slate-700 mt-4 uppercase font-black tracking-widest">Powered by Gemini 3 Pro • Structured Response Core</p>
      </div>
    </div>
  );
};

export default GlobalAiAssistant;
