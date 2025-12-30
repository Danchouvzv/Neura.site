-- Create users table for Q&A if it doesn't exist
-- This table is used by both Q&A and TeamHub

-- Make sure we're working in public schema
SET search_path = public;

-- 1) Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Ensure email column exists (idempotent, no DO needed)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS email TEXT;

-- 3) Create index safely (IF NOT EXISTS exists in PG, but make it explicit)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- 4) Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5) Policies
DROP POLICY IF EXISTS "Users can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

CREATE POLICY "Users can read all users" ON public.users
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (even if email not confirmed yet)
-- Users can insert their own profile (even if email not confirmed yet)
-- This policy allows authenticated users to create their profile during registration
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 6) updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_users_updated_at();
