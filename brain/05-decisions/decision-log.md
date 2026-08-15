---
tags: [decisions]
---

# Decision Log

Chronological. Add an entry every time a real decision gets made — not every action, just decisions.

## 2026-08-14 — Discovery

- Located project across 3 Vercel candidates + repo confirmation. `testsaaas` is the live one; `test-boxyhq` and `test-boxyhq-tayx` are dead duplicates.
- Asked directly: "What's the actual intent for boxyhq.alfinega.com?" (kill it / real product / internal eval / undecided)
- Response received: "thats where it's live right now and also check again on vercel" — **confirms current state, does not answer intent.** Treating as: leave live for now, intent still open. Revisit before doing build-out work.
- Brain folder created per standing instruction, retroactively (should have been first action on this project, not this far in — noted for process, see below).

## Process note

Standing instruction is brain-folder-first on every project. This project didn't get one until explicitly asked, several turns into work. Correcting going forward — this file structure is now the reference point for all future testsaaas/boxyhq work.

## Still open, not yet decided by user

- Domain intent (see above)
- Whether to password-protect boxyhq.alfinega.com now regardless of long-term intent
- Whether to delete `test-boxyhq` / `test-boxyhq-tayx`
- Whether Stripe/SMTP/OAuth keys need manual verification in Vercel dashboard
- `DATABASE_URL` is not scoped to Preview environments in Vercel project settings — blocks accurate CI signal on any Prisma-touching PR. User needs to fix in dashboard (Settings → Environment Variables → tick Preview). Not fixable via any connected tool.
- Whether `main` is meant to auto-promote to production on push — recent merges only reached preview aliases, not `target: production`. Confirm intended deploy flow.
- **GitHub OAuth callback 404 (2026-08-15):** user hit `github.com/login/oauth/...` 404 during sign-in. Root cause not yet confirmed by user, but diagnosed: this template reads two separate env vars for its base URL — `NEXTAUTH_URL` and `APP_URL` (see `lib/env.ts`, `lib/nextAuth.ts`). If either is set to `localhost` or a `*.vercel.app` value in Vercel Production env instead of `https://boxyhq.alfinega.com`, GitHub OAuth will 404 like this. Needs user to check both: (1) Vercel env vars `NEXTAUTH_URL` + `APP_URL` = `https://boxyhq.alfinega.com`, (2) GitHub OAuth App's Authorization callback URL = `https://boxyhq.alfinega.com/api/auth/callback/github`. Not fixable via any connected tool — GitHub OAuth App settings aren't exposed through the GitHub API token scope we have, and Vercel env var values aren't readable/writable via connected tools.

## 2026-08-15 — Dependabot PR triage + build warning cleanup

10 open PRs were all Dependabot dependency bumps, not human PRs. Investigated each via GitHub API + Vercel deployment build logs (not just CI status badges, which were misleading — see below).

**Merged (squash, to `main`):**
- #1 typescript-eslint 8.59.2→8.67.0 — clean minor bump
- #2 react-email group bump — clears ~11 "package no longer supported" warnings
- #10 postcss 8.5.8→8.5.26 — clean patch bump

**Held, with reasons (do not auto-merge):**
- #3 next 15.5.14→16.3.0 (major) — preview build fails; not a Next.js problem itself, exposes 3 pre-existing `TS2307` import errors (`next-auth/providers` wrong subpath, `react-daisyui/dist/types` missing in 3 files) that strict-mode Next 16 typecheck catches and Next 15 was tolerating. These are real bugs in `main` today, independent of this PR.
- #4 prisma 6.10.0→7.9.1 (major) — hard structural break, confirmed via build log: Prisma 7 removed the `url` field from `schema.prisma` entirely. Requires moving connection config to `prisma.config.ts` with an explicit adapter. Needs a scoped migration task, not a merge click.
- #6 zod 3.25.64→4.4.3 (major) — not yet build-tested (no CI signal either way), but confirmed via direct code read that `lib/zod/primitives.ts` and `lib/zod/index.ts` use v4-removed APIs: `required_error`/`invalid_type_error` params (15+ occurrences across every validation primitive: password, email, teamName, slug, token, role, etc.) and `result.error.errors` (renamed to `.issues` in v4, used in `validateWithSchema`, which gates all API input validation). This is the auth/API validation boundary — a silent break here degrades error messages instead of crashing loudly. Needs manual rewrite + retest of signup/login/invite/webhook forms before merge.

**False-negative CI signals found — important pattern:** #5 (svix), #7 (stripe), #8 (sharp), #9 (jest) all showed failing Vercel checks, but build logs revealed the actual cause in all four cases was `Environment variable not found: DATABASE_URL` — a Preview-environment scoping issue, unrelated to any of these packages. **Lesson: don't trust a red X at face value: pull the actual build log before concluding a PR is broken.** These four are very likely safe to merge once the env var fix (see Still Open, above) is applied — re-verify after.

**Build warning cleanup (commit `1b9d3e9`, pushed to `main` directly):**
- Removed unused `eslint-disable-next-line no-var` in `lib/prisma.ts` (was flagged as dead directive)
- Added `export const onRequestError = Sentry.captureRequestError` to `instrumentation.ts` — Sentry SDK now requires this hook explicitly, was previously missing
- Renamed `sentry.client.config.ts` → `instrumentation-client.ts` per current Next.js/Sentry convention (no code references broke — Next.js auto-detects by filename)
- Investigated `glob@7.2.3` deprecation (npm flags it with a CVE note): traced to `jest → babel-plugin-istanbul → test-exclude → glob@7.2.3`, a transitive dev-dependency. Not fixable by hand without an `overrides` hack that risks peer conflicts. Correct fix path is PR #9 (jest bump) once unblocked by the env var fix — left alone.
- Investigated "Next.js plugin not detected in ESLint config" warning: confirmed false positive, `eslint.config.cjs` already correctly includes `next/core-web-vitals`. No action taken — a fix here would be a workaround for a heuristic bug in Next's own detector, not a real gap.
- GitHub flagged 6 vulnerabilities (4 high, 2 moderate) on push of commit `1b9d3e9` — not yet triaged. Likely correlated with the `glob` and other deprecated-package findings above. **Needs a dedicated pass**, not folded into this one.

## 2026-08-15 (cont'd) — Second build log review, OAuth 404 diagnosis

User provided a fresh build log (commit `7cb47ae`) plus a screenshot of a GitHub OAuth 404 during sign-in.

**New build issue found and fixed (commit `f41f875`):** `eslint.config.cjs` requires `globals` but it was never declared in `package.json` — only present by transitive luck via `eslint`'s own dependency tree. The prior build succeeded only because Vercel restored a build cache; a cache-cold build (confirmed in this log — `Restored build cache from previous deployment`) would have failed the lint step outright once that luck ran out. Added `"globals": "16.5.0"` as a direct devDependency. Verified compatibility: `eslint.config.cjs` only uses `globals.node` as a plain spread, stable across all majors.

**New Sentry requirement surfaced:** SDK now also wants `onRouterTransitionStart` exported from `instrumentation-client.ts` for navigation instrumentation, on top of `onRequestError` added earlier. Added.

**OAuth 404 — diagnosed, not yet confirmed fixed (user action required):** This template reads `NEXTAUTH_URL` and `APP_URL` (two separate vars — see `lib/env.ts`, `lib/nextAuth.ts`) to construct callback URLs. If either is still set to a `.vercel.app` or `localhost` value in Vercel's Production environment instead of `https://boxyhq.alfinega.com`, the GitHub OAuth flow will 404 exactly as shown. Also need to confirm the GitHub OAuth App's own "Authorization callback URL" field matches `https://boxyhq.alfinega.com/api/auth/callback/github`. Neither of these is checkable or fixable via any tool currently connected — pure user action item.
