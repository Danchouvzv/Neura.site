import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Question, Answer } from '../../types';
import SharedNavBar from '../shared/SharedNavBar';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerText, setAnswerText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadQuestion();
      loadAnswers();
      checkUser();
    }
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };


  const loadQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from('questions_with_author')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // Fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('questions')
          .select('*')
          .eq('id', id)
          .single();

        if (fallbackError) throw fallbackError;
        setQuestion(fallbackData);
      } else {
        setQuestion(data);
      }
    } catch (err) {
      console.error('Error loading question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from('answers_with_author')
        .select('*')
        .eq('question_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        // Fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('answers')
          .select('*')
          .eq('question_id', id)
          .order('created_at', { ascending: true });

        if (fallbackError) throw fallbackError;
        setAnswers(fallbackData || []);
      } else {
        setAnswers(data || []);
      }
    } catch (err) {
      console.error('Error loading answers:', err);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !answerText.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('answers').insert({
        question_id: id,
        author_id: user.id,
        body: answerText.trim(),
      });

      if (error) throw error;

      setAnswerText('');
      loadAnswers();
    } catch (err: any) {
      alert(err.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neura-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neura-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-neura-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Question not found</div>
          <Link to="/qa" className="text-neura-pink hover:underline">
            Back to questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neura-black text-white">
      {/* Shared Navigation Bar */}
      <SharedNavBar user={user} />
      
      {/* Spacer for fixed nav */}
      <div className="h-24"></div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Enhanced Question Card */}
        <div className="relative bg-gradient-to-br from-black/90 via-neutral-950/90 to-black/90 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-8 md:p-10 mb-8 overflow-hidden group">
          {/* Decorative effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/5 via-purple-500/3 to-cyan-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neura-pink/0 via-neura-pink/60 to-neura-pink/0"></div>
          
          {/* Question Title - Enhanced */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white mb-6 leading-tight bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
            {question.title}
          </h1>
          
          {/* Question Body - Better readability */}
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed whitespace-pre-wrap">
              {question.body}
            </p>
          </div>
          
          {/* Enhanced Author Info */}
          <div className="flex items-center gap-4 pt-6 border-t border-neutral-800/60">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-neura-pink/30 rounded-xl blur-md"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-neura-pink/30 via-purple-500/20 to-cyan-500/20 border-2 border-neura-pink/40 flex items-center justify-center shadow-lg">
                  <span className="text-lg font-display font-black text-neura-pink">
                    {(question.author_username || 'A')[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-display font-bold text-white">
                  {question.author_username || 'Anonymous'}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {formatDate(question.created_at)}
                </span>
              </div>
            </div>
            
            {/* Question badge */}
            <div className="ml-auto px-4 py-2 rounded-xl bg-neura-pink/10 border border-neura-pink/20">
              <span className="text-xs font-mono font-bold text-neura-pink">QUESTION</span>
            </div>
          </div>
          
          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-neura-pink/5 via-purple-500/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
        </div>

        {/* Enhanced Answers Section */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {answers.length}
              </span>
              <span className="text-gray-400 ml-2">
                {answers.length === 1 ? 'Answer' : 'Answers'}
              </span>
            </h2>
          </div>
          
          {answers.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-gradient-to-br from-black/50 to-neutral-950/50 border border-neutral-800/50">
              <div className="w-16 h-16 rounded-2xl bg-neura-pink/10 border border-neura-pink/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neura-pink/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-400 mb-2">No answers yet</p>
              <p className="text-sm text-gray-500">Be the first to answer this question!</p>
            </div>
          ) : (
            answers.map((answer, index) => (
              <div
                key={answer.id}
                className="relative bg-gradient-to-br from-black/80 via-neutral-950/80 to-black/80 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-6 md:p-8 hover:border-neura-pink/40 transition-all duration-300 overflow-hidden group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/40 to-cyan-500/0"></div>
                
                {/* Answer Content */}
                <div className="relative z-10">
                  <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-6 whitespace-pre-wrap">
                    {answer.body}
                  </p>
                  
                  {/* Enhanced Author Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-md"></div>
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-2 border-cyan-500/30 flex items-center justify-center">
                          <span className="text-sm font-display font-black text-cyan-400">
                            {(answer.author_username || 'A')[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-display font-bold text-white">
                          {answer.author_username || 'Anonymous'}
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                          {formatDate(answer.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Answer badge */}
                    <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-xs font-mono font-bold text-cyan-400">ANSWER</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/3 to-transparent rounded-bl-3xl pointer-events-none"></div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Answer Form */}
        {user ? (
          <form onSubmit={handleSubmitAnswer} className="relative bg-gradient-to-br from-black/90 via-neutral-950/90 to-black/90 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-8 md:p-10 overflow-hidden group">
            {/* Decorative effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/5 via-purple-500/3 to-cyan-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neura-pink/0 via-neura-pink/60 to-neura-pink/0"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Your Answer
                </span>
              </h3>
              <p className="text-sm text-gray-400 mb-6">Share your knowledge and help the community</p>
              
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your detailed answer here... Be helpful and clear!"
                rows={8}
                className="w-full bg-black/50 border-2 border-neutral-800/80 rounded-2xl py-4 px-5 text-white placeholder-gray-500 focus:outline-none focus:border-neura-pink/60 focus:ring-2 focus:ring-neura-pink/20 transition-all resize-none mb-6 text-base leading-relaxed"
                required
              />
              
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !answerText.trim()}
                  className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-neura-pink to-pink-600 hover:from-pink-600 hover:to-neura-pink text-white text-sm font-display font-bold transition-all shadow-[0_0_30px_rgba(214,51,132,0.5)] hover:shadow-[0_0_50px_rgba(214,51,132,0.8)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2 group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                      <span className="relative z-10">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="relative z-10">Submit Answer</span>
                    </>
                  )}
                </button>
                
                <div className="text-xs text-gray-500 font-mono">
                  {answerText.length} characters
                </div>
              </div>
            </div>
            
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-neura-pink/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
          </form>
        ) : (
          <div className="relative bg-gradient-to-br from-black/80 via-neutral-950/80 to-black/80 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-8 md:p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/5 via-purple-500/3 to-cyan-500/3"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-neura-pink/10 border border-neura-pink/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-lg text-gray-300 mb-2 font-display font-bold">Sign in to answer</p>
              <p className="text-sm text-gray-400 mb-6">Join the discussion and share your knowledge</p>
              <Link
                to={`/signin?return=${encodeURIComponent(window.location.pathname)}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neura-pink to-pink-600 hover:from-pink-600 hover:to-neura-pink text-white text-sm font-display font-bold transition-all shadow-[0_0_30px_rgba(214,51,132,0.5)] hover:shadow-[0_0_50px_rgba(214,51,132,0.8)] hover:scale-105 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestionDetailPage;

