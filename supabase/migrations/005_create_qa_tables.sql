-- Q&A System Tables and Views
-- This migration creates tables for questions and answers, plus views with author information

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== QUESTIONS TABLE ====================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  likes UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ANSWERS TABLE ====================
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  likes UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON public.questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_tags ON public.questions USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_author_id ON public.answers(author_id);
CREATE INDEX IF NOT EXISTS idx_answers_created_at ON public.answers(created_at DESC);

-- ==================== ROW LEVEL SECURITY ====================
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Questions policies
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;
CREATE POLICY "Anyone can view questions" ON public.questions
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create questions" ON public.questions;
CREATE POLICY "Authenticated users can create questions" ON public.questions
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own questions" ON public.questions;
CREATE POLICY "Users can update their own questions" ON public.questions
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own questions" ON public.questions;
CREATE POLICY "Users can delete their own questions" ON public.questions
  FOR DELETE
  USING (auth.uid() = author_id);

-- Answers policies
DROP POLICY IF EXISTS "Anyone can view answers" ON public.answers;
CREATE POLICY "Anyone can view answers" ON public.answers
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create answers" ON public.answers;
CREATE POLICY "Authenticated users can create answers" ON public.answers
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own answers" ON public.answers;
CREATE POLICY "Users can update their own answers" ON public.answers
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own answers" ON public.answers;
CREATE POLICY "Users can delete their own answers" ON public.answers
  FOR DELETE
  USING (auth.uid() = author_id);

-- ==================== TRIGGERS FOR UPDATED_AT ====================
CREATE OR REPLACE FUNCTION public.update_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_answers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_questions_updated_at ON public.questions;
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.update_questions_updated_at();

DROP TRIGGER IF EXISTS update_answers_updated_at ON public.answers;
CREATE TRIGGER update_answers_updated_at
BEFORE UPDATE ON public.answers
FOR EACH ROW
EXECUTE FUNCTION public.update_answers_updated_at();

-- ==================== VIEWS WITH AUTHOR INFORMATION ====================

-- View: questions_with_author
-- This view joins questions with users table to get author username
DROP VIEW IF EXISTS public.questions_with_author;
CREATE VIEW public.questions_with_author AS
SELECT 
  q.id,
  q.author_id,
  q.title,
  q.body,
  q.tags,
  q.likes,
  q.created_at,
  q.updated_at,
  u.username AS author_username,
  u.email AS author_email
FROM public.questions q
LEFT JOIN public.users u ON q.author_id = u.id;

-- View: answers_with_author
-- This view joins answers with users table to get author username
DROP VIEW IF EXISTS public.answers_with_author;
CREATE VIEW public.answers_with_author AS
SELECT 
  a.id,
  a.question_id,
  a.author_id,
  a.body,
  a.likes,
  a.created_at,
  a.updated_at,
  u.username AS author_username,
  u.email AS author_email
FROM public.answers a
LEFT JOIN public.users u ON a.author_id = u.id;

-- ==================== RLS FOR VIEWS ====================
-- Views inherit RLS from underlying tables, but we need to grant access
GRANT SELECT ON public.questions_with_author TO authenticated;
GRANT SELECT ON public.questions_with_author TO anon;

GRANT SELECT ON public.answers_with_author TO authenticated;
GRANT SELECT ON public.answers_with_author TO anon;

-- ==================== COMMENTS ====================
-- This migration creates:
-- 1. questions table with all necessary columns
-- 2. answers table with foreign key to questions
-- 3. Indexes for performance
-- 4. RLS policies for security
-- 5. Triggers for auto-updating updated_at
-- 6. Views with author information (questions_with_author, answers_with_author)
--
-- After running this migration:
-- - Q&A system will be fully functional
-- - Views will provide author information automatically
-- - All security policies will be in place

