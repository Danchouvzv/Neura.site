-- Migration to update members table to use users table
-- Run this if you already have a members table with old structure

-- Step 1: Drop old foreign key and column if exists
DO $$ 
BEGIN
  -- Drop foreign key if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'members_supabase_user_id_fkey'
  ) THEN
    ALTER TABLE members DROP CONSTRAINT members_supabase_user_id_fkey;
  END IF;
  
  -- Drop old column if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'members' AND column_name = 'supabase_user_id'
  ) THEN
    ALTER TABLE members DROP COLUMN supabase_user_id;
  END IF;
  
  -- Drop old columns if they exist (name, email, avatar)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'members' AND column_name = 'name'
  ) THEN
    ALTER TABLE members DROP COLUMN name;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'members' AND column_name = 'email'
  ) THEN
    ALTER TABLE members DROP COLUMN email;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'members' AND column_name = 'avatar'
  ) THEN
    ALTER TABLE members DROP COLUMN avatar;
  END IF;
END $$;

-- Step 2: Add user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'members' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE members ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 3: Migrate data from supabase_user_id to user_id if needed
-- This assumes supabase_user_id was the same as users.id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'members' AND column_name = 'user_id'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'members' AND column_name = 'supabase_user_id'
  ) THEN
    UPDATE members 
    SET user_id = supabase_user_id 
    WHERE user_id IS NULL;
  END IF;
END $$;

-- Step 4: Make user_id NOT NULL after migration
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'members' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE members ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Step 5: Update unique constraint
DO $$
BEGIN
  -- Drop old unique constraint if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'members_team_id_email_key'
  ) THEN
    ALTER TABLE members DROP CONSTRAINT members_team_id_email_key;
  END IF;
  
  -- Add new unique constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'members_team_id_user_id_key'
  ) THEN
    ALTER TABLE members ADD CONSTRAINT members_team_id_user_id_key UNIQUE (team_id, user_id);
  END IF;
END $$;

-- Step 6: Update indexes
DROP INDEX IF EXISTS idx_members_email;
DROP INDEX IF EXISTS idx_members_supabase_user_id;

CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);

