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

## Manual prereqs (fleet owner)
- Create repo **`jumjum/fleet-bugs`** (private is fine; see screenshot note).
- A `repo`-scoped GitHub token in each consumer's env as `GITHUB_TOKEN`,
  plus `ZEROGUB_REPO=jumjum/fleet-bugs`.

## Notes
- **Screenshots on a private repo** don't render inline in issue markdown (raw
  URLs need auth); the link still works. For inline rendering, plug a blob
  uploader (`uploadScreenshot`) — R2 / Vercel Blob.
- Raw TS is shipped and compiled by the consumer via `transpilePackages`. To
  publish to npm later, add a build step (tsup) — see extraction path.
- Native capture (RN view-shot) deferred until a native dev app exists.
