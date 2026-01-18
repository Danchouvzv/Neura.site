import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [useCanvasParticles, setUseCanvasParticles] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Detect low-performance devices and reduce animations
  useEffect(() => {
    const checkPerformance = () => {
      // Check for mobile devices or low-end hardware
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      const hasSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

      const lowPerf = isMobile || hasLowMemory || hasSlowCPU;
      setIsLowPerformance(lowPerf);
      setUseCanvasParticles(!lowPerf); // Disable canvas on low performance devices
    };

    checkPerformance();

    // Throttle mouse move for better performance
    let throttleTimer: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!throttleTimer) {
        throttleTimer = window.setTimeout(() => {
          setMousePosition({ x: e.clientX, y: e.clientY });
          throttleTimer = 0;
        }, 16); // ~60fps
      }
    };

    window.addEventListener('mousemove', throttledMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  // Lightweight Canvas particles effect (only on high-performance devices)
  useEffect(() => {
    if (!useCanvasParticles) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'fixed inset-0 pointer-events-none z-0';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Create fewer, simpler particles
    for (let i = 0; i < 12; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        color: ['#D63384', '#06B6D4'][Math.floor(Math.random() * 2)],
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    let animationId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      // Throttle to ~30fps for better performance
      if (currentTime - lastTime < 33) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw simple particle
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [useCanvasParticles]);

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
        console.error('❌ Sign in error:', signInError);
        console.error('❌ Error details:', {
          message: signInError.message,
          status: signInError.status,
          name: signInError.name,
          stack: signInError.stack
        });

        // Provide more helpful error messages
        let errorMessage = 'Authentication failed. Please try again.';

        if (signInError.message?.includes('Invalid login credentials') || signInError.message?.includes('400')) {
          errorMessage = 'Invalid email or password. Please check your credentials or sign up if you don\'t have an account.';
        } else if (signInError.message?.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before signing in.';
        } else if (signInError.message?.includes('For security purposes') || signInError.message?.includes('429') || signInError.message?.includes('Too Many Requests')) {
          const match = signInError.message?.match(/(\d+)\s+seconds/);
          const seconds = match ? match[1] : '60';
          errorMessage = `Too many sign-in attempts. Please wait ${seconds} seconds before trying again.`;
        } else if (signInError.message?.includes('Network request failed') || signInError.message?.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (signInError.message) {
          errorMessage = signInError.message;
        }

        setError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        console.log('Sign in successful, user:', data.user.email);
        
        // Create user profile in Supabase if it doesn't exist
        // This happens when user confirms email and signs in for the first time
        try {
          // Try to create profile (upsert to handle conflicts)
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || email.split('@')[0],
              email: data.user.email || email.toLowerCase(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (profileError && profileError.code !== '23505') { // Ignore unique constraint violations
            console.warn('⚠️ Profile creation error:', profileError.message);
          } else {
            console.log('✅ User profile created/updated successfully in Supabase');
          }
        } catch (profileErr: any) {
          console.warn('⚠️ Error creating/updating profile:', profileErr.message);
          // Continue anyway - profile is not critical
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
      {/* Performance-aware background effects */}
      {useCanvasParticles ? (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
          {/* Canvas particles will be created dynamically */}
        </div>
      ) : (
        /* Lightweight CSS particle system for low-performance devices */
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(isLowPerformance ? 8 : 15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-neura-pink/40 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      )}

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

        {/* Optimized Floating Geometric Shapes */}
        {[...Array(isLowPerformance ? 4 : 8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-float-simple"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          >
            {i % 4 === 0 && (
              <div className="w-8 h-8 border border-neura-pink/30 rotate-45"></div>
            )}
            {i % 4 === 1 && (
              <div className="w-6 h-6 border border-cyan-500/30 rounded-full"></div>
            )}
            {i % 4 === 2 && (
              <div className="w-7 h-7 border border-purple-500/30 rotate-12"></div>
            )}
            {i % 4 === 3 && (
              <div className="w-5 h-5 bg-neura-pink/20 rounded"></div>
            )}
          </div>
        ))}

        {/* Dynamic Light Rays */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-neura-pink/20 to-transparent"
              style={{
                left: `${20 + i * 15}%`,
                top: 0,
                height: '100%',
                animation: `pulse ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                transform: `rotate(${i * 15}deg)`,
                transformOrigin: 'center',
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 bg-[linear-gradient(rgba(214,51,132,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(214,51,132,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-40 z-0"
        style={{
          transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-2 sm:px-4">
        {/* Enhanced Logo & Branding */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 animate-fade-in">
          <div className="relative group">
            {/* Multiple Glow Layers */}
            <div className="absolute inset-0 bg-neura-pink/40 blur-3xl rounded-2xl animate-pulse group-hover:animate-none"></div>
            <div className="absolute inset-0 bg-neura-pink/20 blur-2xl rounded-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-black via-neutral-900 to-black border-2 border-neura-pink/60 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(214,51,132,0.7)] group-hover:shadow-[0_0_80px_rgba(214,51,132,1)] transition-all duration-700 group-hover:scale-110 group-hover:border-neura-pink group-hover:rotate-3">
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-white via-neura-pink via-white to-neura-pink bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              NEURA
            </h1>
            <span className="text-[10px] sm:text-xs font-mono text-neura-pink/90 tracking-[0.3em] sm:tracking-[0.4em] font-bold mt-1">
              WELCOME BACK
            </span>
          </div>
        </div>

        {/* Performance-aware Sign In Form */}
        <div className="relative animate-fade-in-up">
          {/* Optimized Glow Effects */}
          {!isLowPerformance && (
            <>
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-neura-pink/20 via-purple-500/15 to-cyan-500/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-50 animate-pulse-slow"></div>
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-neura-pink/30 via-transparent to-cyan-500/30 opacity-0 hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
            </>
          )}

          <div className={`relative ${isLowPerformance ? 'bg-neura-card/95' : 'bg-gradient-to-br from-neura-card/98 via-neura-card/95 to-neura-card/98 backdrop-blur-2xl'} border-2 border-neutral-800/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(214,51,132,0.3)] hover:shadow-[0_0_80px_rgba(214,51,132,0.5)] transition-all duration-300 overflow-hidden`}>
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-neura-pink/20 via-transparent to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-t-2 border-l-2 border-neura-pink/30 rounded-tl-2xl sm:rounded-tl-3xl animate-pulse"></div>
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-2xl sm:rounded-tr-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-2xl sm:rounded-bl-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-b-2 border-r-2 border-neura-pink/30 rounded-br-2xl sm:rounded-br-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>

            {/* Decorative Lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neura-pink/60 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>

            {/* Optimized Background Pattern */}
            {!isLowPerformance && (
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(214,51,132,0.1)_0%,_transparent_50%)] animate-pulse-slow"></div>
              </div>
            )}

            {/* Optimized Floating Tech Icons */}
            {[...Array(isLowPerformance ? 3 : 6)].map((_, i) => (
              <div
                key={i}
                className="absolute opacity-15 text-neura-pink animate-float-simple"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 2) * 60}%`,
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: `${3 + i * 0.5}s`,
                }}
              >
                {i % 6 === 0 && <span className="text-lg">⚡</span>}
                {i % 6 === 1 && <span className="text-lg">🔧</span>}
                {i % 6 === 2 && <span className="text-lg">⚙️</span>}
                {i % 6 === 3 && <span className="text-lg">🚀</span>}
                {i % 6 === 4 && <span className="text-lg">🤖</span>}
                {i % 6 === 5 && <span className="text-lg">⚡</span>}
              </div>
            ))}
            
            <div className="mb-6 sm:mb-8 text-center relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Sign In
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-mono tracking-wide">
                Enter your credentials to continue your journey
              </p>

              {/* Performance Toggle */}
              <div className="absolute top-0 right-0 flex items-center gap-2">
                <button
                  onClick={() => {
                    setUseCanvasParticles(!useCanvasParticles);
                    setIsLowPerformance(!isLowPerformance);
                  }}
                  className="px-2 py-1 rounded-lg bg-neutral-800/50 border border-neutral-700 text-xs font-mono text-gray-400 hover:text-neura-pink hover:border-neura-pink/50 transition-all"
                  title={isLowPerformance ? "Enable enhanced effects" : "Disable for better performance"}
                >
                  {isLowPerformance ? "⚡" : "🎨"}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="group relative">
                <label className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 text-neura-pink group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="group-hover:text-neura-pink transition-colors">Email Address</span>
                  <div className="w-8 h-px bg-gradient-to-r from-neura-pink/0 via-neura-pink/50 to-neura-pink/0 group-hover:from-neura-pink group-hover:to-neura-pink transition-all duration-500"></div>
                </label>
                <div className="relative">
                  {/* Animated background particles for input */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-neura-pink/30 rounded-full animate-ping"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + (i % 2) * 40}%`,
                          animationDelay: `${i * 0.5}s`,
                          animationDuration: '2s',
                        }}
                      ></div>
                    ))}
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-black/80 backdrop-blur-sm border-2 border-neutral-800 hover:border-neura-pink/50 focus:border-neura-pink rounded-xl py-3 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-neura-pink/40 transition-all text-white !text-white placeholder-gray-500 font-mono group-hover:shadow-[0_0_20px_rgba(214,51,132,0.2)] group-hover:bg-black/90 relative z-10 min-h-[44px] group-hover:scale-[1.01] transform duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neura-pink/0 via-neura-pink/5 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
                  {/* Animated cursor effect */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-neura-pink animate-pulse opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
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
                    className="w-full bg-black border-2 border-neutral-800 hover:border-neura-pink/50 focus:border-neura-pink rounded-xl py-3 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-neura-pink/40 transition-all text-white !text-white placeholder-gray-500 font-mono tracking-widest group-hover:shadow-[0_0_20px_rgba(214,51,132,0.2)] relative z-10 min-h-[44px]"
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
                      <span className="font-medium block mb-1">{typeof error === 'string' ? error : error?.message || 'An error occurred'}</span>
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
                className="w-full py-4 sm:py-5 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-neura-pink via-pink-600 to-neura-pink hover:from-pink-600 hover:via-neura-pink hover:to-pink-600 text-white font-display font-bold text-sm sm:text-base transition-all shadow-[0_0_50px_rgba(214,51,132,0.7)] hover:shadow-[0_0_80px_rgba(214,51,132,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
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
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          75% { transform: translateY(-10px) rotate(270deg); }
        }
        @keyframes shapeMorph {
          0%, 100% { border-radius: 50%; transform: rotate(0deg) scale(1); }
          25% { border-radius: 0%; transform: rotate(90deg) scale(1.1); }
          50% { border-radius: 25%; transform: rotate(180deg) scale(0.9); }
          75% { border-radius: 75%; transform: rotate(270deg) scale(1.05); }
        }
        @keyframes wavePulse {
          0%, 100% { opacity: 0.2; transform: scaleX(1); }
          50% { opacity: 0.6; transform: scaleX(1.2); }
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
        .animate-particle-float {
          animation: particleFloat 6s ease-in-out infinite;
        }
        .animate-shape-morph {
          animation: shapeMorph 8s ease-in-out infinite;
        }
        .animate-wave-pulse {
          animation: wavePulse 4s ease-in-out infinite;
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
        .animate-float-simple {
          animation: floatSimple 6s ease-in-out infinite;
        }
        .animate-float-particle {
          animation: floatParticle 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s ease-in-out infinite;
        }
        @keyframes floatSimple {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          33% { transform: translateY(-8px) translateX(4px) scale(1.1); }
          66% { transform: translateY(4px) translateX(-4px) scale(0.9); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SignInPage;
