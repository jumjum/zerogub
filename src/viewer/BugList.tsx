import type { CSSProperties } from "react";
import type { ZerogubBug } from "./index";

/**
 * Drop-in list for an app's Mission Control. Pure render (server-component
 * friendly); self-contained inline styles. For bespoke styling, call
 * `listReports()` and render your own — this is the fast path.
 */
export function BugList({ bugs }: { bugs: ZerogubBug[] }) {
  if (bugs.length === 0) {
    return <p style={empty}>No bug reports yet.</p>;
  }
  return (
    <ul style={list}>
      {bugs.map((b) => (
        <li key={b.number} style={row}>
          <span style={{ ...dot, background: b.state === "open" ? "#34d399" : "#64748b" }} />
          <a href={b.url} target="_blank" rel="noopener noreferrer" style={link}>
            <span style={num}>#{b.number}</span> {b.title}
          </a>
          <span style={meta}>
            {new Date(b.createdAt).toLocaleDateString()}
            {b.assignee ? ` · @${b.assignee}` : ""}
            {b.state === "closed" ? " · fixed" : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

const empty: CSSProperties = { fontSize: 13, color: "#94a3b8" };
const list: CSSProperties = { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 };
const row: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.02)",
};
const dot: CSSProperties = { width: 8, height: 8, borderRadius: 999, flexShrink: 0 };
const link: CSSProperties = { color: "#e2e8f0", textDecoration: "none", fontSize: 13, minWidth: 0 };
const num: CSSProperties = { color: "#94a3b8", fontFamily: "ui-monospace, monospace", fontSize: 11 };
const meta: CSSProperties = { color: "#64748b", fontSize: 11, whiteSpace: "nowrap" };
