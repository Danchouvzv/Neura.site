# Supabase Setup Instructions

## 1. Create .env file

Create a `.env` file in the root directory with the following content:

```env
VITE_SUPABASE_URL=https://wdnutnqyaihhxjnasymr.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_K16J7b3m90jSKeeiLqz8KQ_pyuJvalM
```

## 2. Restart Dev Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## 3. Database Views (Optional but Recommended)

For better performance and to show usernames instead of UUIDs, create these views in your Supabase SQL Editor:

```sql
-- View for questions with author username
create or replace view public.questions_with_author as
select
  q.id,
  q.title,
  q.body,
  q.created_at,
  u.username as author_username,
  q.author_id
from public.questions q
join public.users u on u.id = q.author_id;

-- View for answers with author username
create or replace view public.answers_with_author as
select
  a.id,
  a.question_id,
  a.body,
  a.created_at,
  u.username as author_username,
  a.author_id
from public.answers a
join public.users u on u.id = a.author_id;
```

## 4. Row Level Security (RLS)

Make sure RLS is enabled on your tables and policies are configured correctly:

- `questions` table: Users can read all, insert their own, update/delete their own
- `answers` table: Users can read all, insert their own, update/delete their own
- `users` table: Users can read all, update their own

## 5. Access the Q&A Page

Navigate to `/qa` in your browser to access the Q&A platform.

