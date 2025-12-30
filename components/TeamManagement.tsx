
import React, { useState } from 'react';
import { Member, Team } from '../types';
import { 
  Users, 
  Edit2, 
  Check, 
  X, 
  UserPlus, 
  Trash2, 
  Crown,
  Settings,
  Plus,
  Mail,
  RefreshCw,
  User as UserIcon
} from 'lucide-react';

interface TeamManagementProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  user: any;
  team: Team | null;
  setTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  t: any;
  logActivity: (action: string, target: string, type: any) => void;
  roles: string[];
  setInvitations: any;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ members, setMembers, user, team, setTeam, t, logActivity, roles, setInvitations }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(roles[0]);

  const [newRoleName, setNewRoleName] = useState('');
  const [renamingRole, setRenamingRole] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');

  const isCaptain = user?.role === "Captain";

  const handleEdit = (member: Member) => {
    if (!isCaptain || member.id === user.id) return;
    setEditingId(member.id);
    setTempRole(member.role);
  };

  const handleSaveMember = (id: string) => {
    if (tempRole) {
      const member = members.find(m => m.id === id);
      if (member) logActivity(`изменил роль ${member.name} на`, tempRole.toUpperCase(), 'member');
      setMembers(prev => prev.map(m => m.id === id ? { ...m, role: tempRole } : m));
    }
    setEditingId(null);
    setTempRole(null);
  };

  const handleKick = (id: string) => {
    if (!isCaptain || id === user.id) return;
    const member = members.find(m => m.id === id);
    if (window.confirm(t.confirmKick)) {
      if (member) logActivity('исключил участника', member.name, 'member');
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const addRole = () => {
    if (!newRoleName.trim() || !team) return;
    if (team.roles.includes(newRoleName.trim())) return;
    const updatedRoles = [...team.roles, newRoleName.trim()];
    const updatedTeam = { ...team, roles: updatedRoles };
    setTeam(updatedTeam);
    logActivity('добавил новую роль', newRoleName.trim(), 'member');
    setNewRoleName('');
  };

  const startRenaming = (role: string) => {
    setRenamingRole(role);
    setRenamingValue(role);
  };

  const saveRename = () => {
    if (!team || !renamingRole || !renamingValue.trim() || renamingRole === renamingValue.trim()) {
      setRenamingRole(null);
      return;
    }
    const updatedRoles = team.roles.map(r => r === renamingRole ? renamingValue.trim() : r);
    setTeam({ ...team, roles: updatedRoles });
    
    // Update members who had this role
    setMembers(prev => prev.map(m => m.role === renamingRole ? { ...m, role: renamingValue.trim() } : m));
    
    logActivity(`переименовал роль ${renamingRole} в`, renamingValue.trim(), 'member');
    setRenamingRole(null);
  };

  const removeRole = (role: string) => {
    if (!team || role === "Captain") return;
    const hasMembers = members.some(m => m.role === role);
    if (hasMembers) {
      alert("Cannot remove role while members are assigned to it.");
      return;
    }
    const updatedRoles = team.roles.filter(r => r !== role);
    setTeam({ ...team, roles: updatedRoles });
    logActivity('удалил роль', role, 'member');
  };

  const handleSendInvite = () => {
    if (!inviteEmail.trim() || !inviteName.trim() || !team) return;
    const newInv = {
      id: Math.random().toString(36).substr(2, 9),
      teamId: team.id,
      teamName: team.name,
      teamNumber: team.number,
      inviterName: user.name,
      userName: inviteName.trim(),
      userEmail: inviteEmail.trim(),
      role: inviteRole,
      status: 'pending'
    };
    setInvitations((prev: any) => [...prev, newInv]);
    logActivity('отправил приглашение пользователю', inviteName.trim(), 'member');
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#050505] p-8 rounded-[3rem] border border-pink-500/10 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-pink-600/10 rounded-2xl flex items-center justify-center text-pink-500 border border-pink-500/20 shadow-inner"><Users size={32} /></div>
          <div>
            <h2 className="text-3xl font-black text-white pink-text-glow uppercase tracking-tighter">{isCaptain ? t.management : t.viewOnly}</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">{team?.name} Hub / #{team?.number}</p>
          </div>
        </div>
        {isCaptain && (
          <div className="flex gap-4">
             <button onClick={() => setShowRolesModal(true)} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-3 border border-white/5">
               <Settings size={18} /> {t.manageRoles}
             </button>
             <button onClick={() => setShowInviteModal(true)} className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase transition-all shadow-lg shadow-pink-600/20 flex items-center gap-3 active:scale-95">
               <UserPlus size={18} /> {t.inviteMember}
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {members.map(member => (
          <div key={member.id} className="bg-[#050505] border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-pink-500/30 transition-all group shadow-xl">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-inner">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                {member.role === "Captain" && (
                  <div className="absolute -top-2 -right-2 bg-pink-600 text-white p-1 rounded-lg shadow-lg">
                    <Crown size={10} />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tight text-md flex items-center gap-2">
                  {member.name}
                  {member.id === user.id && <span className="bg-pink-600/10 text-pink-500 text-[8px] px-2 py-0.5 rounded-full uppercase ml-2 border border-pink-500/20">YOU</span>}
                </h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{member.email}</p>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border mt-2 inline-block ${
                  member.role === "Captain" ? 'bg-pink-600/20 border-pink-500 text-pink-500' : 'bg-white/5 border-white/10 text-slate-500'
                }`}>
                  {member.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {editingId === member.id ? (
                <div className="flex items-center gap-2">
                  <select 
                    value={tempRole || member.role}
                    onChange={(e) => setTempRole(e.target.value)}
                    className="bg-black border border-pink-500/30 text-white text-[10px] font-black uppercase rounded-lg px-4 py-2.5 outline-none"
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button onClick={() => handleSaveMember(member.id)} className="p-2.5 bg-green-600 text-white rounded-lg"><Check size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="p-2.5 bg-white/5 text-slate-400 rounded-lg"><X size={16} /></button>
                </div>
              ) : isCaptain && member.id !== user.id ? (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(member)} className="p-3 bg-white/5 hover:bg-white/10 text-slate-500 rounded-xl transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleKick(member.id)} className="p-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
                </div>
              ) : (
                <div className="p-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-slate-700 text-[8px] font-black uppercase tracking-widest">
                  Verified Hub Protocol
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ROLES MANAGEMENT MODAL */}
      {showRolesModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3.5rem] p-10 w-full max-w-lg shadow-[0_0_150px_rgba(236,72,153,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[80px] -mr-32 -mt-32"></div>
              <div className="flex justify-between items-center mb-8 relative">
                <h3 className="text-2xl font-black text-white uppercase pink-text-glow flex items-center gap-3">
                  <Settings className="text-pink-500" size={24} /> {t.manageRoles}
                </h3>
                <button onClick={() => setShowRolesModal(false)} className="bg-white/5 p-2 rounded-full text-slate-600 hover:text-white transition-colors"><X size={24}/></button>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar relative">
                {roles.map(role => (
                   <div key={role} className="flex items-center justify-between bg-black border border-white/5 p-4 rounded-2xl group/role">
                      {renamingRole === role ? (
                        <div className="flex-1 flex gap-2">
                          <input 
                            autoFocus
                            value={renamingValue} 
                            onChange={e => setRenamingValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveRename()}
                            className="bg-slate-900 border border-pink-500/50 rounded-lg px-3 py-1 text-sm text-white font-bold outline-none flex-1"
                          />
                          <button onClick={saveRename} className="bg-green-600 text-white p-2 rounded-lg"><Check size={14}/></button>
                        </div>
                      ) : (
                        <span className="text-sm font-black uppercase text-white tracking-tight">{role}</span>
                      )}
                      
                      {role !== "Captain" && !renamingRole && (
                        <div className="flex gap-1 opacity-0 group-hover/role:opacity-100 transition-opacity">
                          <button onClick={() => startRenaming(role)} className="text-slate-500 hover:text-blue-400 p-2 rounded-lg transition-all"><RefreshCw size={14}/></button>
                          <button onClick={() => removeRole(role)} className="text-slate-500 hover:text-red-500 p-2 rounded-lg transition-all"><Trash2 size={14}/></button>
                        </div>
                      )}
                   </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex gap-3 relative">
                 <input 
                   value={newRoleName} 
                   onChange={e => setNewRoleName(e.target.value)}
                   className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-pink-500/50 text-sm font-bold" 
                   placeholder={t.roleName} 
                 />
                 <button onClick={addRole} className="bg-pink-600 text-white px-6 rounded-2xl hover:bg-pink-500 transition-all shadow-lg active:scale-95"><Plus size={24}/></button>
              </div>
           </div>
        </div>
      )}

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3.5rem] p-10 w-full max-w-md shadow-[0_0_150px_rgba(236,72,153,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[80px] -mr-32 -mt-32"></div>
              <div className="flex justify-between items-center mb-10 relative">
                <h3 className="text-2xl font-black text-white uppercase pink-text-glow flex items-center gap-3">
                  <Mail className="text-pink-500" size={24} /> {t.inviteMember}
                </h3>
                <button onClick={() => setShowInviteModal(false)} className="text-slate-600 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><X size={24}/></button>
              </div>
              <div className="space-y-8 relative">
                <div>
                  <label className="block text-[10px] font-black text-pink-500 uppercase mb-3 tracking-widest ml-1">{t.yourName}</label>
                  <div className="relative group">
                    <UserIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors" />
                    <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl pl-16 pr-8 py-4 text-white outline-none focus:border-pink-500/50 transition-all text-sm font-bold" placeholder="Ivan Ivanov" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-pink-500 uppercase mb-3 tracking-widest ml-1">{t.email}</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors" />
                    <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl pl-16 pr-8 py-4 text-white outline-none focus:border-pink-500/50 transition-all text-sm font-bold" placeholder="member@ftc.kz" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-pink-500 uppercase mb-3 tracking-widest ml-1">Initial Role Assignment</label>
                  <select className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-pink-500/50 transition-all text-sm font-bold appearance-none cursor-pointer" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleSendInvite} 
                  disabled={!inviteEmail.trim() || !inviteName.trim()}
                  className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-30 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-600/30 active:scale-95 transition-all"
                >
                  {t.sendInvite}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
