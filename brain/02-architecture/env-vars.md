---
tags: [architecture, env, secrets]
---

# Environment Variables

⚠️ Values are never visible via the Vercel API/dashboard once set (write-only). Everything below is inferred, not confirmed by direct read.

## Confirmed set (inferred from working behavior)

- `DATABASE_URL` — must be set; build succeeds on current production deployment (Prisma validation passes) and sign-up/sign-in resolve
- `NEXTAUTH_SECRET` — must be set for auth to function

## Required per upstream README, status unknown

| Var | Purpose | Status |
|---|---|---|
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | magic link emails | unknown |
| `APP_URL` | base URL | unknown |
| `SVIX_API_KEY` | webhooks | unknown |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | payments | unknown — **if live-mode keys are set, this is a real financial exposure surface on an unfinished/placeholder public site** |
| `RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` | bot protection | unknown |
| `SENTRY_DSN` | error tracking | likely set — live page fetch showed active Sentry trace headers |
| GitHub/Google OAuth client ID+secret | social login | unknown |

## Action needed

Before treating this as anything beyond a throwaway test: confirm in the Vercel dashboard (Settings → Environment Variables) which of the above are actually set, and whether Stripe/OAuth keys are test-mode or live-mode. This can't be checked via API — needs manual dashboard review.
