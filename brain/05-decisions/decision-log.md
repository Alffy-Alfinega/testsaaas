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
- Whether to triage/close the 10 open Dependabot PRs
- Whether Stripe/SMTP/OAuth keys need manual verification in Vercel dashboard
