# SubSpy

Detect recurring subscriptions from forwarded email receipts and get warned before renewals.

**Current phase:** free private beta — no billing or payment provider required.

## Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind, shadcn/ui
- **Backend**: Supabase (Postgres, Auth, RLS)
- **Email intake**: Cloudflare Email Workers
- **Parsing**: OpenAI gpt-4o-mini
- **Alerts**: Resend (+ optional Telegram)
- **Hosting**: Vercel

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project
2. Enable Google OAuth (and optional email magic link) in Authentication
3. Run migrations in `supabase/migrations/` (001 then 002)
4. Copy URL and keys to `.env.local`

### 3. Environment

```bash
cp .env.example .env.local
```

Fill in Supabase, OpenAI, Resend, and intake/cron secrets. No Polar or Stripe keys needed.

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
2. Add env vars from `.env.example`
3. Set `CRON_SECRET` — Vercel Cron calls `/api/cron/alerts` daily

## Beta limits

Hardcoded in `src/lib/access.ts`:

- Max 20 active subscriptions per user
- Max 50 processed emails per user per day

## Project structure

```
src/
  app/           # Next.js pages and API routes
  components/    # UI components
  lib/           # Supabase, parsing, alerts, access control
supabase/
  migrations/    # Database schema + RLS
workers/email/   # Cloudflare Email Worker
docs/            # Technical specifications
```

## Core flow

1. User signs up → gets unique `@in.subspy.app` alias (`plan = beta`)
2. User sets Gmail filter → forwards receipts
3. Cloudflare worker receives email → POSTs to `/api/email/intake`
4. OpenAI parses receipt → subscription upserted (dedup by user + service + amount + cycle)
5. Daily cron finds renewals in 3 days → sends email/Telegram alerts

## Future billing

Payment integration (Polar/Stripe) is intentionally removed for validation. Use `canUseProduct()` in `src/lib/access.ts` when adding paid plans later.

## License

Private — MVP build.
