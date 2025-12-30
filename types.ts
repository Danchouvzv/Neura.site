// Map-related types from neura-map-2
export interface MapTeam {
  id: string;
  number: string;
  name: string;
  location: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  website?: string;
  awards?: string[];
  logo?: string;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  created_at: string;
  author_id: string;
  author_username?: string;
}

export interface Answer {
  id: string;
  question_id: string;
  body: string;
  created_at: string;
  author_id: string;
  author_username?: string;
}

export interface QaUser {
  id: string;
  username: string;
  email?: string;
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}

export enum TeamRole {
  CAPTAIN = 'Captain',
  ENGINEER = 'Engineer',
  CODER = 'Coder',
  CADER = 'CADer',
  MENTOR = 'Mentor',
  INSPIRE = 'Inspire',
  SCOUT = 'Scout'
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Member ID
  role: string;
  status: TaskStatus;
  deadline: string;
  attachments?: Attachment[];
}

export interface Idea {
  id: string;
  author: string;
  title: string;
  content: string;
  votedBy: string[];
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  priority: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface TeamActivity {
  id: string;
  userName: string;
  action: string;
  target: string;
  timestamp: number;
  type: 'task' | 'idea' | 'member' | 'file' | 'event';
}

export interface Invitation {
  id: string;
  teamId: string;
  teamName: string;
  teamNumber: string;
  inviterName: string;
  userName: string; // Added recipient name
  userEmail: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Team {
  id: string;
  name: string;
  number: string;
  city: string;
  inviteCode: string;
  motto: string;
  status: string;
  progress: number;
  roles: string[];
}
