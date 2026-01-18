import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [particleCount, setParticleCount] = useState(25);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [useCanvasParticles, setUseCanvasParticles] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  }, []);

  // Animated particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      shape: 'circle' | 'square' | 'triangle';
    }> = [];

    // Create particles with different shapes
    for (let i = 0; i < particleCount; i++) {
      const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 1,
        color: ['#06B6D4', '#D63384', '#8B5CF6', '#10B981'][Math.floor(Math.random() * 4)],
        alpha: Math.random() * 0.7 + 0.3,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle based on shape
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 0.5;

        if (particle.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.shape === 'square') {
          ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
        } else if (particle.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y - particle.size/2);
          ctx.lineTo(particle.x - particle.size/2, particle.y + particle.size/2);
          ctx.lineTo(particle.x + particle.size/2, particle.y + particle.size/2);
          ctx.closePath();
          ctx.fill();
        }

        // Draw glow
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles with lines
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 120) * 0.2;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [particleCount]);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

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

      console.log('Attempting to sign up with email:', email);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
        console.error('❌ Error details:', {
          message: signUpError.message,
          status: signUpError.status,
          name: signUpError.name,
          stack: signUpError.stack
        });

        // Provide more helpful error messages
        let errorMessage = 'Registration failed. Please try again.';

        if (signUpError.message?.includes('User already registered') || signUpError.message?.includes('already been registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else if (signUpError.message?.includes('Password')) {
          errorMessage = 'Password is too weak. Please use a stronger password.';
        } else if (signUpError.message?.includes('For security purposes') || signUpError.message?.includes('429') || signUpError.message?.includes('Too Many Requests')) {
          const match = signUpError.message?.match(/(\d+)\s+seconds/);
          const seconds = match ? match[1] : '60';
          errorMessage = `Too many registration attempts. Please wait ${seconds} seconds before trying again.`;
        } else if (signUpError.message?.includes('Network request failed') || signUpError.message?.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (signUpError.message?.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (signUpError.message) {
          errorMessage = signUpError.message;
        }

        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log('Sign up successful, user:', data.user.email);
        
        // Create user profile in Supabase (optional, may fail if table doesn't exist or RLS is blocking)
        // This is non-critical - we'll still create the user in TeamHub localStorage
        // Note: Profile creation might fail if email is not confirmed yet (401 Unauthorized)
        // In that case, profile will be created when user confirms email and signs in
        try {
          // Wait a bit for auth session to be established
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Use upsert instead of insert to handle conflicts
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              username: username || email.split('@')[0],
              email: email.toLowerCase(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (profileError && profileError.code !== '23505') { // Ignore unique constraint violations
            console.warn('⚠️ Profile creation error (non-critical):', profileError.message);
            if (profileError.code === 'PGRST301' || profileError.message.includes('401') || profileError.message.includes('Unauthorized')) {
              console.log('ℹ️ Profile will be created when user confirms email and signs in');
            }
          } else {
            console.log('✅ User profile created/updated successfully in Supabase');
          }
        } catch (profileErr: any) {
          console.warn('⚠️ Profile creation failed (non-critical):', profileErr.message);
          // Continue with registration even if profile creation fails
        }

        // Also register user in TeamHub system
        const teamHubUser = {
          id: 'u-' + data.user.id.substring(0, 8) + '-' + Math.random().toString(36).substr(2, 5),
          name: username || email.split('@')[0],
          email: email.toLowerCase(),
          role: "Guest",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || email}`,
          supabaseId: data.user.id
        };

        // Save to TeamHub members list
        const savedMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
        const existingMember = savedMembers.find((m: any) => m.email === email.toLowerCase());
        if (!existingMember) {
          localStorage.setItem('ftc_members', JSON.stringify([...savedMembers, teamHubUser]));
        }

        // Set as current user
        localStorage.setItem('ftc_user', JSON.stringify(teamHubUser));

        // Check if email confirmation is required
        if (data.session) {
          // User is immediately signed in
          console.log('User signed in immediately');
          const returnUrl = new URLSearchParams(window.location.search).get('return') || '/hub';
          navigate(returnUrl);
        } else {
          // Email confirmation required
          setError('Registration successful! Please check your email to confirm your account before signing in.');
          setIsLoading(false);
        }
      } else {
        setError('Registration successful but no user data received. Please check your email for confirmation.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Unexpected error during sign up:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'from-red-500 to-red-600';
    if (passwordStrength < 75) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="min-h-screen bg-neura-black text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.7 }}
      />

      {/* Enhanced Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neura-black via-neutral-950 to-neura-black"></div>

        {/* Animated Gradient Orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse"
          style={{
            animation: 'float 8s ease-in-out infinite',
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-neura-pink/15 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: '2s',
            animation: 'float 10s ease-in-out infinite',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: '4s',
            animation: 'float 12s ease-in-out infinite',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>

        {/* Optimized Floating Shapes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10 animate-float-simple"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          >
            {i % 3 === 0 && (
              <div className="w-8 h-8 border border-cyan-500/20 rounded-full"></div>
            )}
            {i % 3 === 1 && (
              <div className="w-6 h-6 border border-neura-pink/20 rotate-45"></div>
            )}
            {i % 3 === 2 && (
              <div className="w-7 h-7 bg-gradient-to-br from-cyan-500/10 to-neura-pink/10 rounded"></div>
            )}
          </div>
        ))}

        {/* Dynamic Wave Patterns */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse"
              style={{
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 1.5}s`,
                transform: `skew(${i * 5}deg)`,
              }}
            ></div>
          ))}
        </div>

        {/* Minimal Floating Elements */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-15 animate-float-simple"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${4 + i * 0.8}s`,
            }}
          >
            {i % 4 === 0 && <span className="text-lg">⚡</span>}
            {i % 4 === 1 && <span className="text-lg">🚀</span>}
            {i % 4 === 2 && <span className="text-lg">🔥</span>}
            {i % 4 === 3 && <span className="text-lg">💎</span>}
          </div>
        ))}
      </div>

      {/* Enhanced Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-40 z-0"
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
            <div className="absolute inset-0 bg-cyan-500/40 blur-3xl rounded-2xl animate-pulse group-hover:animate-none"></div>
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-black via-neutral-900 to-black border-2 border-cyan-500/60 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.7)] group-hover:shadow-[0_0_80px_rgba(6,182,212,1)] transition-all duration-700 group-hover:scale-110 group-hover:border-cyan-400 group-hover:rotate-3">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 animate-spin-slow" style={{ animationDuration: '3s' }}></div>
              
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
                      fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                      className="drop-shadow-[0_0_20px_#06b6d4]" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-white via-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              NEURA
            </h1>
            <span className="text-[10px] sm:text-xs font-mono text-cyan-400/90 tracking-[0.3em] sm:tracking-[0.4em] font-bold mt-1">
              JOIN THE FUTURE
            </span>
          </div>
        </div>

        {/* Performance-aware Sign Up Form */}
        <div className="relative animate-fade-in-up">
          {/* Optimized Glow Effects */}
          <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-cyan-500/20 via-purple-500/15 to-neura-pink/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-50 animate-pulse-slow"></div>

          <div className="relative bg-gradient-to-br from-neura-card/98 via-neura-card/95 to-neura-card/98 backdrop-blur-2xl border-2 border-neutral-800/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(6,182,212,0.3)] hover:shadow-[0_0_80px_rgba(6,182,212,0.5)] transition-all duration-300">
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-500/20 via-transparent to-neura-pink/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            
            {/* Simplified Corner Elements */}
            <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl animate-pulse-slow"></div>
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-neura-pink/30 rounded-tr-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-neura-pink/30 rounded-bl-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

            {/* Animated Matrix-style Background */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="matrix" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="2" y="2" width="16" height="16" fill="none" stroke="#06B6D4" strokeWidth="0.2" opacity="0.3"/>
                    <circle cx="10" cy="10" r="0.5" fill="#D63384" opacity="0.6"/>
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#matrix)" className="animate-pulse"/>
              </svg>
            </div>

            {/* Floating Tech Elements */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute opacity-15 text-cyan-400 animate-spin-slow"
                style={{
                  left: `${8 + i * 12}%`,
                  top: `${15 + (i % 2) * 70}%`,
                  animationDelay: `${i * 0.6}s`,
                  animationDuration: `${8 + i * 0.8}s`,
                }}
              >
                {i % 8 === 0 && <span className="text-3xl">⟨</span>}
                {i % 8 === 1 && <span className="text-2xl">⟩</span>}
                {i % 8 === 2 && <span className="text-xl">⟦</span>}
                {i % 8 === 3 && <span className="text-2xl">⟧</span>}
                {i % 8 === 4 && <span className="text-xl">⦃</span>}
                {i % 8 === 5 && <span className="text-2xl">⦄</span>}
                {i % 8 === 6 && <span className="text-xl">⦗</span>}
                {i % 8 === 7 && <span className="text-2xl">⦘</span>}
              </div>
            ))}
            
            <div className="mb-6 sm:mb-8 text-center relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-cyan-400 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-mono tracking-wide">
                Start your journey with NEURA today
              </p>

              {/* Performance Toggle */}
              <div className="absolute top-0 right-0 flex items-center gap-2">
                <button
                  onClick={() => setUseCanvasParticles(!useCanvasParticles)}
                  className="px-2 py-1 rounded-lg bg-neutral-800/50 border border-neutral-700 text-xs font-mono text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
                  title="Toggle visual effects"
                >
                  {useCanvasParticles ? "🎨" : "⚡"}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="group relative">
                <label className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full bg-black border-2 border-neutral-800 hover:border-cyan-400/50 focus:border-cyan-400 rounded-xl py-3 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all text-white !text-white placeholder-gray-500 font-mono group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] relative z-10 min-h-[44px]"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
                </div>
              </div>

              <div className="group relative">
                <label className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full bg-black border-2 border-neutral-800 hover:border-cyan-400/50 focus:border-cyan-400 rounded-xl py-3 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all text-white !text-white placeholder-gray-500 font-mono group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] relative z-10 min-h-[44px]"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
                </div>
              </div>

              <div className="group relative">
                <label className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full bg-black border-2 border-neutral-800 hover:border-cyan-400/50 focus:border-cyan-400 rounded-xl py-3 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all text-white !text-white placeholder-gray-500 font-mono tracking-widest group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] relative z-10 min-h-[44px]"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
                </div>
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              <div className="group relative">
                <label className="block text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black border-2 border-neutral-800 hover:border-cyan-400/50 focus:border-cyan-400 rounded-xl py-3 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all text-white !text-white placeholder-gray-500 font-mono tracking-widest group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] relative z-10 min-h-[44px]"
                    required
                  />
                  {confirmPassword && password === confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/15 to-red-600/15 border-2 border-red-500/40 text-red-400 text-sm flex items-center gap-3 animate-shake backdrop-blur-sm">
                  <svg className="w-5 h-5 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{typeof error === 'string' ? error : error?.message || 'An error occurred'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-500 text-white font-display font-bold text-base transition-all shadow-[0_0_50px_rgba(6,182,212,0.7)] hover:shadow-[0_0_80px_rgba(6,182,212,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                    <span className="relative z-10">Creating account...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Create Account</span>
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
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Enhanced Sign In Link */}
            <Link
              to="/signin"
              className="block w-full py-4 px-6 rounded-xl border-2 border-neutral-800/70 hover:border-cyan-400/60 bg-neutral-900/40 hover:bg-neutral-900/60 text-gray-300 hover:text-white font-display font-bold text-base transition-all flex items-center justify-center gap-3 group relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/15 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg className="w-5 h-5 relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="relative z-10">Sign In</span>
            </Link>

            {/* Enhanced Back to Home */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-cyan-400 transition-colors font-mono inline-flex items-center gap-2 group"
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
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-15px) rotate(90deg) scale(1.1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(0.9); }
          75% { transform: translateY(-15px) rotate(270deg) scale(1.05); }
        }
        @keyframes shapeMorph {
          0%, 100% { border-radius: 50%; transform: rotate(0deg) scale(1); clip-path: circle(50%); }
          25% { border-radius: 0%; transform: rotate(90deg) scale(1.2); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
          50% { border-radius: 25%; transform: rotate(180deg) scale(0.8); clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
          75% { border-radius: 75%; transform: rotate(270deg) scale(1.1); clip-path: circle(60% at 30% 40%); }
        }
        @keyframes waveFlow {
          0%, 100% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          50% { transform: translateX(0%) skewX(0deg); opacity: 0.8; }
        }
        @keyframes techGlow {
          0%, 100% { text-shadow: 0 0 5px currentColor; transform: scale(1); }
          50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; transform: scale(1.1); }
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
          animation: particleFloat 8s ease-in-out infinite;
        }
        .animate-shape-morph {
          animation: shapeMorph 10s ease-in-out infinite;
        }
        .animate-wave-flow {
          animation: waveFlow 6s ease-in-out infinite;
        }
        .animate-tech-glow {
          animation: techGlow 2s ease-in-out infinite;
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

export default SignUpPage;
