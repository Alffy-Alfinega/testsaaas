---
tags: [architecture, stack]
---

# Stack & Architecture

Per upstream BoxyHQ README (this fork has not diverged):

| Layer | Tech | Notes |
|---|---|---|
| Framework | Next.js (Pages Router) | `next.config.js`, `pages/` |
| Styling | Tailwind CSS | `postcss.config.js`, `tailwind.config.js` |
| DB | PostgreSQL via Prisma | schema in `prisma/`, requires `DATABASE_URL` |
| Auth | NextAuth.js | email/password, magic link, GitHub OAuth, Google OAuth |
| Enterprise SSO | SAML Jackson (BoxyHQ) | SAML SSO + Directory Sync (SCIM) |
| Webhooks | Svix | emits events on user/team CRUD |
| Audit logs | Retraced (BoxyHQ) | tracks user activity |
| Payments | Stripe | billing/subscriptions scaffolding — "Coming Soon" per README, not finished upstream |
| Error tracking | Sentry | `sentry.client.config.ts` present, confirmed active (saw Sentry trace headers on live page fetch) |
| Bot protection | reCAPTCHA | optional, needs `RECAPTCHA_SITE_KEY`/`SECRET_KEY` |
| i18n | next-i18next | `locales/en/` |
| Testing | Playwright (E2E), Jest | `tests/e2e/`, `__tests__/lib/` |
| Containerization | Docker Compose | local Postgres spin-up |

See [[env-vars|Environment Variables]] for what needs configuring and what we know is configured.

## Repo structure (top-level, unmodified from upstream)

`.do/`, `.github/`, `__tests__/lib/`, `components/`, `hooks/`, `lib/`, `locales/en/`, `models/`, `pages/`, `prisma/`, `public/`, `styles/`, `tests/e2e/`, `types/`, plus config files (`.env.example`, `middleware.ts`, `instrumentation.ts`, etc.)

Deploy targets supported out of the box: Vercel, Heroku, DigitalOcean App Platform (`app.json`, `Procfile`, `.do/` present).
