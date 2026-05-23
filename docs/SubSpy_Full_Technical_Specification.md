# SUBSPY — FULL TECHNICAL SPECIFICATION FOR CURSOR

## Project Overview

Build a production-ready MVP SaaS called **SubSpy**.

SubSpy detects recurring subscriptions from forwarded email receipts and warns users before renewals.

Core idea:

> “Your subscriptions quietly spend money while you live your life.”

This is NOT:
- a finance platform
- a banking app
- an AI agent system
- a budgeting tool

This IS:
- a lightweight subscription renewal warning service
- focused on simplicity
- focused on speed
- focused on reducing invisible recurring spending

Target audience:
- indie hackers
- developers
- founders
- freelancers
- SaaS-heavy users

Primary region:
- US / EU
- English only
- USD only in MVP

---

# CORE PRODUCT FLOW

```text
User signs up
→ gets unique forwarding alias
→ sets Gmail forwarding rule
→ subscription receipts arrive
→ system parses receipts
→ subscriptions stored
→ user receives renewal alerts before charge
```

---

# TECH STACK

## Frontend
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion (minimal tasteful usage)

## Backend
- Supabase
  - Postgres
  - Auth
  - RLS
  - Edge Functions
  - Cron jobs

## Email Intake
- Cloudflare Email Workers

## AI Parsing
- OpenAI API
- gpt-4o-mini
- structured JSON output

## Email Sending
- Resend

## Billing
- Polar.sh

## Hosting
- Vercel

---

# IMPORTANT PRODUCT PRINCIPLES

## DO NOT OVERENGINEER

Do NOT add:
- agents
- LangChain
- vector databases
- memory systems
- embeddings
- orchestration frameworks
- microservices
- event buses
- Redis
- Kafka
- queues unless absolutely required

This product is intentionally:
- lean
- direct
- simple

Architecture should feel:
- boring
- stable
- understandable

---

# MVP FEATURES ONLY

## INCLUDED

### Auth
- Google OAuth
- Email login optional

### User Dashboard
- Active subscriptions
- Upcoming renewals
- Monthly total
- Yearly total

### Email Parsing
- Detect recurring subscriptions from receipts

### Renewal Alerts
- Email alerts
- Telegram alerts optional

### Billing
- Polar subscription billing

### Settings
- Show forwarding alias
- Show Gmail setup instructions

---

## EXCLUDED FROM MVP

DO NOT BUILD:
- mobile apps
- browser extensions
- Plaid integration
- bank APIs
- budgeting
- charts/analytics overload
- AI insights
- teams
- collaboration
- admin panels
- multi-language
- OCR systems
- Outlook/Yahoo support
- automatic cancellation
- spending predictions

---

# DATABASE SCHEMA

## users

```sql
id uuid primary key
email text unique
forward_alias text unique
plan text check (plan in ('free','pro','lifetime'))
telegram_chat_id text nullable
created_at timestamp
```

## subscriptions

```sql
id uuid primary key
user_id uuid references users(id)

service text
amount numeric
currency text
cycle text
status text

next_renewal date

source_email_id uuid references email_logs(id)

created_at timestamp
updated_at timestamp
```

## email_logs

```sql
id uuid primary key
user_id uuid references users(id)

raw text

parse_status text
parsed_at timestamp

created_at timestamp
```

## alerts_sent

```sql
id uuid primary key

subscription_id uuid references subscriptions(id)

channel text

sent_at timestamp
```

---

# ROW LEVEL SECURITY

Every table must enforce:

```sql
user_id = auth.uid()
```

Users can ONLY access their own data.

---

# AUTH FLOW

## Signup

User signs in with Google.

On signup:
- create user row
- generate forwarding alias

Example:

```text
abx72k@in.subspy.app
```

Alias generation:
- short random string
- collision-safe

---

# LANDING PAGE

Tone:
- premium
- calm
- slightly cinematic
- emotionally intelligent

NOT:
- corporate SaaS
- crypto
- AI hype

---

# LANDING COPY DIRECTION

Hero headline ideas:

```text
Your subscriptions quietly spend money while you live your life.
```

```text
Tiny recurring charges become invisible.
```

```text
Get warned before subscriptions renew.
```

---

# VISUAL DIRECTION

Visual metaphor:
- subscriptions quietly feeding at night
- invisible recurring spending
- subtle emotional tension

Design:
- dark premium UI
- matte surfaces
- restrained motion
- lots of negative space

DO NOT USE:
- bright startup gradients
- cartoon SaaS art
- generic AI imagery

---

# USER ONBOARDING

CRITICAL:
Onboarding friction must be extremely low.

User flow:

## Step 1
Copy Gmail filter

## Step 2
Forward receipts

## Step 3
Done

---

# GMAIL FILTER COPY

Provide copy-paste Gmail filter instructions.

Example:

```text
subject:(receipt OR invoice OR renewal OR subscription OR payment)
```

Forward to:

```text
youralias@in.subspy.app
```

---

# EMAIL WORKER FLOW

## Incoming email

Cloudflare Email Worker receives:

```text
xxxxx@in.subspy.app
```

Worker:
1. identify user from alias
2. extract:
   - from
   - subject
   - plain body
3. send to OpenAI parser
4. receive structured JSON
5. upsert subscription
6. store raw email log

---

# OPENAI PARSING

Use structured JSON output ONLY.

Expected output:

```json
{
  "is_subscription": true,
  "service": "OpenAI",
  "amount": 20,
  "currency": "USD",
  "cycle": "monthly",
  "next_renewal": "2026-06-23",
  "status": "active"
}
```

---

# PARSING RULES

## Detect:
- service name
- amount
- billing cycle
- renewal date
- trial/cancel state

## Ignore:
- one-time purchases
- shipping confirmations
- unrelated invoices

---

# DEDUP LOGIC

Recurring receipts should update existing subscriptions.

Dedup key:

```text
user_id + service + amount + cycle
```

DO NOT create duplicates for monthly renewals.

---

# RENEWAL ALERT SYSTEM

Daily cron job:

```text
subscriptions renewing in 3 days
```

Send:
- email alert
- optional Telegram alert

---

# ALERT COPY STYLE

Tone:
- calm
- direct
- useful

Example:

```text
Adobe renews tomorrow — $239/year.
```

NOT:
- corporate
- playful
- AI-ish

---

# POLAR BILLING INTEGRATION

## Plans

### Free
- up to 5 subscriptions

### Pro
- unlimited subscriptions
- renewal alerts
- Telegram alerts

Price:

```text
$4/month
```

---

# BILLING FLOW

Polar checkout:
- user upgrades
- webhook fires
- update user plan

Webhook events:
- subscription.created
- subscription.updated
- subscription.canceled

---

# REQUIRED PAGES

## Public
- /
- /pricing
- /login
- /privacy
- /terms

## Authenticated
- /dashboard
- /settings
- /billing

## Utility
- /success
- /cancel

---

# DASHBOARD UI

Show:
- active subscriptions
- renewal dates
- monthly burn
- yearly burn

Simple clean cards.

NO:
- graphs
- analytics overload
- financial dashboards

---

# SETTINGS PAGE

Display:
- forwarding alias
- Gmail setup instructions
- Telegram connection
- billing management button

---

# PRIVACY

Critical positioning:
- transparent
- minimal
- trustworthy

State clearly:
- only receipt emails are processed
- raw emails auto-delete after 30 days
- no banking access
- no card access

---

# SECURITY

Never expose:
- OpenAI keys
- Supabase service role keys
- Polar secrets

Validate:
- Polar webhook signatures
- incoming alias ownership

---

# DEPLOYMENT

## Frontend
Deploy on Vercel.

## Database
Supabase hosted.

## Email Worker
Cloudflare Workers.

---

# ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

RESEND_API_KEY=

POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
```

---

# CODE QUALITY REQUIREMENTS

- strict TypeScript
- clean folder structure
- reusable components
- no spaghetti code
- avoid unnecessary abstractions

---

# DESIGN REQUIREMENTS

UI should feel:
- modern
- calm
- cinematic
- minimal

References:
- Linear
- Raycast
- Vercel
- Resend

NOT:
- generic Tailwind SaaS templates
- bright AI startup aesthetics

---

# FINAL GOAL

Build a real working SaaS MVP capable of:
- receiving forwarded receipts
- detecting subscriptions
- warning users before renewals
- charging via Polar

The system should be:
- production-ready
- simple
- understandable
- deployable within days

Do not overbuild.
