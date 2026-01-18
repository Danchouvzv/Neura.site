import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
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
    <section className="relative min-h-screen flex items-center justify-center px-4 py-24 md:py-32 overflow-hidden bg-black selection:bg-[#ff007f] selection:text-white">
      {/* Background Ambience */}
      <div 
        className="fixed pointer-events-none z-0 w-[800px] h-[800px] rounded-full blur-[180px] opacity-10 transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, #ff007f 0%, transparent 70%)',
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
        className="relative z-10 w-full max-w-7xl min-h-[400px] sm:min-h-[500px] md:min-h-[600px] rounded-[24px] sm:rounded-[32px] md:rounded-[100px] border border-[#ff007f33] bg-[#050505]/95 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-16 lg:p-24 overflow-hidden shadow-[0_0_100px_rgba(255,0,127,0.15)] group"
      >
        {/* Interior Decorative Tech Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(#ff007f 1.5px, transparent 1.5px), linear-gradient(90deg, #ff007f 1.5px, transparent 1.5px)`,
              backgroundSize: '60px 60px',
              transform: `translate(${mousePos.x / 60}px, ${mousePos.y / 60}px)`
            }}
          />
        </div>

        {/* Content Layout */}
        <div className="relative space-y-6 sm:space-y-8 md:space-y-12 max-w-5xl z-10 py-6 sm:py-8 md:py-10">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-black/60 border border-[#ff007f44] text-[7px] sm:text-[8px] md:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.1)]">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#ff007f]"></span>
            </span>
            <span className="hidden xs:inline">NIS ALMATY NAURYZBAY // </span>NEURA_TEAM
          </div>

          <h1 className="font-tech text-4xl sm:text-5xl md:text-6xl lg:text-[120px] xl:text-[160px] font-black leading-[0.85] sm:leading-[0.8] tracking-tighter text-white px-2">
            <span className="block opacity-20 transition-all group-hover:opacity-30 duration-1000 text-2xl sm:text-3xl md:text-4xl lg:text-6xl">COMMUNITY</span>
            <span className="block relative bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-[#ff007f]">
               NEURA
            </span>
          </h1>

          <p className="text-white/50 text-sm sm:text-base md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Building the engineering culture of tomorrow. A premium ecosystem for the <span className="text-white">Kazakhstan FIRST community</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 md:gap-8 pt-4 sm:pt-6 px-4">
            <Link
              to="/signup"
              className="group relative px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 bg-[#ff007f] text-black font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs rounded-xl sm:rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,0,127,0.5)] active:scale-95 text-center min-h-[44px] flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">Connect Now</span>
              <svg className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/map"
              className="group px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 bg-transparent border-2 border-[#ff007f]/40 text-white font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs rounded-xl sm:rounded-2xl hover:bg-[#ff007f11] hover:border-[#ff007f] transition-all flex items-center justify-center gap-2 sm:gap-3 min-h-[44px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff007f]/0 via-[#ff007f]/10 to-[#ff007f]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">Explore Map</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Technical Hud Decorations */}
        <div className="absolute top-8 left-10 text-[7px] md:text-[8px] font-black text-[#ff007f] tracking-widest opacity-30 uppercase hidden md:block">
          STATUS: ACTIVE <br/> ENCRYPTED_CHANNEL: 0xff007f
        </div>
        <div className="absolute top-8 right-10 text-[7px] md:text-[8px] font-black text-[#ff007f] tracking-widest opacity-30 uppercase text-right hidden md:block">
          ALM_NODE: {new Date().getFullYear()} <br/> LAT: 43.238 // LNG: 76.889
        </div>

        {/* Framing Accents */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-8 h-8 sm:w-16 sm:h-16 border-t border-l border-[#ff007f]/30 rounded-tl-[15px] sm:rounded-tl-[30px] group-hover:border-[#ff007f] transition-colors" />
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-8 h-8 sm:w-16 sm:h-16 border-t border-r border-[#ff007f]/30 rounded-tr-[15px] sm:rounded-tr-[30px] group-hover:border-[#ff007f] transition-colors" />
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-8 h-8 sm:w-16 sm:h-16 border-b border-l border-[#ff007f]/30 rounded-bl-[15px] sm:rounded-bl-[30px] group-hover:border-[#ff007f] transition-colors" />
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-8 h-8 sm:w-16 sm:h-16 border-b border-r border-[#ff007f]/30 rounded-br-[15px] sm:rounded-br-[30px] group-hover:border-[#ff007f] transition-colors" />
      </div>
    </section>
  );
};

export default Hero;

