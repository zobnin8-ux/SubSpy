# SubSpy

Detect recurring subscriptions from forwarded email receipts and get warned before renewals.

## Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind, shadcn/ui
- **Backend**: Supabase (Postgres, Auth, RLS)
- **Email intake**: Cloudflare Email Workers
- **Parsing**: OpenAI gpt-4o-mini
- **Alerts**: Resend (+ optional Telegram)
- **Billing**: Polar.sh
- **Hosting**: Vercel

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project
2. Enable Google OAuth (and optional email magic link) in Authentication
3. Run the migration in `supabase/migrations/001_initial_schema.sql`
4. Copy URL and keys to `.env.local`

### 3. Environment

```bash
cp .env.example .env.local
```

Fill in all required values.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy email worker

1. Configure Cloudflare Email Routing for `in.subspy.app`
2. Set `INTAKE_URL` in `wrangler.toml` to your production API URL
3. Set secret: `wrangler secret put EMAIL_INTAKE_SECRET`
4. Deploy: `npm run worker:deploy`

### 6. Deploy to Vercel

1. Connect repo to Vercel
2. Add all env vars from `.env.example`
3. Set `CRON_SECRET` — Vercel Cron will call `/api/cron/alerts` daily

### 7. Polar billing

1. Create a $4/month product in Polar
2. Set `POLAR_PRO_PRODUCT_ID` and webhook URL: `https://your-domain/api/webhooks/polar`

## Project structure

```
src/
  app/           # Next.js pages and API routes
  components/    # UI components
  lib/           # Supabase, parsing, alerts, billing
supabase/
  migrations/    # Database schema + RLS
workers/email/   # Cloudflare Email Worker
docs/            # Technical specification
```

## Core flow

1. User signs up → gets unique `@in.subspy.app` alias
2. User sets Gmail filter → forwards receipts
3. Cloudflare worker receives email → POSTs to `/api/email/intake`
4. OpenAI parses receipt → subscription upserted (dedup by user + service + amount + cycle)
5. Daily cron finds renewals in 3 days → sends email/Telegram alerts

## License

Private — MVP build.
