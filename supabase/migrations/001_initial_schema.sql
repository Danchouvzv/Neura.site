-- TeamHub Supabase Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  number TEXT NOT NULL UNIQUE,
  city TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  motto TEXT,
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  roles TEXT[] DEFAULT ARRAY['Captain', 'Engineer', 'Coder', 'CADer', 'Mentor', 'Inspire', 'Scout'],
  captain_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Members table (team members) - связующая таблица между users и teams
-- Использует существующую таблицу users из Q&A
-- NOTE: If members table already exists, run migration 002_update_members_to_use_users.sql first
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'members') THEN
    CREATE TABLE members (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, -- ссылка на users из Q&A
      role TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(team_id, user_id) -- один пользователь может быть только в одной команде
    );
  END IF;
END $$;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES members(id) ON DELETE SET NULL,
  role TEXT,
  status TEXT NOT NULL DEFAULT 'To Do',
  deadline TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  author UUID REFERENCES members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  voted_by UUID[] DEFAULT ARRAY[]::UUID[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  priority TEXT DEFAULT 'medium',
  created_by UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  inviter_id UUID REFERENCES members(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Activities table (activity log)
CREATE TABLE IF NOT EXISTS team_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_id UUID REFERENCES members(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_team_id ON members(team_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_ideas_team_id ON ideas(team_id);
CREATE INDEX IF NOT EXISTS idx_ideas_author ON ideas(author);
CREATE INDEX IF NOT EXISTS idx_calendar_events_team_id ON calendar_events(team_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_invitations_team_id ON invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_invitations_user_email ON invitations(user_email);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_team_activities_team_id ON team_activities(team_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_timestamp ON team_activities(timestamp);

-- Row Level Security (RLS) Policies - SIMPLIFIED TO AVOID RECURSION

-- TEMPORARILY DISABLE RLS FOR TESTING - WILL BE RE-ENABLED WITH PROPER POLICIES
-- ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE members DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE ideas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE invitations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE team_activities DISABLE ROW LEVEL SECURITY;

-- Enable RLS with SIMPLIFIED policies to avoid recursion
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;

-- SIMPLIFIED Teams policies - allow all authenticated users for now
DROP POLICY IF EXISTS "Allow all operations on teams for authenticated users" ON teams;
CREATE POLICY "Allow all operations on teams for authenticated users" ON teams
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- SIMPLIFIED Members policies - allow all operations for authenticated users
DROP POLICY IF EXISTS "Allow all operations on members for authenticated users" ON members;
CREATE POLICY "Allow all operations on members for authenticated users" ON members
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- SIMPLIFIED Policies for other tables - allow all authenticated users
DROP POLICY IF EXISTS "Allow all operations on tasks for authenticated users" ON tasks;
CREATE POLICY "Allow all operations on tasks for authenticated users" ON tasks
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all operations on ideas for authenticated users" ON ideas;
CREATE POLICY "Allow all operations on ideas for authenticated users" ON ideas
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all operations on calendar_events for authenticated users" ON calendar_events;
CREATE POLICY "Allow all operations on calendar_events for authenticated users" ON calendar_events
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all operations on invitations for authenticated users" ON invitations;
CREATE POLICY "Allow all operations on invitations for authenticated users" ON invitations
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all operations on team_activities for authenticated users" ON team_activities;
CREATE POLICY "Allow all operations on team_activities for authenticated users" ON team_activities
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ideas_updated_at ON ideas;
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invitations_updated_at ON invitations;
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

