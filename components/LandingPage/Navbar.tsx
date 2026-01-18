import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  scrolled: boolean;
  isLoggedIn: boolean;
  onLoginToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, isLoggedIn, onLoginToggle }) => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-3 md:top-6 left-0 right-0 z-[100] flex justify-center px-3 md:px-4 pointer-events-none">
      <nav className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-between gap-2 md:gap-12 px-3 md:px-8 ${
        scrolled 
          ? 'py-2 md:py-2.5 bg-black/70 backdrop-blur-3xl border border-[#ff007f33] rounded-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_20px_rgba(255,0,127,0.15)] w-full max-w-4xl' 
          : 'py-2.5 md:py-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-[24px] md:rounded-[32px] w-full max-w-6xl'
      }`}>
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group cursor-pointer shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="relative">
            <div className="absolute inset-0 bg-[#ff007f] blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-8 h-8 md:w-11 md:h-11 bg-[#ff007f] rounded-lg md:rounded-xl flex items-center justify-center font-tech font-black text-black text-base md:text-xl shadow-[0_0_20px_rgba(255,0,127,0.3)] group-hover:scale-105 group-hover:rotate-[10deg] transition-all duration-500">
              N
            </div>
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="font-tech text-base md:text-xl font-black tracking-tighter text-white leading-none">NEURA</span>
            <span className="text-[6px] md:text-[7px] font-black text-[#ff007f] tracking-[0.3em] uppercase opacity-80">COM_HUB</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 md:gap-10">
          {[
            { name: 'Карта', href: '/map' },
            { name: 'Q&A', href: '/qa' },
            { name: 'TeamHub', href: '/hub' }
          ].map((link) => (
            <Link 
              key={link.name}
              to={link.href} 
              className={`relative group py-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-white' 
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <span className="relative z-10">{link.name}</span>
              <span className={`absolute bottom-0 left-0 h-[2px] bg-[#ff007f] transition-all duration-500 shadow-[0_0_8px_#ff007f] ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </div>

        {/* Desktop Auth CTA */}
        <div className="hidden md:flex items-center shrink-0">
          <button 
            onClick={onLoginToggle}
            className={`group relative overflow-hidden px-5 md:px-7 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              isLoggedIn 
                ? 'bg-transparent text-white border border-[#ff007f66] hover:border-[#ff007f] hover:shadow-[0_0_25px_rgba(255,0,127,0.2)]' 
                : 'bg-[#ff007f] text-black hover:shadow-[0_0_35px_rgba(255,0,127,0.5)]'
            }`}
          >
            <div className={`absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${isLoggedIn ? 'hidden' : ''}`} />
            <span className="relative z-10">
              {isLoggedIn ? (
                <span className="flex items-center gap-2">
                  Открыть Hub
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              ) : 'Sign In'}
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Меню"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-3 right-3 z-[100] md:hidden bg-black/90 backdrop-blur-2xl border border-[#ff007f33] rounded-2xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col gap-4">
              {[
                { name: 'Карта', href: '/map' },
                { name: 'Q&A', href: '/qa' },
                { name: 'TeamHub', href: '/hub' }
              ].map((link) => (
                <Link 
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'bg-[#ff007f]/20 text-white border border-[#ff007f]/50' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoginToggle();
                }}
                className={`mt-2 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                  isLoggedIn 
                    ? 'bg-transparent text-white border border-[#ff007f66]' 
                    : 'bg-[#ff007f] text-black'
                }`}
              >
                {isLoggedIn ? 'Открыть Hub' : 'Sign In'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
