
import React from 'react';
import { Task, Idea, TaskStatus, TeamActivity, Invitation } from '../types';
import { 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  Activity, 
  Users, 
  ClipboardCheck, 
  Zap,
  Code,
  Hammer,
  Eye,
  ScrollText,
  FileText,
  Lightbulb,
  CheckCircle2,
  Mail,
  Check,
  X as XIcon
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  ideas: Idea[];
  userRole: string;
  user: any;
  team: any;
  t: any;
  activities: TeamActivity[];
  invitations: Invitation[];
  acceptInvitation: (inv: Invitation) => void;
  declineInvitation: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks = [], ideas = [], userRole, user, team, t = {}, activities = [], invitations = [], acceptInvitation, declineInvitation }) => {
  const safeTasks = tasks || [];
  const safeIdeas = ideas || [];
  const safeActivities = activities || [];
  const safeInvitations = invitations || [];
  
  const myTasks = safeTasks.filter(task => 
    (task.assignedTo === user?.id || task.assignedTo === 'Team') &&
    task.status !== TaskStatus.DONE
  );
  
  const teamTasks = safeTasks.filter(task => 
    task.status !== TaskStatus.DONE && 
    task.assignedTo !== user?.id && 
    task.assignedTo !== 'Team'
  );

  const stats = [
    { label: t?.myTasks || 'My Tasks', value: myTasks.length, icon: <Zap className="text-pink-500" />, highlight: true },
    { label: t?.pendingTasks || 'Pending Tasks', value: teamTasks.length, icon: <ClipboardCheck className="text-blue-400" /> },
    { label: t?.activeIdeas || 'Active Ideas', value: safeIdeas.length, icon: <TrendingUp className="text-purple-400" /> },
    { label: t?.daysToComp || 'Days to Comp', value: '24', icon: <AlertCircle className="text-red-400" /> },
  ];

  const userPendingInvs = safeInvitations.filter(i => i.userEmail === user?.email && i.status === 'pending');

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getActivityIcon = (type: TeamActivity['type']) => {
    switch(type) {
      case 'task': return <CheckCircle2 size={14} className="text-blue-400" />;
      case 'idea': return <Lightbulb size={14} className="text-amber-400" />;
      case 'file': return <FileText size={14} className="text-pink-500" />;
      case 'member': return <Users size={14} className="text-green-400" />;
      default: return <Activity size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white pink-text-glow uppercase tracking-tighter leading-none">
            {(t?.welcome || 'Welcome {name}').replace('{name}', user?.name || 'Explorer')}
          </h2>
          <p className="text-slate-500 mt-3 font-bold flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping"></span>
            {team?.name || 'Public Hub'} / {userRole || 'Member'}
          </p>
        </div>
      </div>

      {userPendingInvs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight pink-text-glow flex items-center gap-3">
             <Mail className="text-pink-500" size={20} />
             {t?.notifications || 'Notifications'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPendingInvs.map(inv => (
              <div key={inv.id} className="bg-[#0a0a0a] border border-pink-500/30 p-6 rounded-[2rem] flex items-center justify-between shadow-2xl animate-in zoom-in-95">
                <div>
                   <h4 className="text-white font-black uppercase text-sm">{inv.teamName} / #{inv.teamNumber}</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Invited by {inv.inviterName} as <span className="text-pink-500">{inv.role}</span></p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => acceptInvitation(inv)} className="bg-green-600/20 text-green-500 p-3 rounded-xl hover:bg-green-600 hover:text-white transition-all"><Check size={20} /></button>
                   <button onClick={() => declineInvitation(inv.id)} className="bg-red-600/20 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all"><XIcon size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-[#050505] border ${stat.highlight ? 'border-pink-500/40' : 'border-white/5'} p-8 rounded-[2.5rem] hover:border-pink-500/40 transition-all group shadow-2xl`}>
            <div className="flex items-center justify-between mb-8">
              <div className={`p-4 ${stat.highlight ? 'bg-pink-600/10' : 'bg-white/5'} rounded-2xl group-hover:scale-110 transition-all`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-4xl font-black ${stat.highlight ? 'text-pink-500' : 'text-white'} mb-1 tracking-tighter`}>{stat.value}</p>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase pink-text-glow tracking-tight">
            <Zap className="text-pink-500" size={20} />
            {t?.priorities || 'Priorities'}
          </h3>
          <div className="space-y-4">
            {myTasks.length > 0 ? myTasks.map(task => (
              <div key={task.id} className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between hover:border-pink-500/30 transition-all group shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-600"></div>
                <div>
                  <h4 className="font-bold text-white text-xl uppercase tracking-tight">{task.title}</h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase mt-1">{task.deadline} • {task.status}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
                <Activity className="mx-auto text-slate-800 mb-6" size={48} />
                <p className="text-slate-600 font-black uppercase text-xs tracking-[0.2em]">{t?.noPriorities || 'No priorities'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight pink-text-glow">{t?.recentActivity || 'Recent Activity'}</h3>
          <div className="bg-[#050505] border border-pink-500/10 rounded-[3rem] p-8 relative overflow-hidden shadow-2xl min-h-[400px]">
            <div className="absolute top-0 left-0 w-2 h-full bg-pink-600 opacity-50"></div>
            <div className="space-y-8 relative z-10">
              {safeActivities.length > 0 ? safeActivities.slice(0, 6).map((act) => (
                <div key={act.id} className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-pink-600/10 border border-pink-500/20 flex-shrink-0 flex items-center justify-center text-pink-500">
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-slate-300 leading-snug">
                      <span className="font-black text-white uppercase">{act.userName}</span> {act.action} <span className="text-pink-500 font-bold">{act.target}</span>
                    </p>
                    <span className="text-[9px] text-slate-600 font-black uppercase mt-2 block">{formatTimeAgo(act.timestamp)}</span>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center py-20 opacity-30">
                  <Activity size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase">No activity yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
