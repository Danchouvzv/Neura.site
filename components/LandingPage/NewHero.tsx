import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const NewHero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2) * -4;
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2) * 4;
        setTilt({ x: tiltX, y: tiltY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-24 md:py-32 overflow-hidden bg-black selection:bg-neura-pink selection:text-white">
      {/* Background Ambience */}
      <div 
        className="fixed pointer-events-none z-0 w-[800px] h-[800px] rounded-full blur-[180px] opacity-10 transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, #D63384 0%, transparent 70%)',
          transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`
        }}
      />

      {/* Floating Architecture Module */}
      <div 
        ref={containerRef}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s linear'
        }}
        className="relative z-10 w-full max-w-7xl min-h-[500px] md:min-h-[600px] rounded-[40px] md:rounded-[100px] border border-neura-pink/20 bg-[#050505]/95 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8 md:p-16 lg:p-24 overflow-hidden shadow-[0_0_100px_rgba(214,51,132,0.15)] group"
      >
        {/* Interior Decorative Tech Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(#D63384 1.5px, transparent 1.5px), linear-gradient(90deg, #D63384 1.5px, transparent 1.5px)`,
              backgroundSize: '60px 60px',
              transform: `translate(${mousePos.x / 60}px, ${mousePos.y / 60}px)`
            }}
          />
        </div>

        {/* Content Layout */}
        <div className="relative space-y-8 md:space-y-12 max-w-5xl z-10 py-10">
          <div className="inline-flex flex-wrap justify-center items-center gap-3 px-6 py-2 rounded-full bg-black/60 border border-neura-pink/30 text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase text-neura-pink shadow-[0_0_20px_rgba(214,51,132,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neura-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neura-pink"></span>
            </span>
            NIS ALMATY NAURYZBAY // NEURA_TEAM
          </div>

          <h1 className="font-display text-6xl md:text-[120px] lg:text-[160px] font-black leading-[0.8] tracking-tighter text-white">
            <span className="block opacity-20 transition-all group-hover:opacity-30 duration-1000">COMMUNITY</span>
            <span className="block relative bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neura-pink">
               NEURA
            </span>
          </h1>

          <p className="text-white/50 text-base md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Building the engineering culture of tomorrow. A premium ecosystem for the <span className="text-white">Kazakhstan FIRST community</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-6">
            <Link 
              to="/map" 
              className="group relative px-8 md:px-12 py-4 md:py-6 bg-neura-pink text-black font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(214,51,132,0.5)] active:scale-95 whitespace-nowrap"
            >
              <span className="relative z-10">Connect Now</span>
            </Link>
            <Link 
              to="#mission" 
              className="group px-8 md:px-12 py-4 md:py-6 bg-transparent border-2 border-neura-pink/40 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-2xl hover:bg-neura-pink/10 hover:border-neura-pink transition-all flex items-center gap-3 whitespace-nowrap"
            >
              Learn More
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Technical Hud Decorations */}
        <div className="absolute top-8 left-10 text-[7px] md:text-[8px] font-black text-neura-pink tracking-widest opacity-30 uppercase hidden md:block">
          STATUS: ACTIVE <br/> ENCRYPTED_CHANNEL: 0xff007f
        </div>
        <div className="absolute top-8 right-10 text-[7px] md:text-[8px] font-black text-neura-pink tracking-widest opacity-30 uppercase text-right hidden md:block">
          ALM_NODE: {new Date().getFullYear()} <br/> LAT: 43.238 // LNG: 76.889
        </div>

        {/* Framing Accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-neura-pink/30 rounded-tl-[30px] group-hover:border-neura-pink transition-colors" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-neura-pink/30 rounded-tr-[30px] group-hover:border-neura-pink transition-colors" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-neura-pink/30 rounded-bl-[30px] group-hover:border-neura-pink transition-colors" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-neura-pink/30 rounded-br-[30px] group-hover:border-neura-pink transition-colors" />
      </div>
    </section>
  );
};

export default NewHero;

