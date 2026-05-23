# SUBSPY — ADDITIONAL CURSOR SPECIFICATION  
## Temporary Removal of Billing / Payments Layer

## Context

This is an additional technical instruction for the existing **SubSpy** MVP project.

The original specification included a paid subscription flow through Polar / Stripe / MoR.

For the current validation phase, **remove the entire payment layer from the MVP**.

The goal now is NOT to launch a paid SaaS immediately.

The goal is to launch a working free beta prototype to validate:
- whether users understand the product
- whether users are willing to forward subscription receipt emails
- whether email parsing works reliably
- whether renewal alerts feel useful
- whether the pain is strong enough for future monetization

---

# MAIN DECISION

## Payments are temporarily removed

Do NOT implement:
- Polar
- Stripe
- Lemon Squeezy
- Creem
- checkout pages
- paid subscriptions
- upgrade flow
- payment webhooks
- billing portal
- customer portal
- invoices
- subscription status from payment provider
- pricing enforcement based on payment

This project should currently work as a **free closed beta / early access prototype**.

---

# WHAT TO REMOVE FROM THE CURRENT PLAN

Remove or disable all references to:

```text
Polar
Stripe
MoR
checkout
billing webhook
paid plan activation
subscription.created
subscription.updated
subscription.canceled
customer portal
payment success page
payment cancel page
```

---

# ENVIRONMENT VARIABLES TO REMOVE

Do NOT require these variables for the current MVP:

```env
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

The app must run without payment-related environment variables.

---

# ROUTES TO REMOVE OR DISABLE

Do NOT build or temporarily disable:

```text
/api/polar-webhook
/api/stripe-webhook
/billing
/success
/cancel
```

If these files already exist, either:
- remove them completely
or
- replace them with harmless placeholder pages explaining that billing is not active during beta.

---

# PRICING PAGE CHANGE

The `/pricing` page should NOT sell a paid plan right now.

Replace paid pricing with a beta access message.

Suggested copy:

```text
SubSpy is currently in private beta.

We are testing whether subscription renewal alerts are useful enough before launching paid plans.

For now, early users can try the product for free.
```

Primary CTA:

```text
Request Early Access
```

or:

```text
Join Beta
```

Do NOT show:
- $4/month checkout button
- Upgrade to Pro button
- payment provider logos
- billing promises

---

# PLAN MODEL CHANGE

For now, simplify user access.

## User plan values

Keep the `plan` field if already created, but use it only internally.

Recommended values:

```text
free
beta
```

Optional future values may remain in the database schema, but they should not affect current functionality.

Current beta users should have:

```text
plan = 'beta'
```

or simply:

```text
plan = 'free'
```

Either is acceptable, but the app should not require a paid plan to function during validation.

---

# FEATURE ACCESS DURING BETA

During beta, allow users to access the core product without payment.

Enable:
- account creation
- forwarding alias generation
- subscription detection
- receipt parsing
- subscription overview
- renewal alerts
- settings page
- Gmail forwarding instructions

Do NOT block these features behind payment.

---

# FREE LIMITS DURING BETA

To prevent abuse, add simple internal limits.

Recommended beta limits:

```text
max_subscriptions_per_user = 20
max_processed_emails_per_user_per_day = 50
```

These limits should be hardcoded or stored in a simple config file.

Do NOT build a complex quota system.

If limit is exceeded, show a simple message:

```text
Beta limit reached. This account has reached the current testing limit.
```

---

# LANDING PAGE CHANGE

The landing page should position the product as a working beta.

Main message:

```text
Your subscriptions quietly spend money while you live your life.
```

Supporting message:

```text
Forward your receipt emails. SubSpy detects recurring subscriptions and warns you before renewals.
```

Beta disclosure:

```text
SubSpy is currently a free private beta.
```

CTA:

```text
Join the Beta
```

or:

```text
Request Early Access
```

---

# DASHBOARD / OVERVIEW

Keep the dashboard or subscriptions overview.

It should show:
- detected subscriptions
- service name
- amount
- billing cycle
- next renewal date
- status
- upcoming renewals
- monthly total
- yearly total

Do NOT show:
- Upgrade button
- locked Pro features
- billing status
- payment prompts

---

# SETTINGS PAGE

Settings should include:
- user email
- forwarding alias
- Gmail forwarding instructions
- Telegram alert setup if available
- account status: Beta

Do NOT include:
- Manage billing
- Upgrade to Pro
- Cancel subscription
- payment history
- invoices

---

# DATABASE NOTES

The existing `users.plan` field can remain.

Suggested default:

```sql
plan default 'beta'
```

or:

```sql
plan default 'free'
```

For this validation phase, the app should treat both `free` and `beta` as allowed access.

Do NOT create payment-related tables right now unless they already exist.

Do NOT create:
- payments
- invoices
- checkout_sessions
- billing_events
- polar_customers
- stripe_customers

---

# FUTURE BILLING COMPATIBILITY

Even though billing is removed now, keep the architecture ready for future monetization.

Do NOT hardcode anything that makes future billing difficult.

Recommended future-compatible approach:

Create a simple helper:

```ts
canUseProduct(user): boolean
```

For now:

```ts
return user.plan === 'free' || user.plan === 'beta' || user.plan === 'pro'
```

Later, paid logic can be added there.

---

# EARLY ACCESS FLOW

If open signup is enabled:
- allow Google login
- generate alias
- show onboarding

If closed beta is preferred:
- show request access form
- collect email
- store in `beta_waitlist`

Optional table:

```sql
beta_waitlist
- id uuid primary key
- email text unique
- created_at timestamp
```

Do NOT overbuild the waitlist.

---

# PRODUCT GOAL FOR THIS PHASE

The only important goal now:

```text
Can a user forward subscription receipts and receive useful renewal alerts?
```

Everything else is secondary.

---

# PRIORITY ORDER

Build in this order:

1. Auth
2. User creation
3. Alias generation
4. Supabase schema
5. Email intake / worker
6. Receipt parsing
7. Subscription upsert / dedup
8. Overview page
9. Renewal alerts
10. Beta landing / onboarding

Billing is NOT part of this phase.

---

# IMPORTANT INSTRUCTION TO CURSOR

Do not spend time implementing payments.

Do not create Stripe or Polar integration.

Do not create billing UI.

Do not block product usage behind payment.

Focus entirely on building a reliable free beta MVP.

The project should be deployable and usable without any payment provider configured.

---

# FINAL STATE EXPECTED

After this change, SubSpy should be:

- a working free beta product
- no billing dependency
- no payment provider dependency
- no Stripe / Polar setup required
- users can test the actual core product
- the founder can validate real usage before solving payments/legal/KYC issues

This is intentional.

Payments will be added later only if real usage proves that the product is worth monetizing.
