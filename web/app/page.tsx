export default function Home() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">The feedback layer · open source</span>
        <h1>
          One click → a <span className="grad">GitHub Issue</span>
          <br />
          in a repo you own.
        </h1>
        <p className="lede">
          ZeroG drops a bug &amp; feature button into any app. Each report becomes a
          fully-contextualized GitHub Issue — screenshot, device, console, the user&apos;s
          note — labeled and filed in <em>your</em> repo. No dashboard to rent, no seats,
          no data on our servers. The onboarding is a prompt.
        </p>
        <div className="cta">
          <a className="btn primary" href="/mc">
            Open Mission Control →
          </a>
          <a
            className="btn ghost"
            href="https://github.com/jumjum/zerogub"
            target="_blank"
            rel="noopener noreferrer"
          >
            ★ View on GitHub
          </a>
        </div>
      </section>

      <section className="section" style={{ borderTop: "none", paddingTop: 0 }}>
        <h2>How it works</h2>
        <div className="flow">
          <div className="cell">
            <div className="big">🐞 💡</div>
            <div className="k">Button</div>
            <div className="s">
              your app (web/native) — screenshot + auto context + a note
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="cell">
            <div className="big">⚙️</div>
            <div className="k">Collector</div>
            <div className="s">your route, your token — validates &amp; routes by kind</div>
          </div>
          <div className="arrow">→</div>
          <div className="cell">
            <div className="big">📌</div>
            <div className="k">GitHub Issue</div>
            <div className="s">
              your repo — labeled <code>app:</code> · <code>type:</code>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Why it&apos;s different</h2>
        <div className="grid3">
          <div className="card">
            <h3>GitHub is the dashboard</h3>
            <p>
              No bug-management layer to learn. Reports are just issues — labels,
              assignees, close-via-PR all already exist.
            </p>
          </div>
          <div className="card">
            <h3>You own the data</h3>
            <p>
              Reports land in your repo via your token. The code is open, so you can
              audit exactly what the client sends. Nothing on our servers.
            </p>
          </div>
          <div className="card">
            <h3>Bug + feature, one drop-in</h3>
            <p>
              <code>ZeroGBar</code> ships both buttons. Features route to their own
              stream — the seed of a GitHub-native roadmap product.
            </p>
          </div>
          <div className="card">
            <h3>Web and native</h3>
            <p>
              The payload is uniform; only capture is platform-specific. The same
              contract flows from the browser and (soon) native apps.
            </p>
          </div>
          <div className="card">
            <h3>Onboarding is a prompt</h3>
            <p>
              Hand <code>INTEGRATE.md</code> to your coding agent. ~10 minutes to a live
              button, viewer, and collector — no setup wizard.
            </p>
          </div>
          <div className="card">
            <h3>Open core</h3>
            <p>
              Free and yours at the core. The hosted Mission Control aggregates across
              your fleet when reading repo-by-repo starts to hurt.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Wire it in</h2>
        <div className="card">
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
            Paste to your agent:{" "}
            <em>
              &ldquo;Add ZeroG one-click bug + feature tracking to this app. Read
              INTEGRATE.md and follow it exactly — git dep, collector route, ZeroGBar,
              and the /admin/bugs viewer. Then file a test report and confirm it
              lands.&rdquo;
            </em>{" "}
            Full guide:{" "}
            <a
              href="https://github.com/jumjum/zerogub/blob/main/INTEGRATE.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--indigo)" }}
            >
              INTEGRATE.md
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
