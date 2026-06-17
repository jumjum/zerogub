import { listReports, type ZerogubBug } from "zerogub/viewer";
import { BugList } from "zerogub/viewer/ui";

// WHY: reads the GitHub token server-side per request; never cache stale issues.
export const dynamic = "force-dynamic";

type Loaded = { bugs: ZerogubBug[]; features: ZerogubBug[] };

async function load(): Promise<{ data?: Loaded; error?: string; configured: boolean }> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.ZEROGUB_REPO;
  const featureRepo = process.env.ZEROGUB_FEATURES_REPO || repo;
  if (!token || !repo) return { configured: false };

  try {
    const [bugs, features] = await Promise.all([
      listReports({ token, repo }, { kind: "bug", limit: 50 }),
      listReports({ token, repo: featureRepo! }, { kind: "feature", limit: 50 }),
    ]);
    return { configured: true, data: { bugs, features } };
  } catch (e) {
    return { configured: true, error: e instanceof Error ? e.message : "failed to load" };
  }
}

function appsFrom(items: ZerogubBug[]): number {
  const set = new Set<string>();
  for (const i of items) {
    for (const l of i.labels) if (l.startsWith("app:")) set.add(l);
  }
  return set.size;
}

function Setup() {
  return (
    <div className="setup">
      <h3>⚙️ Connect a token to see live reports</h3>
      <p>
        The dashboard reads issues from your GitHub repos server-side. Copy{" "}
        <code>.env.local.example</code> → <code>.env.local</code> and set:
      </p>
      <ul>
        <li>
          <code>GITHUB_TOKEN</code> — fine-grained, Issues+Contents read on the repos
        </li>
        <li>
          <code>ZEROGUB_REPO</code> — where bugs live (e.g. <code>jumjum/zerogub-bugs</code>)
        </li>
        <li>
          <code>ZEROGUB_FEATURES_REPO</code> — feature requests (optional)
        </li>
      </ul>
      <p>Restart the dev server and this page lists your fleet&apos;s reports.</p>
    </div>
  );
}

export default async function MissionControl() {
  const { configured, error, data } = await load();
  const bugs = data?.bugs ?? [];
  const features = data?.features ?? [];
  const openBugs = bugs.filter((b) => b.state === "open").length;
  const apps = appsFrom([...bugs, ...features]);

  return (
    <main>
      <div className="mc-head">
        <h1>Mission Control</h1>
        <p>
          Bugs and feature requests across your fleet — read straight from GitHub
          Issues. {configured ? "Live." : "Demo mode (no token configured)."}
        </p>
      </div>

      {!configured && <Setup />}
      {error && <p className="err">Couldn&apos;t load: {error}</p>}

      <div className="stats">
        <div className="stat">
          <div className="n">{bugs.length}</div>
          <div className="l">bug reports</div>
        </div>
        <div className="stat">
          <div className="n">{openBugs}</div>
          <div className="l">open bugs</div>
        </div>
        <div className="stat">
          <div className="n">{features.length}</div>
          <div className="l">feature requests</div>
        </div>
        <div className="stat">
          <div className="n">{apps}</div>
          <div className="l">apps reporting</div>
        </div>
      </div>

      <div className="streams">
        <section className="stream">
          <h2>
            🐞 Bugs <span className="count">{bugs.length}</span>
          </h2>
          <BugList bugs={bugs} />
        </section>
        <section className="stream">
          <h2>
            💡 Feature requests <span className="count">{features.length}</span>
          </h2>
          <BugList bugs={features} />
        </section>
      </div>
    </main>
  );
}
