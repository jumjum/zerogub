# ZeroG · build status

Standalone package; first consumer = **govaj**, then napps / LIS / fairbor.
Decision: **per-app collector** (each app mounts its own route + token), not a
central napps service — so it works in deployed apps (Vercel), not just when the
local napps hub is up. GitHub Issues backend + uniform payload unchanged.

## Done (Phase 0–1) — package, in isolation
- `types` — zod payload contract (`reportSchema`, `appLabel`, `ZEROGUB_LABEL`).
- `collector` — `createReport()` + `createZerogubRoute()` → labeled GH issue;
  pluggable screenshot uploader (default commits PNG to the repo).
- `client` — `<BugReportButton>` (html2canvas-pro capture + console buffer +
  popup), self-contained inline styles.
- `viewer` — `listReports()` + `<BugList>` for an app's MC.

## Next (Phase 2–4) — wiring, after review
2. govaj: `file:`-link + `transpilePackages`; mount `/api/zerogub/report`;
   `<BugReportButton projectKey="govaj">` app-wide, dev/admin-gated.
3. govaj MC: `/admin/bugs` (`requireAdmin`) using `listReports`/`BugList`;
   add `McNav` link.
4. Extend the same drop to napps (R&D drawer panel), LIS, fairbor.

## Storage model: central + per-app, chosen per app
Each consumer sets `ZEROGUB_REPO` to where *its* bugs go — zero code change:
- **central** (`jumjum/zerogub-bugs`): many apps pool here, separated by the
  `app:<key>` label; the bucket itself is the fleet overview.
- **local** (the app's own repo, e.g. `jumjum/govaj`): bugs sit next to the
  code, native close-via-PR.

Per-app *views* work in both (the viewer reads whatever repo the app points at,
filtered by `app:<key>`). A combined fleet view across *mixed* modes needs a
small repo registry + napps roll-up — add only when modes are actually mixed.

## Manual prereqs (fleet owner)
- Central bucket **`jumjum/zerogub-bugs`** created (private). ✓
- A `repo`-scoped GitHub token in each consumer's env as `GITHUB_TOKEN`,
  plus `ZEROGUB_REPO` (central bucket or the app's own repo).

## Notes
- **Screenshots on a private repo** don't render inline in issue markdown (raw
  URLs need auth); the link still works. For inline rendering, plug a blob
  uploader (`uploadScreenshot`) — R2 / Vercel Blob.
- Raw TS is shipped and compiled by the consumer via `transpilePackages`. To
  publish to npm later, add a build step (tsup) — see extraction path.
- Native capture (RN view-shot) deferred until a native dev app exists.
