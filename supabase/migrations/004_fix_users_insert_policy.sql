-- Fix users table INSERT policy to allow profile creation during registration
-- Problem: 401 Unauthorized when trying to insert user profile
-- This happens because email confirmation is required by default in Supabase

-- Solution 1: Make policy work even for unconfirmed users
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- This policy allows users to insert their own profile
-- It works even if email is not confirmed yet
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Solution 2: If above doesn't work, disable email confirmation in Supabase
-- Go to: Authentication → Settings → Email Auth
-- Disable "Enable email confirmations"
-- This allows users to use the app immediately after registration

-- Solution 3: Create profile later (when user confirms email and signs in)
-- The code already handles this - profile creation is non-critical
-- Profile will be created automatically when user first signs in after email confirmation

