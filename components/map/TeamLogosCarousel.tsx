import React, { useState, useEffect } from 'react';

interface TeamLogo {
  name: string;
  src: string;
  loaded: boolean;
}

interface TeamLogosCarouselProps {
  className?: string;
}

const TeamLogosCarousel: React.FC<TeamLogosCarouselProps> = ({ className = "" }) => {
  const [logos, setLogos] = useState<TeamLogo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Team logo filenames from the logo folder
  const teamLogoFiles = [
    'azumi.jpg',
    'bilorda.jpg',
    'errorda.jpg',
    'espada.jpg',
    'fiftyone.jpg',
    'flyingpenguins.jpg',
    'foxslide.jpg',
    'futurevortex.jpg',
    'gamma drive.jpg',
    'irys.jpg',
    'jeltoqsan.jpg',
    'mlp.jpg',
    'naizagay.jpg',
    'oyu.jpg',
    'ozge.jpg',
    'panheya.jpg',
    'qazaqsrylejuniors.jpg',
    'rumble.jpg',
    'sakura.jpg',
    'sana.jpg',
    'slapseals.jpg',
    'spirit.jpg',
    'sunrise.jpg',
    'tolqyn.jpg',
    'ulydala.jpg',
    'uniontur.jpg',
    'water7.jpg',
    'zenith.jpg'
  ];

  useEffect(() => {
    // Load logos from the logo folder
    const loadLogos = async () => {
      const loadedLogos: TeamLogo[] = [];

      for (const filename of teamLogoFiles) {
        const logo: TeamLogo = {
          name: filename.replace('.jpg', '').replace(/\s+/g, ' ').toUpperCase(),
          src: `/logos/${filename}`,
          loaded: false
        };

        // Preload image
        const img = new Image();
        img.onload = () => {
          logo.loaded = true;
          setLogos(prev => {
            const updated = [...prev];
            const index = updated.findIndex(l => l.name === logo.name);
            if (index !== -1) {
              updated[index] = logo;
            }
            return updated;
          });
        };
        img.src = logo.src;

        loadedLogos.push(logo);
      }

      setLogos(loadedLogos);
      setIsLoading(false);
    };

    loadLogos();
  }, []);

  // Auto-rotate logos
  useEffect(() => {
    if (logos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % logos.length);
    }, 3000); // Change logo every 3 seconds

    return () => clearInterval(interval);
  }, [logos.length]);

  if (isLoading || logos.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-neura-pink/20 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const currentLogo = logos[currentIndex];
  const nextLogo = logos[(currentIndex + 1) % logos.length];
  const prevLogo = logos[(currentIndex - 1 + logos.length) % logos.length];

  return (
    <div className={`relative ${className}`}>
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/10 via-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl animate-pulse"></div>

      {/* Main logo display */}
      <div className="relative bg-gradient-to-br from-black/80 via-neutral-900/80 to-black/80 backdrop-blur-xl border border-neutral-800/60 rounded-2xl p-6 shadow-[0_0_40px_rgba(214,51,132,0.3)] overflow-hidden">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neura-pink/20 via-transparent to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-700 blur-sm"></div>

        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-1">
            FTC Team Logos
          </h3>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-neura-pink/60 to-transparent mx-auto"></div>
        </div>

        {/* Logo carousel */}
        <div className="relative h-32 flex items-center justify-center overflow-hidden">
          {/* Previous logo (faded) */}
          <div className="absolute left-2 opacity-30 transform scale-75 transition-all duration-700">
            {prevLogo?.loaded && (
              <img
                src={prevLogo.src}
                alt={prevLogo.name}
                className="w-16 h-16 object-cover rounded-lg border border-neutral-700/50"
              />
            )}
          </div>

          {/* Current logo (main) */}
          <div className="relative z-10 animate-fade-in">
            {currentLogo?.loaded ? (
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-neura-pink/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <img
                  src={currentLogo.src}
                  alt={currentLogo.name}
                  className="relative w-24 h-24 object-cover rounded-xl border-2 border-neutral-700 group-hover:border-neura-pink/60 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                />

                {/* Animated border overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neura-pink/20 via-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow" style={{ animationDuration: '4s' }}></div>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border-2 border-neutral-700 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-neura-pink/40 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Next logo (faded) */}
          <div className="absolute right-2 opacity-30 transform scale-75 transition-all duration-700">
            {nextLogo?.loaded && (
              <img
                src={nextLogo.src}
                alt={nextLogo.name}
                className="w-16 h-16 object-cover rounded-lg border border-neutral-700/50"
              />
            )}
          </div>
        </div>

        {/* Team name */}
        <div className="text-center mt-4">
          <p className="text-sm font-display font-bold text-white truncate">
            {currentLogo?.name || 'Loading...'}
          </p>
          <p className="text-xs text-gray-400 font-mono mt-1">
            {currentIndex + 1} of {logos.length} teams
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center space-x-1 mt-3">
          {logos.slice(0, Math.min(10, logos.length)).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex % Math.min(10, logos.length)
                  ? 'bg-neura-pink shadow-[0_0_8px_#D63384]'
                  : 'bg-neutral-600'
              }`}
            ></div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-neura-pink/40 rounded-full animate-ping"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-500/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-purple-500/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-green-500/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
      </div>
    </div>
  );
};

export default TeamLogosCarousel;