---
tags: [overview]
---

# What This Is

An unmodified fork of [BoxyHQ's Enterprise SaaS Starter Kit](https://github.com/boxyhq/saas-starter-kit), a Next.js boilerplate for B2B SaaS with enterprise auth features baked in (SAML SSO, SCIM, audit logs, webhooks, Stripe billing scaffolding).

Repo: `Alffy-Alfinega/testsaaas` — single commit ("Initial commit — Created from https://vercel.com/new"), 0 stars, 0 forks, 0 external contributors. This is a clone, not something built out yet.

Deployed live at **boxyhq.alfinega.com** via Vercel project `testsaaas`.

## What's actually working right now

- Homepage loads
- `/auth/join` (sign up) and `/auth/login` (sign in) resolve and are functional — meaning `DATABASE_URL` and `NEXTAUTH_SECRET` are configured in Vercel
- Build succeeds on the current production deployment

## What's still template/placeholder

Every content block on the live site is unedited Lorem Ipsum — Features, Create Account, SSO, SCIM, pricing tiers (literally "USD 30k/month" boilerplate numbers), FAQ. See [[../04-risks/open-risks|Open Risks]] for why this matters more than it looks like it should.

## Origin question (unresolved)

See [[../05-decisions/decision-log|Decision Log]] — intent for this domain was asked directly and not clearly answered. Current operating assumption: it's being left live as-is, not being taken down. Treat that as provisional until confirmed.
