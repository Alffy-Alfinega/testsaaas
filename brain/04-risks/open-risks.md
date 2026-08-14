---
tags: [risk]
severity: high
---

# Open Risks

## 1. Public domain, no access gate (HIGH)

`boxyhq.alfinega.com` — no password protection, no trusted IPs, Vercel Auth explicitly excludes custom domains. Anyone can register an account right now via a working signup flow, on a company subdomain, against a site that reads as an unfinished placeholder (Lorem Ipsum everywhere, fake pricing tiers). Reputational and (if real Stripe/OAuth keys are wired) financial exposure. **Cheapest fix: enable password protection in Vercel project settings — ~5 min, closes the door regardless of what's decided long-term.**

## 2. Unknown secret/key state (MEDIUM-HIGH pending verification)

Can't confirm via API whether Stripe, SMTP, OAuth, or reCAPTCHA credentials are set, and if set, whether they're test-mode or live-mode. If Stripe is live-mode, real payment processing could be triggered on a template nobody has security-reviewed. See [[../02-architecture/env-vars|Environment Variables]]. Needs manual Vercel dashboard check — this is not optional, it should happen before anything else.

## 3. Unmanaged Dependabot backlog (MEDIUM)

10 open PRs, 9 failing to build. Left as-is, this teaches "ignore CI failures" as a pattern and buries the one PR that does matter under noise. See [[../03-deployment/vercel-state|Vercel Deployment State]].

## 4. Duplicate dead projects (LOW, hygiene)

`test-boxyhq` and `test-boxyhq-tayx` sitting broken in the same Vercel team. See [[../03-deployment/related-projects|Related Projects]]. No security risk (not live), but clutter risk — easy to debug the wrong project next time.

## 5. Ambiguous intent (BLOCKING for any further work)

Directly asked what this domain is for; got confirmation it's live but not what it's *for*. Every fix above changes in scope depending on the answer:
- **Kill it** → revoke domain, take deployment down, done in minutes
- **Real product** → this becomes a real security/compliance project (BoxyHQ's own feature set — SSO, SCIM, audit logs — exists because enterprise customers will ask for it; can't half-do this)
- **Internal eval only** → password-protect and leave it, no further build-out needed

Recommend resolving this before spending more time on architecture or content work here.
