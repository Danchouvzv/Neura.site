import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { teamHubService } from './services/teamHubService';
import { 
  LayoutGrid, 
  CheckSquare, 
  BookOpen, 
  Lightbulb, 
  BarChart3, 
  Calendar, 
  Users, 
  Search,
  Bell,
  Menu,
  Sparkles,
  LogOut,
  UserPlus,
  ShieldCheck,
  Settings,
  X,
  CheckCircle2,
  AlertCircle,
  Crown,
  User as UserIcon,
  Map as MapIcon
} from 'lucide-react';
import { TaskStatus, Task, Idea, Member, Invitation, CalendarEvent, TeamActivity, Team } from './types';
import { translations } from './translations';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import KnowledgeBase from './components/KnowledgeBase';
import InnovationHub from './components/InnovationHub';
import Analytics from './components/Analytics';
import TeamCalendar from './components/TeamCalendar';
import Auth from './components/Auth';
import TeamsDirectory from './components/TeamsDirectory';
import GlobalAiAssistant from './components/GlobalAiAssistant';
import TeamManagement from './components/TeamManagement';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import MapPage from './components/map/MapPage';
import QAPage from './components/qa/QAPage';
import SignInPage from './components/auth/SignInPage';
import SignUpPage from './components/auth/SignUpPage';

const DEFAULT_ROLES = ["Captain", "Engineer", "Coder", "CADer", "Mentor", "Inspire", "Scout"];

// TeamHub Content Component with navigation
interface TeamHubContentProps {
  lang: 'en' | 'ru';
  setLang: (l: 'en' | 'ru') => void;
  user: any;
  team: Team | null;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  invitations: Invitation[];
  setInvitations: React.Dispatch<React.SetStateAction<Invitation[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  activities: TeamActivity[];
  setActivities: React.Dispatch<React.SetStateAction<TeamActivity[]>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  logActivity: (action: string, target: string, type: TeamActivity['type']) => void;
  t: any;
  handleLogout: () => void;
}

const TeamHubContent: React.FC<TeamHubContentProps> = ({
  lang, setLang, user, team, teams, setTeams, members, setMembers, invitations, setInvitations,
  tasks, setTasks, ideas, setIdeas, events, setEvents, activities, setActivities,
  activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, isAssistantOpen, setIsAssistantOpen,
  logActivity, t, handleLogout
}) => {
  const navigate = useNavigate();
  const isCaptain = user?.role === "Captain";
  const userPendingInvs = invitations.filter(i => i.userEmail === user?.email && i.status === 'pending');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} team={team} members={members} tasks={tasks} activities={activities} invitations={invitations} setInvitations={setInvitations} logActivity={logActivity} t={t} />;
      case 'tasks': return <TaskBoard team={team} tasks={tasks} setTasks={setTasks} members={members} logActivity={logActivity} t={t} />;
      case 'knowledge': return <KnowledgeBase team={team} t={t} />;
      case 'innovation': return <InnovationHub team={team} ideas={ideas} setIdeas={setIdeas} members={members} logActivity={logActivity} t={t} />;
      case 'management': return isCaptain ? <TeamManagement team={team} setTeam={(t: any) => {}} members={members} setMembers={setMembers} invitations={invitations} setInvitations={setInvitations} logActivity={logActivity} t={t} /> : <div className="text-center py-20"><p className="text-slate-500">{t.membersOnly}</p></div>;
      case 'calendar': return <TeamCalendar team={team} events={events} setEvents={setEvents} members={members} logActivity={logActivity} t={t} />;
      case 'teams': return <TeamsDirectory teams={teams} setTeams={setTeams} user={user} setUser={(u: any) => {}} setTeam={(t: any) => {}} setMembers={setMembers} logActivity={logActivity} t={t} />;
      case 'profile': return <Profile user={user} team={team} setUser={(u: any) => {}} setTeam={(t: any) => {}} t={t} />;
      default: return <Dashboard user={user} team={team} members={members} tasks={tasks} activities={activities} invitations={invitations} setInvitations={setInvitations} logActivity={logActivity} t={t} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black text-slate-200">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#050505] border-r border-pink-500/20 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg pink-glow">N</div>
          {isSidebarOpen && <h1 className="text-xl font-black text-white pink-text-glow uppercase tracking-tighter">NeuraHub</h1>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', label: t.dashboard, icon: <LayoutGrid size={20} />, private: true },
            { id: 'tasks', label: t.tasks, icon: <CheckSquare size={20} />, private: true },
            { id: 'knowledge', label: t.knowledge, icon: <BookOpen size={20} />, private: true },
            { id: 'innovation', label: t.innovation, icon: <Lightbulb size={20} />, private: true },
            { id: 'management', label: isCaptain ? t.management : t.members, icon: <Settings size={20} />, private: true },
            { id: 'calendar', label: t.calendar, icon: <Calendar size={20} />, private: true },
            { id: 'teams', label: t.teams, icon: <Users size={20} />, private: false },
            { id: 'map', label: 'Map', icon: <MapIcon size={20} />, private: false },
            { id: 'qa', label: 'Q&A', icon: <Search size={20} />, private: false },
            { id: 'profile', label: t.profile, icon: <UserIcon size={20} />, private: false },
          ].map((item) => {
            if (item.private && !team) return null;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'map') {
                    navigate('/map');
                  } else if (item.id === 'qa') {
                    navigate('/qa');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                  ? 'bg-pink-600/20 text-pink-500 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.1)]' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-pink-400'
                }`}
              >
                {item.icon}
                {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                {item.id === 'dashboard' && userPendingInvs.length > 0 && isSidebarOpen && (
                   <span className="ml-auto w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center text-[10px] text-white animate-pulse">
                     {userPendingInvs.length}
                   </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-pink-500/10">
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 bg-white/[0.02] rounded-2xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors group/user"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-pink-500/30 overflow-hidden shrink-0">
               <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-black text-white truncate group-hover/user:text-pink-500 transition-colors">{user?.name || t.guestMode}</p>
                <p className={`text-[8px] uppercase font-black truncate flex items-center gap-1 ${isCaptain ? 'text-pink-500' : 'text-slate-500'}`}>
                  {isCaptain && <Crown size={10} />}
                  {user?.role || 'Guest'}
                </p>
              </div>
            )}
          </div>
          {user && isSidebarOpen && (
            <button onClick={handleLogout} className="mt-4 w-full flex items-center justify-center gap-2 text-slate-600 hover:text-red-500 transition-colors py-2 text-[10px] font-black uppercase tracking-widest">
              <LogOut size={16} /> {t.logout}
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 bg-black/80 backdrop-blur-xl border-b border-pink-500/10 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-pink-500">
              <Menu size={20} />
            </button>
            <div className="flex bg-[#0a0a0a] rounded-lg p-1 border border-white/5">
              <button onClick={() => setLang('ru')} className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${lang === 'ru' ? 'bg-pink-600 text-white' : 'text-slate-600'}`}>RU</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${lang === 'en' ? 'bg-pink-600 text-white' : 'text-slate-600'}`}>EN</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => setIsAssistantOpen(true)} className="flex items-center gap-2 bg-pink-600/10 hover:bg-pink-600 hover:text-white text-pink-500 px-4 py-2 rounded-lg font-black text-xs uppercase transition-all shadow-lg border border-pink-500/20 active:scale-95">
                <Sparkles size={14} />
                <span>{t.aiAssistant}</span>
              </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_top_right,_#10000a,_#000000_60%)]">
          {renderContent()}
        </div>
      </main>

      <GlobalAiAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} t={t} lang={lang} />
    </div>
  );
};

const App: React.FC = () => {
  console.log('App component rendering...');
  const [lang, setLang] = useState<'en' | 'ru'>('ru');
  const [user, setUser] = useState<any>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  
  // Start with empty states as requested
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Load data from Supabase or localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check Supabase auth first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ Supabase user found, loading from Supabase...');
          const supabaseUser = session.user;
          
          // Get current team from Supabase
          const currentTeam = await teamHubService.getCurrentTeam(supabaseUser.id);
          
          if (currentTeam) {
            setTeam(currentTeam);
            
            // Load all team data from Supabase
            const [teamMembers, teamTasks, teamIdeas, teamEvents, teamActivities, userInvs] = await Promise.all([
              teamHubService.getTeamMembers(currentTeam.id),
              teamHubService.getTeamTasks(currentTeam.id),
              teamHubService.getTeamIdeas(currentTeam.id),
              teamHubService.getTeamEvents(currentTeam.id),
              teamHubService.getTeamActivities(currentTeam.id),
              teamHubService.getUserInvitations(supabaseUser.email || ''),
            ]);
            
            setMembers(teamMembers);
            setTasks(teamTasks);
            setIdeas(teamIdeas);
            setEvents(teamEvents);
            setActivities(teamActivities);
            setInvitations(userInvs);
            
            // Create/update user in localStorage for compatibility
            const teamHubUser = {
              id: teamMembers.find(m => m.email === supabaseUser.email)?.id || 'u-' + supabaseUser.id.substring(0, 8),
              name: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              role: teamMembers.find(m => m.email === supabaseUser.email)?.role || 'Guest',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email || 'user'}`,
              supabaseId: supabaseUser.id,
              teamId: currentTeam.id,
            };
            setUser(teamHubUser);
            localStorage.setItem('ftc_user', JSON.stringify(teamHubUser));
          } else {
            // User not in any team yet
            const teamHubUser = {
              id: 'u-' + supabaseUser.id.substring(0, 8),
              name: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              role: 'Guest',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email || 'user'}`,
              supabaseId: supabaseUser.id,
            };
            setUser(teamHubUser);
            localStorage.setItem('ftc_user', JSON.stringify(teamHubUser));
            
            // Load invitations
            const userInvs = await teamHubService.getUserInvitations(supabaseUser.email || '');
            setInvitations(userInvs);
          }
          
          // Load all teams for directory
          const allTeams = await teamHubService.getAllTeams();
          setTeams(allTeams);
        } else {
          // Fallback to localStorage
          console.log('📦 No Supabase session, loading from localStorage...');
          const savedUser = localStorage.getItem('ftc_user');
          const savedTeam = localStorage.getItem('ftc_team');
          
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            
            const allMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
            const teamMembers = allMembers.filter((m: any) => m.teamId === parsedUser.teamId);
            setMembers(teamMembers);
          }
          
          if (savedTeam) setTeam(JSON.parse(savedTeam));
          
          const savedTeams = localStorage.getItem('ftc_global_teams');
          if (savedTeams) setTeams(JSON.parse(savedTeams));
          
          const savedActivities = localStorage.getItem('ftc_activities');
          if (savedActivities) setActivities(JSON.parse(savedActivities));
          
          const savedInvs = localStorage.getItem('ftc_invitations');
          if (savedInvs) setInvitations(JSON.parse(savedInvs));
          
          const savedTasks = localStorage.getItem('ftc_tasks');
          if (savedTasks) setTasks(JSON.parse(savedTasks));
          
          const savedIdeas = localStorage.getItem('ftc_ideas');
          if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
          
          const savedEvents = localStorage.getItem('ftc_events');
          if (savedEvents) setEvents(JSON.parse(savedEvents));
        }
      } catch (error: any) {
        console.error('Error loading data:', error);
        // Fallback to localStorage on error
        const savedUser = localStorage.getItem('ftc_user');
        const savedTeam = localStorage.getItem('ftc_team');
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedTeam) setTeam(JSON.parse(savedTeam));
      }
    };
    
    loadData();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logActivity = useCallback(async (action: string, target: string, type: TeamActivity['type']) => {
    const activeUser = user || JSON.parse(localStorage.getItem('ftc_user') || '{"name": "System"}');
    
    const newActivity: TeamActivity = {
      id: Math.random().toString(36).substr(2, 9),
      userName: activeUser.name,
      action,
      target,
      timestamp: Date.now(),
      type
    };
    
    // Save to Supabase if team exists
    if (team && user) {
      try {
        const member = members.find(m => m.email === user.email);
        if (member) {
          await teamHubService.createActivity(newActivity, team.id, member.id);
        }
      } catch (error) {
        console.error('Error saving activity to Supabase:', error);
      }
    }
    
    // Also save to localStorage for compatibility
    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 50); 
      localStorage.setItem('ftc_activities', JSON.stringify(updated));
      return updated;
    });
  }, [user, team, members]);

  // Sync state to Supabase and localStorage on changes
  useEffect(() => {
    if (user?.teamId && team) {
      // Sync members to Supabase
      members.forEach(async (member) => {
        try {
          await teamHubService.updateMember(member.id, member);
        } catch (error) {
          console.error('Error syncing member to Supabase:', error);
        }
      });
      
      // Also update localStorage for compatibility
      const allMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
      const otherTeamsMembers = allMembers.filter((m: any) => m.teamId !== user.teamId);
      localStorage.setItem('ftc_members', JSON.stringify([...otherTeamsMembers, ...members]));
    }
  }, [members, user, team]);

  useEffect(() => {
    // Sync tasks to Supabase
    if (team && user) {
      tasks.forEach(async (task) => {
        try {
          const member = members.find(m => m.email === user.email);
          if (member && !task.id.startsWith('temp-')) {
            const existing = await teamHubService.getTeamTasks(team.id);
            if (!existing.find(t => t.id === task.id)) {
              await teamHubService.createTask(task, team.id, member.id);
            } else {
              await teamHubService.updateTask(task.id, task);
            }
          }
        } catch (error) {
          console.error('Error syncing task to Supabase:', error);
        }
      });
    }
    
    // Also save to localStorage
    localStorage.setItem('ftc_tasks', JSON.stringify(tasks));
  }, [tasks, team, user, members]);

  useEffect(() => {
    // Sync ideas to Supabase
    if (team && user) {
      ideas.forEach(async (idea) => {
        try {
          const member = members.find(m => m.email === user.email);
          if (member && !idea.id.startsWith('temp-')) {
            const existing = await teamHubService.getTeamIdeas(team.id);
            if (!existing.find(i => i.id === idea.id)) {
              await teamHubService.createIdea(idea, team.id, member.id);
            } else {
              await teamHubService.updateIdea(idea.id, idea);
            }
          }
        } catch (error) {
          console.error('Error syncing idea to Supabase:', error);
        }
      });
    }
    
    // Also save to localStorage
    localStorage.setItem('ftc_ideas', JSON.stringify(ideas));
  }, [ideas, team, user, members]);

  useEffect(() => {
    // Sync events to Supabase
    if (team && user) {
      events.forEach(async (event) => {
        try {
          const member = members.find(m => m.email === user.email);
          if (member && !event.id.startsWith('temp-')) {
            const existing = await teamHubService.getTeamEvents(team.id);
            if (!existing.find(e => e.id === event.id)) {
              await teamHubService.createEvent(event, team.id, member.id);
            } else {
              await teamHubService.updateEvent(event.id, event);
            }
          }
        } catch (error) {
          console.error('Error syncing event to Supabase:', error);
        }
      });
    }
    
    // Also save to localStorage
    localStorage.setItem('ftc_events', JSON.stringify(events));
  }, [events, team, user, members]);

  useEffect(() => {
    // Sync teams to localStorage (teams are read-only from Supabase)
    localStorage.setItem('ftc_global_teams', JSON.stringify(teams));
    if (team) {
       const updatedTeams = teams.map(t => t.id === team.id ? team : t);
       if (JSON.stringify(updatedTeams) !== JSON.stringify(teams)) {
         setTeams(updatedTeams);
       }
    }
  }, [teams, team]);

  useEffect(() => {
    // Invitations are managed through Supabase
    localStorage.setItem('ftc_invitations', JSON.stringify(invitations));
  }, [invitations]);

  const handleLogout = () => {
    localStorage.removeItem('ftc_user');
    localStorage.removeItem('ftc_team');
    setUser(null);
    setTeam(null);
    setMembers([]);
    setActivities([]);
    setActiveTab('dashboard');
  };

  const goToRegister = () => {
    handleLogout(); 
  };

  const t = translations[lang];

  const acceptInvitation = async (inv: Invitation) => {
    if (!user) return;
    
    const joinedTeam = teams.find(t => t.id === inv.teamId);
    if (!joinedTeam) return;

    try {
      // Accept invitation in Supabase
      const success = await teamHubService.acceptInvitation(
        inv.id,
        user.supabaseId || user.id,
        user.email,
        user.name
      );
      
      if (success) {
        // Reload team data from Supabase
        const currentTeam = await teamHubService.getCurrentTeam(user.supabaseId || user.id);
        if (currentTeam) {
          setTeam(currentTeam);
          localStorage.setItem('ftc_team', JSON.stringify(currentTeam));
          
          const teamMembers = await teamHubService.getTeamMembers(currentTeam.id);
          setMembers(teamMembers);
          
          const updatedUser = { ...user, teamId: currentTeam.id, role: inv.role };
          setUser(updatedUser);
          localStorage.setItem('ftc_user', JSON.stringify(updatedUser));
          
          setInvitations(prev => prev.filter(i => i.id !== inv.id));
          await logActivity('accepted invitation to', currentTeam.name, 'member');
        }
      }
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      // Fallback to localStorage
      const newMember: Member = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: inv.role,
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
        teamId: inv.teamId
      } as any;
      
      const allGlobalMembers = JSON.parse(localStorage.getItem('ftc_members') || '[]');
      const existingTeamMembers = allGlobalMembers.filter((m: any) => m.teamId === inv.teamId);
      const updatedGlobalMembers = [...allGlobalMembers.filter((m: any) => m.id !== user.id), newMember];
      localStorage.setItem('ftc_members', JSON.stringify(updatedGlobalMembers));
      
      setMembers([...existingTeamMembers, newMember]);
      setTeam(joinedTeam);
      localStorage.setItem('ftc_team', JSON.stringify(joinedTeam));
      
      const updatedUser = { ...user, teamId: joinedTeam.id, role: inv.role };
      setUser(updatedUser);
      localStorage.setItem('ftc_user', JSON.stringify(updatedUser));
      
      setInvitations(prev => prev.filter(i => i.id !== inv.id));
      await logActivity('accepted invitation to', joinedTeam.name, 'member');
    }
  };

  const declineInvitation = async (invId: string) => {
    try {
      await teamHubService.declineInvitation(invId);
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
    setInvitations(prev => prev.filter(i => i.id !== invId));
  };

  const renderContent = () => {
    const commonProps = { 
      tasks, ideas, setTasks, setIdeas, lang, t, user, team, 
      members, setMembers, events, setEvents, logActivity, activities,
      invitations, setInvitations, acceptInvitation, declineInvitation,
      setTeam, setUser
    };
    
    if ((!team || team.id === 'public-team') && activeTab !== 'teams' && activeTab !== 'dashboard' && activeTab !== 'profile' && activeTab !== 'map' && activeTab !== 'qa') {
       return <TeamsDirectory t={t} teams={teams} onJoinHub={goToRegister} />;
    }

    if (!team && activeTab === 'dashboard') {
      return <TeamsDirectory t={t} teams={teams} onJoinHub={goToRegister} />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard {...commonProps} userRole={user?.role} activities={activities} />;
      case 'tasks': return <TaskBoard {...commonProps} userRole={user?.role} roles={team?.roles || DEFAULT_ROLES} />;
      case 'knowledge': return <KnowledgeBase t={t} logActivity={logActivity} team={team} />;
      case 'innovation': return <InnovationHub {...commonProps} />;
      case 'management': return <TeamManagement {...commonProps} roles={team?.roles || DEFAULT_ROLES} />;
      case 'analytics': return <Analytics tasks={tasks} t={t} />;
      case 'calendar': return <TeamCalendar {...commonProps} lang={lang} />;
      case 'teams': return <TeamsDirectory t={t} teams={teams} onJoinHub={goToRegister} user={user} setUser={setUser} setTeam={setTeam} setMembers={setMembers} />;
      case 'profile': return <Profile {...commonProps} lang={lang} />;
      case 'map': return <MapPage />;
      case 'qa': return <QAPage />;
      default: return <Dashboard {...commonProps} userRole={user?.role} activities={activities} />;
    }
  };

  // Public routes (Landing, Map, Q&A)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/qa/*" element={<QAPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        
        {/* Protected routes - TeamHub */}
        <Route path="/hub/*" element={
          !user ? (
            <Auth lang={lang} setLang={setLang} setUser={setUser} setTeam={setTeam} setTeams={setTeams} setMembers={setMembers} logActivity={logActivity} t={t} />
          ) : (
            <TeamHubContent 
              lang={lang}
              setLang={setLang}
              user={user}
              team={team}
              teams={teams}
              setTeams={setTeams}
              members={members}
              setMembers={setMembers}
              invitations={invitations}
              setInvitations={setInvitations}
              tasks={tasks}
              setTasks={setTasks}
              ideas={ideas}
              setIdeas={setIdeas}
              events={events}
              setEvents={setEvents}
              activities={activities}
              setActivities={setActivities}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              isAssistantOpen={isAssistantOpen}
              setIsAssistantOpen={setIsAssistantOpen}
              logActivity={logActivity}
              t={t}
              handleLogout={handleLogout}
            />
          )
        } />
        
        {/* Redirect /hub to /hub/dashboard */}
        <Route path="/hub" element={<Navigate to="/hub/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
