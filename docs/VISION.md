# ZeroG — Vision, Business Model & GTM

> Audience: founder, prospective investors, and any agent reasoning about
> direction. This is the executive layer; the technical ground truth is
> [ARCHITECTURE.md](ARCHITECTURE.md).

## 1. The thesis

Software is increasingly built by **agents and indie/solo teams** who do not
have — and do not want — a QA org, a separate bug-tracker subscription, or a
dashboard to babysit. They already live in **GitHub** and increasingly **prompt**
their tooling into place. The feedback loop between "a user/agent hits a problem"
and "an issue exists next to the code that can fix it" is still manual, lossy,
and tool-heavy.

**ZeroG collapses that loop to one click, into the repo you already own, wired in
by a prompt.**

## 2. The problem (sharp)

- Existing feedback tools (Jam, Marker.io, BugHerd, Usersnap, Sentry Feedback)
  are **dashboards you rent**: your reports live on *their* servers, behind
  *their* seats, in *their* workflow — a second system of record beside GitHub.
- They onboard with **setup wizards and SDK docs**, not a prompt — friction that
  an agent-built app shouldn't have to pay.
- They are **web-first browser extensions or widgets**, weak or absent on native.
- For a fleet of small apps, per-app seat pricing is **economically hostile**.

The gap: **GitHub-native + own-your-data + agent-onboarded + web *and* native.**
Nobody sits in all four quadrants. That intersection is ZeroG.

## 3. The wedge

**One-click bug capture → GitHub Issue.** It is small, obviously useful, and
trivially adoptable (10 minutes, one prompt, no new account). It is already live
and public. The wedge earns the right to expand because every install:

1. puts a button in front of users (capture surface),
2. creates labeled issues in a repo we can later read across (data surface),
3. is wired by an agent that reports friction back to us (improvement flywheel).

## 4. The expansion (wedge → platform)

The same payload + label model already carries a **second stream — feature
requests** (`type:feature`, routable to its own repo). That is not a footnote; it
is the second product:

- **Bug capture** competes with Jam/Sentry Feedback — table stakes, the wedge.
- **Feature requests / roadmap** competes with **Canny / Productboard** — a
  larger market (product & growth budgets, not just eng), and a *stickier* one
  (public roadmaps, voting, changelog). We already emit the data; the roadmap
  surface is a read-model away.

ZeroG is therefore **the feedback layer** — one capture primitive, many report
types — not a bug tool that might add features later.

## 5. Business model — open-core

| Layer | What | Price | Why it converts |
|---|---|---|---|
| **OSS core** (this repo, MIT) | the capture client, collector, viewer, contract | Free | distribution; own-your-data is the *feature*, not the giveaway |
| **Hosted MC** | cross-repo dashboard, fleet roll-up, triage, search, GitHub App auth | SaaS, per-org | the moment you have >1 app/repo, reading across them by hand hurts |
| **Roadmap product** | public roadmap, voting, changelog from the `feature` stream | SaaS, per-org | product/growth budget; competes with Canny on a GitHub-native base |
| **Team / enterprise** | SSO, audit, SLAs, private blob screenshot storage, support | Seat/usage | the org that standardizes ZeroG across its fleet |

The free tier is genuinely free and genuinely yours — that is the trust that
makes the hosted layer an easy yes. We monetize **aggregation, collaboration, and
managed infrastructure**, never access to your own data.

## 6. Go-to-market

1. **Dogfood the fleet.** ZeroG ships in `napps`, `govaj`, and the rest of the
   owner's apps first — proof, screenshots, and real issues before any pitch.
2. **Agent-led distribution.** The product *is* `INTEGRATE.md` + a drop-in
   prompt. The growth motion is "tell your coding agent to add ZeroG," and the
   `integration-feedback` flywheel makes each wire-up smoother than the last.
3. **OSS surface.** Public repo, MIT, README that reads like a product. npm
   publish widens the top of funnel ("`npm i zerogub`").
4. **Land on bugs, expand to roadmap.** Bug capture gets the install; the feature
   stream and hosted MC are the upsell once the team has data worth aggregating.
5. **Fleet/agency beachhead.** Builders running *many* small apps feel per-seat
   pricing most and value cross-repo roll-up most — the natural first paying
   segment.

## 7. Moat

- **Data gravity, the right way.** The data is the customer's, but the
  *aggregation, labels, and read-models* are ours and compound per fleet.
- **Onboarding-as-prompt + flywheel.** Every integration improves `INTEGRATE.md`;
  the wire-up gets easier over time in a way a static SDK can't.
- **GitHub-native positioning.** Incumbents would have to abandon their own
  dashboard (their business) to match "GitHub *is* the dashboard."
- **Two markets, one primitive.** Bug + roadmap from a single capture/label model
  is a structural efficiency competitors split across two products carry.

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| GitHub ships native feedback capture | We're cross-repo, cross-app, web+native, and roadmap — above their layer |
| "Just an issue form" perception | Screenshot + auto-context + native + hosted roll-up is the defensible delta |
| OSS cannibalizes hosted | Hosted sells aggregation/collab/managed infra, not data access — non-overlapping |
| Single-maintainer bus factor | OSS + MIT + agent-readable docs make it forkable-but-followable; flywheel grows contributors |

## 9. What "winning" looks like

- **6 mo:** ZeroG standard across the owner's fleet; npm-published; hosted MC in
  private beta reading across ≥3 repos; native client shipped.
- **12 mo:** roadmap product live on the `feature` stream; first external paying
  fleets/agencies; `integration-feedback` flywheel onboarding apps the maintainer
  never touched.
- **The durable position:** the default feedback layer for agent-built software —
  the thing your coding agent reaches for the same way it reaches for a linter.

See [ROADMAP.md](ROADMAP.md) for sequencing and [MVP.md](MVP.md) for the current
target and due-diligence posture.
