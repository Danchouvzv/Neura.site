
import React, { useState, useRef, useEffect } from 'react';
import { User, Shield, Crown, Save, RefreshCcw, Upload, X, Check, ZoomIn, Sparkles, Mail, CheckCircle2, Edit3, Settings, Award, Calendar, Users, MapPin, Globe } from 'lucide-react';
import { Member, Invitation } from '../types';

interface ProfileProps {
  user: any;
  setUser: (u: any) => void;
  team: any;
  setTeam: (t: any) => void;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  t: any;
  lang: 'ru' | 'en';
  invitations?: Invitation[];
  acceptInvitation?: (inv: Invitation) => void;
  declineInvitation?: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  user, 
  setUser, 
  team,
  setTeam,
  members, 
  setMembers, 
  t, 
  lang, 
  invitations = [],
  acceptInvitation = (_inv: Invitation) => {},
  declineInvitation = (_id: string) => {}
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [tempAvatar, setTempAvatar] = useState(user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0, aspect: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setTempAvatar(user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`);
    }
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        setRawImage(reader.result as string);
        setImageMeta({ width: img.width, height: img.height, aspect: img.width / img.height });
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setIsCropModalOpen(true);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyCrop = () => {
    if (!canvasRef.current || !rawImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const size = 400;
      canvas.width = size;
      canvas.height = size;

      const drawWidth = imageMeta.aspect >= 1 ? size * imageMeta.aspect * zoom : size * zoom;
      const drawHeight = imageMeta.aspect >= 1 ? size * zoom : (size / imageMeta.aspect) * zoom;
      
      const dx = (size - drawWidth) / 2 + (offset.x * (size / 300));
      const dy = (size - drawHeight) / 2 + (offset.y * (size / 300));

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
      setTempAvatar(croppedBase64);
      setIsCropModalOpen(false);
    };
    img.src = rawImage;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const randomizeAvatar = () => {
    const newSeed = Math.random().toString(36).substr(2, 7);
    setTempAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`);
  };

  const handleSave = () => {
    const updatedUser = { ...user, name, email, avatar: tempAvatar };
    setUser(updatedUser);
    localStorage.setItem('ftc_user', JSON.stringify(updatedUser));
    
    setMembers(prev => prev.map(m => m.id === user.id ? { ...m, name, avatar: tempAvatar } : m));
    setIsEditing(false);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-2xl z-[400] animate-in slide-in-from-right-4';
    notification.textContent = lang === 'ru' ? 'Профиль сохранен!' : 'Profile saved!';
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const isCaptain = user?.role === "Captain";
  const safeInvitations = invitations || [];
  const safeMembers = members || [];
  const userPendingInvs = safeInvitations.filter(i => i.userEmail === user?.email && i.status === 'pending');
  const teamMembers = safeMembers.filter(m => m.teamId === team?.id);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Hero Profile Section */}
      <div className="relative bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-[#0a0a0a] rounded-[3rem] border border-pink-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/5 via-transparent to-cyan-500/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[100px] -ml-48 -mb-48"></div>
        
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 via-cyan-500 to-pink-600 rounded-[3rem] opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-500"></div>
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-[3rem] bg-gradient-to-br from-slate-900 to-black border-4 border-pink-500/30 overflow-hidden shadow-2xl transition-transform group-hover:scale-105 group-hover:border-pink-500/60">
                  {tempAvatar ? (
                    <img src={tempAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-600/20 to-cyan-500/20">
                      <User size={64} className="text-white/50" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Avatar Action Buttons */}
              <div className="absolute -bottom-2 -right-2 flex flex-col gap-2 z-10">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-3 rounded-2xl shadow-xl hover:from-pink-500 hover:to-pink-600 transition-all active:scale-95 border border-pink-400/30"
                  title={t.changeAvatar || 'Change Avatar'}
                >
                  <Upload size={18} />
                </button>
                <button 
                  onClick={randomizeAvatar}
                  className="bg-slate-800/80 backdrop-blur-sm text-slate-300 p-2.5 rounded-2xl shadow-xl hover:bg-slate-700 transition-all active:scale-95 border border-white/10"
                  title="Randomize"
                >
                  <RefreshCcw size={16} />
                </button>
              </div>
              
              {/* Role Badge */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-sm ${
                  isCaptain 
                    ? 'bg-gradient-to-r from-pink-600/20 to-pink-500/20 text-pink-400 border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.3)]' 
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}>
                  {isCaptain && <Crown size={12} className="inline mr-1" />}
                  {user?.role || 'Member'}
                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-4">
                {!isEditing ? (
                  <>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black text-white pink-text-glow uppercase tracking-tighter mb-2">
                        {name || t.profile || 'Profile'}
                      </h2>
                      <p className="text-slate-400 text-sm font-bold flex items-center justify-center md:justify-start gap-2">
                        <Mail size={14} />
                        {email || 'No email'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
                    >
                      <Edit3 size={16} />
                      {lang === 'ru' ? 'Редактировать' : 'Edit Profile'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest ml-1 text-left">
                          {t.yourName || 'Your Name'}
                        </label>
                        <input 
                          value={name} 
                          onChange={e => setName(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all" 
                          placeholder={t.yourName || 'Your Name'}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest ml-1 text-left">
                          Email
                        </label>
                        <input 
                          type="email"
                          value={email} 
                          onChange={e => setEmail(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all" 
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center gap-3 active:scale-95"
                      >
                        <Save size={18} />
                        {t.saveProfile || 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || '');
                          setEmail(user?.email || '');
                          setTempAvatar(user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`);
                        }}
                        className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                      >
                        {lang === 'ru' ? 'Отмена' : 'Cancel'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team Info Card */}
        {team && (
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-pink-500/20 rounded-[2rem] p-6 shadow-xl hover:border-pink-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-600/10 rounded-2xl flex items-center justify-center text-pink-500 group-hover:bg-pink-600/20 transition-colors">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{t.teams || 'Team'}</p>
                <h3 className="text-lg font-black text-white">{team.name || 'No Team'}</h3>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-bold">#{team.number || 'N/A'}</p>
              {team.city && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={12} />
                  {team.city}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Role Card */}
        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-cyan-500/20 rounded-[2rem] p-6 shadow-xl hover:border-cyan-500/40 transition-all group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Award size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Role</p>
              <h3 className="text-lg font-black text-white">{user?.role || 'Member'}</h3>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-bold">
              {isCaptain ? (lang === 'ru' ? 'Капитан команды' : 'Team Captain') : (lang === 'ru' ? 'Участник' : 'Team Member')}
            </p>
          </div>
        </div>

        {/* Members Count Card */}
        {team && (
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-purple-500/20 rounded-[2rem] p-6 shadow-xl hover:border-purple-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{lang === 'ru' ? 'Участники' : 'Members'}</p>
                <h3 className="text-lg font-black text-white">{teamMembers.length}</h3>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-bold">
                {lang === 'ru' ? 'В команде' : 'In Team'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Invitations Section */}
      {userPendingInvs.length > 0 && (
        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-pink-500/20 rounded-[3rem] p-8 shadow-2xl space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-600/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400 border border-pink-500/30">
              <Mail size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase pink-text-glow tracking-tighter">
                {t.pendingInvites || 'Pending Invitations'}
              </h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                {userPendingInvs.length} {lang === 'ru' ? 'приглашений' : 'invitations'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPendingInvs.map(inv => (
              <div key={inv.id} className="bg-black/60 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:border-pink-500/30 transition-all shadow-lg group">
                <div className="space-y-2 flex-1">
                   <h4 className="text-white font-black uppercase text-sm">{inv.teamName || 'Team'} / #{inv.teamNumber || 'N/A'}</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">
                     {lang === 'ru' ? 'Приглашен' : 'Invited by'} <span className="text-pink-400">{inv.inviterName || 'Unknown'}</span>
                   </p>
                   <div className="flex items-center gap-2 mt-3">
                     <span className="text-[9px] text-pink-500 font-black uppercase tracking-widest bg-pink-600/10 w-fit px-3 py-1 rounded-full border border-pink-500/20">
                       {inv.role || 'Member'}
                     </span>
                   </div>
                </div>
                <div className="flex gap-2 ml-4">
                   <button 
                    onClick={() => acceptInvitation(inv)} 
                    className="p-3 bg-green-600/10 text-green-400 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-lg active:scale-95 border border-green-500/20 hover:border-green-500/50"
                    title={t.accept || 'Accept'}
                   >
                     <Check size={20} />
                   </button>
                   <button 
                    onClick={() => declineInvitation(inv.id)} 
                    className="p-3 bg-red-600/10 text-red-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95 border border-red-500/20 hover:border-red-500/50"
                    title={t.decline || 'Decline'}
                   >
                     <X size={20} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avatar Cropping Modal */}
      {isCropModalOpen && rawImage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-pink-500/30 rounded-[3rem] p-8 w-full max-w-xl shadow-[0_0_100px_rgba(236,72,153,0.2)] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white uppercase pink-text-glow">
                {lang === 'ru' ? 'Настройка аватара' : 'Adjust Avatar'}
              </h3>
              <button onClick={() => setIsCropModalOpen(false)} className="text-slate-600 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <div className="relative aspect-square bg-slate-900 rounded-3xl overflow-hidden cursor-move border border-white/10"
                 ref={containerRef}
                 onMouseDown={handleMouseDown}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}
                 onMouseLeave={handleMouseUp}>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img 
                  src={rawImage} 
                  alt="Source" 
                  className="max-w-none transition-transform duration-75 select-none"
                  style={{ 
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    width: imageMeta.aspect >= 1 ? '100%' : 'auto',
                    height: imageMeta.aspect >= 1 ? 'auto' : '100%'
                  }}
                />
              </div>

              {/* Circular Overlay Mask */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[300px] h-[300px] rounded-full border-2 border-pink-500 ring-[2000px] ring-black/70 shadow-[inset_0_0_30px_rgba(0,0,0,0.7)]"></div>
              </div>

              {/* Aspect Ratio Warning */}
              {Math.abs(imageMeta.aspect - 1) > 0.5 && (
                <div className="absolute bottom-4 left-4 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-400 text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
                  {lang === 'ru' ? 'Широкое соотношение сторон' : 'Wide aspect ratio - adjust crop'}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4">
                <ZoomIn size={18} className="text-slate-500" />
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.01" 
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />
                <span className="text-[10px] font-black text-slate-500 w-8">{Math.round(zoom * 100)}%</span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsCropModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors bg-white/5 rounded-2xl hover:bg-white/10"
                >
                  {lang === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
                <button 
                  onClick={handleApplyCrop}
                  className="flex-[2] bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Check size={18} /> {lang === 'ru' ? 'Применить' : 'Apply Crop'}
                </button>
              </div>
            </div>
            
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
