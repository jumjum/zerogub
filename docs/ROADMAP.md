# ZeroG — Product Roadmap

> Sequenced by leverage, not by ease. Status is honest: `done` means live in
> production, not merged. Ground truth = git log + [ARCHITECTURE.md](ARCHITECTURE.md).

## Now (v0.1.x) — the wedge is live

| Item | Status |
|---|---|
| Uniform `reportSchema` contract (zod, versioned) | ✅ done |
| Collector route factory (`createZerogubRoute`) → GitHub Issue | ✅ done |
| Capture client: screenshot + device/console/url context | ✅ done |
| `ZeroGBar` — bug **and** feature buttons, one drop-in | ✅ done |
| Kind routing: bug → repo, feature → featureRepo (fallback) | ✅ done |
| Viewer (`listReports` + `BugList`) for an app's MC | ✅ done |
| Live in `napps` + `govaj`, filing to public repos | ✅ done |
| Public repo, MIT, `INTEGRATE.md`, agent drop-in prompt | ✅ done |
| Pre-push secret/fleet-file guard | ✅ done |
| Hosted MC: home page + cross-repo `/mc` dashboard (`web/`) | 🟡 this build |
| First test suite (contract + collector routing) | 🟡 this build |
| Doc suite (architecture / vision / roadmap / MVP / build plan) | 🟡 this build |

## Next (v0.2) — close the obvious gaps

| Item | Why now | Notes |
|---|---|---|
| **Native capture client** (`zerogub/native`) | "web *and* native" is a core claim; govaj/fleet have native surfaces | `react-native-view-shot`; fills the same contract; points at a deployed collector URL |
| **Multi-screen bug reports** | requested; reproduces multi-step bugs | payload `screenshots: string[]`; widget "📸 Add screen" flow; body renders the sequence |
| **npm publish** | widens funnel ("`npm i zerogub`") | drop `private:true`, add tsup build; exports/contract unchanged |
| **Blob screenshot uploader** | durable inline render on private repos | implement `ScreenshotUploader` for R2 / Vercel Blob |

## Later (v0.3) — open-core revenue surfaces

| Item | Market | Notes |
|---|---|---|
| **Hosted MC, multi-tenant** | aggregation upsell | GitHub App auth, org accounts, cross-repo fleet roll-up, triage/search |
| **Roadmap product** on the `feature` stream | Canny / Productboard | public roadmap, voting, changelog — read-model over `type:feature` issues |
| **Team tier** | enterprise | SSO, audit log, private blob storage, support/SLA |
| **Repo registry + fleet roll-up** | mixed-mode fleets | when apps split across central + local repos, a registry unifies the view |

## Sequencing logic

1. **Prove, then publish.** Dogfood across the fleet (done) → hosted MC + tests +
   docs (now) → npm (next). Credibility before reach.
2. **Bugs land, features expand.** Bug capture wins the install; the `feature`
   stream and roadmap product are the expansion into a bigger budget.
3. **Own-your-data first, aggregate-for-money second.** The hosted layer only
   makes sense *after* the free, self-hosted core has earned trust.

## Explicitly out of scope (for now)

- A bug-*management* workflow inside ZeroG (assign/triage/status). GitHub already
  is that. We add read-models and roll-up, not a competing workflow.
- Non-GitHub backends (Jira, Linear). Possible later via a backend adapter at the
  collector seam, but it dilutes the wedge today.
- Analytics/session-replay. Different product; would bloat the capture client.
