import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

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
      {/* Ultra Creative Fixed Navigation - Same as Landing */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neura-pink/20 via-purple-500/20 to-neura-pink/20 rounded-3xl blur-xl opacity-50"></div>
        
        <div className="relative bg-gradient-to-br from-neura-black/95 via-neura-black/90 to-neura-black/95 backdrop-blur-2xl border border-neutral-800/60 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/20 to-neura-pink/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group relative">
                <div className="absolute -inset-2 bg-neura-pink/10 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-0 bg-neura-pink/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-black via-neutral-900 to-black border-2 border-neutral-800 group-hover:border-neura-pink/60 transition-all duration-300 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-[0_0_20px_rgba(214,51,132,0.5)] group-hover:scale-105">
                    <img 
                      src="/logos/neura-logo.jpeg" 
                      alt="Neura"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <svg className="hidden w-full h-full p-2.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 25 L45 25 L45 75 L55 25 L75 25 L75 75 L55 75 L55 25 L45 75 L25 75 Z" 
                            fill="none" stroke="#D63384" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                            className="drop-shadow-[0_0_15px_#D63384]" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-display font-bold bg-gradient-to-r from-white via-white to-gray-300 group-hover:from-neura-pink group-hover:via-white group-hover:to-neura-pink bg-clip-text text-transparent transition-all duration-300">
                    NEURA
                  </span>
                  <span className="text-[9px] font-mono text-neura-pink/80 tracking-wider">FTC TEAM</span>
                </div>
              </Link>
              
              {/* Navigation Buttons */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Back to Questions */}
                <button
                  onClick={() => navigate('/qa')}
                  className="px-4 py-2 rounded-xl border border-neutral-800 hover:border-neura-pink/50 bg-neutral-900/30 hover:bg-neutral-900/50 text-gray-300 hover:text-white text-sm font-display font-bold transition-all flex items-center gap-2 group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden md:inline">Back</span>
                </button>
                
                {/* Map Button */}
                <Link
                  to="/map"
                  className="relative px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neura-pink/60 bg-gradient-to-br from-neutral-900/40 to-neutral-900/20 hover:from-neutral-900/60 hover:to-neutral-900/40 text-gray-300 hover:text-white text-sm font-display font-bold transition-all flex items-center gap-2 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/10 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <svg className="w-4 h-4 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="relative z-10">Map</span>
                </Link>
                
                {/* Forum Button - Active */}
                <Link
                  to="/qa"
                  className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-neura-pink to-pink-600 hover:from-pink-600 hover:to-neura-pink text-white text-sm font-display font-bold transition-all shadow-[0_0_25px_rgba(214,51,132,0.5)] hover:shadow-[0_0_40px_rgba(214,51,132,0.8)] flex items-center gap-2 group overflow-hidden hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <svg className="w-4 h-4 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="relative z-10">Forum</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed nav */}
      <div className="h-24"></div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
              Question Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              className="w-full bg-neura-card border border-neutral-800 rounded-xl py-4 px-4 text-lg focus:outline-none focus:border-neura-pink/50 focus:ring-1 focus:ring-neura-pink/50 transition-all text-white placeholder-gray-600 font-display font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
              Details
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Provide more details about your question..."
              rows={12}
              className="w-full bg-neura-card border border-neutral-800 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-neura-pink/50 focus:ring-1 focus:ring-neura-pink/50 transition-all text-white placeholder-gray-600 resize-none leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !body.trim()}
              className="px-8 py-4 rounded-xl bg-neura-pink hover:bg-neura-pink/90 text-white text-sm font-display font-bold transition-all shadow-[0_0_20px_rgba(214,51,132,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                'Publish Question'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/qa')}
              className="px-6 py-4 rounded-xl border border-neutral-800 hover:border-neura-pink/50 text-gray-400 hover:text-white text-sm font-display font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewQuestionPage;

