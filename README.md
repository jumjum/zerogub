# ZeroG (`zerogub`)

> The drop-in bug-capture layer for indie builders — one click sends a fully-contextualized report straight to GitHub Issues, across web and native, no dashboard, no seats, no lock-in.

One click in any app → screenshot + auto-collected device / console / URL context + a note → a **GitHub Issue**. No bug-management layer: GitHub *is* the dashboard. You own the data; it lives in *your* repo. Open source, embeddable, and the onboarding is a prompt.

## How it works

```
[ button ]  →  [ collector ]  →  [ GitHub Issue ]
 your app       your route        your repo, labeled app:<key>
 (web/native)   (any platform)    (you own it)
```

Capture is the only platform-specific piece; **collector + payload + backend are uniform**. Drop the module, point at your own collector route, add the button.

## Quick start

**The whole wiring guide (copy-paste): [INTEGRATE.md](INTEGRATE.md).** Or hand this to your coding agent:

> Add ZeroG one-click bug tracking to this app. Read `INTEGRATE.md` and follow it exactly. Use the published package, set `projectKey` to this app's slug, point `ZEROGUB_REPO` at the bug repo, and wire the collector route, the bug button, and the `/admin/bugs` viewer. Then file a test bug and confirm it lands.

Install (`npm i zerogub` once published, or `github:jumjum/zerogub` as a git dep) · `next.config`: `transpilePackages: ["zerogub"]`. Subpath exports:
`zerogub/types` · `zerogub/collector` · `zerogub/client` · `zerogub/viewer` · `zerogub/viewer/ui`.

## Why it's different

- **GitHub-Issues-native** — zero new tool to manage; bugs are just issues.
- **You own the data** — reports land in *your* repo, never on our servers. The code is open, so you can audit exactly what it sends.
- **Web *and* native**, embedded in your own app — not a browser extension.
- **The onboarding is a prompt** — your coding agent wires it in.

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Wiring ZeroG into an app and something tripped you up? That's the flywheel: file it under the `integration-feedback` label (or PR the fix). Security: [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © jumjum
