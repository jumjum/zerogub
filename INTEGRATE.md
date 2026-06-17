# Wire ZeroG into your app (copy-paste)

> For the agent working on any fleet app. Adds one-click bug capture in ~10 min.
> Replace **`<app>`** with your project slug (lowercase, e.g. `govaj`, `napps`,
> `fairbor`). Every report becomes a GitHub Issue labeled `app:<app>`.

You wire up **three** touch-points — they're identical in every app:
1. a **collector route** (server) that files the issue,
2. a **bug button** (client) in your root layout,
3. a **bug page** in your Mission Control / admin that lists the issues.

Plus dependency + config + env. That's it.

---

## Drop-in prompt (paste this to the app's agent)

> **Add ZeroG one-click bug tracking to this app.** Read `~/Projects/zerogub/INTEGRATE.md`
> and follow it exactly. Use the **git dependency** (`github:jumjum/zerogub`), never
> `file:`. Set `projectKey` to this app's slug. For `ZEROGUB_REPO`, use the central
> bucket `jumjum/zerogub-bugs` unless told otherwise. Wire all three touch-points: the
> collector route, the bug button in the root layout (dev/admin-gated), and the servable
> `/admin/bugs` page in this app's Mission Control. Then run the app, file a test bug via
> the button, and confirm it shows up both as an `app:<slug>` issue in the bucket and on
> `/admin/bugs`. I'll provide `GITHUB_TOKEN` (fine-grained, Issues + Contents r/w) and
> `ZEROGUB_REPO` in `.env.local`. **Finally: if any step here was wrong, unclear, or broke
> on this stack, report it back to `jumjum/zerogub` (label `integration-feedback`) or open
> a PR — that's required, it's how ZeroG improves.**

---

## 0. Prereqs (fleet owner does once)

- **Where bugs go** — pick one and use it as `ZEROGUB_REPO`:
  - **central** `jumjum/zerogub-bugs` — pooled across apps, compare in one place (recommended when you have many apps), or
  - **local** your app's own repo (e.g. `jumjum/<app>`) — bugs sit next to the code.
- **A fine-grained GitHub token** with **Issues: Read & write** + **Contents: Read & write** on that repo. Make it at
  <https://github.com/settings/personal-access-tokens/new>. It's a secret — server-side only.

---

## 1. Dependency — use the **git** dep (deploy-safe)

`package.json`:

```jsonc
"dependencies": {
  "zerogub": "github:jumjum/zerogub"   // pin a tag/commit once stable
}
```

```bash
npm install
```

> **Do NOT use `file:../zerogub`.** It works locally but **breaks every Vercel
> deploy** — the sibling repo isn't in Vercel's build context. The git dep
> installs real files into `node_modules` (inside your root), which fixes both
> the deploy and the Turbopack resolution. zerogub commits its compiled `dist/`,
> so there's **nothing to build** on install.
>
> *Deploy access:* `jumjum/zerogub` is private, so your Vercel project needs read
> access to it (Vercel's GitHub integration on the `jumjum` org, or a deploy
> token). *Local-only iteration on zerogub itself?* You can temporarily use
> `file:../zerogub` **plus** `experimental: { externalDir: true }` in
> `next.config` — but switch back to the git dep before deploying.

---

## 2. `next.config`

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["zerogub"], // harmless; helps if any TS ever leaks
  // ...your existing config
};
```

With the **git dep**, that's all — `externalDir` is **not** needed (the package
lives inside your `node_modules`). You only need `experimental: { externalDir:
true }` if you fall back to the local `file:` link for zerogub development.

---

## 3. Env — `.env.local` (and your deploy env)

```bash
GITHUB_TOKEN=github_pat_xxxxxxxx      # fine-grained, server-side only, NEVER commit
ZEROGUB_REPO=jumjum/zerogub-bugs      # central bucket, or your own repo for local mode
```

Use a clear section header; this is **not** your GitHub *OAuth* login (that's a
separate client id/secret). On a deployed preview where you want the button on,
also set `NEXT_PUBLIC_ZEROGUB_ENABLED=1`.

---

## 4. Collector route — `src/app/api/zerogub/report/route.ts`

```ts
import { NextResponse } from "next/server";
import { createZerogubRoute } from "zerogub/collector";

export const dynamic = "force-dynamic";

// On in dev, or anywhere NEXT_PUBLIC_ZEROGUB_ENABLED=1. Off on prod so the
// issue-filing endpoint isn't publicly abusable.
const enabled =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ZEROGUB_ENABLED === "1";

const handler = createZerogubRoute(() => ({
  token: process.env.GITHUB_TOKEN!,
  repo: process.env.ZEROGUB_REPO!,
}));

export async function POST(req: Request) {
  if (!enabled) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 404 });
  }
  return handler(req);
}
```

---

## 5. Bug button — in your root layout (`src/app/layout.tsx`)

```tsx
import { BugReportButton } from "zerogub/client";

const zerogubEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ZEROGUB_ENABLED === "1";

// ...inside <body>, near the end:
<BugReportButton projectKey="<app>" enabled={zerogubEnabled} />
```

It's self-contained (inline styles, floating bottom-right) — needs none of your
CSS. Capture uses `html2canvas-pro` (handles Tailwind v4 `oklch`, which classic
html2canvas can't). Place it clear of your bottom-of-screen primary actions.

---

## 6. Servable bug page — in your Mission Control / admin

Create `src/app/admin/bugs/page.tsx` (path/auth/styling adapt to **your** app —
gate it exactly like your other admin pages):

```tsx
import { listReports } from "zerogub/viewer";
import { BugList } from "zerogub/viewer/ui";
// import { requireAdmin } from "@/lib/admin/auth"; // ← your app's admin gate

export const dynamic = "force-dynamic";

export default async function BugsPage() {
  // await requireAdmin(...);  // gate with whatever your MC uses
  const bugs = await listReports(
    { token: process.env.GITHUB_TOKEN!, repo: process.env.ZEROGUB_REPO! },
    { projectKey: "<app>" },   // omit projectKey to show the WHOLE fleet
  );

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Bug reports</h1>
      <BugList bugs={bugs} />
    </main>
  );
}
```

Then add a link to it from your MC nav. `BugList` is a drop-in (inline styles,
links each issue to GitHub, shows open/closed + assignee). Prefer your own UI?
Call `listReports()` for the data and render it yourself.

---

## 7. Verify

```bash
npm run dev
```
1. Click **🐞 Report bug** (bottom-right) → type a note → **Send**.
2. A new Issue appears in `ZEROGUB_REPO`, labeled `app:<app>` + `zerogub`.
3. Open `/admin/bugs` → it's listed there.

If the route 500s with `Can't resolve 'zerogub/collector'` → you're on a `file:`
link without `experimental.externalDir: true`. Switch to the git dep (step 1).

---

## 8. Close the loop (required — this is how ZeroG improves)

If any step above was wrong, unclear, missing for your stack, or broke — **report it
back**. This is a flywheel: every report makes the next agent's wiring smoother.

**Report it** (≈10s — you already have `gh`):
```bash
gh issue create --repo jumjum/zerogub --label integration-feedback \
  --title "wiring: <one line>" \
  --body "Step <#>. Stack: <Next/CF Worker/…> on <Vercel/CF/AWS/…>.
What happened: <…>. What would've helped: <…>."
```

**Or fix it** (better): the docs + package live at `github.com/jumjum/zerogub` —
open a PR. An agent improving the tool it just used is the whole point.

These integration reports are themselves GitHub issues — ZeroG eats its own dog
food. (End-user bugs go to your app's `ZEROGUB_REPO`; tool/DX feedback goes here,
next to the code that needs the fix.)

---

## What each piece is

| Import | What | Runs |
|---|---|---|
| `zerogub/collector` → `createZerogubRoute` | files the GitHub issue (+ screenshot) | server |
| `zerogub/client` → `BugReportButton` | floating capture widget | client |
| `zerogub/viewer` → `listReports` | reads `app:<app>` issues | server |
| `zerogub/viewer/ui` → `BugList` | drop-in list UI | server component |
| `zerogub/types` | the payload contract (zod) | shared |

## Gotchas (so you don't relearn them)
- **Use the git dep, not `file:`** — `file:../zerogub` breaks Vercel deploys; the
  git dep avoids that *and* the Turbopack outside-root issue (no `externalDir`).
- **Screenshots on a *private* bucket**: the link works, but inline image render
  in the issue expires (raw URLs need auth). For durable inline render, pass a
  blob uploader to the collector later — clients don't change.
- **Native (RN) apps**: capture client is web-only for now; native is deferred.

Central vs local, mixed per app, the SaaS extraction path: see [BUILD.md](BUILD.md).
