import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPage from './qa/AuthPage';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  const handleGetStarted = () => {
    navigate('/map');
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    navigate('/map');
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    if (currentSrc.includes('logos/neura-logo.jpeg')) {
      img.src = 'neura-logo.jpeg';
    } else {
      img.style.display = 'none';
      img.nextElementSibling?.classList.remove('hidden');
    }
  };

  return (
    <div className="min-h-screen bg-neura-black text-white relative overflow-x-hidden">
      {/* Enhanced Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neura-pink/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neura-pink/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Enhanced Grid Pattern Overlay with animation */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(214,51,132,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(214,51,132,0.04)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0 opacity-50"></div>
      
      {/* Animated scan lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neura-pink/20 to-transparent h-1 animate-scan" style={{ animation: 'scan 8s linear infinite' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Ultra Creative Fixed Navigation */}
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
                        onError={handleLogoError}
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
                  <button
                    onClick={handleGetStarted}
                    className="relative px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neura-pink/60 bg-gradient-to-br from-neutral-900/40 to-neutral-900/20 hover:from-neutral-900/60 hover:to-neutral-900/40 text-gray-300 hover:text-white text-sm font-display font-bold transition-all flex items-center gap-2 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/10 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <svg className="w-4 h-4 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="relative z-10">Map</span>
                  </button>
                  
                  {/* Forum Button */}
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
                  
                  {/* Sign In Button */}
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
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Revolutionary Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-20 relative z-10 overflow-hidden">
          {/* Futuristic Grid Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(214, 51, 132, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(214, 51, 132, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>

          {/* Holographic Light Beams */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Vertical beams */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`beam-v-${i}`}
                className="absolute w-px bg-gradient-to-b from-transparent via-neura-pink/30 to-transparent"
                style={{
                  left: `${12.5 + i * 12.5}%`,
                  top: '0',
                  height: '100%',
                  animation: `beamPulse ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  boxShadow: '0 0 20px rgba(214, 51, 132, 0.5)'
                }}
              />
            ))}
            
            {/* Horizontal beams */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`beam-h-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-neura-pink/30 to-transparent"
                style={{
                  top: `${15 + i * 15}%`,
                  left: '0',
                  width: '100%',
                  animation: `beamPulse ${4 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                  boxShadow: '0 0 20px rgba(214, 51, 132, 0.5)'
                }}
              />
            ))}
          </div>

          {/* Central Glow Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-neura-pink/20 via-pink-500/10 to-transparent rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-purple-500/15 via-transparent to-transparent rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Corner Accent Lights */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-neura-pink/15 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-radial from-purple-500/15 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-pink-500/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-2xl"></div>

          <div className="max-w-6xl mx-auto text-center relative z-20">
            {/* Minimalist Logo */}
            <div className="mb-12 flex justify-center">
              <div className="relative group">
                {/* Holographic effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-neura-pink/20 via-purple-500/20 to-neura-pink/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-black/80 via-neutral-900/80 to-black/80 border border-neura-pink/50 group-hover:border-neura-pink transition-all duration-500 flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-[0_0_60px_rgba(214,51,132,0.6)] group-hover:shadow-[0_0_100px_rgba(214,51,132,0.9)] group-hover:scale-105">
                  <img 
                    src="/logos/neura-logo.jpeg" 
                    alt="Neura Logo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={handleLogoError}
                  />
                  <svg className="hidden w-full h-full p-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 25 L45 25 L45 75 L55 25 L75 25 L75 75 L55 75 L55 25 L45 75 L25 75 Z" 
                          fill="none" stroke="#D63384" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                          className="drop-shadow-[0_0_15px_#D63384]" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bold Typography */}
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-display font-black mb-8 leading-[0.9] tracking-tight">
              <span className="relative inline-block">
                {/* Text shadow glow */}
                <span className="absolute inset-0 bg-gradient-to-r from-neura-pink via-pink-500 to-neura-pink blur-3xl opacity-50 scale-150"></span>
                
                {/* Main text */}
                <span className="relative text-white drop-shadow-[0_0_30px_rgba(214,51,132,0.5)]">
                  NEURA
                </span>
              </span>
            </h1>
            
            {/* Clean Badge */}
            <div className="mb-10">
              <span className="inline-block px-6 py-3 rounded-lg bg-neura-pink/10 border border-neura-pink/40 text-neura-pink text-xs font-mono font-bold tracking-[0.3em] uppercase backdrop-blur-sm">
                FIRST TECH CHALLENGE
              </span>
            </div>

            {/* Clean Typography */}
            <div className="space-y-4 mb-16 max-w-4xl mx-auto">
              <p className="text-2xl md:text-4xl text-gray-200 font-light">
                Команда из <span className="text-neura-pink font-semibold">НИШ Алматы Наурызбай</span>
              </p>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                Создались в <span className="text-neura-pink">2024 году</span>. Наша цель — выйти на <span className="text-white font-semibold">Worlds</span> и показать миру, на что способны казахстанские робототехники.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button
                onClick={handleGetStarted}
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-neura-pink via-pink-600 to-neura-pink hover:from-pink-600 hover:via-neura-pink hover:to-pink-600 text-white text-lg font-display font-bold transition-all shadow-[0_0_40px_rgba(214,51,132,0.6)] hover:shadow-[0_0_60px_rgba(214,51,132,0.9)] overflow-hidden hover:scale-105"
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {/* Pulsing glow */}
                <div className="absolute -inset-1 bg-neura-pink/50 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Карта команд
                </span>
              </button>
              
              <Link
                to="/qa"
                className="group relative px-10 py-5 rounded-2xl border-2 border-neutral-800 hover:border-neura-pink/60 bg-gradient-to-br from-neutral-900/40 to-neutral-900/20 hover:from-neutral-900/60 hover:to-neutral-900/40 text-gray-300 hover:text-white text-lg font-display font-bold transition-all overflow-hidden hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/10 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Q&A Платформа
                </span>
              </Link>
            </div>

            {/* Enhanced Features */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { 
                  title: "Карта команд", 
                  description: "Исследуйте глобальную карту FTC команд со всего мира. Найдите единомышленников и партнеров.",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                  svgIcon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                },
                { 
                  title: "Q&A Платформа", 
                  description: "Задавайте вопросы, делитесь опытом и получайте помощь от сообщества FTC.",
                  gradient: "from-purple-500/20 to-pink-500/20",
                  svgIcon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                },
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-gradient-to-br from-neura-card/40 via-neura-card/30 to-neura-card/40 backdrop-blur-sm border border-neutral-800 rounded-2xl p-7 hover:border-neura-pink/40 transition-all overflow-hidden"
                >
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-neura-pink/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neura-pink/20 to-purple-500/20 border-2 border-neura-pink/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_0_20px_rgba(214,51,132,0.3)] text-neura-pink">
                        {feature.svgIcon}
                      </div>
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neura-pink group-hover:to-purple-400 transition-all">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Team Section */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                О нашей команде
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-neura-pink to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Мы молодая, но амбициозная команда робототехников из НИШ Алматы Наурызбай, 
                объединенная общей целью — представить Казахстан на мировом чемпионате FIRST Tech Challenge.
              </p>
            </div>

            {/* Mission Section */}
            <div className="bg-neura-card/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 md:p-10 mb-12 hover:border-neura-pink/30 transition-all relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-neura-pink/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neura-pink/20 to-purple-500/20 border-2 border-neura-pink/30 flex items-center justify-center shadow-[0_0_20px_rgba(214,51,132,0.3)]">
                    <svg className="w-8 h-8 text-neura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Наша миссия</h3>
                    <p className="text-sm text-neura-pink font-mono tracking-wider">MISSION</p>
                  </div>
                </div>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl">
                  Наша миссия — <span className="text-neura-pink font-bold">вдохновлять и обучать через робототехнику</span>, показывая, что технологии доступны каждому.
                  Мы стремимся не только создавать конкурентоспособных роботов, но и развивать лидерские качества, инженерное мышление и культуру сотрудничества, следуя ценностям FIRST.
                </p>
              </div>
            </div>

            {/* Optimized Goals Section */}
            <div className="mb-12">
              <div className="text-center mb-10">
                <h3 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent mb-4">
                  Цели команды
                </h3>
                <div className="w-40 h-1 bg-gradient-to-r from-transparent via-neura-pink to-transparent mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { 
                    text: "Развивать инженерные, программные и аналитические навыки участников", 
                    color: "blue"
                  },
                  { 
                    text: "Продвигать FIRST и робототехнику среди школьников", 
                    color: "purple"
                  },
                  { 
                    text: "Участвовать и побеждать в соревнованиях FTC", 
                    color: "yellow"
                  },
                  { 
                    text: "Создавать устойчивые проекты с реальным социальным и образовательным эффектом", 
                    color: "green"
                  },
                  { 
                    text: "Формировать сильное командное сообщество, основанное на сотрудничестве и взаимном уважении", 
                    color: "pink"
                  },
                ].map((goal, idx) => {
                  const colorClasses = {
                    blue: "border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5",
                    purple: "border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/5",
                    yellow: "border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/5",
                    green: "border-green-500/30 hover:border-green-500/60 hover:bg-green-500/5",
                    pink: "border-neura-pink/30 hover:border-neura-pink/60 hover:bg-neura-pink/5"
                  };
                  
                  return (
                    <div 
                      key={idx}
                      className={`group relative bg-neura-card/50 backdrop-blur-sm border-2 ${colorClasses[goal.color as keyof typeof colorClasses]} rounded-2xl p-6 transition-all duration-300`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-neura-pink mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                        <p className="text-base text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 font-medium">
                          {goal.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Values Section */}
            <div className="bg-gradient-to-br from-neura-card/60 via-neura-card/50 to-neura-card/60 backdrop-blur-sm border-2 border-neutral-800 rounded-3xl p-8 md:p-12 hover:border-neura-pink/40 transition-all relative overflow-hidden group">
              {/* Multiple decorative gradients */}
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-neura-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-neura-pink/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/30 rounded-xl blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/30 to-neura-pink/30 border-2 border-purple-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-white via-purple-300 to-neura-pink bg-clip-text text-transparent mb-2">
                      Ценности команды
                    </h3>
                    <p className="text-sm text-purple-400 font-mono tracking-wider uppercase">VALUES</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Командная работа",
                    "Ответственность",
                    "Открытость и поддержка",
                    "Непрерывное развитие"
                  ].map((value, idx) => (
                    <div 
                      key={idx} 
                      className="group/item flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-neutral-900/60 via-neutral-900/40 to-transparent border border-neutral-800/60 hover:border-neura-pink/50 transition-all relative overflow-hidden"
                    >
                      {/* Animated gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-neura-pink/10 to-purple-500/0 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                      
                      <div className="relative w-3 h-3 rounded-full bg-neura-pink group-hover/item:scale-150 group-hover/item:shadow-[0_0_15px_#D63384] transition-all flex-shrink-0">
                        <div className="absolute inset-0 bg-neura-pink rounded-full animate-ping opacity-75"></div>
                      </div>
                      <span className="text-gray-300 font-display font-medium group-hover/item:text-white group-hover/item:translate-x-2 transition-all relative z-10">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-neura-pink/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent mb-6">
                Наша команда
              </h2>
              <div className="w-40 h-1 bg-gradient-to-r from-transparent via-neura-pink to-transparent mx-auto mb-8"></div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-3 leading-relaxed">
                Наша команда состоит из <span className="text-transparent bg-clip-text bg-gradient-to-r from-neura-pink to-pink-300 font-bold">13 мотивированных участников</span>, каждый из которых вносит вклад в общее дело
              </p>
              <p className="text-base text-gray-400 max-w-3xl mx-auto">
                Команда делится на три группы: <span className="text-white font-semibold">Coding team</span>, <span className="text-white font-semibold">Inspire team</span>, <span className="text-white font-semibold">Robo part team</span>
              </p>
            </div>

            {/* Enhanced Team Groups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { 
                  name: "Coding Team", 
                  gradient: "from-blue-500/30 via-cyan-500/20 to-blue-500/30", 
                  borderGradient: "from-blue-500/60 to-cyan-500/60",
                  textColor: "text-blue-400", 
                  description: "Разработка программного обеспечения, алгоритмов и систем управления", 
                  glow: "rgba(59,130,246,0.4)",
                  svgIcon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> 
                },
                { 
                  name: "Inspire Team", 
                  gradient: "from-purple-500/30 via-pink-500/20 to-purple-500/30",
                  borderGradient: "from-purple-500/60 to-pink-500/60",
                  textColor: "text-purple-400", 
                  description: "Вдохновение, коммуникация и продвижение FIRST", 
                  glow: "rgba(168,85,247,0.4)",
                  svgIcon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
                },
                { 
                  name: "Robo Part Team", 
                  gradient: "from-orange-500/30 via-red-500/20 to-orange-500/30",
                  borderGradient: "from-orange-500/60 to-red-500/60",
                  textColor: "text-orange-400", 
                  description: "Механическая разработка, сборка и тестирование робота", 
                  glow: "rgba(249,115,22,0.4)",
                  svgIcon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
                },
              ].map((group, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-gradient-to-br from-neura-card/70 via-neura-card/60 to-neura-card/70 backdrop-blur-sm border-2 border-neutral-800 rounded-3xl p-8 hover:border-transparent transition-all overflow-hidden"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  {/* Animated gradient border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${group.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-md`}></div>
                  
                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${group.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: group.glow }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${group.gradient} border-2 border-neutral-800 group-hover:border-transparent flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${group.textColor}`}>
                        {group.svgIcon}
                      </div>
                      <h3 className={`text-2xl font-display font-bold ${group.textColor} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neura-pink group-hover:to-purple-400 transition-all mb-2`}>
                        {group.name}
                      </h3>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors text-center">
                      {group.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-neura-card/40 backdrop-blur-sm border border-neutral-800 rounded-xl p-5 text-center hover:border-neura-pink/30 transition-all group">
                <div className="text-3xl md:text-4xl font-display font-bold text-neura-pink mb-2 group-hover:scale-110 transition-transform">13</div>
                <div className="text-xs text-gray-400 font-mono">Членов команды</div>
              </div>
              <div className="bg-neura-card/40 backdrop-blur-sm border border-neutral-800 rounded-xl p-5 text-center hover:border-neura-pink/30 transition-all group">
                <div className="text-3xl md:text-4xl font-display font-bold text-neura-pink mb-2 group-hover:scale-110 transition-transform">3</div>
                <div className="text-xs text-gray-400 font-mono">Часа в день</div>
              </div>
              <div className="bg-neura-card/40 backdrop-blur-sm border border-neutral-800 rounded-xl p-5 text-center hover:border-neura-pink/30 transition-all group">
                <div className="text-3xl md:text-4xl font-display font-bold text-neura-pink mb-2 group-hover:scale-110 transition-transform">87ч</div>
                <div className="text-xs text-gray-400 font-mono">В лабе</div>
              </div>
              <div className="bg-neura-card/40 backdrop-blur-sm border border-neutral-800 rounded-xl p-5 text-center hover:border-neura-pink/30 transition-all group">
                <div className="text-3xl md:text-4xl font-display font-bold text-neura-pink mb-2 group-hover:scale-110 transition-transform">100%</div>
                <div className="text-xs text-gray-400 font-mono">Мотивация</div>
              </div>
            </div>

            {/* Projects & Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neura-card/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-neura-pink/30 transition-all">
                <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-neura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Выпущенных работ
                </h3>
                <div className="space-y-2">
                  {["ТГ бот", "Словарь", "Сайт"].map((project, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-neura-pink"></span>
                      <span className="text-sm">{project}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-neura-card/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-neura-pink/30 transition-all">
                <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-neura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Форумы и события
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-neura-pink"></span>
                    <span className="text-sm">Проведено форумов: <span className="text-neura-pink font-bold">2</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-neura-pink"></span>
                    <span className="text-sm">Планируется работ/ивентов: <span className="text-neura-pink font-bold">6</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section - Enhanced */}
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent mb-6">
                Достижения
              </h2>
              <div className="w-40 h-1 bg-gradient-to-r from-transparent via-neura-pink to-transparent mx-auto mb-8"></div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Наши победы и награды в соревнованиях FIRST
              </p>
            </div>

            {/* FLL Achievements */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-2 border-blue-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                    <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                    FIRST LEGO League
                  </h3>
                  <p className="text-sm text-blue-400 font-mono uppercase tracking-wider">FLL</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { award: "Core Values Finalist", event: "Haileybury", year: "2024" },
                  { award: "Engineering Excellence Award", event: "Scrimmage", year: "2024" },
                  { award: "Innovation Project Winner", event: "Scrimmage", year: "2024" },
                  { award: "Programming Excellence Award", event: "Central Asia", year: "2024" },
                ].map((achievement, idx) => (
                  <div 
                    key={idx}
                    className="group relative bg-gradient-to-br from-neura-card/70 via-neura-card/60 to-neura-card/70 backdrop-blur-sm border-2 border-neutral-800 rounded-2xl p-7 hover:border-blue-500/50 transition-all overflow-hidden"
                  >
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm"></div>
                    
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all flex-shrink-0">
                          <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xl font-display font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-cyan-300 transition-all">
                              {achievement.award}
                            </h4>
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
                              {achievement.year}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 font-mono group-hover:text-gray-300 transition-colors">
                            {achievement.event}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FTC Achievements */}
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-xl"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30 border-2 border-orange-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                    <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                    FIRST Tech Challenge
                  </h3>
                  <p className="text-sm text-orange-400 font-mono uppercase tracking-wider">FTC</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-3xl">
                <div className="group relative bg-gradient-to-br from-neura-card/70 via-neura-card/60 to-neura-card/70 backdrop-blur-sm border-2 border-neutral-800 rounded-2xl p-8 hover:border-orange-500/50 transition-all overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm"></div>
                  <div className="absolute -inset-1 bg-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all flex-shrink-0">
                      <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-2xl font-display font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-300 group-hover:to-red-300 transition-all">
                          BIL FIRST Scrimmage — WAP
                        </h4>
                        <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-mono font-bold">
                          2024
                        </span>
                      </div>
                      <p className="text-base text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                        Первое участие в соревнованиях FTC
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies Section - Enhanced */}
        <section className="relative z-10 py-20 px-4 bg-gradient-to-b from-transparent via-neura-pink/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-neura-pink to-white bg-clip-text text-transparent mb-6">
                Технологии и навыки
              </h2>
              <div className="w-40 h-1 bg-gradient-to-r from-transparent via-neura-pink to-transparent mx-auto mb-8"></div>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Мы используем современные технологии и инструменты для создания лучших решений
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "Java", "Python", "CAD", "3D Printing", "Vision", "Sensors",
                "Control Systems", "Mechanical Design", "Electronics", "Git",
                "Fusion 360", "OnShape"
              ].map((tech, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-gradient-to-br from-neura-card/50 via-neura-card/40 to-neura-card/50 backdrop-blur-sm border-2 border-neutral-800 rounded-xl p-5 hover:border-neura-pink/50 transition-all text-center overflow-hidden"
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neura-pink/10 via-purple-500/10 to-neura-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-neura-pink/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="text-sm font-display font-bold text-gray-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neura-pink group-hover:to-purple-400 transition-all">
                      {tech}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-neura-card/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-12 hover:border-neura-pink/30 transition-all">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Готовы присоединиться к сообществу?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Исследуйте карту команд, задавайте вопросы в Q&A и станьте частью глобального сообщества FTC
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleGetStarted}
                  className="group relative px-8 py-4 rounded-xl bg-neura-pink hover:bg-neura-pink/90 text-white text-lg font-display font-bold transition-all shadow-[0_0_30px_rgba(214,51,132,0.5)] hover:shadow-[0_0_40px_rgba(214,51,132,0.7)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    Карта команд
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </span>
                </button>
                <Link
                  to="/qa"
                  className="px-8 py-4 rounded-xl border-2 border-neutral-800 hover:border-neura-pink/50 bg-neutral-900/30 hover:bg-neutral-900/50 text-gray-300 hover:text-white text-lg font-display font-bold transition-all"
                >
                  Q&A Платформа
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-neutral-800/50 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-500 font-mono">
              © 2024 NEURA FTC Team • НИШ Алматы Наурызбай
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Создано для сообщества FIRST Tech Challenge
            </p>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors z-10"
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
  );
};

export default LandingPage;


