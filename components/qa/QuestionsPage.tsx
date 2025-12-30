import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Question } from '../../types';
import SharedNavBar from '../shared/SharedNavBar';

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
      {/* Shared Navigation Bar */}
      <SharedNavBar user={user} />
      
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
                onClick={() => window.location.href = '/signin?return=/qa'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neura-pink to-pink-600 hover:from-pink-600 hover:to-neura-pink text-white text-sm font-display font-bold transition-all shadow-[0_0_30px_rgba(214,51,132,0.6)] hover:shadow-[0_0_50px_rgba(214,51,132,0.9)] hover:scale-105"
              >
                Sign In to Ask
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {questions.map((question, index) => (
              <Link
                key={question.id}
                to={`/qa/${question.id}`}
                className="group block relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Enhanced glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-neura-pink/0 via-neura-pink/30 to-neura-pink/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                
                {/* Enhanced Card */}
                <div className="relative bg-gradient-to-br from-black/90 via-neutral-950/90 to-black/90 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-6 md:p-8 hover:border-neura-pink/60 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(214,51,132,0.3)] hover:scale-[1.02] overflow-hidden group">
                  {/* Multi-layer animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/10 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Accent line on the left */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neura-pink/0 via-neura-pink/60 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header with improved typography */}
                    <div className="flex items-start justify-between gap-6 mb-5">
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Question Title - Enhanced */}
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-neura-pink group-hover:via-white group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500 leading-tight">
                          {question.title}
                        </h2>
                        
                        {/* Question Body - Better readability */}
                        <p className="text-base md:text-lg text-gray-300/90 leading-relaxed line-clamp-3 group-hover:text-gray-100 transition-colors duration-300">
                          {question.body}
                        </p>
                      </div>
                      
                      {/* Enhanced Arrow indicator */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neura-pink/20 to-purple-500/20 border-2 border-neura-pink/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-neura-pink/20">
                          <svg className="w-6 h-6 text-neura-pink group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-neutral-800/60 group-hover:border-neura-pink/30 transition-colors duration-300">
                      <div className="flex items-center gap-5 flex-wrap">
                        {/* Enhanced Author Badge */}
                        <div className="flex items-center gap-3 group/author">
                          <div className="relative">
                            <div className="absolute inset-0 bg-neura-pink/30 rounded-full blur-md opacity-0 group-hover/author:opacity-100 transition-opacity"></div>
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neura-pink/30 via-purple-500/20 to-cyan-500/20 border-2 border-neura-pink/40 flex items-center justify-center shadow-lg">
                              <span className="text-sm font-display font-black text-neura-pink">
                                {(question.author_username || 'A')[0].toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-display font-bold text-white group-hover/author:text-neura-pink transition-colors">
                              {question.author_username || 'Anonymous'}
                            </span>
                            <span className="text-xs font-mono text-gray-400 group-hover/author:text-gray-300 transition-colors">
                              {formatDate(question.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Question badge */}
                        <div className="px-3 py-1.5 rounded-lg bg-neura-pink/10 border border-neura-pink/20 group-hover:bg-neura-pink/20 group-hover:border-neura-pink/40 transition-all">
                          <span className="text-xs font-mono font-bold text-neura-pink">Q&A</span>
                        </div>
                      </div>
                      
                      {/* Enhanced View indicator */}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/50 border border-neutral-800/50 group-hover:border-neura-pink/30 group-hover:bg-neura-pink/5 transition-all">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-neura-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-neura-pink transition-colors">View</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced decorative corner accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neura-pink/5 via-purple-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/3 to-transparent rounded-tr-3xl pointer-events-none"></div>
                  
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
};

export default QuestionsPage;

