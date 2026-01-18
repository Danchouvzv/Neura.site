import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapTeam } from '../../types';
import { INITIAL_TEAMS } from '../../constants';
import LeafletMap from './LeafletMap';
import TeamCard from './TeamCard';
import TeamDetailsPanel from './TeamDetailsPanel';
import TeamLogosCarousel from './TeamLogosCarousel';
import { findTeams } from '../../services/geminiService';

const MapPage: React.FC = () => {
  const [teams, setTeams] = useState<MapTeam[]>(INITIAL_TEAMS);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(INITIAL_TEAMS[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await findTeams(searchQuery);
      if (results.length > 0) {
        setTeams(prev => {
           // Merge new teams with existing, avoiding duplicates by number
           const existingNumbers = new Set(prev.map(t => t.number));
           const newTeams = results.filter(t => !existingNumbers.has(t.number));
           return [...newTeams, ...prev];
        });
        setSelectedTeamId(results[0].id);
      } else {
        setSearchError('No teams found.');
      }
    } catch (err) {
      setSearchError('Search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTeam = useCallback((team: Team) => {
    setSelectedTeamId(team.id);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedTeamId(null);
  }, []);

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  // Logo Error Handling Logic
  // Tries /logos/neura-logo.jpeg first. If fail, tries /neura-logo.jpeg. If fail, shows SVG.
  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    // We check if the failed URL contained 'logos/'. 
    // If yes, it means the default path failed, so we try the root.
    if (currentSrc.includes('logos/neura-logo.jpeg')) {
        // Prevent infinite loops if this also fails by setting a flag or just hoping the next error is caught by the else
        img.src = 'neura-logo.jpeg';
    } else {
        // If we aren't in the logos folder (meaning we likely already tried root or it's some other error),
        // fallback to the SVG.
        img.style.display = 'none';
        img.nextElementSibling?.classList.remove('hidden');
    }
  };

  return (
    <div className="flex h-screen w-full bg-neura-black text-white overflow-hidden relative">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neura-black via-neura-black to-neutral-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neura-pink/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(214,51,132,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(214,51,132,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-30 z-0"></div>
      
      {/* MOBILE BRANDING (Top Left Absolute) */}
      <div className="absolute top-4 left-4 z-[60] md:hidden">
         <Link to="/" className="flex items-center gap-3 group relative">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-neura-pink/10 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
            <div className="relative w-10 h-10 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 group-hover:border-neura-pink/50 flex items-center justify-center overflow-hidden shadow-lg transition-all group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(214,51,132,0.5)]">
               <img 
                 src="/logos/neura-logo.jpeg" 
                 alt="Neura Logo"
                 className="w-full h-full object-cover"
                 onError={handleLogoError}
               />
               {/* Fallback Neon N SVG */}
               <svg className="hidden w-full h-full p-2" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 25 L45 25 L45 75 L55 25 L75 25 L75 75 L55 75 L55 25 L45 75 L25 75 Z" 
                        fill="none" stroke="#D63384" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                        className="drop-shadow-[0_0_10px_#D63384]" />
               </svg>
            </div>
            <span className="font-display font-bold text-lg text-white drop-shadow-md group-hover:text-neura-pink transition-colors bg-gradient-to-r from-white to-white group-hover:from-neura-pink group-hover:to-white bg-clip-text text-transparent">
              NEURA
            </span>
         </Link>
      </div>

      {/* SIDEBAR - Full Height */}
      <aside className="w-full md:w-[320px] absolute md:relative bottom-0 top-[60%] md:top-0 bg-gradient-to-b from-neura-black/95 via-neura-black/98 to-neura-black/95 backdrop-blur-2xl border-t md:border-t-0 md:border-r border-neutral-800/60 flex flex-col z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-[10px_0_40px_rgba(0,0,0,0.5)] flex-shrink-0 transition-all duration-300 relative">
        {/* Sidebar glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/5 via-transparent to-transparent pointer-events-none"></div>
        
        {/* TOP LEFT: Branding & Logo (Desktop) */}
        <div className="p-5 pb-3 hidden md:block relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-5 group relative">
             {/* Glow effect */}
             <div className="absolute -inset-2 bg-neura-pink/10 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
             <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-black via-neutral-900 to-black border-2 border-neutral-800 group-hover:border-neura-pink/60 transition-all duration-300 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-[0_0_20px_rgba(214,51,132,0.5)] group-hover:scale-105 flex-shrink-0">
                <img 
                  src="/logos/neura-logo.jpeg" 
                  alt="Neura"
                  className="w-full h-full object-cover"
                  onError={handleLogoError}
                />
                {/* Fallback Neon N SVG */}
                <svg className="hidden w-full h-full p-2.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 25 L45 25 L45 75 L55 25 L75 25 L75 75 L55 75 L55 25 L45 75 L25 75 Z" 
                        fill="none" stroke="#D63384" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                        className="drop-shadow-[0_0_15px_#D63384]" />
                </svg>
             </div>
             <div className="flex flex-col justify-center">
               <h1 className="text-xl font-display font-bold bg-gradient-to-r from-white via-white to-gray-300 group-hover:from-neura-pink group-hover:via-white group-hover:to-neura-pink bg-clip-text text-transparent transition-all duration-300 tracking-tight leading-none">
                 NEURA
               </h1>
               <span className="text-[9px] font-mono text-neura-pink tracking-[0.2em] font-bold whitespace-nowrap mt-0.5">
                 GLOBAL MAP
               </span>
             </div>
          </Link>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neura-pink/20 via-neura-pink/10 to-neura-pink/20 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search teams..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gradient-to-br from-neura-card/80 to-neura-card/60 backdrop-blur-sm border border-neutral-800 rounded-xl py-2.5 px-3 pl-9 text-xs focus:outline-none focus:border-neura-pink/60 focus:ring-2 focus:ring-neura-pink/30 transition-all placeholder-gray-500 relative z-10 text-gray-100 font-display shadow-lg"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-neura-pink transition-colors z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                   <div className="w-3.5 h-3.5 border-2 border-neura-pink border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </form>
          {searchError && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {searchError}
            </div>
          )}
        </div>

        {/* TEAM LIST - Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-hide pt-3 md:pt-0 relative z-10">
           {/* Enhanced Header */}
           <div className="sticky top-0 bg-gradient-to-b from-neura-black/95 via-neura-black/95 to-transparent backdrop-blur-sm z-20 py-2 mb-2 -mx-3 px-3 border-b border-neutral-800/50">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-neura-pink animate-pulse shadow-[0_0_6px_#D63384]"></div>
                 <span className="text-[10px] font-display font-bold text-white uppercase tracking-wider">
                   Active Units
                 </span>
               </div>
               <div className="px-2 py-0.5 rounded-lg bg-neura-pink/10 border border-neura-pink/30">
                 <span className="text-[10px] font-mono font-bold text-neura-pink">
                   {teams.length}
                 </span>
               </div>
             </div>
           </div>
           
           {teams.map((team, index) => (
             <TeamCard 
               key={team.id}
               team={team}
               isSelected={team.id === selectedTeamId}
               onClick={() => handleSelectTeam(team)}
             />
           ))}

           {teams.length === 0 && (
             <div className="p-8 text-center border border-dashed border-neutral-800 rounded-2xl bg-neura-card/30 backdrop-blur-sm">
               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neura-pink/10 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-neura-pink/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                 </svg>
               </div>
               <p className="text-sm text-gray-400 font-display mb-2">No teams found</p>
               <p className="text-xs text-gray-500 font-mono">Try searching for a team</p>
             </div>
           )}
        </div>

        {/* TEAM LOGOS CAROUSEL */}
        <div className="hidden md:block px-3 py-4 border-t border-neutral-800/60 z-20">
          <TeamLogosCarousel />
        </div>

        {/* BOTTOM LEFT: Add Team Link & Q&A Link */}
        <div className="hidden md:block p-3 border-t border-neutral-800/60 bg-gradient-to-t from-neura-black to-transparent z-20 space-y-2 relative">
          {/* Decorative gradient line */}
          <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-neura-pink/30 to-transparent"></div>
          
          <Link
             to="/hub"
             className="relative flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 hover:from-neutral-800 hover:to-neutral-800 hover:border-cyan-500/50 hover:text-white text-gray-300 text-xs font-bold tracking-wide transition-all group font-display overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02]"
          >
             {/* Animated gradient overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <span className="relative z-10 w-5 h-5 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_-2px_rgba(6,182,212,0.3)]">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
             </span>
             <span className="relative z-10">TEAM HUB</span>
          </Link>
          <Link
             to="/qa"
             className="relative flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 hover:from-neutral-800 hover:to-neutral-800 hover:border-neura-pink/50 hover:text-white text-gray-300 text-xs font-bold tracking-wide transition-all group font-display overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(214,51,132,0.3)] hover:scale-[1.02]"
          >
             {/* Animated gradient overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/10 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <span className="relative z-10 w-5 h-5 rounded-lg bg-neura-pink/10 text-neura-pink flex items-center justify-center group-hover:scale-110 group-hover:bg-neura-pink/20 transition-all shadow-[0_0_10px_-2px_rgba(214,51,132,0.3)]">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </span>
             <span className="relative z-10">Q&A FORUM</span>
          </Link>
          
          {/* Sign In Button */}
          <Link
             to="/qa"
             className="relative flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl border-2 border-neura-pink/50 hover:border-neura-pink bg-neura-pink/10 hover:bg-neura-pink/20 text-neura-pink hover:text-white text-xs font-bold tracking-wide transition-all group font-display overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(214,51,132,0.3)] hover:scale-[1.02]"
          >
             {/* Animated gradient overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/20 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <span className="relative z-10 w-5 h-5 rounded-lg bg-neura-pink/10 text-neura-pink flex items-center justify-center group-hover:scale-110 group-hover:bg-neura-pink/20 transition-all shadow-[0_0_10px_-2px_rgba(214,51,132,0.3)]">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </span>
             <span className="relative z-10">SIGN IN</span>
          </Link>
          <a 
             href="https://t.me/dricns" 
             target="_blank"
             rel="noreferrer"
             className="relative flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 hover:from-neutral-800 hover:to-neutral-800 hover:border-neura-pink/50 hover:text-white text-gray-300 text-xs font-bold tracking-wide transition-all group font-display overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(214,51,132,0.3)] hover:scale-[1.02]"
          >
             {/* Animated gradient overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/10 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <span className="relative z-10 w-5 h-5 rounded-lg bg-neura-pink/10 text-neura-pink flex items-center justify-center group-hover:scale-110 group-hover:bg-neura-pink/20 transition-all shadow-[0_0_10px_-2px_rgba(214,51,132,0.3)]">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
             </span>
             <span className="relative z-10">ADD YOUR TEAM</span>
          </a>
        </div>
      </aside>

      {/* MAP AREA */}
      <main className="absolute inset-0 md:relative md:flex-1 bg-neutral-900 z-10">
         <LeafletMap 
           teams={teams}
           selectedTeamId={selectedTeamId}
           onSelectTeam={handleSelectTeam}
         />
         
         {/* Aesthetic Gradient Overlays */}
         <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-neura-black to-transparent pointer-events-none z-[400] hidden md:block"></div>
         
         {/* Enhanced Live System Indicator */}
         <div className="absolute top-6 right-6 md:bottom-6 md:right-6 md:top-auto md:left-auto z-[500] pointer-events-none">
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-black/60 via-black/50 to-black/60 px-4 py-2 rounded-full border border-neura-pink/30 text-xs text-gray-300 font-display font-bold flex items-center gap-2.5 shadow-[0_0_30px_rgba(214,51,132,0.3)]">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-neura-pink/10 rounded-full blur-xl"></div>
              
              <div className="relative flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neura-pink opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neura-pink shadow-[0_0_10px_#D63384]"></span>
                </span>
                <span className="relative z-10 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  LIVE SYSTEM
                </span>
              </div>
            </div>
         </div>

         {/* Expanded Details Panel */}
         {selectedTeam && (
           <TeamDetailsPanel team={selectedTeam} onClose={handleCloseDetails} />
         )}
      </main>

    </div>
  );
};

export default MapPage;

