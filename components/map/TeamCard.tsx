import React from 'react';
import { MapTeam } from '../../types';

interface TeamCardProps {
  team: MapTeam;
  isSelected: boolean;
  onClick: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 group
        border flex flex-col gap-1.5 shrink-0 overflow-hidden
        ${isSelected 
          ? 'bg-gradient-to-br from-neutral-900/90 via-neutral-900/80 to-neutral-900/90 border-neura-pink/50 shadow-[0_8px_30px_-10px_rgba(214,51,132,0.4)] scale-[1.01] z-10' 
          : 'bg-gradient-to-br from-neutral-900/30 via-transparent to-neutral-900/30 border-neutral-800/50 hover:bg-gradient-to-br hover:from-neutral-900/60 hover:via-neutral-900/40 hover:to-neutral-900/60 hover:border-neura-pink/30 hover:scale-[1.005]'}
      `}
    >
      {/* Glow effect on hover/select */}
      <div className={`absolute inset-0 bg-gradient-to-r from-neura-pink/0 via-neura-pink/10 to-neura-pink/0 opacity-0 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'} transition-opacity duration-500`}></div>
      
      {/* Selection Indicator Bar - Enhanced */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neura-pink via-neura-pink to-neura-pink rounded-r-full shadow-[0_0_15px_rgba(214,51,132,0.6)]"></div>
      )}
      
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-neura-pink/5 to-transparent rounded-bl-2xl opacity-0 ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'} transition-opacity`}></div>

      {/* Info Section */}
      <div className="flex justify-between items-center gap-2 relative z-10">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {team.logo && (
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden border flex-shrink-0 transition-all shadow-lg ${isSelected ? 'bg-black/40 border-neura-pink/30 shadow-[0_0_15px_rgba(214,51,132,0.3)] scale-105' : 'bg-black/20 border-white/10 group-hover:border-neura-pink/20 group-hover:scale-105'}`}>
              <img 
                src={team.logo} 
                alt={`${team.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className={`text-xs md:text-sm font-display font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
            {team.name}
          </h3>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded-lg border flex-shrink-0 transition-all ${isSelected ? 'bg-neura-pink/10 border-neura-pink/30 text-neura-pink shadow-[0_0_10px_rgba(214,51,132,0.2)]' : 'bg-neutral-800/30 border-neutral-700/50 text-gray-400 group-hover:border-neura-pink/20 group-hover:text-neura-pink/80'}`}>
          <span className="text-[9px] md:text-[10px] font-mono font-bold">
          #{team.number}
        </span>
        </div>
      </div>
      
      {/* Location */}
      <div className={`text-xs text-gray-400 truncate flex items-center gap-2 relative z-10 ${isSelected ? 'text-gray-300' : 'group-hover:text-gray-300'} transition-colors`}>
        <div className={`flex items-center gap-1.5 ${isSelected ? 'text-neura-pink' : 'text-gray-600 group-hover:text-neura-pink'} transition-colors`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-mono">{team.location}</span>
        </div>
      </div>

      {/* Awards - Enhanced */}
      {team.awards && team.awards.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 relative z-10">
          {team.awards.slice(0, 3).map((award, i) => (
            <span key={i} className={`px-2 py-1 text-[9px] font-medium uppercase tracking-wide rounded-lg border transition-all ${isSelected ? 'bg-neura-pink/10 border-neura-pink/30 text-neura-pink shadow-[0_0_8px_rgba(214,51,132,0.2)]' : 'bg-white/5 text-gray-400 border-white/10 group-hover:border-neura-pink/30 group-hover:text-neura-pink/90 group-hover:bg-neura-pink/5'}`}>
              {award}
            </span>
          ))}
          {team.awards.length > 3 && (
            <span className={`px-2 py-1 text-[9px] font-medium rounded-lg border ${isSelected ? 'bg-neutral-800/50 border-neutral-700/50 text-gray-400' : 'bg-white/5 text-gray-500 border-white/5'}`}>
              +{team.awards.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamCard;