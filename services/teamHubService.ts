import { supabase } from '../lib/supabaseClient';
import { Team, Member, Task, Idea, CalendarEvent, Invitation, TeamActivity, TaskStatus } from '../types';

// Helper to generate invite code
const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// ==================== TEAMS ====================

export const teamHubService = {
  // Get user's current team
  async getCurrentTeam(userId: string): Promise<Team | null> {
    try {
      const { data: member } = await supabase
        .from('members')
        .select('team_id')
        .eq('user_id', userId) // user_id ссылается на users.id
        .single();

      if (!member?.team_id) return null;

      const { data: team, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', member.team_id)
        .single();

      if (error) throw error;
      return this.mapTeamFromDB(team);
    } catch (error: any) {
      console.error('Error getting current team:', error);
      return null;
    }
  },

  // Get all teams (for directory)
  async getAllTeams(): Promise<Team[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapTeamFromDB);
    } catch (error: any) {
      console.error('Error getting teams:', error);
      return [];
    }
  },

  // Create a new team
  async createTeam(teamData: {
    name: string;
    number: string;
    city: string;
    motto: string;
    captainEmail: string;
    captainId: string;
  }): Promise<Team | null> {
    try {
      const inviteCode = generateInviteCode();
      
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamData.name,
          number: teamData.number,
          city: teamData.city,
          motto: teamData.motto,
          invite_code: inviteCode,
          captain_email: teamData.captainEmail,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Get or create user in users table first
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', teamData.captainId)
        .single();

      if (!existingUser) {
        // Create user if doesn't exist
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: teamData.captainId,
            username: teamData.captainEmail.split('@')[0],
            email: teamData.captainEmail,
          });
        if (userError) throw userError;
      }

      // Create captain as member
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          team_id: team.id,
          user_id: teamData.captainId, // ссылка на users.id
          role: 'Captain',
        });

      if (memberError) {
        console.error('Error creating captain member:', memberError);
        // Delete team if member creation fails
        await supabase.from('teams').delete().eq('id', team.id);
        throw memberError;
      }

      return this.mapTeamFromDB(team);
    } catch (error: any) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  // Join team by invite code
  async joinTeamByInviteCode(inviteCode: string, userId: string, userEmail: string, userName: string): Promise<Team | null> {
    try {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (teamError || !team) {
        throw new Error('Invalid invite code');
      }

      // Get or create user in users table first
      let userRecord = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!userRecord.data) {
        // Create user if doesn't exist
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            username: userName,
            email: userEmail,
          });
        if (userError) throw userError;
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('members')
        .select('id')
        .eq('team_id', team.id)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        return this.mapTeamFromDB(team);
      }

      // Create member
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          team_id: team.id,
          user_id: userId, // ссылка на users.id
          role: 'Guest',
        });

      if (memberError) throw memberError;

      return this.mapTeamFromDB(team);
    } catch (error: any) {
      console.error('Error joining team:', error);
      throw error;
    }
  },

  // Map team from database
  mapTeamFromDB(dbTeam: any): Team {
    return {
      id: dbTeam.id,
      name: dbTeam.name,
      number: dbTeam.number,
      city: dbTeam.city || '',
      inviteCode: dbTeam.invite_code,
      motto: dbTeam.motto || '',
      status: dbTeam.status || 'active',
      progress: dbTeam.progress || 0,
      roles: dbTeam.roles || ['Captain', 'Engineer', 'Coder', 'CADer', 'Mentor', 'Inspire', 'Scout'],
    };
  },

  // ==================== MEMBERS ====================

  // Get team members
  async getTeamMembers(teamId: string): Promise<Member[]> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          users:user_id (
            id,
            username,
            email
          )
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(this.mapMemberFromDB);
    } catch (error: any) {
      console.error('Error getting members:', error);
      return [];
    }
  },

  // Update member
  async updateMember(memberId: string, updates: Partial<Member>): Promise<Member | null> {
    try {
      // Update role in members table
      const memberUpdate: any = {
        role: updates.role,
        updated_at: new Date().toISOString(),
      };

      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .update(memberUpdate)
        .eq('id', memberId)
        .select(`
          *,
          users:user_id (
            id,
            username,
            email
          )
        `)
        .single();

      if (memberError) throw memberError;

      // Update user info in users table if provided
      if (updates.name || updates.email) {
        const userUpdate: any = {};
        if (updates.name) userUpdate.username = updates.name;
        if (updates.email) userUpdate.email = updates.email;

        if (memberData.user_id) {
          await supabase
            .from('users')
            .update(userUpdate)
            .eq('id', memberData.user_id);
        }
      }

      return this.mapMemberFromDB(memberData);
    } catch (error: any) {
      console.error('Error updating member:', error);
      return null;
    }
  },

  mapMemberFromDB(dbMember: any): Member {
    const user = dbMember.users || {};
    return {
      id: dbMember.id,
      name: user.username || dbMember.name || 'User',
      email: user.email || dbMember.email || '',
      role: dbMember.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.email || 'user'}`,
    };
  },

  // ==================== TASKS ====================

  // Get team tasks
  async getTeamTasks(teamId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapTaskFromDB);
    } catch (error: any) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  // Create task
  async createTask(task: Omit<Task, 'id'>, teamId: string, createdById: string): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          team_id: teamId,
          title: task.title,
          description: task.description,
          assigned_to: task.assignedTo || null,
          role: task.role,
          status: task.status,
          deadline: task.deadline || null,
          attachments: task.attachments || [],
          created_by: createdById,
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapTaskFromDB(data);
    } catch (error: any) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  // Update task
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.assignedTo) updateData.assigned_to = updates.assignedTo;
      if (updates.role) updateData.role = updates.role;
      if (updates.status) updateData.status = updates.status;
      if (updates.deadline) updateData.deadline = updates.deadline;
      if (updates.attachments) updateData.attachments = updates.attachments;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return this.mapTaskFromDB(data);
    } catch (error: any) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  // Delete task
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  mapTaskFromDB(dbTask: any): Task {
    return {
      id: dbTask.id,
      title: dbTask.title,
      description: dbTask.description || '',
      assignedTo: dbTask.assigned_to || '',
      role: dbTask.role || '',
      status: dbTask.status as TaskStatus,
      deadline: dbTask.deadline || '',
      attachments: dbTask.attachments || [],
    };
  },

  // ==================== IDEAS ====================

  // Get team ideas
  async getTeamIdeas(teamId: string): Promise<Idea[]> {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapIdeaFromDB);
    } catch (error: any) {
      console.error('Error getting ideas:', error);
      return [];
    }
  },

  // Create idea
  async createIdea(idea: Omit<Idea, 'id'>, teamId: string, authorId: string): Promise<Idea | null> {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert({
          team_id: teamId,
          author: authorId,
          title: idea.title,
          content: idea.content,
          voted_by: idea.votedBy || [],
          tags: idea.tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapIdeaFromDB(data);
    } catch (error: any) {
      console.error('Error creating idea:', error);
      return null;
    }
  },

  // Update idea (for voting)
  async updateIdea(ideaId: string, updates: Partial<Idea>): Promise<Idea | null> {
    try {
      const updateData: any = {};
      if (updates.votedBy) updateData.voted_by = updates.votedBy;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.title) updateData.title = updates.title;
      if (updates.content) updateData.content = updates.content;

      const { data, error } = await supabase
        .from('ideas')
        .update(updateData)
        .eq('id', ideaId)
        .select()
        .single();

      if (error) throw error;
      return this.mapIdeaFromDB(data);
    } catch (error: any) {
      console.error('Error updating idea:', error);
      return null;
    }
  },

  mapIdeaFromDB(dbIdea: any): Idea {
    return {
      id: dbIdea.id,
      author: dbIdea.author || '',
      title: dbIdea.title,
      content: dbIdea.content,
      votedBy: dbIdea.voted_by || [],
      tags: dbIdea.tags || [],
    };
  },

  // ==================== CALENDAR EVENTS ====================

  // Get team events
  async getTeamEvents(teamId: string): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('team_id', teamId)
        .order('date', { ascending: true });

      if (error) throw error;
      return (data || []).map(this.mapEventFromDB);
    } catch (error: any) {
      console.error('Error getting events:', error);
      return [];
    }
  },

  // Create event
  async createEvent(event: Omit<CalendarEvent, 'id'>, teamId: string, createdById: string): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          team_id: teamId,
          title: event.title,
          date: event.date,
          location: event.location || '',
          priority: event.priority || 'medium',
          created_by: createdById,
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapEventFromDB(data);
    } catch (error: any) {
      console.error('Error creating event:', error);
      return null;
    }
  },

  // Update event
  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.date) updateData.date = updates.date;
      if (updates.location) updateData.location = updates.location;
      if (updates.priority) updateData.priority = updates.priority;

      const { data, error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return this.mapEventFromDB(data);
    } catch (error: any) {
      console.error('Error updating event:', error);
      return null;
    }
  },

  // Delete event
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting event:', error);
      return false;
    }
  },

  mapEventFromDB(dbEvent: any): CalendarEvent {
    return {
      id: dbEvent.id,
      title: dbEvent.title,
      date: dbEvent.date,
      location: dbEvent.location || '',
      priority: dbEvent.priority || 'medium',
    };
  },

  // ==================== INVITATIONS ====================

  // Get user invitations
  async getUserInvitations(userEmail: string): Promise<Invitation[]> {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          teams:team_id (
            id,
            name,
            number
          )
        `)
        .eq('user_email', userEmail)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapInvitationFromDB);
    } catch (error: any) {
      console.error('Error getting invitations:', error);
      return [];
    }
  },

  // Create invitation
  async createInvitation(invitation: Omit<Invitation, 'id'>, teamId: string, inviterId: string): Promise<Invitation | null> {
    try {
      const { data: team } = await supabase
        .from('teams')
        .select('name, number')
        .eq('id', teamId)
        .single();

      const { data, error } = await supabase
        .from('invitations')
        .insert({
          team_id: teamId,
          inviter_id: inviterId,
          user_email: invitation.userEmail,
          user_name: invitation.userName,
          role: invitation.role,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapInvitationFromDB({ ...data, teams: team });
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      return null;
    }
  },

  // Accept invitation
  async acceptInvitation(invitationId: string, userId: string, userEmail: string, userName: string): Promise<boolean> {
    try {
      const { data: invitation } = await supabase
        .from('invitations')
        .select('team_id, role')
        .eq('id', invitationId)
        .single();

      if (!invitation) throw new Error('Invitation not found');

      // Get or create user in users table
      let userRecord = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!userRecord.data) {
        // Create user if doesn't exist
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            username: userName,
            email: userEmail,
          });
        if (userError) throw userError;
      }

      // Update invitation status
      await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      // Create or update member
      const { data: existingMember } = await supabase
        .from('members')
        .select('id')
        .eq('team_id', invitation.team_id)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        await supabase
          .from('members')
          .update({ role: invitation.role })
          .eq('id', existingMember.id);
      } else {
        await supabase
          .from('members')
          .insert({
            team_id: invitation.team_id,
            user_id: userId, // ссылка на users.id
            role: invitation.role,
          });
      }

      return true;
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      return false;
    }
  },

  // Decline invitation
  async declineInvitation(invitationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error declining invitation:', error);
      return false;
    }
  },

  mapInvitationFromDB(dbInvitation: any): Invitation {
    const team = dbInvitation.teams || {};
    return {
      id: dbInvitation.id,
      teamId: dbInvitation.team_id,
      teamName: team.name || '',
      teamNumber: team.number || '',
      inviterName: dbInvitation.inviter_id || '',
      userName: dbInvitation.user_name || '',
      userEmail: dbInvitation.user_email,
      role: dbInvitation.role,
      status: dbInvitation.status as 'pending' | 'accepted' | 'declined',
    };
  },

  // ==================== TEAM ACTIVITIES ====================

  // Get team activities
  async getTeamActivities(teamId: string, limit: number = 50): Promise<TeamActivity[]> {
    try {
      const { data, error } = await supabase
        .from('team_activities')
        .select('*')
        .eq('team_id', teamId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(this.mapActivityFromDB);
    } catch (error: any) {
      console.error('Error getting activities:', error);
      return [];
    }
  },

  // Create activity
  async createActivity(activity: Omit<TeamActivity, 'id'>, teamId: string, userId: string): Promise<TeamActivity | null> {
    try {
      const { data, error } = await supabase
        .from('team_activities')
        .insert({
          team_id: teamId,
          user_name: activity.userName,
          user_id: userId,
          action: activity.action,
          target: activity.target,
          activity_type: activity.type,
          timestamp: activity.timestamp,
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapActivityFromDB(data);
    } catch (error: any) {
      console.error('Error creating activity:', error);
      return null;
    }
  },

  mapActivityFromDB(dbActivity: any): TeamActivity {
    return {
      id: dbActivity.id,
      userName: dbActivity.user_name,
      action: dbActivity.action,
      target: dbActivity.target,
      timestamp: dbActivity.timestamp,
      type: dbActivity.activity_type as TeamActivity['type'],
    };
  },
};

