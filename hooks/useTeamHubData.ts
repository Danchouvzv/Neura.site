import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { teamHubService } from '../services/teamHubService';
import { Team, Member, Task, Idea, CalendarEvent, Invitation, TeamActivity } from '../types';

export const useTeamHubData = () => {
  const [user, setUser] = useState<any>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  // Check if Supabase is configured
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUseSupabase(true);
          setUser(session.user);
        }
      } catch (error) {
        console.warn('Supabase not available, using localStorage');
        setUseSupabase(false);
      }
    };
    checkSupabase();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUseSupabase(true);
        await loadDataFromSupabase(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setTeam(null);
        setMembers([]);
        setTasks([]);
        setIdeas([]);
        setEvents([]);
        setInvitations([]);
        setActivities([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load data from Supabase
  const loadDataFromSupabase = useCallback(async (userId: string, userEmail: string) => {
    try {
      setIsLoading(true);

      // Get current team
      const currentTeam = await teamHubService.getCurrentTeam(userId);
      if (currentTeam) {
        setTeam(currentTeam);

        // Load team data
        const [teamMembers, teamTasks, teamIdeas, teamEvents, teamActivities, userInvs] = await Promise.all([
          teamHubService.getTeamMembers(currentTeam.id),
          teamHubService.getTeamTasks(currentTeam.id),
          teamHubService.getTeamIdeas(currentTeam.id),
          teamHubService.getTeamEvents(currentTeam.id),
          teamHubService.getTeamActivities(currentTeam.id),
          teamHubService.getUserInvitations(userEmail),
        ]);

        setMembers(teamMembers);
        setTasks(teamTasks);
        setIdeas(teamIdeas);
        setEvents(teamEvents);
        setActivities(teamActivities);
        setInvitations(userInvs);
      }

      // Load all teams for directory
      const allTeams = await teamHubService.getAllTeams();
      setTeams(allTeams);
    } catch (error: any) {
      console.error('Error loading data from Supabase:', error);
      // Fallback to localStorage
      loadDataFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data from localStorage (fallback)
  const loadDataFromLocalStorage = useCallback(() => {
    try {
      const savedUser = localStorage.getItem('ftc_user');
      const savedTeam = localStorage.getItem('ftc_team');
      const savedTeams = localStorage.getItem('ftc_global_teams');
      const savedMembers = localStorage.getItem('ftc_members');
      const savedTasks = localStorage.getItem('ftc_tasks');
      const savedIdeas = localStorage.getItem('ftc_ideas');
      const savedEvents = localStorage.getItem('ftc_events');
      const savedActivities = localStorage.getItem('ftc_activities');
      const savedInvs = localStorage.getItem('ftc_invitations');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedTeam) setTeam(JSON.parse(savedTeam));
      if (savedTeams) setTeams(JSON.parse(savedTeams));
      if (savedMembers) {
        const allMembers = JSON.parse(savedMembers);
        const teamMembers = team ? allMembers.filter((m: any) => m.teamId === team.id) : [];
        setMembers(teamMembers);
      }
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedActivities) setActivities(JSON.parse(savedActivities));
      if (savedInvs) setInvitations(JSON.parse(savedInvs));
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [team]);

  // Initial load
  useEffect(() => {
    if (user && useSupabase) {
      loadDataFromSupabase(user.id, user.email || '');
    } else {
      loadDataFromLocalStorage();
    }
  }, [user, useSupabase, loadDataFromSupabase, loadDataFromLocalStorage]);

  // Save functions with Supabase support
  const saveTask = useCallback(async (task: Task) => {
    if (useSupabase && team && user) {
      const member = members.find(m => m.email === user.email);
      if (member) {
        const saved = await teamHubService.createTask(task, team.id, member.id);
        if (saved) {
          setTasks(prev => [...prev, saved]);
          return saved;
        }
      }
    } else {
      // localStorage fallback
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      localStorage.setItem('ftc_tasks', JSON.stringify(newTasks));
      return task;
    }
    return null;
  }, [useSupabase, team, user, members, tasks]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (useSupabase) {
      const updated = await teamHubService.updateTask(taskId, updates);
      if (updated) {
        setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
        return updated;
      }
    } else {
      const updated = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
      setTasks(updated);
      localStorage.setItem('ftc_tasks', JSON.stringify(updated));
      return updated.find(t => t.id === taskId) || null;
    }
    return null;
  }, [useSupabase, tasks]);

  const saveIdea = useCallback(async (idea: Idea) => {
    if (useSupabase && team && user) {
      const member = members.find(m => m.email === user.email);
      if (member) {
        const saved = await teamHubService.createIdea(idea, team.id, member.id);
        if (saved) {
          setIdeas(prev => [...prev, saved]);
          return saved;
        }
      }
    } else {
      const newIdeas = [...ideas, idea];
      setIdeas(newIdeas);
      localStorage.setItem('ftc_ideas', JSON.stringify(newIdeas));
      return idea;
    }
    return null;
  }, [useSupabase, team, user, members, ideas]);

  const saveEvent = useCallback(async (event: CalendarEvent) => {
    if (useSupabase && team && user) {
      const member = members.find(m => m.email === user.email);
      if (member) {
        const saved = await teamHubService.createEvent(event, team.id, member.id);
        if (saved) {
          setEvents(prev => [...prev, saved]);
          return saved;
        }
      }
    } else {
      const newEvents = [...events, event];
      setEvents(newEvents);
      localStorage.setItem('ftc_events', JSON.stringify(newEvents));
      return event;
    }
    return null;
  }, [useSupabase, team, user, members, events]);

  const createActivity = useCallback(async (activity: Omit<TeamActivity, 'id'>) => {
    if (useSupabase && team && user) {
      const member = members.find(m => m.email === user.email);
      if (member) {
        const saved = await teamHubService.createActivity(activity, team.id, member.id);
        if (saved) {
          setActivities(prev => [saved, ...prev].slice(0, 50));
          return saved;
        }
      }
    } else {
      const newActivity: TeamActivity = {
        ...activity,
        id: Math.random().toString(36).substr(2, 9),
      };
      const updated = [newActivity, ...activities].slice(0, 50);
      setActivities(updated);
      localStorage.setItem('ftc_activities', JSON.stringify(updated));
      return newActivity;
    }
    return null;
  }, [useSupabase, team, user, members, activities]);

  return {
    user,
    team,
    teams,
    members,
    tasks,
    ideas,
    events,
    invitations,
    activities,
    isLoading,
    useSupabase,
    setUser,
    setTeam,
    setTeams,
    setMembers,
    setTasks,
    setIdeas,
    setEvents,
    setInvitations,
    setActivities,
    saveTask,
    updateTask,
    saveIdea,
    saveEvent,
    createActivity,
    refreshData: () => {
      if (user && useSupabase) {
        loadDataFromSupabase(user.id, user.email || '');
      } else {
        loadDataFromLocalStorage();
      }
    },
  };
};

