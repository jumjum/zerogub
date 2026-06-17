# ZeroG (`zerogub`)

Fleet-wide, one-click bug capture → **GitHub Issues**. Standalone, embeddable.
Click in any app → screenshot + auto device/console/URL context + a note → a
labeled issue in a bug bucket (`zerogub-bugs`). No bug-management layer; GitHub *is* the
dashboard. Each app's Mission Control shows its own `app:<key>` reports.

Capture is the only platform-specific piece; **collector + payload + backend are
uniform**. Drop the module, point at your own collector route, add the button.

## Consume (Next.js App Router)

`package.json`: `"zerogub": "file:../zerogub"` · `next.config`: `transpilePackages: ["zerogub"]`

**1. Collector** — `app/api/zerogub/report/route.ts`
```ts
import { createZerogubRoute } from "zerogub/collector";
export const POST = createZerogubRoute(() => ({
  token: process.env.GITHUB_TOKEN!,   // repo scope, server-side only
  repo: process.env.ZEROGUB_REPO!,    // central bucket jumjum/zerogub-bugs, or the app's own repo
}));
```

**2. Button** — in a root layout / client boundary
```tsx
import { BugReportButton } from "zerogub/client";
<BugReportButton projectKey="govaj" enabled={isDevOrAdmin} />
```

**3. Viewer** — in Mission Control (server component)
```tsx
import { listReports } from "zerogub/viewer";
import { BugList } from "zerogub/viewer/ui";
const bugs = await listReports({ token, repo }, { projectKey: "govaj" });
return <BugList bugs={bugs} />;
```

Subpath exports: `zerogub/types` · `zerogub/collector` · `zerogub/client` ·
`zerogub/viewer` · `zerogub/viewer/ui`.

See [BUILD.md](BUILD.md) for status and the extraction path.
