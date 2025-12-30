import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate email format
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Validate password
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      console.log('Attempting to sign in with email:', email);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        // Provide more helpful error messages
        if (signInError.message.includes('Invalid login credentials') || signInError.message.includes('400')) {
          setError('Invalid email or password. Please check your credentials or sign up if you don\'t have an account.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else if (signInError.message.includes('For security purposes') || signInError.message.includes('429') || signInError.message.includes('Too Many Requests')) {
          const match = signInError.message.match(/(\d+)\s+seconds/);
          const seconds = match ? match[1] : '60';
          setError(`Too many sign-in attempts. Please wait ${seconds} seconds before trying again.`);
        } else {
          setError(signInError.message || 'Authentication failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        console.log('Sign in successful, user:', data.user.email);
        
        // Create user profile in Supabase if it doesn't exist
        // This happens when user confirms email and signs in for the first time
        try {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('users')
            .select('id')
            .eq('id', data.user.id)
            .single();

          if (!existingProfile) {
            // Create profile in Supabase
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || email.split('@')[0],
                email: data.user.email || email.toLowerCase(),
              });

            if (profileError) {
              console.warn('⚠️ Profile creation error:', profileError.message);
            } else {
              console.log('✅ User profile created successfully in Supabase');
            }
          }
        } catch (profileErr: any) {
          console.warn('⚠️ Error checking/creating profile:', profileErr.message);
        }
        
        // Check if user exists in TeamHub, if not create them
        const savedMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
        const existingMember = savedMembers.find((m: any) => m.email === email.toLowerCase());
        
        if (!existingMember) {
          // Create user in TeamHub system
          const teamHubUser = {
            id: 'u-' + data.user.id.substring(0, 8) + '-' + Math.random().toString(36).substr(2, 5),
            name: data.user.user_metadata?.username || data.user.email?.split('@')[0] || email.split('@')[0],
            email: email.toLowerCase(),
            role: "Guest",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.user_metadata?.username || email}`,
            supabaseId: data.user.id
          };
          
          localStorage.setItem('ftc_members', JSON.stringify([...savedMembers, teamHubUser]));
          
          // Set as current user
          localStorage.setItem('ftc_user', JSON.stringify(teamHubUser));
        } else {
          // Update user if needed and set as current user
          const updatedMember = {
            ...existingMember,
            supabaseId: data.user.id,
            email: email.toLowerCase()
          };
          localStorage.setItem('ftc_user', JSON.stringify(updatedMember));
          
          // Update in members list
          const updatedMembers = savedMembers.map((m: any) => 
            m.email === email.toLowerCase() ? updatedMember : m
          );
          localStorage.setItem('ftc_members', JSON.stringify(updatedMembers));
        }
        
        // Redirect based on where user came from
        const returnUrl = new URLSearchParams(window.location.search).get('return') || '/hub';
        console.log('Redirecting to:', returnUrl);
        navigate(returnUrl);
      } else {
        setError('Sign in successful but no user data received. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Unexpected error during sign in:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neura-black text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Enhanced Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neura-black via-neutral-950 to-neura-black"></div>
        
        {/* Animated Gradient Orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neura-pink/15 rounded-full blur-3xl animate-pulse"
          style={{ 
            animation: 'float 8s ease-in-out infinite',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse"
          style={{ 
            animationDelay: '2s',
            animation: 'float 10s ease-in-out infinite',
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ 
            animationDelay: '4s',
            animation: 'float 12s ease-in-out infinite',
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neura-pink/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Enhanced Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 bg-[linear-gradient(rgba(214,51,132,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(214,51,132,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-40 z-0"
        style={{
          transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Enhanced Logo & Branding */}
        <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in">
          <div className="relative group">
            {/* Multiple Glow Layers */}
            <div className="absolute inset-0 bg-neura-pink/40 blur-3xl rounded-2xl animate-pulse group-hover:animate-none"></div>
            <div className="absolute inset-0 bg-neura-pink/20 blur-2xl rounded-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-black via-neutral-900 to-black border-2 border-neura-pink/60 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(214,51,132,0.7)] group-hover:shadow-[0_0_80px_rgba(214,51,132,1)] transition-all duration-700 group-hover:scale-110 group-hover:border-neura-pink group-hover:rotate-3">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-neura-pink via-pink-600 to-neura-pink opacity-0 group-hover:opacity-20 animate-spin-slow" style={{ animationDuration: '3s' }}></div>
              
              <img 
                src="/logos/neura-logo.jpeg" 
                alt="Neura"
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <svg className="hidden w-full h-full p-5 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 25 L45 25 L45 75 L55 25 L75 25 L75 75 L55 75 L55 25 L45 75 L25 75 Z" 
                      fill="none" stroke="#D63384" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                      className="drop-shadow-[0_0_20px_#D63384]" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-5xl font-display font-black bg-gradient-to-r from-white via-neura-pink via-white to-neura-pink bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              NEURA
            </h1>
            <span className="text-xs font-mono text-neura-pink/90 tracking-[0.4em] font-bold mt-1">
              WELCOME BACK
            </span>
          </div>
        </div>

        {/* Enhanced Sign In Form */}
        <div className="relative animate-fade-in-up">
          {/* Multi-layer Glow Effect */}
          <div className="absolute -inset-6 bg-gradient-to-r from-neura-pink/30 via-purple-500/20 to-cyan-500/30 rounded-3xl blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute -inset-4 bg-gradient-to-r from-neura-pink/20 via-purple-500/15 to-cyan-500/20 rounded-3xl blur-2xl opacity-40"></div>
          
          <div className="relative bg-gradient-to-br from-neura-card/98 via-neura-card/95 to-neura-card/98 backdrop-blur-3xl border-2 border-neutral-800/70 rounded-3xl p-10 shadow-[0_0_100px_rgba(214,51,132,0.5)] hover:shadow-[0_0_120px_rgba(214,51,132,0.7)] transition-all duration-500">
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-neura-pink/20 via-transparent to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-neura-pink/30 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-neura-pink/30 rounded-br-3xl"></div>
            
            {/* Decorative Lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neura-pink/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent"></div>
            
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-display font-bold mb-3 bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Sign In
              </h2>
              <p className="text-sm text-gray-400 font-mono tracking-wide">
                Enter your credentials to continue your journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group relative">
                <label className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-neura-pink group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-black border-2 border-neutral-800 hover:border-neura-pink/50 focus:border-neura-pink rounded-xl py-4 px-5 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-neura-pink/40 transition-all text-white !text-white placeholder-gray-500 font-mono group-hover:shadow-[0_0_20px_rgba(214,51,132,0.2)] relative z-10"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neura-pink/0 via-neura-pink/5 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
                </div>
              </div>

              <div className="group relative">
                <label className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-neura-pink group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black border-2 border-neutral-800 hover:border-neura-pink/50 focus:border-neura-pink rounded-xl py-4 px-5 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-neura-pink/40 transition-all text-white !text-white placeholder-gray-500 font-mono tracking-widest group-hover:shadow-[0_0_20px_rgba(214,51,132,0.2)] relative z-10"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neura-pink/0 via-neura-pink/5 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/15 to-red-600/15 border-2 border-red-500/40 text-red-400 text-sm backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 animate-pulse mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <span className="font-medium block mb-1">{error}</span>
                      {error.includes('Invalid email or password') && (
                        <p className="text-xs text-red-300/80 mt-2">
                          Don't have an account?{' '}
                          <Link to="/signup" className="underline hover:text-red-200 transition-colors">
                            Sign up here
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 px-6 rounded-xl bg-gradient-to-r from-neura-pink via-pink-600 to-neura-pink hover:from-pink-600 hover:via-neura-pink hover:to-pink-600 text-white font-display font-bold text-base transition-all shadow-[0_0_50px_rgba(214,51,132,0.7)] hover:shadow-[0_0_80px_rgba(214,51,132,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                    <span className="relative z-10">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Sign In</span>
                    <svg className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Enhanced Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-6 py-2 bg-neura-card/80 backdrop-blur-sm text-gray-500 font-mono border border-neutral-800/50 rounded-full">
                  New to NEURA?
                </span>
              </div>
            </div>

            {/* Enhanced Sign Up Link */}
            <Link
              to="/signup"
              className="block w-full py-4 px-6 rounded-xl border-2 border-neutral-800/70 hover:border-neura-pink/60 bg-neutral-900/40 hover:bg-neutral-900/60 text-gray-300 hover:text-white font-display font-bold text-base transition-all flex items-center justify-center gap-3 group relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/15 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg className="w-5 h-5 relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="relative z-10">Create Account</span>
            </Link>

            {/* Enhanced Back to Home */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-neura-pink transition-colors font-mono inline-flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SignInPage;
