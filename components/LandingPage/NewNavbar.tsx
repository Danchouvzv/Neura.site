import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NewNavbarProps {
  scrolled: boolean;
  user: any;
}

const NewNavbar: React.FC<NewNavbarProps> = ({ scrolled, user }) => {
  const { pathname } = useLocation();

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <nav className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-between gap-4 md:gap-12 px-5 md:px-8 ${
        scrolled 
          ? 'py-2.5 bg-black/70 backdrop-blur-3xl border border-neura-pink/20 rounded-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_20px_rgba(214,51,132,0.15)] w-full max-w-4xl' 
          : 'py-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-[32px] w-full max-w-6xl'
      }`}>
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-neura-pink blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-9 h-9 md:w-11 md:h-11 bg-neura-pink rounded-xl flex items-center justify-center font-display font-black text-black text-lg md:text-xl shadow-[0_0_20px_rgba(214,51,132,0.3)] group-hover:scale-105 group-hover:rotate-[10deg] transition-all duration-500">
              N
            </div>
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="font-display text-lg md:text-xl font-black tracking-tighter text-white leading-none">NEURA</span>
            <span className="text-[7px] font-black text-neura-pink tracking-[0.3em] uppercase opacity-80">COM_HUB</span>
          </div>
        </Link>

        {/* Navigation Links - Centered & Professional */}
        <div className="flex items-center gap-6 md:gap-10">
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
              <span className={`absolute bottom-0 left-0 h-[2px] bg-neura-pink transition-all duration-500 shadow-[0_0_8px_#D63384] ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </div>

        {/* Auth CTA */}
        <div className="flex items-center shrink-0">
          <Link 
            to={user ? "/hub" : "/signin"}
            className={`group relative overflow-hidden px-5 md:px-7 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              user 
                ? 'bg-transparent text-white border border-neura-pink/40 hover:border-neura-pink hover:shadow-[0_0_25px_rgba(214,51,132,0.2)]' 
                : 'bg-neura-pink text-black hover:shadow-[0_0_35px_rgba(214,51,132,0.5)]'
            }`}
          >
            <div className={`absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${user ? 'hidden' : ''}`} />
            <span className="relative z-10">
              {user ? (
                <span className="flex items-center gap-2">
                  Открыть Hub
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              ) : 'Sign In'}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NewNavbar;

