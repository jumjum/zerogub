# ZeroG — Mission Control (`web/`)

The hosted dashboard surface: a landing page (`/`) and a cross-repo bug/feature
dashboard (`/mc`). It dogfoods the package — `/mc` reads issues via
`zerogub/viewer`. This is the open-core upsell surface; ZeroG works fully without it.

## Run locally

```bash
cd web
npm install
cp .env.local.example .env.local   # then paste your GitHub token + repos
npm run dev                        # → http://localhost:3300
```

- `/` — landing page (static, no token needed).
- `/mc` — Mission Control. Without a token it renders in demo mode with a setup
  card; with a token it lists live bugs + features across your repos.

## Notes

- Consumes the parent package via `file:..` → needs `experimental.externalDir`
  (already set in `next.config.ts`). A *standalone* consumer uses the git dep and
  needs none of this — see [../INTEGRATE.md](../INTEGRATE.md).
- `GITHUB_TOKEN` is read server-side only; it never reaches the browser.
- Port `3300` (napps 3100, govaj 3200 — kept clear).
