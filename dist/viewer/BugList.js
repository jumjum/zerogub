import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Drop-in list for an app's Mission Control. Pure render (server-component
 * friendly); self-contained inline styles. For bespoke styling, call
 * `listReports()` and render your own — this is the fast path.
 */
export function BugList({ bugs }) {
    if (bugs.length === 0) {
        return _jsx("p", { style: empty, children: "No bug reports yet." });
    }
    return (_jsx("ul", { style: list, children: bugs.map((b) => (_jsxs("li", { style: row, children: [_jsx("span", { style: { ...dot, background: b.state === "open" ? "#34d399" : "#64748b" } }), _jsxs("a", { href: b.url, target: "_blank", rel: "noopener noreferrer", style: link, children: [_jsxs("span", { style: num, children: ["#", b.number] }), " ", b.title] }), _jsxs("span", { style: meta, children: [new Date(b.createdAt).toLocaleDateString(), b.assignee ? ` · @${b.assignee}` : "", b.state === "closed" ? " · fixed" : ""] })] }, b.number))) }));
}
const empty = { fontSize: 13, color: "#94a3b8" };
const list = { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 };
const row = {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
};
const dot = { width: 8, height: 8, borderRadius: 999, flexShrink: 0 };
const link = { color: "#e2e8f0", textDecoration: "none", fontSize: 13, minWidth: 0 };
const num = { color: "#94a3b8", fontFamily: "ui-monospace, monospace", fontSize: 11 };
const meta = { color: "#64748b", fontSize: 11, whiteSpace: "nowrap" };
