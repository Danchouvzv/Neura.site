
import React, { useState } from 'react';
import { Mail, ArrowRight, ChevronLeft, Crown, User, Globe, Tag } from 'lucide-react';
import { Member } from '../types';

interface AuthProps {
  lang: string;
  setLang: (l: any) => void;
  setUser: (u: any) => void;
  setTeam: (t: any) => void;
  setTeams: (ts: any) => void;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  logActivity: (action: string, target: string, type: any) => void;
  t: any;
}

const DEFAULT_ROLES = ["Captain", "Engineer", "Coder", "CADer", "Mentor", "Inspire", "Scout"];

const Auth: React.FC<AuthProps> = ({ lang, setLang, setUser, setTeam, setTeams, setMembers, logActivity, t }) => {
  const [authMode, setAuthMode] = useState<'captain' | 'member' | 'register'>('member');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teamName: '',
    teamNumber: '',
    city: 'Алматы',
    motto: ''
  });

  const login = (user: any, team: any) => {
    // Save user to TeamHub
    localStorage.setItem('ftc_user', JSON.stringify(user));
    
    // Also save to members list if not already there
    const allMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
    const existingMember = allMembers.find((m: any) => m.email === user?.email);
    if (!existingMember && user) {
      localStorage.setItem('ftc_members', JSON.stringify([...allMembers, user]));
    }
    
    if (team) {
      localStorage.setItem('ftc_team', JSON.stringify(team));
      // Re-load members for this specific team
      const teamMembers = allMembers.filter((m: any) => m.teamId === team.id);
      setMembers(teamMembers);
    } else {
      localStorage.removeItem('ftc_team');
      setMembers([]);
    }
    setUser(user);
    setTeam(team);
    
    // Redirect to hub after successful login
    setTimeout(() => {
      window.location.href = '/hub';
    }, 100);
  };

  const handleCaptainLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.name.trim()) {
      alert(lang === 'ru' ? 'Пожалуйста, заполните все поля' : 'Please fill in all fields');
      return;
    }

    try {
      const globalTeams = JSON.parse(localStorage.getItem('ftc_global_teams') || '[]');
      const foundTeam = globalTeams.find((t: any) => t.captainEmail === formData.email.trim());
      
      if (foundTeam) {
         const capUser = { 
           id: 'cap-' + foundTeam.id, 
           name: formData.name.trim(), 
           email: formData.email.trim(), 
           role: "Captain", 
           teamId: foundTeam.id,
           avatar: foundTeam.captainAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
         };
         login(capUser, foundTeam);
      } else {
         alert(lang === 'ru' ? "Хаб капитана с таким Email не найден. Сначала зарегистрируйте Хаб." : "Captain Hub with this email not found. Register your Hub first.");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(lang === 'ru' ? 'Ошибка при входе. Попробуйте еще раз.' : 'Login error. Please try again.');
    }
  };

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.name.trim()) {
      alert(lang === 'ru' ? 'Пожалуйста, заполните все поля' : 'Please fill in all fields');
      return;
    }

    try {
      const savedMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
      const globalTeams = JSON.parse(localStorage.getItem('ftc_global_teams') || '[]');
      
      const foundMember = savedMembers.find((m: any) => m.email === formData.email.trim());
      
      if (foundMember) {
         const memberTeam = globalTeams.find((t: any) => t.id === foundMember.teamId);
         login(foundMember, memberTeam || null);
      } else {
         // Create new guest user
         const newUser = { 
           id: 'u-' + Math.random().toString(36).substr(2, 5), 
           name: formData.name.trim(), 
           email: formData.email.trim(), 
           role: "Guest",
           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
         };
         // Save new user to members list
         localStorage.setItem('ftc_members', JSON.stringify([...savedMembers, newUser]));
         login(newUser, null);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(lang === 'ru' ? 'Ошибка при входе. Попробуйте еще раз.' : 'Login error. Please try again.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Validate all required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.teamName.trim() || !formData.teamNumber.trim()) {
      alert(lang === 'ru' ? 'Пожалуйста, заполните все обязательные поля' : 'Please fill in all required fields');
      setStep(1);
      return;
    }

    try {
      const globalTeams = JSON.parse(localStorage.getItem('ftc_global_teams') || '[]');
      
      // Check if team number already exists
      const existingTeam = globalTeams.find((t: any) => t.number === formData.teamNumber.trim());
      if (existingTeam) {
        alert(lang === 'ru' ? `Команда с номером ${formData.teamNumber} уже существует` : `Team with number ${formData.teamNumber} already exists`);
        return;
      }

      // Check if email already used
      const existingCaptain = globalTeams.find((t: any) => t.captainEmail === formData.email.trim());
      if (existingCaptain) {
        alert(lang === 'ru' ? 'Этот email уже используется как капитан другой команды' : 'This email is already used as captain of another team');
        return;
      }

      const teamId = 't-' + Math.random().toString(36).substr(2, 9);
      const teamObj = { 
        id: teamId, 
        name: formData.teamName.trim(), 
        number: formData.teamNumber.trim(), 
        city: formData.city || 'Алматы',
        captainEmail: formData.email.trim(),
        captainName: formData.name.trim(),
        inviteCode: `${formData.teamName.slice(0,3).toUpperCase()}-${formData.teamNumber}`,
        motto: formData.motto || (lang === 'ru' ? 'Вперед к победе!' : 'Towards Victory!'),
        status: 'Active',
        progress: 0,
        roles: [...DEFAULT_ROLES]
      };

      const capUser = { 
        id: 'cap-' + teamId, 
        name: formData.name.trim(), 
        email: formData.email.trim(),
        role: "Captain",
        teamId: teamId,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
      } as any;
      
      // Save Team
      localStorage.setItem('ftc_global_teams', JSON.stringify([...globalTeams, teamObj]));
      setTeams([...globalTeams, teamObj]);

      // Save Member (Captain)
      const savedMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
      localStorage.setItem('ftc_members', JSON.stringify([...savedMembers, capUser]));
      setMembers([capUser]);
      
      login(capUser, teamObj);
      logActivity('инициализировал Хаб команды', teamObj.name, 'member');
    } catch (error) {
      console.error('Registration error:', error);
      alert(lang === 'ru' ? 'Ошибка при регистрации. Попробуйте еще раз.' : 'Registration error. Please try again.');
    }
  };

  const handleGuestView = () => {
    const guestUser = { id: 'guest-' + Math.random().toString(36).substr(2, 5), name: 'Guest', email: 'guest@ftc.kz', role: "Scout", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest` };
    login(guestUser, null);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#250012,_#000)]">
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
           <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-700 rounded-3xl flex items-center justify-center font-black text-white text-4xl shadow-[0_0_40px_rgba(236,72,153,0.4)] mx-auto mb-6 rotate-3">N</div>
           <h1 className="text-4xl font-black text-white pink-text-glow tracking-tighter uppercase italic leading-none">Neura Hub</h1>
           <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] mt-3 opacity-60">{t.authDesc}</p>
        </div>

        <div className="bg-[#080808]/80 backdrop-blur-2xl border border-pink-500/20 rounded-[3rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="flex bg-black/50 rounded-2xl p-1 mb-10 border border-white/5 overflow-hidden">
            <button 
              onClick={() => { setAuthMode('member'); setStep(1); }}
              className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all ${authMode === 'member' ? 'bg-white/10 text-white shadow-inner' : 'text-slate-500 hover:text-white'}`}
            >
              {t.memberLogin}
            </button>
            <button 
              onClick={() => { setAuthMode('captain'); setStep(1); }}
              className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all ${authMode === 'captain' ? 'bg-pink-600/20 text-pink-500' : 'text-slate-500 hover:text-white'}`}
            >
              {t.captainLogin}
            </button>
            <button 
              onClick={() => { setAuthMode('register'); setStep(1); }}
              className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all ${authMode === 'register' ? 'bg-pink-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              {t.register}
            </button>
          </div>

          {(authMode === 'member' || authMode === 'captain') && (
             <form onSubmit={authMode === 'member' ? handleMemberLogin : handleCaptainLogin} className="space-y-6 animate-in fade-in duration-300">
               <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.yourName}</label>
                  <div className="relative group">
                    <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors" />
                    <input 
                      type="text"
                      required
                      className="w-full bg-black border border-white/10 rounded-2xl pl-16 pr-8 py-4 text-white outline-none focus:border-white/30 transition-all text-sm font-bold"
                      placeholder={t.placeholderUser}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.email}</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors" />
                    <input 
                      type="email"
                      required
                      className="w-full bg-black border border-white/10 rounded-2xl pl-16 pr-8 py-4 text-white outline-none focus:border-white/30 transition-all text-sm font-bold"
                      placeholder={t.placeholderEmail}
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
               </div>
               <button type="submit" className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-xl ${authMode === 'captain' ? 'bg-pink-600 text-white shadow-pink-600/20' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                 {t.login}
               </button>
             </form>
          )}

          {authMode === 'register' && (
             <form onSubmit={handleRegister} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-[9px] font-black text-pink-500 uppercase mb-4 tracking-[0.3em] ml-1">{t.step1}</label>
                      <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-pink-500/50 mb-4 font-bold text-sm" placeholder={t.placeholderUser} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-pink-500/50 font-bold text-sm" type="email" placeholder={t.placeholderEmail} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <button type="submit" disabled={!formData.name || !formData.email} className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-600 transition-all disabled:opacity-30">
                      {lang === 'ru' ? 'Далее' : 'Next'}
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <label className="block text-[9px] font-black text-pink-500 uppercase mb-1 tracking-[0.3em] ml-1">{t.step2}</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm" placeholder={t.teamNumber} value={formData.teamNumber} onChange={e => setFormData({...formData, teamNumber: e.target.value})} required />
                      <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white uppercase font-bold text-sm" placeholder={t.teamName} value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} required />
                    </div>
                    <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm" placeholder={t.motto} value={formData.motto} onChange={e => setFormData({...formData, motto: e.target.value})} />
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(1)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"><ChevronLeft size={20}/></button>
                      <button type="submit" disabled={!formData.teamName || !formData.teamNumber} className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-600 transition-all disabled:opacity-30">
                        {lang === 'ru' ? 'Последний шаг' : 'Last Step'}
                      </button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="p-8 bg-pink-600/5 border border-pink-500/20 rounded-[2.5rem] text-center">
                      <Crown className="text-pink-500 mx-auto mb-4 animate-bounce" size={40} />
                      <h4 className="text-white font-black uppercase text-md mb-2 tracking-tighter">Neura Hub</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{formData.teamName} Command Hub</p>
                    </div>
                    <div className="flex gap-4">
                       <button type="button" onClick={() => setStep(2)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"><ChevronLeft size={20}/></button>
                       <button type="submit" className="flex-1 bg-pink-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-600/30">
                         {t.createTeam}
                       </button>
                    </div>
                  </div>
                )}
             </form>
          )}

          <button onClick={handleGuestView} className="w-full mt-10 py-2 text-slate-600 text-[10px] font-black uppercase hover:text-pink-400 transition-colors flex items-center justify-center gap-2 tracking-[0.2em]">
            <Globe size={12}/> {t.guestMode}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
