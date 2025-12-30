import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import SharedNavBar from '../shared/SharedNavBar';

const NewQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/qa');
    }
    setUser(user);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !body.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('questions').insert({
        author_id: user.id,
        title: title.trim(),
        body: body.trim(),
      });

      if (error) throw error;

      navigate('/qa');
    } catch (err: any) {
      alert(err.message || 'Failed to create question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neura-black text-white">
      {/* Shared Navigation Bar */}
      <SharedNavBar user={user} />
      
      {/* Spacer for fixed nav */}
      <div className="h-24"></div>
      

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
            <span className="bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent">
              Ask a Question
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Share your question with the FTC community and get helpful answers
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="relative bg-gradient-to-br from-black/90 via-neutral-950/90 to-black/90 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-8 md:p-10 space-y-8 overflow-hidden group">
          {/* Decorative effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/5 via-purple-500/3 to-cyan-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neura-pink/0 via-neura-pink/60 to-neura-pink/0"></div>
          
          <div className="relative z-10 space-y-8">
            {/* Enhanced Title Input */}
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider font-bold">
                Question Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question? Be specific and clear..."
                className="w-full bg-black/50 border-2 border-neutral-800/80 rounded-2xl py-5 px-6 text-xl md:text-2xl focus:outline-none focus:border-neura-pink/60 focus:ring-2 focus:ring-neura-pink/20 transition-all text-white placeholder-gray-500 font-display font-bold"
                required
              />
              <p className="mt-2 text-xs text-gray-500 font-mono">
                {title.length} characters • A clear title helps others find your question
              </p>
            </div>

            {/* Enhanced Details Textarea */}
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider font-bold">
                Question Details
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide more details about your question...&#10;&#10;• What have you tried?&#10;• What specific help do you need?&#10;• Any relevant context?"
                rows={14}
                className="w-full bg-black/50 border-2 border-neutral-800/80 rounded-2xl py-5 px-6 text-base focus:outline-none focus:border-neura-pink/60 focus:ring-2 focus:ring-neura-pink/20 transition-all text-white placeholder-gray-500 resize-none leading-relaxed"
                required
              />
              <p className="mt-2 text-xs text-gray-500 font-mono">
                {body.length} characters • The more details, the better answers you'll get
              </p>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-800/60">
              <button
                type="button"
                onClick={() => navigate('/qa')}
                className="px-6 py-3 rounded-xl border-2 border-neutral-800/80 hover:border-neura-pink/50 bg-black/30 hover:bg-black/50 text-gray-400 hover:text-white text-sm font-display font-bold transition-all flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !body.trim()}
                className="relative px-10 py-4 rounded-xl bg-gradient-to-r from-neura-pink to-pink-600 hover:from-pink-600 hover:to-neura-pink text-white text-sm font-display font-bold transition-all shadow-[0_0_30px_rgba(214,51,132,0.5)] hover:shadow-[0_0_50px_rgba(214,51,132,0.8)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-3 group/btn overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                    <span className="relative z-10">Publishing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="relative z-10">Publish Question</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-neura-pink/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/3 to-transparent rounded-tr-3xl pointer-events-none"></div>
        </form>
      </main>
    </div>
  );
};

export default NewQuestionPage;

