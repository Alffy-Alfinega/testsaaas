---
tags: [deployment, vercel, cleanup]
---

# Related / Duplicate Projects

Two other Vercel projects in the same team are also BoxyHQ-derived test spins, both **broken and not live**:

| Project | Vercel ID | State | Failure |
|---|---|---|---|
| `test-boxyhq` | prj_Lqjsi79cI0uzOTdu3VVTmNtkaHA2 | `live: false`, latest deploy ERROR | Prisma P1012 — `DATABASE_URL` not found |
| `test-boxyhq-tayx` | prj_GzKLQKd0QEDfS9ado0HSaPaK57b4 | `live: false`, latest deploy ERROR | Same — `DATABASE_URL` not found |

Neither has a custom domain attached. **testsaaas is the only one of the three that's actually live and reachable.**

## Open question

Three separate spin-up attempts of the same template exist. Worth clarifying: were `test-boxyhq` and `test-boxyhq-tayx` earlier failed attempts before `testsaaas` succeeded, or are they meant to serve a different purpose? If no purpose, recommend deleting both — dead projects with identical failure signatures add confusion without value. Flagged, not yet actioned — awaiting decision.
