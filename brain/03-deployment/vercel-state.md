---
tags: [deployment, vercel]
last_checked: 2026-08-14
---

# Vercel Deployment State

## Project: testsaaas

- Project ID: `prj_Wg84p2eHqbGLrEMdBM6MOehTfOT9`
- Team: Alffy - Alfinega (`team_jwTPFdcHvCUSm3qb3cJ5NliE`)
- Framework: Next.js, Node 24.x
- Current production deployment: `dpl_5yfzDSDybN43ngEJDFQnCmcnGVwR` — READY
  - This is a **redeploy of the original single commit** ("Initial commit — Created from https://vercel.com/new"), not a build from any of the Dependabot updates
- Domains attached: `boxyhq.alfinega.com` (custom), `testsaaas-alffy-alfinega.vercel.app`, `testsaaas-git-main-alffy-alfinega.vercel.app`

## Deployment protection (checked 2026-08-14)

- Password protection: **disabled**
- Vercel Authentication (SSO): enabled, but scoped to `all_except_custom_domains` — **does NOT cover boxyhq.alfinega.com**
- Trusted IPs: disabled

**Net effect: the live custom domain has zero access gate.** Anyone can reach it and use the working signup/login flow.

## Dependabot PR / deployment backlog

10 Dependabot PRs opened against `main`, each auto-deployed as a Vercel preview. Status as of last check:

| PR | Dependency | Deploy state |
|---|---|---|
| #1 | typescript-eslint 8.59→8.66 | ERROR |
| #2 | react-email group | ERROR |
| #3 | next 15.5→16.3 (major) | ERROR |
| #4 | prisma 6.10→7.9 (major) | ERROR |
| #5 | svix 1.89→1.99 | ERROR |
| #6 | zod 3.25→4.4 (major) | ERROR |
| #7 | stripe 17.7→22.4 (major) | ERROR |
| #8 | sharp 0.34→0.35 | ERROR |
| #9 | jest 30.3→30.4 | ERROR |
| #10 | postcss 8.5.8→8.5.26 | READY (only one that builds) |

9 of 10 are broken. Root cause likely same as production's original failure mode seen on sibling projects (`test-boxyhq`, `test-boxyhq-tayx`): missing `DATABASE_URL` in preview environment, compounded by major-version breaking changes on next/prisma/zod/stripe. Not yet individually diagnosed — do this before merging any of them.

None of these PRs have been reviewed or merged. This is an unmanaged backlog, not evidence of active development.

## Related sibling projects (same Vercel team, do not confuse with this one)

See [[related-projects]].
