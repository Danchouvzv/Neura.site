# 🔧 Исправление ошибки миграции

## ❌ Ошибка
```
ERROR: 42703: column "user_id" does not exist
```

## 🔍 Причина
Таблица `members` уже существует со старой структурой (с колонками `supabase_user_id`, `name`, `email`, `avatar`), а миграция пытается использовать новую структуру с `user_id`.

## ✅ Решение

### Вариант 1: Применить миграцию обновления (рекомендуется)

1. **Сначала примените миграцию обновления:**
   - Откройте SQL Editor в Supabase
   - Откройте файл `supabase/migrations/002_update_members_to_use_users.sql`
   - Скопируйте весь код
   - Вставьте в SQL Editor
   - Нажмите **Run**

2. **Затем примените основную миграцию:**
   - Откройте `supabase/migrations/001_initial_schema.sql`
   - Скопируйте весь код
   - Вставьте в SQL Editor
   - Нажмите **Run**

### Вариант 2: Удалить и пересоздать таблицу (если нет важных данных)

⚠️ **ВНИМАНИЕ:** Это удалит все данные из таблицы `members`!

```sql
-- Удалить таблицу members
DROP TABLE IF EXISTS members CASCADE;

-- Затем применить основную миграцию 001_initial_schema.sql
```

### Вариант 3: Ручное обновление (если нужно сохранить данные)

```sql
-- 1. Добавить новую колонку user_id
ALTER TABLE members ADD COLUMN user_id UUID;

-- 2. Заполнить user_id из supabase_user_id (если они совпадают)
UPDATE members 
SET user_id = supabase_user_id 
WHERE user_id IS NULL;

-- 3. Создать связь с users таблицей
ALTER TABLE members 
ADD CONSTRAINT members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 4. Сделать user_id обязательным
ALTER TABLE members ALTER COLUMN user_id SET NOT NULL;

-- 5. Удалить старые колонки
ALTER TABLE members DROP COLUMN IF EXISTS supabase_user_id;
ALTER TABLE members DROP COLUMN IF EXISTS name;
ALTER TABLE members DROP COLUMN IF EXISTS email;
ALTER TABLE members DROP COLUMN IF EXISTS avatar;

-- 6. Обновить уникальное ограничение
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_team_id_email_key;
ALTER TABLE members ADD CONSTRAINT members_team_id_user_id_key UNIQUE (team_id, user_id);

-- 7. Обновить индексы
DROP INDEX IF EXISTS idx_members_email;
DROP INDEX IF EXISTS idx_members_supabase_user_id;
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
```

## ✅ После исправления

Проверьте структуру таблицы:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'members'
ORDER BY ordinal_position;
```

Должны быть колонки:
- `id`
- `team_id`
- `user_id` ✅
- `role`
- `created_at`
- `updated_at`

## 📝 Примечание

Если у вас уже есть данные в таблице `members` со старой структурой, используйте **Вариант 3** для сохранения данных.

