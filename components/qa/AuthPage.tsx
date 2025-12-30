import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        if (data.user) {
          // Check if user exists in TeamHub, if not create them
          const savedMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
          const existingMember = savedMembers.find((m: any) => m.email === email);
          
          if (!existingMember) {
            // Create user in TeamHub system
            const teamHubUser = {
              id: 'u-' + data.user.id.substring(0, 8) + '-' + Math.random().toString(36).substr(2, 5),
              name: data.user.user_metadata?.username || email.split('@')[0],
              email: email,
              role: "Guest",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.user_metadata?.username || email}`,
              supabaseId: data.user.id
            };
            
            localStorage.setItem('ftc_members', JSON.stringify([...savedMembers, teamHubUser]));
            
            // Set as current user if not already logged in
            const currentUser = localStorage.getItem('ftc_user');
            if (!currentUser) {
              localStorage.setItem('ftc_user', JSON.stringify(teamHubUser));
            }
          } else {
            // Update user if needed and set as current user
            const currentUser = localStorage.getItem('ftc_user');
            if (!currentUser || JSON.parse(currentUser).email !== email) {
              localStorage.setItem('ftc_user', JSON.stringify(existingMember));
            }
          }
          
          onAuthSuccess();
        }
      } else {
        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Create user profile in Supabase
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              username: username || email.split('@')[0],
              email: email,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          // Also register user in TeamHub system
          const teamHubUser = {
            id: 'u-' + data.user.id.substring(0, 8) + '-' + Math.random().toString(36).substr(2, 5),
            name: username || email.split('@')[0],
            email: email,
            role: "Guest",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || email}`,
            supabaseId: data.user.id // Link to Supabase user
          };

          // Save to TeamHub members list
          const savedMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
          const existingMember = savedMembers.find((m: any) => m.email === email);
          if (!existingMember) {
            localStorage.setItem('ftc_members', JSON.stringify([...savedMembers, teamHubUser]));
          }

          // Also save as current user if not already logged in
          const currentUser = localStorage.getItem('ftc_user');
          if (!currentUser) {
            localStorage.setItem('ftc_user', JSON.stringify(teamHubUser));
          }

          onAuthSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-0 bg-transparent p-4">
      <div className="w-full max-w-md relative">
        {/* Animated background glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-neura-pink/20 via-purple-500/20 to-neura-pink/20 rounded-3xl blur-2xl opacity-50"></div>
        
        <div className="relative">
          {/* Logo & Branding - Enhanced */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-neura-pink/20 blur-xl rounded-xl animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-black via-neutral-900 to-black border-2 border-neura-pink/50 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(214,51,132,0.5)]">
                <img 
                  src="/logos/neura-logo.jpeg" 
                  alt="Neura"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <svg className="hidden w-full h-full p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 25 L45 25 L45 75 L55 25 L75 25 L75 75 L55 75 L55 25 L45 75 L25 75 Z" 
                        fill="none" stroke="#D63384" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                        className="drop-shadow-[0_0_15px_#D63384]" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent">
                NEURA
              </h1>
              <span className="text-xs font-mono text-neura-pink tracking-[0.2em] font-bold">
                JOIN THE COMMUNITY
              </span>
            </div>
          </div>

          {/* Auth Form - Ultra Creative */}
          <div className="bg-gradient-to-br from-neura-card/95 via-neura-card/90 to-neura-card/95 backdrop-blur-2xl border border-neutral-800/60 rounded-2xl p-8 shadow-[0_0_60px_rgba(214,51,132,0.3)] relative overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/5 via-transparent to-neura-pink/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Tab Switcher - Enhanced */}
              <div className="flex gap-2 mb-8 p-1 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-display font-bold transition-all relative overflow-hidden group ${
                    isLogin
                      ? 'bg-gradient-to-r from-neura-pink to-pink-600 text-white shadow-[0_0_20px_rgba(214,51,132,0.5)]'
                      : 'bg-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {isLogin && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Sign In
                  </span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-display font-bold transition-all relative overflow-hidden group ${
                    !isLogin
                      ? 'bg-gradient-to-r from-neura-pink to-pink-600 text-white shadow-[0_0_20px_rgba(214,51,132,0.5)]'
                      : 'bg-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {!isLogin && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="group">
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full bg-gradient-to-br from-black/60 to-neutral-900/40 border border-neutral-800 hover:border-neura-pink/30 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-neura-pink/60 focus:ring-2 focus:ring-neura-pink/30 transition-all text-white placeholder-gray-500 font-mono"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="group">
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-gradient-to-br from-black/60 to-neutral-900/40 border border-neutral-800 hover:border-neura-pink/30 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-neura-pink/60 focus:ring-2 focus:ring-neura-pink/30 transition-all text-white placeholder-gray-500 font-mono"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gradient-to-br from-black/60 to-neutral-900/40 border border-neutral-800 hover:border-neura-pink/30 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-neura-pink/60 focus:ring-2 focus:ring-neura-pink/30 transition-all text-white placeholder-gray-500 font-mono tracking-widest"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-shake">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-neura-pink via-pink-600 to-neura-pink hover:from-pink-600 hover:via-neura-pink hover:to-pink-600 text-white font-display font-bold text-sm transition-all shadow-[0_0_30px_rgba(214,51,132,0.6)] hover:shadow-[0_0_50px_rgba(214,51,132,0.9)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                      <span className="relative z-10">{isLogin ? 'Signing in...' : 'Signing up...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

