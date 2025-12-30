
import React, { useState, useRef } from 'react';
import { Task, TaskStatus, TeamRole, Member, Attachment } from '../types';
import { Plus, MoreVertical, Calendar, X, User, Users, Paperclip, FileCode, ImageIcon } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  members: Member[];
  userRole: TeamRole;
  t: any;
  logActivity: (action: string, target: string, type: any) => void;
  // Added roles prop to match the usage in App.tsx which fixes the type mismatch error
  roles: string[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks, members, userRole, t, logActivity, roles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<TeamRole | 'All'>('All');
  const taskFileInputRef = useRef<HTMLInputElement>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRole, setNewRole] = useState<TeamRole>(TeamRole.ENGINEER);
  const [newAssignee, setNewAssignee] = useState<string>('Team');
  const [newAttachments, setNewAttachments] = useState<Attachment[]>([]);

  const columns: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE];
  const filteredTasks = filterRole === 'All' ? tasks : tasks.filter(t => t.role === filterRole);

  const handleTaskFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const assets: Attachment[] = Array.from(files).map((file: File) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file),
    }));

    setNewAttachments(prev => [...prev, ...assets]);
  };

  const addTask = () => {
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription || 'Task assigned to the team.',
      assignedTo: newAssignee,
      role: newRole,
      status: TaskStatus.TODO,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      attachments: newAttachments
    };
    setTasks([...tasks, newTask]);
    logActivity('created task', newTitle, 'task');
    setNewTitle('');
    setNewDescription('');
    setNewAssignee('Team');
    setNewAttachments([]);
    setIsModalOpen(false);
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    logActivity(`moved ${task.title} to`, newStatus.toUpperCase(), 'task');
  };

  const filteredMembersForRole = members.filter(m => m.role === newRole);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#050505] p-8 rounded-[3rem] border border-pink-500/10 shadow-2xl">
        <div>
          <h2 className="text-3xl font-black text-white pink-text-glow uppercase tracking-tighter leading-none">{t.tasks}</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black border border-white/5 rounded-2xl p-1.5 shadow-inner flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Filter:</span>
            <select 
              className="bg-transparent text-pink-500 text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none cursor-pointer"
              onChange={(e) => setFilterRole(e.target.value as any)}
              value={filterRole}
            >
              <option value="All">{t.allRoles}</option>
              {Object.keys(TeamRole).map(roleKey => (
                <option key={roleKey} value={TeamRole[roleKey as keyof typeof TeamRole]}>
                  {t.roles[roleKey]}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase transition-all shadow-lg shadow-pink-600/30 flex items-center gap-2 active:scale-95"
          >
            <Plus size={18} />
            <span>{t.newTask}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-hidden">
        {columns.map(status => (
          <div key={status} className="flex flex-col min-h-0 bg-[#050505] rounded-[2.5rem] border border-white/5 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-pink-600/20"></div>
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="font-black text-white flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                {t.status[Object.keys(TaskStatus).find(key => TaskStatus[key as keyof typeof TaskStatus] === status) || 'TODO']}
                <span className="bg-pink-600/10 text-pink-500 text-[10px] px-3 py-1 rounded-full border border-pink-500/20">
                  {filteredTasks.filter(t => t.status === status).length}
                </span>
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10">
              {filteredTasks.filter(t => t.status === status).map(task => {
                const assignedMember = members.find(m => m.id === task.assignedTo);
                return (
                  <div key={task.id} className="bg-black/60 border border-white/5 p-6 rounded-[2rem] hover:border-pink-500/50 transition-all group relative shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-pink-500 uppercase tracking-tighter">
                        {t.roles[Object.keys(TeamRole).find(k => TeamRole[k as keyof typeof TeamRole] === task.role) || 'ENGINEER']}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-white text-md mb-2 uppercase tracking-tight leading-tight group-hover:text-pink-400 transition-colors">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 mb-5 line-clamp-2 italic font-medium">{task.description}</p>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <div className="flex items-center gap-2 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                        <Calendar size={14} className="text-pink-600" />
                        {task.deadline}
                      </div>
                      <div className="flex items-center">
                        {assignedMember ? (
                          <div className="flex items-center gap-2 group/member">
                            <img src={assignedMember.avatar} alt={assignedMember.name} className="w-7 h-7 rounded-xl border border-pink-500/30 shadow-inner" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-slate-600">
                            <Users size={14} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <select 
                         className="bg-black text-[9px] font-black uppercase text-pink-500 border border-pink-500/30 rounded-lg px-2 py-1 outline-none cursor-pointer"
                         value={task.status}
                         onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                       >
                         {columns.map(c => <option key={c} value={c}>{t.status[Object.keys(TaskStatus).find(k => TaskStatus[k as keyof typeof TaskStatus] === c) || 'TODO']}</option>)}
                       </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3.5rem] p-10 w-full max-w-xl shadow-[0_0_150px_rgba(236,72,153,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[80px] -mr-32 -mt-32"></div>
            <div className="flex justify-between items-center mb-10 relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Plus size={28} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase pink-text-glow tracking-tighter">{t.newTask}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full p-2"><X size={32}/></button>
            </div>
            
            <div className="space-y-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-pink-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.title}</label>
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 text-white font-bold text-lg outline-none focus:border-pink-500 transition-all" placeholder="e.g. Robot Scrimmage Prep" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-pink-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.roles.SCOUT}</label>
                  <select className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-pink-500 cursor-pointer appearance-none" onChange={(e) => {setNewRole(e.target.value as TeamRole); setNewAssignee('Team');}} value={newRole}>
                    {Object.keys(TeamRole).map(k => (<option key={k} value={TeamRole[k as keyof typeof TeamRole]}>{t.roles[k]}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-pink-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.assignTo}</label>
                  <select className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-pink-500 cursor-pointer appearance-none" onChange={(e) => setNewAssignee(e.target.value)} value={newAssignee}>
                    <option value="Team">{t.entireRole}</option>
                    {filteredMembersForRole.map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-pink-500 uppercase mb-3 tracking-[0.3em] ml-1">{t.description}</label>
                  <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-pink-500 transition-all text-sm resize-none font-medium h-32" placeholder="Detailed mission objectives..." />
                </div>
              </div>

              <div className="flex gap-6 pt-10">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">
                  {t.cancel}
                </button>
                <button onClick={addTask} disabled={!newTitle.trim()} className="flex-[2] bg-pink-600 hover:bg-pink-500 disabled:opacity-30 text-white py-5 px-10 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-[0_20px_40px_rgba(236,72,153,0.3)] transition-all active:scale-95">
                  {t.createMission}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
