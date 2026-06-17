# ZeroG — Architecture

> Status: shipped & live (v0.1.0). Bug + feature capture is in production across
> `napps` and `govaj`, filing to public GitHub repos. This document is the
> ground-truth technical overview; it tracks the code, not aspiration.

## 1. One sentence

A standalone, embeddable capture layer that turns one click in any app into a
fully-contextualized **GitHub Issue** in a repo *you* own — no dashboard, no
seats, no data leaving your infrastructure.

## 2. Design axioms

1. **GitHub Issues *is* the backend.** We do not build a bug-management layer.
   Issues, labels, assignees, and close-via-PR already exist and the team
   already lives there.
2. **You own the data.** Reports land in the consumer's own repo via the
   consumer's own token. ZeroG operates no central server in the critical path.
3. **The payload is uniform; only capture is platform-specific.** The same
   `reportSchema` flows from web today and native tomorrow. Swapping the capture
   client never touches the collector or the backend.
4. **The onboarding is a prompt.** A coding agent wires it in from `INTEGRATE.md`
   in ~10 minutes. Distribution rides the agent, not a sales motion.
5. **Each app is self-contained.** Per-app collector route + per-app token. No
   shared service to keep alive — it works in any deployed app (Vercel, CF,
   AWS), not only when a central hub is running.

## 3. The data path

```
┌──────────────┐   POST report    ┌──────────────┐   REST    ┌───────────────┐
│  client      │ ───────────────▶ │  collector   │ ────────▶ │ GitHub Issue  │
│  (web/native)│   JSON contract  │  (your route)│   token   │ (your repo)   │
└──────────────┘                  └──────────────┘           └───────────────┘
   screenshot +                     validates (zod),            labeled:
   device/console/url               routes by kind,             app:<key>
   + reporter note                  uploads screenshot,         type:<bug|feature>
                                    files issue                 zerogub
        ▲                                                            │
        │                          ┌──────────────┐   REST          │
        └───── viewer / MC ◀────── │  listReports │ ◀───────────────┘
              (BugList UI)         │  (your route)│   read by label
                                   └──────────────┘
```

Three touch-points in every consumer, identical everywhere:

| Touch-point | Module | Runs | Responsibility |
|---|---|---|---|
| Collector route | `zerogub/collector` → `createZerogubRoute` | server | validate + file the issue (+ screenshot) |
| Capture button | `zerogub/client` → `ZeroGBar` | client | screenshot + context + the note, POST |
| Viewer page | `zerogub/viewer` → `listReports` + `zerogub/viewer/ui` → `BugList` | server | read issues by label, render in MC |

## 4. The contract (`zerogub/types`)

The single source of truth is `reportSchema` (zod). Everything else is built to
serve it.

- `kind: "bug" | "feature"` — the stream selector (default `bug`).
- `projectKey` — lowercase slug → GitHub label `app:<key>`. Identity across the
  whole fleet.
- `screen` — URL (web) or screen name (native). Platform-agnostic by design.
- `device`, `consoleErrors`, `reporter`, `timestamp`, `screenshot` — auto-collected
  context; console errors only attach to bugs.
- `ZEROGUB_PROTOCOL_VERSION` — bumped only on breaking payload changes, so a
  collector can reject a stale client. Currently `1`.

Labels are deterministic functions of the payload — `appLabel(key)`,
`typeLabel(kind)`, and the constant `ZEROGUB_LABEL`. The viewer reads by the
same labels, so capture and read can never drift.

## 5. Module map

```
src/
  types.ts              contract: reportSchema, labels, protocol version
  collector/
    index.ts            createReport(), createZerogubRoute() — kind→repo routing,
                        screenshot upload, issue body rendering
    github.ts           minimal fetch-based GitHub REST (no SDK): createIssue,
                        commitFile, listIssues
  client/
    ReportWidget.tsx    the shared floating widget (bug + feature, one component)
    BugReportButton.tsx \  thin kind-bound wrappers over ReportWidget
    FeatureRequestButton.tsx
    ZeroGBar.tsx        both buttons in one drop-in (recommended default)
    capture.ts          html2canvas-pro screenshot + collectContext()
    console-buffer.ts   rolling console/window error buffer (idempotent patch)
    index.ts            client barrel export
  viewer/
    index.ts            listReports() — read issues by label, server-only
    BugList.tsx         drop-in list UI (pure render, server-component-safe)
```

Subpath exports (`package.json#exports`) map 1:1 to these boundaries:
`zerogub/{types,collector,client,viewer,viewer/ui}`. The compiled `dist/` is
committed, so a git-dep consumer installs with **nothing to build**.

## 6. Kind routing (bug vs feature)

The only stateful decision in the collector is `repoFor(cfg, kind)`:

- `bug` → `cfg.repo` (`ZEROGUB_REPO`)
- `feature` → `cfg.featureRepo ?? cfg.repo` (`ZEROGUB_FEATURES_REPO`, falls back)

So the feature button works the instant it's dropped in (lands in the bug repo
labeled `type:feature`), and graduates to its own repo by setting one env var —
zero code change. This is the seam the roadmap's "roadmap product" grows from.

## 7. Trust & security model

- **Token is server-side only.** `GITHUB_TOKEN` lives in the collector/viewer
  env and never reaches the client. The client only knows its own collector URL.
- **Fine-grained scope.** Issues r/w + Contents r/w (for screenshot commits) on
  the single target repo — nothing broader.
- **Collector is gated.** Off in production unless `NEXT_PUBLIC_ZEROGUB_ENABLED=1`,
  so the issue-filing endpoint isn't publicly abusable by default.
- **Payload is validated at the door.** `reportSchema.safeParse` rejects
  malformed input with a 400 before any GitHub call.
- **Screenshot upload is non-fatal.** If the image upload fails, the report is
  still filed without it — capture never blocks on the optional artifact.
- **Public-repo hygiene.** `scripts/prepush-guard.sh` (wired via
  `install-hooks.sh`) aborts any push containing fleet files, `.env`, or
  secret-shaped strings. This repo is public; the guard is the gate.

## 8. Extension points (deliberate seams)

- **`ScreenshotUploader`** — default commits the PNG into the repo; swap for an
  R2 / Vercel Blob uploader to get durable inline rendering on private repos.
- **`getConfig()`** in `createZerogubRoute` — async, so token/repo can come from
  a secrets manager per request (multi-tenant hosted mode).
- **Capture client** — `collectContext()` + a `captureScreenshot()` are the only
  web-specific code. A native (`react-native-view-shot`) client fills the same
  contract; collector/viewer unchanged.
- **Viewer** — `listReports()` returns plain data; `BugList` is the fast path,
  but any UI can render the data (the hosted MC dashboard does).

## 9. Distribution & deployment

- **Today:** git dep — `github:jumjum/zerogub`. Compiled `dist/` is committed,
  so consumers install with no build step. `file:` links are banned (break
  Vercel — sibling repo absent from build context).
- **Next:** `npm publish` (drop `private: true`, add a tsup build). The contract
  and exports don't change; only the install string does.
- **Hosted MC** (`web/`) — the optional dashboard that reads across repos. It is
  the open-core upsell surface, not required to use ZeroG.

## 10. Known limits (tracked, not hidden)

- Native capture is deferred until a native dev app exists (contract is ready).
- Screenshots on a *private* repo: the link works but inline render expires
  (raw URLs need auth) — fixed by a blob uploader.
- No auth/SSO on the hosted MC yet — it's a single-owner dashboard today.
- Multi-screen bug reports (`screenshots: string[]`) are designed, not built.

See [BUILD_PLAN.md](BUILD_PLAN.md) for how each limit closes.
