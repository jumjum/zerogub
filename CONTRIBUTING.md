# Contributing to ZeroG

Thanks for helping — every fix makes the next person's wire-up smoother.

## Two ways to contribute

1. **Report integration friction.** Wired ZeroG into an app and a step was wrong,
   unclear, or broke on your stack? File it — it directly drives the docs/package:
   ```bash
   gh issue create --repo jumjum/zerogub --label integration-feedback \
     --title "wiring: <one line>" --body "Step <#>. Stack: <…> on <…>. What happened: <…>."
   ```
2. **Open a PR.** Even better — fix the doc or the code you just used.

## Dev setup

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run build       # compiles src/ → dist/ (commit dist with code changes)
```

- Source is in `src/` (types · collector · client · viewer); compiled output in
  `dist/` is committed so consumers need no build step — **rebuild and commit
  `dist/` whenever you change `src/`**.
- Keep the collector + payload contract uniform across platforms. Only the
  capture client is platform-specific.
- The canonical wiring guide is [INTEGRATE.md](INTEGRATE.md); keep it in sync.

By contributing you agree your work is licensed under the project's [MIT License](LICENSE).
