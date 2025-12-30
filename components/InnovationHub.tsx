
import React, { useState } from 'react';
import { Idea } from '../types';
import { Lightbulb, Plus, Zap, Star, Sparkles, MessageSquare, X } from 'lucide-react';
import { suggestInnovation } from '../services/geminiService';

interface InnovationHubProps {
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  user: any;
  t: any;
  logActivity: (action: string, target: string, type: any) => void;
}

const InnovationHub: React.FC<InnovationHubProps> = ({ ideas, setIdeas, user, t, logActivity }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (!user?.id) return;
    
    setIdeas(prev => prev.map(idea => {
      if (idea.id === id) {
        const hasVoted = idea.votedBy.includes(user.id);
        if (!hasVoted) logActivity('voted for', idea.title, 'idea');
        const newVotedBy = hasVoted 
          ? idea.votedBy.filter(uid => uid !== user.id) 
          : [...idea.votedBy, user.id];
          
        return { ...idea, votedBy: newVotedBy };
      }
      return idea;
    }));
  };

  const getAiHelp = async () => {
    if (!newTitle) return;
    setIsAiLoading(true);
    try {
      const res = await suggestInnovation(newTitle);
      setAiResult(res || 'AI suggested some cool upgrades.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const postIdea = () => {
    if (!newTitle) return;
    const idea: Idea = {
      id: Date.now().toString(),
      author: user?.name || 'Team',
      title: newTitle,
      content: newContent,
      votedBy: [],
      tags: ['Innovation']
    };
    setIdeas([idea, ...ideas]);
    logActivity('proposed idea', newTitle, 'idea');
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white pink-text-glow flex items-center gap-3 uppercase">
            <Lightbulb className="text-pink-500" />
            {t.innovation}
          </h2>
          <p className="text-slate-500 text-sm font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-[#050505] border border-pink-500/20 rounded-2xl p-6 shadow-2xl sticky top-24">
            <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest mb-6">{t.newIdea}</h3>
            <div className="space-y-4">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={t.title} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-pink-500/30" />
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows={4} placeholder={t.description} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-pink-500/30 resize-none" />
              <div className="flex flex-col gap-2">
                <button onClick={getAiHelp} disabled={isAiLoading || !newTitle} className="w-full bg-white/5 hover:bg-white/10 text-pink-500 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 border border-pink-500/10 disabled:opacity-50 transition-all">
                  {isAiLoading ? <Zap className="animate-spin" size={14}/> : <Sparkles size={14}/>} AI Suggest
                </button>
                <button onClick={postIdea} className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-pink-600/30 transition-all active:scale-95">
                  {t.add}
                </button>
              </div>
              {aiResult && (
                <div className="mt-4 p-4 bg-pink-500/5 border border-pink-500/20 rounded-xl text-[10px] text-slate-300 relative">
                   <button onClick={() => setAiResult(null)} className="absolute top-2 right-2 text-slate-600 hover:text-white"><X size={12}/></button>
                   <p className="font-black text-pink-500 uppercase mb-2">Gemini Analysis:</p>
                   <div className="leading-relaxed">{aiResult}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 pb-20">
          {ideas.sort((a,b) => b.votedBy.length - a.votedBy.length).map(idea => {
            const hasVoted = user?.id && idea.votedBy.includes(user.id);
            return (
              <div key={idea.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-pink-500/30 transition-all shadow-xl group">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => handleVote(idea.id)} className={`p-3 rounded-xl transition-all border ${hasVoted ? 'bg-pink-600 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-pink-500/10 hover:bg-pink-600/20 text-pink-500 border-pink-500/20'}`}>
                      <Star size={20} className={hasVoted ? 'fill-current' : ''} />
                    </button>
                    <span className={`font-black text-xs ${hasVoted ? 'text-pink-500' : 'text-slate-400'}`}>{idea.votedBy.length}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-pink-500 transition-colors uppercase tracking-tight">{idea.title}</h4>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{idea.content}</p>
                    <div className="flex items-center gap-2">
                      {idea.tags.map(tag => (<span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-black text-slate-600 border border-white/5 uppercase">{tag}</span>))}
                      <div className="flex-1"></div>
                      <span className="text-[9px] font-bold text-slate-700 uppercase">by {idea.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InnovationHub;
