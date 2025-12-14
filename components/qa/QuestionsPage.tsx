import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Question } from '../../types';
import AuthPage from './AuthPage';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    loadQuestions();
    checkUser();

    // Listen for auth changes
    supabase.auth.onAuthStateChange(() => {
      checkUser();
    });
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      // Try to use view with author, fallback to regular table
      const { data, error } = await supabase
        .from('questions_with_author')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback to questions table if view doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        setQuestions(fallbackData || []);
      } else {
        setQuestions(data || []);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    checkUser();
    // Redirect to map after successful auth
    window.location.href = '/map';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-neura-black text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neura-black via-neura-black to-neutral-950"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neura-pink/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(214,51,132,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(214,51,132,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-50"></div>
      
      <div className="relative z-10">
      {/* Ultra Creative Fixed Navigation - Same as Landing */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neura-pink/20 via-purple-500/20 to-neura-pink/20 rounded-3xl blur-xl opacity-50"></div>
        
        <div className="relative bg-gradient-to-br from-neura-black/95 via-neura-black/90 to-neura-black/95 backdrop-blur-2xl border border-neutral-800/60 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/20 to-neura-pink/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo with enhanced effects */}
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
              
              {/* Enhanced Navigation Buttons */}
              <div className="flex items-center gap-2 md:gap-3">
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
                
                {user ? (
                  <>
                    {/* New Question Button */}
                    <Link
                      to="/qa/new"
                      className="relative px-4 md:px-5 py-2.5 rounded-xl bg-gradient-to-r from-neura-pink/80 to-pink-600/80 hover:from-pink-600 hover:to-neura-pink text-white text-xs md:text-sm font-display font-bold transition-all shadow-[0_0_20px_rgba(214,51,132,0.4)] hover:shadow-[0_0_30px_rgba(214,51,132,0.6)] flex items-center gap-2 group overflow-hidden hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <svg className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="relative z-10 hidden sm:inline">New</span>
                    </Link>
                    
                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="relative px-4 py-2.5 rounded-xl border-2 border-neura-pink/50 hover:border-neura-pink bg-neura-pink/10 hover:bg-neura-pink/20 text-neura-pink hover:text-white text-sm font-display font-bold transition-all flex items-center gap-2 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/20 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <svg className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="hidden md:inline relative z-10">Out</span>
                    </button>
                  </>
                ) : (
                  /* Sign In Button */
                  <button
                    onClick={() => setShowAuth(true)}
                    className="relative px-5 py-2.5 rounded-xl border-2 border-neura-pink/50 hover:border-neura-pink bg-neura-pink/10 hover:bg-neura-pink/20 text-neura-pink hover:text-white text-sm font-display font-bold transition-all flex items-center gap-2 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/20 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <svg className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="relative z-10">Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed nav */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-12">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neura-pink/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent">
                Community Forum
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6">
              Ask questions, share knowledge, and connect with the FTC community
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neura-card/50 border border-neutral-800">
                <svg className="w-5 h-5 text-neura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-display font-bold text-white">
                  {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                </span>
              </div>
              
              {user && (
                <Link
                  to="/qa/new"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neura-pink to-pink-600 hover:from-pink-600 hover:to-neura-pink text-white text-sm font-display font-bold transition-all shadow-[0_0_25px_rgba(214,51,132,0.5)] hover:shadow-[0_0_40px_rgba(214,51,132,0.8)] flex items-center gap-2 group hover:scale-105"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ask Question
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-neura-pink/20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-neura-pink border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-400 text-sm font-mono">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neura-pink/10 to-purple-500/10 flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-neura-pink/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">No questions yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Be the first to start a discussion and help build our community!
            </p>
            {user ? (
              <Link
                to="/qa/new"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neura-pink to-pink-600 hover:from-pink-600 hover:to-neura-pink text-white text-sm font-display font-bold transition-all shadow-[0_0_30px_rgba(214,51,132,0.6)] hover:shadow-[0_0_50px_rgba(214,51,132,0.9)] hover:scale-105 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Ask the first question
              </Link>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neura-pink to-pink-600 hover:from-pink-600 hover:to-neura-pink text-white text-sm font-display font-bold transition-all shadow-[0_0_30px_rgba(214,51,132,0.6)] hover:shadow-[0_0_50px_rgba(214,51,132,0.9)] hover:scale-105"
              >
                Sign In to Ask
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Link
                key={question.id}
                to={`/qa/${question.id}`}
                className="group block relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neura-pink/0 via-neura-pink/20 to-neura-pink/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                
                {/* Card */}
                <div className="relative bg-gradient-to-br from-neura-card/80 via-neura-card/60 to-neura-card/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 md:p-8 hover:border-neura-pink/50 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(214,51,132,0.2)] hover:scale-[1.01] overflow-hidden">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/5 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-3 group-hover:text-neura-pink transition-colors duration-300 leading-tight">
                          {question.title}
                        </h2>
                        <p className="text-sm md:text-base text-gray-300 leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors">
                          {question.body}
                        </p>
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-neura-pink/10 border border-neura-pink/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-neura-pink group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neura-pink/20 to-purple-500/20 border border-neura-pink/30 flex items-center justify-center">
                            <span className="text-xs font-display font-bold text-neura-pink">
                              {(question.author_username || 'A')[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-display font-bold text-white">
                              {question.author_username || 'Anonymous'}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                              {formatDate(question.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* View indicator */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-neura-pink transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-mono">View</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-neura-pink/5 to-transparent rounded-bl-2xl pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default QuestionsPage;

