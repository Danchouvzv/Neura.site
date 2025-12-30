
import React, { useState } from 'react';
import { Users, ShieldCheck, MapPin, ExternalLink, Activity, AlertCircle, Key, Copy, Check } from 'lucide-react';

interface Props {
  t: any;
  teams: any[];
  onJoinHub?: () => void;
  user?: any;
  setUser?: (u: any) => void;
  setTeam?: (t: any) => void;
  setMembers?: any;
}

const TeamsDirectory: React.FC<Props> = ({ t, teams, onJoinHub, user, setUser, setTeam, setMembers }) => {
  const [showInviteCodeModal, setShowInviteCodeModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white pink-text-glow uppercase tracking-tighter">{t.teams}</h2>
          <p className="text-slate-500 text-sm font-medium">Объединяем робототехников со всего Казахстана.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-pink-600/10 border border-pink-500/20 text-pink-500 rounded-xl text-xs font-bold uppercase flex items-center gap-2">
            <Activity size={14} className="animate-pulse" />
            {teams.length} Команд в системе
          </div>
        </div>
      </div>

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="bg-[#050505] border border-white/5 rounded-3xl overflow-hidden hover:border-pink-500/40 transition-all group shadow-2xl relative">
              <div className="h-2 bg-gradient-to-r from-pink-600 to-cyan-500"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-600/10 rounded-2xl flex items-center justify-center text-pink-500 font-black text-xl border border-pink-500/20 group-hover:scale-110 transition-transform">
                    {team.number[0]}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-slate-500`}>
                    #{team.number}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-pink-500 transition-colors uppercase leading-none mb-2">{team.name}</h3>
                <p className="text-xs text-slate-500 mb-4 italic font-medium">"{team.motto}"</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <MapPin size={12} className="text-pink-500" />
                    {team.city || 'KZ'}
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-600 h-full pink-glow" style={{ width: `${team.progress || 0}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <button 
                    onClick={() => {
                      if (team.inviteCode) {
                        navigator.clipboard.writeText(team.inviteCode);
                        setCopiedCode(team.id);
                        setTimeout(() => setCopiedCode(null), 2000);
                      }
                    }}
                    className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 group"
                    title={`Invite Code: ${team.inviteCode}`}
                  >
                    {copiedCode === team.id ? (
                      <>
                        <Check size={14} className="text-green-500" />
                        Скопировано!
                      </>
                    ) : (
                      <>
                        <Key size={14} className="group-hover:text-pink-500" />
                        {team.inviteCode || 'N/A'}
                      </>
                    )}
                  </button>
                  {user && (
                    <button 
                      onClick={() => {
                        if (user.teamId === team.id) {
                          window.location.href = '/hub';
                        } else {
                          setShowInviteCodeModal(true);
                          setInviteCode('');
                        }
                      }}
                      className="text-[10px] font-black uppercase text-pink-500 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} />
                      {user.teamId === team.id ? 'Открыть Хаб' : 'Присоединиться'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
          <AlertCircle className="mx-auto text-slate-800 mb-6" size={48} />
          <p className="text-slate-600 font-black uppercase text-xs tracking-[0.2em]">Список команд пуст</p>
          <p className="text-[10px] text-slate-800 mt-2 uppercase font-medium italic">Станьте первым, кто зарегистрирует свой хаб!</p>
        </div>
      )}

      <div className="bg-[#0a0a0a] border border-pink-500/10 rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#ec489910,_transparent_70%)] opacity-50"></div>
        <div className="relative z-10">
          <ShieldCheck size={48} className="text-pink-500 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white uppercase pink-text-glow mb-2">Хочешь создать свою команду?</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto font-medium italic">Стань частью крупнейшего сообщества робототехники в Центральной Азии. Управляй задачами, делись опытом и побеждай на национальном уровне.</p>
          <button 
            onClick={onJoinHub}
            className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-pink-600 hover:text-white transition-all shadow-2xl active:scale-95"
          >
            {t.joinTeam}
          </button>
        </div>
      </div>

      {/* Invite Code Modal */}
      {showInviteCodeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-pink-500/20 rounded-3xl p-8 max-w-md w-full relative">
            <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
              <Key className="text-pink-500" size={24} />
              Присоединиться к команде
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Введите код приглашения команды, чтобы присоединиться
            </p>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Введите код (например: NEU-12345"
              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-pink-500/50 transition-all text-sm font-bold mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const globalTeams = JSON.parse(localStorage.getItem('ftc_global_teams') || '[]');
                  const foundTeam = globalTeams.find((t: any) => t.inviteCode === inviteCode.trim());
                  
                  if (foundTeam && user && setUser && setTeam && setMembers) {
                    const updatedUser = { ...user, teamId: foundTeam.id, role: 'Member' };
                    setUser(updatedUser);
                    setTeam(foundTeam);
                    localStorage.setItem('ftc_user', JSON.stringify(updatedUser));
                    localStorage.setItem('ftc_team', JSON.stringify(foundTeam));
                    
                    const allMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
                    const teamMembers = allMembers.filter((m: any) => m.teamId === foundTeam.id);
                    setMembers(teamMembers);
                    
                    setShowInviteCodeModal(false);
                    window.location.href = '/hub';
                  } else {
                    alert('Команда с таким кодом не найдена');
                  }
                }}
                disabled={!inviteCode.trim()}
                className="flex-1 bg-pink-600 hover:bg-pink-500 text-white px-6 py-3 rounded-xl font-black text-sm uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Присоединиться
              </button>
              <button
                onClick={() => setShowInviteCodeModal(false)}
                className="px-6 py-3 border border-white/10 hover:border-white/30 text-white rounded-xl font-black text-sm uppercase transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsDirectory;
