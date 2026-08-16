---
tags: [risk]
severity: high
---

# Open Risks

## 1. Public domain, no access gate (HIGH)

`boxyhq.alfinega.com` — no password protection, no trusted IPs, Vercel Auth explicitly excludes custom domains. Anyone can register an account right now via a working signup flow, on a company subdomain, against a site that reads as an unfinished placeholder (Lorem Ipsum everywhere, fake pricing tiers). Reputational and (if real Stripe/OAuth keys are wired) financial exposure. **Cheapest fix: enable password protection in Vercel project settings — ~5 min, closes the door regardless of what's decided long-term.**

## 2. Unknown secret/key state (MEDIUM-HIGH pending verification)

Can't confirm via API whether Stripe, SMTP, OAuth, or reCAPTCHA credentials are set, and if set, whether they're test-mode or live-mode. If Stripe is live-mode, real payment processing could be triggered on a template nobody has security-reviewed. See [[../02-architecture/env-vars|Environment Variables]]. Needs manual Vercel dashboard check — this is not optional, it should happen before anything else.

## 3. Unmanaged Dependabot backlog (MEDIUM → PARTIALLY RESOLVED 2026-08-15)

Was 10 open PRs, 9 showing failing builds. Triaged individually via build logs, not CI badges alone. 3 merged clean (#1, #2, #10). 4 (#5, #7, #8, #9) turned out to be false-negative failures — real cause is `DATABASE_URL` missing from Preview environment scope, unrelated to the PRs themselves; safe to merge once that's fixed. 3 (#3 next, #4 prisma, #6 zod) are genuine major-version breaks needing real engineering work, correctly held. Full detail in [[../05-decisions/decision-log|Decision Log]].

**Remaining action for user:** fix `DATABASE_URL` Preview scoping in Vercel dashboard, then re-verify and merge #5/#7/#8/#9.

## 6. Exposed GitHub PAT (MEDIUM — self-inflicted, live)

A GitHub PAT with repo write access was pasted directly into chat (`github_pat_11B3...`) to authorize cloning and merging. It has been used for real pushes and merges to `main`. This token should be rotated once this work session is done — a token that's been transmitted through a chat interface and used across multiple tool calls is harder to treat as fully contained than one that's never left a local credential manager. Not blocking today's work, but shouldn't be left standing indefinitely.

## 7. Undisclosed dependency vulnerabilities (MEDIUM — new, untriaged)

GitHub's push-time scanner flagged 6 vulnerabilities (4 high, 2 moderate) on `main` as of commit `1b9d3e9` (2026-08-15). Not yet reviewed — see https://github.com/Alffy-Alfinega/testsaaas/security/dependabot for detail. Likely overlaps with deprecated transitive packages already surfaced (e.g. `glob@7.2.3`), but needs its own pass, not an assumption.

## 8. react-daisyui is unmaintained and incompatible with daisyUI 5 (MEDIUM — worked around, not fixed)

`react-daisyui@5.0.5` (latest available, published ~2 years ago per npm) peer-requires `daisyui@^4.12.10` — it has never been updated for daisyUI 5, and its GitHub issue tracker shows a long backlog of unaddressed open issues, suggesting the package is effectively unmaintained. This blocked `npm install` outright (ERESOLVE) once daisyUI was bumped to 5.

Worked around via `.npmrc` (`legacy-peer-deps=true`), **not fixed** — this is a real ecosystem gap, not a false alarm. Before accepting the workaround, verified directly by reading `react-daisyui`'s compiled JS that it hardcodes several daisyUI-4-only class names internally (`input-bordered`, `select-bordered`, `textarea-bordered`, `file-input-bordered`, `form-control`, `label-text`, `card-compact` — all removed or renamed in daisyUI 5) inside components like `Form.Label` and the `bordered`/`compact` props. Confirmed via grep that this app's actual code never invokes those specific props/subcomponents, so the mismatch is currently dormant, not actively broken — but any *future* use of `<Input bordered />`, `<Form.Label>`, `<Card compact />`, etc. from `react-daisyui` will silently apply CSS classes that no longer exist in the stylesheet, with no error at build or runtime.

**Do not add new usage of `react-daisyui`'s bordered/compact/Form.Label patterns without re-checking this.** Longer-term, real fix options: (a) wait for/contribute a react-daisyui daisyUI-5 compatible release, (b) migrate off react-daisyui entirely to daisyUI's plain CSS classes directly in JSX (the officially recommended daisyUI 5 pattern) — a ~44-file rewrite, out of scope for this dependency-upgrade sweep, (c) fork/patch react-daisyui locally. None attempted; flagging for a deliberate future decision.

## 6. Duplicate dead projects (LOW, hygiene)

`test-boxyhq` and `test-boxyhq-tayx` sitting broken in the same Vercel team. See [[../03-deployment/related-projects|Related Projects]]. No security risk (not live), but clutter risk — easy to debug the wrong project next time.

## 5. Ambiguous intent (BLOCKING for any further work)

Directly asked what this domain is for; got confirmation it's live but not what it's *for*. Every fix above changes in scope depending on the answer:
- **Kill it** → revoke domain, take deployment down, done in minutes
- **Real product** → this becomes a real security/compliance project (BoxyHQ's own feature set — SSO, SCIM, audit logs — exists because enterprise customers will ask for it; can't half-do this)
- **Internal eval only** → password-protect and leave it, no further build-out needed

Recommend resolving this before spending more time on architecture or content work here.
