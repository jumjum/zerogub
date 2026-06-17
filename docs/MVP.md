# ZeroG — MVP Target & Due-Diligence Posture

> What "MVP" means here, what's in/out, how we'll know it worked, and the
> evidence a technical/VC reviewer would ask for. Companion to
> [VISION.md](VISION.md) and [ROADMAP.md](ROADMAP.md).

## 1. MVP definition

**MVP = the wedge, dogfooded and credible.** Not "a feature-complete product" —
the smallest thing that proves the loop and earns the right to expand.

> A builder adds ZeroG to their app in ~10 minutes via a prompt, ships it, and
> from then on every bug/feature their users hit becomes a labeled GitHub Issue
> in a repo they own — viewable in one place — with zero ongoing tool to manage.

That loop is **live today** in `napps` and `govaj`. The MVP target is to make it
**self-serve credible**: anyone (or any agent) can repeat it, see it work, and
trust where the data goes.

## 2. In scope (MVP)

- ✅ One-click **bug** capture → GitHub Issue (screenshot + auto-context).
- ✅ One-click **feature** request → its own stream (`type:feature`).
- ✅ `ZeroGBar` drop-in; per-app collector route; per-app token; own-your-data.
- ✅ Per-app viewer (`BugList`) for an app's Mission Control.
- ✅ Agent onboarding: `INTEGRATE.md` + drop-in prompt + feedback flywheel.
- 🟡 **Hosted MC**: a home/landing page and a cross-repo `/mc` dashboard that
  reads bugs + features across the fleet (the open-core upsell surface, demoable
  on localhost now).
- 🟡 **Tests** on the contract + collector routing (the money path).

## 3. Out of scope (MVP) — deliberately deferred

- Native capture client (contract is ready; client is v0.2).
- Multi-screen bug reports.
- Multi-tenant hosted MC with GitHub App auth / SSO.
- Roadmap product (voting, public roadmap, changelog).
- Non-GitHub backends, analytics, session replay.

Deferring these is a *positioning* decision, not a gap: the MVP proves the wedge;
the deferred items are the funded expansion in [ROADMAP.md](ROADMAP.md).

## 4. Success metrics

| Metric | MVP bar | Why it matters |
|---|---|---|
| Time-to-first-issue (fresh app, via prompt) | ≤ 15 min | onboarding-as-prompt is the GTM; this *is* the product |
| Apps live in the owner's fleet | ≥ 2 (✅ napps, govaj) → 4 | dogfood depth = credibility |
| Reports filed end-to-end (bug + feature) | ✅ both streams proven | the loop actually closes |
| `integration-feedback` issues filed by wiring agents | > 0 per new app | the flywheel is real, not theoretical |
| Hosted MC reads ≥ 2 repos in one view | 🟡 this build | the aggregation upsell is demonstrable |

## 5. Due-diligence checklist (what a reviewer can verify today)

**Technical**
- [x] Code is open, MIT, and auditable — you can read exactly what the client sends.
- [x] Typed contract (zod) with a versioned protocol; one source of truth.
- [x] Clean module boundaries via subpath exports (`types/collector/client/viewer`).
- [x] No secrets in the repo; pre-push guard enforces it on a public repo.
- [x] Token is server-side only; collector validates + gates input.
- [x] Compiled `dist/` committed → consumers install with no build step.
- [ ] Test coverage on the core contract + routing — **added this build**.
- [ ] CI running tests + typecheck on PR — *next* (wire `npm test` + `typecheck`).

**Product / traction**
- [x] Live in two real apps, filing real issues to public repos (inspectable).
- [x] Both report streams (bug + feature) proven end-to-end.
- [x] Onboarding is a single prompt; flywheel issue template exists.
- [ ] Self-serve external install (npm publish) — *v0.2*.

**Business**
- [x] Articulated open-core model with non-overlapping free vs paid (VISION.md).
- [x] Two addressable markets from one primitive (bugs → roadmap).
- [x] Identified beachhead (fleet/agency builders) and GTM (agent-led).
- [ ] First external paying user — *post-MVP*.

## 6. The pitch in one breath

> Bug & feature capture that lives in *your* GitHub, wired in by a prompt, free
> and open at the core — then a hosted dashboard and a roadmap product when your
> fleet is big enough that reading across repos by hand starts to hurt.
