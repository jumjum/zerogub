# ZeroG — Build Plan

> Concrete, sequenced engineering work. Each item: what, why, the seam it touches,
> and "done when." Status mirrors [ROADMAP.md](ROADMAP.md); this is the
> implementation view.

## Legend
`✅ done` · `🟡 in this build` · `⬜ next` · `🔒 blocked/needs decision`

---

## B0. This build — structure & surfaces (🟡)

**Goal:** give the fast release a spine — docs, a runnable hosted MC, first tests.

- 🟡 **Doc suite** — `docs/{ARCHITECTURE,VISION,ROADMAP,MVP,BUILD_PLAN}.md`.
  *Done when:* a reviewer can understand system + business from `docs/` alone.
- 🟡 **Hosted MC app** — `web/`, Next on `:3300`:
  - `/` — home/landing (the product story, on-brand).
  - `/mc` — cross-repo dashboard: bugs + features across `ZEROGUB_REPO` and
    `ZEROGUB_FEATURES_REPO`, via `zerogub/viewer`. Degrades gracefully with no token.
  *Done when:* `npm run dev` in `web/` serves both pages; `/mc` lists real issues
  when a token is present.
- 🟡 **Tests** — `test/` (node:test, zero new deps, runs against `dist/`):
  contract defaults/validation + collector kind→repo routing + label correctness.
  *Done when:* `npm test` passes and covers the routing money-path.

---

## B1. Native capture (⬜ v0.2) — "web *and* native" claim

**Why:** the README promises native; govaj and fleet apps have native surfaces.
**Seam:** capture client only — `collector`, `viewer`, contract unchanged.

- ⬜ New subpath export `zerogub/native`.
- ⬜ `captureScreenshot()` via `react-native-view-shot`; `collectContext()` using
  RN `Platform`/`Dimensions` instead of `navigator`/`window`.
- ⬜ `ZeroGBar`/button RN component (no fixed DOM; RN view + modal).
- ⬜ Points at a **deployed** collector URL (no local route in a native binary).
- 🔒 *Needs:* a native dev app to host it (govaj native shell or a sample Expo app).

*Done when:* a bug filed from a native screen lands as a `type:bug` issue with a
screenshot, same contract as web.

---

## B2. Feature-request completion (⬜ v0.2) — finish the second stream

**Status:** backend routing is ✅ done (`featureRepo`, `type:feature`, viewer
`kind` filter). What's left is the *experience*, not the pipe.

- ⬜ Feature stream first-class in the hosted MC: counts, filter by app, status.
- ⬜ Lighter feature payload already in place (no console errors) — verify + label
  polish (e.g. `status:planned`/`shipped` convention for the future roadmap view).
- ⬜ Seed the roadmap read-model: group `type:feature` by app, sort by reactions
  (👍) as proto-voting — the data GitHub already stores.

*Done when:* features have a dedicated, app-filterable view in `/mc`, and the
👍-as-votes read-model is queryable (foundation for the roadmap product).

---

## B3. npm publish (⬜ v0.2) — widen the funnel

- ⬜ Add a real build (tsup) — already compiling via tsc; tsup gives cleaner ESM
  + minification for npm.
- ⬜ Remove `"private": true`; verify `files: ["dist"]` ships only `dist`.
- ⬜ `npm publish --access public`; pin a tag in `INTEGRATE.md`.
*Done when:* `npm i zerogub` works in a clean app and the wiring guide points to it.

---

## B4. Durable screenshots (⬜ v0.2)

- ⬜ Implement a `ScreenshotUploader` for R2 / Vercel Blob.
- ⬜ Document the swap in `INTEGRATE.md` (one-line config; clients unchanged).
*Done when:* a private-repo consumer gets inline-rendering screenshots that don't expire.

---

## B5. Hosted MC, multi-tenant (⬜ v0.3) — open-core revenue

- ⬜ GitHub App auth (read issues across a customer's repos without pasting a PAT).
- ⬜ Org accounts; repo registry; cross-repo fleet roll-up + search + triage view.
- ⬜ Deploy `web/` as the hosted product (the localhost MC is the seed).
*Done when:* an external org connects GitHub and sees their fleet's bugs+features
in one dashboard.

---

## B6. Roadmap product (⬜ v0.3) — the bigger market

- ⬜ Public roadmap page generated from `type:feature` issues (+ 👍 voting).
- ⬜ Changelog from closed/`shipped` features.
- ⬜ Embeddable public board (the Canny-competitor surface).
*Done when:* a customer publishes a public roadmap backed entirely by their GitHub.

---

## Cross-cutting (⬜ ongoing)

- ⬜ **CI** — GitHub Action: `npm test` + `npm run typecheck` on PR.
- ⬜ **Versioning** — semver discipline + `ZEROGUB_PROTOCOL_VERSION` bumps on
  breaking payload changes; pin tags in consumer deps.
- ✅ **Public-repo safety** — pre-push guard (keep it green on every push).

## Order of operations (recommended)

1. **B0** (this build) — ship structure, MC, tests. ← *now*
2. **B2** feature view + **B1** native — finish the two headline claims.
3. **B3** npm publish — open the funnel once the above is solid.
4. **B4** durable screenshots — quality pass.
5. **B5/B6** — hosted multi-tenant + roadmap, the revenue surfaces.
