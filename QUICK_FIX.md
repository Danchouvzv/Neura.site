# ⚡ БЫСТРОЕ ИСПРАВЛЕНИЕ ОШИБКИ

## Проблема: `Invalid API key` в Vercel

### 🔴 Что нужно сделать СЕЙЧАС:

1. **Откройте Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Выберите проект `neura-ftcc`

2. **Settings → Environment Variables → Add:**

   **Первая переменная:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://wdnutnqyaihhxjnasymr.supabase.co
   Environment: ✅ Production ✅ Preview ✅ Development
   ```

   **Вторая переменная:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: [ваш ключ из Supabase Dashboard → Settings → API → anon public]
   Environment: ✅ Production ✅ Preview ✅ Development
   ```

3. **Нажмите "Save"**

4. **Передеплойте:**
   - Deployments → последний деплой → "..." → "Redeploy"

---

## 📍 Где взять ключ:

1. https://app.supabase.com
2. Ваш проект → **Settings** → **API**
3. Скопируйте **anon public** ключ (начинается с `eyJ` или `sb_publishable_`)

---

✅ После этого ошибка исчезнет!

Подробнее: `FIX_VERCEL_ENV.md`

