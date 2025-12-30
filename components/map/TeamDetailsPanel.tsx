import React from 'react';
import { MapTeam } from '../../types';

interface TeamDetailsPanelProps {
  team: MapTeam;
  onClose: () => void;
}

const TeamDetailsPanel: React.FC<TeamDetailsPanelProps> = ({ team, onClose }) => {
  const formatUrl = (url: string) => {
    if (!url) return '';
    if (!url.startsWith('http')) return `https://${url}`;
    return url;
  };

  const getLinkLabel = (url: string) => {
    if (url.includes('instagram')) return 'Instagram';
    if (url.includes('youtube')) return 'YouTube';
    if (url.includes('facebook')) return 'Facebook';
    if (url.includes('tiktok')) return 'TikTok';
    return 'Website';
  };

  const SocialIcon = ({ url }: { url: string }) => {
    if (url.includes('instagram')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    }
    if (url.includes('youtube')) {
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33A29 29 0 0 0 22.54 6.42z"></path>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
          </svg>
        );
    }
    // Default Globe
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    );
  };

  return (
    <div className="absolute top-auto bottom-0 left-0 right-0 md:top-6 md:right-6 md:left-auto md:bottom-auto md:w-[360px] z-[1000] p-3 md:p-4 animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-300">
      {/* Glow effect behind panel */}
      <div className="absolute inset-0 bg-neura-pink/10 blur-2xl rounded-3xl opacity-50"></div>
      
      <div className="relative bg-gradient-to-br from-[#0a0a0a]/98 via-[#0a0a0a]/95 to-[#0a0a0a]/98 backdrop-blur-2xl border border-neura-pink/40 rounded-2xl shadow-[0_0_60px_-15px_rgba(214,51,132,0.4)] overflow-hidden flex flex-col max-h-[80vh] md:max-h-[85vh]">
        
        {/* Enhanced Header Background Gradient */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-neura-pink/25 via-neura-pink/10 to-transparent pointer-events-none" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/5 to-neura-pink/0 opacity-50"></div>

        {/* Enhanced Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/40 hover:bg-neura-pink/20 text-white/70 hover:text-white border border-white/10 hover:border-neura-pink/50 transition-all z-10 backdrop-blur-sm hover:scale-110 shadow-lg hover:shadow-[0_0_20px_rgba(214,51,132,0.4)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-5 md:p-6 relative overflow-y-auto scrollbar-hide">
          {/* Header Info - Enhanced */}
          <div className="flex flex-col gap-3 mb-5 relative z-10">
            <div className="flex items-start gap-4">
              {team.logo && (
                <div className="relative flex-shrink-0">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-neura-pink/20 blur-xl rounded-xl"></div>
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-black/60 to-black/40 border-2 border-neura-pink/30 flex-shrink-0 shadow-[0_0_30px_rgba(214,51,132,0.4)]">
                  <img 
                    src={team.logo} 
                    alt={`${team.name} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-gradient-to-r from-neura-pink to-pink-600 text-white shadow-[0_0_20px_rgba(214,51,132,0.5)] mb-2 border border-neura-pink/50">
                  #{team.number}
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent leading-tight mb-2">
                  {team.name}
                </h2>
                <div className="flex items-center gap-2.5 text-gray-300 text-sm font-display">
                  <div className="p-1.5 rounded-lg bg-neura-pink/10 border border-neura-pink/20">
                    <svg className="w-4 h-4 text-neura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  </div>
                  <span className="font-mono">{team.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Awards - Enhanced */}
          {team.awards && team.awards.length > 0 && (
            <div className="mb-6 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-neura-pink to-pink-600 rounded-full"></div>
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-display font-bold">Achievements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {team.awards.map((award, i) => (
                  <span key={i} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-br from-neura-pink/10 to-pink-600/10 border border-neura-pink/30 text-neura-pink shadow-[0_0_10px_rgba(214,51,132,0.2)] hover:scale-105 transition-transform">
                    {award}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description - Enhanced */}
          <div className="mb-6 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-neura-pink to-pink-600 rounded-full"></div>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 font-display font-bold">About Team</h3>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 border border-neutral-800/50">
              <p className="text-sm text-gray-200 leading-relaxed font-light">
              {team.description || "No description provided for this team."}
            </p>
            </div>
          </div>

          {/* Contact / Links - Enhanced */}
          {team.website && (
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-neura-pink to-pink-600 rounded-full"></div>
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-display font-bold">Connect</h3>
              </div>
              <a 
                href={formatUrl(team.website)}
                target="_blank" 
                rel="noreferrer"
                className="relative flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 border border-neutral-800/50 hover:border-neura-pink/50 hover:bg-gradient-to-br hover:from-neutral-800/60 hover:to-neutral-800/40 transition-all group overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(214,51,132,0.3)] hover:scale-[1.02]"
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/10 to-neura-pink/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-black/60 to-black/40 border border-neura-pink/20 text-white group-hover:text-neura-pink group-hover:border-neura-pink/40 transition-all shadow-lg">
                    <SocialIcon url={team.website} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-display font-bold text-white group-hover:text-neura-pink transition-colors">
                      {getLinkLabel(team.website)}
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-[180px] font-mono">
                      {team.website}
                    </span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-500 group-hover:text-neura-pink group-hover:translate-x-1 transition-all relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
        
        {/* Enhanced Footer decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-neura-pink via-purple-500 to-transparent opacity-60"></div>
      </div>
    </div>
  );
};

export default TeamDetailsPanel;