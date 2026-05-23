# Настройка Supabase для SubSpy

Пошаговая инструкция. Занимает ~15 минут.

---

## Шаг 1. Создать проект

1. Откройте [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project**
3. Заполните:
   - **Name:** `subspy`
   - **Database password:** придумайте и **сохраните** (для SQL-доступа, не для приложения)
   - **Region:** West US / EU Central (по желанию)
4. **Create new project** → подождите 1–2 минуты (статус Active)

---

## Шаг 2. Таблицы и триггеры (SQL)

1. В левом меню: **SQL Editor**
2. **New query**
3. Скопируйте **весь** файл `supabase/setup_all.sql` из репозитория
4. **Run** (или Ctrl+Enter)
5. Должно быть: `Success. No rows returned`

**Проверка:** **Table Editor** → схема `public` → таблицы:
- `profiles`
- `subscriptions`
- `email_logs`
- `alerts_sent`

---

## Шаг 3. Ключи API → Vercel и локально

1. **Project Settings** (шестерёнка) → **API**
2. Скопируйте:

| Поле в Supabase | Переменная в `.env.local` / Vercel |
|-----------------|-------------------------------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role (Reveal) | `SUPABASE_SERVICE_ROLE_KEY` |

3. Локально: `d:\SubSpy\.env.local` (создайте из `.env.example`)
4. Vercel: **Project → Settings → Environment Variables** — те же три для **Production** и **Preview**
5. **Redeploy** на Vercel после сохранения переменных

> `service_role` — секрет. Только сервер (Vercel), никогда в браузер.

---

## Шаг 4. URL для авторизации

1. **Authentication** → **URL Configuration**
2. **Site URL:**
   ```
   https://sub-spy-kappa.vercel.app
   ```
   (или ваш домен)
3. **Redirect URLs** — добавьте обе строки:
   ```
   https://sub-spy-kappa.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```
4. **Save**

---

## Шаг 5. Включить вход (Google + Email)

### Вариант A — только Email (magic link, проще для старта)

1. **Authentication** → **Providers** → **Email**
2. Включите **Enable Email provider**
3. (Опционально) отключите **Confirm email** для быстрого теста

### Вариант B — Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → проект → **Credentials**
2. **Create Credentials** → **OAuth client ID** → **Web application**
3. **Authorized redirect URIs** — скопируйте из Supabase:
   - **Authentication** → **Providers** → **Google** → там будет Callback URL вида  
     `https://XXXXXXXX.supabase.co/auth/v1/callback`
4. Вставьте **Client ID** и **Client Secret** в Supabase → Google → **Save**

---

## Шаг 6. Проверка

1. Откройте сайт → **Join the Beta** / **Sign in**
2. Войдите (Google или magic link)
3. В Supabase **Table Editor** → `profiles` — новая строка:
   - ваш `email`
   - `forward_alias` (5 символов)
   - `plan` = `beta`
4. В приложении: **Settings** — виден alias `xxxxx@in.subspy.app`

---

## Что создаётся автоматически

| Событие | Что происходит |
|---------|----------------|
| Первый вход | Триггер создаёт `profiles` + уникальный `forward_alias` |
| Forward email (позже) | Worker → API → `email_logs` + `subscriptions` |
| Cron (позже) | `alerts_sent` + письма через Resend |

---

## Частые ошибки

| Симптом | Решение |
|---------|---------|
| 500 на сайте | Нет env на Vercel → шаг 3 + redeploy |
| Вход есть, профиля нет | SQL не выполнен → шаг 2 |
| Redirect после login ломается | Неверный callback URL → шаг 4 |
| Google не работает | Callback в Google ≠ Supabase → шаг 5B |

---

## Что НЕ нужно в Supabase для beta

- Storage buckets
- Edge Functions (пока)
- Realtime
- Polar / Stripe таблицы

Только Auth + Postgres из `setup_all.sql`.
