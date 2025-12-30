import React, { useMemo } from 'react';

interface BackgroundProps {
  prefersReducedMotion: boolean;
}

const Background: React.FC<BackgroundProps> = ({ prefersReducedMotion }) => {
  const dots = useMemo(() => {
    if (prefersReducedMotion) return [];
    return Array.from({ length: 60 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 10,
      duration: Math.random() * 20 + 15,
    }));
  }, [prefersReducedMotion]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      {/* Intense Neon Pink Orbs */}
      <div className={`absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#ff007f08] blur-[200px] rounded-full ${!prefersReducedMotion && 'animate-pulse'}`} />
      <div className={`absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#ff007f05] blur-[200px] rounded-full ${!prefersReducedMotion && 'animate-pulse'}`} />
      
      {/* Center Depth Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#ff007f03] blur-[250px] rounded-full" />

      {/* Floating Particles (Cyberdust) */}
      {!prefersReducedMotion && dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#ff007f]/30"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            animation: `cyberfloat ${dot.duration}s infinite linear ${dot.delay}s`,
          }}
        />
      ))}

      {/* Static Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ff007f 1px, transparent 1px), linear-gradient(90deg, #ff007f 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <style>{`
        @keyframes cyberfloat {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Background;
