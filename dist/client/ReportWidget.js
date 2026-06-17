"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { captureScreenshot, collectContext } from "./capture";
import { installConsoleCapture } from "./console-buffer";
const KIND_UI = {
    bug: {
        emoji: "🐞",
        fab: "Report bug",
        title: "report bug",
        placeholder: "What went wrong? What did you expect?",
        accent: {
            border: "1px solid rgba(129,140,248,0.5)",
            background: "rgba(99,102,241,0.25)",
            color: "#c7d2fe",
        },
    },
    feature: {
        emoji: "💡",
        fab: "Request feature",
        title: "request feature",
        placeholder: "What would you like? Why is it useful?",
        accent: {
            border: "1px solid rgba(45,212,191,0.5)",
            background: "rgba(20,184,166,0.22)",
            color: "#99f6e4",
        },
    },
};
/**
 * Floating report widget — bug or feature. Click → screenshot + auto context →
 * popup with a text field → POST to the collector. Self-contained inline styles.
 * `standalone={false}` drops the fixed wrapper so a parent (ZeroGBar) can lay out
 * several side by side.
 */
export function ReportWidget({ kind, projectKey, collectorUrl = "/api/zerogub/report", reporter, placement = "bottom-right", enabled = true, label, standalone = true, }) {
    const ui = KIND_UI[kind];
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [shot, setShot] = useState(undefined);
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState(null);
    useEffect(() => {
        installConsoleCapture();
    }, []);
    const start = useCallback(async () => {
        setResult(null);
        setText("");
        setShot(undefined);
        setOpen(true);
        setShot(await captureScreenshot());
    }, []);
    const send = useCallback(async () => {
        setBusy(true);
        setResult(null);
        try {
            const payload = {
                ...collectContext(projectKey, text, { kind, reporter }),
                screenshot: shot,
            };
            const res = await fetch(collectorUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok || !data.ok)
                throw new Error(data.error || `collector ${res.status}`);
            setResult({ ok: true, msg: `Filed #${data.issueNumber}` });
            setText("");
            setTimeout(() => {
                setOpen(false);
                setResult(null);
            }, 1500);
        }
        catch (e) {
            setResult({ ok: false, msg: e instanceof Error ? e.message : "send failed" });
        }
        finally {
            setBusy(false);
        }
    }, [collectorUrl, kind, projectKey, reporter, shot, text]);
    if (!enabled)
        return null;
    const content = !open ? (_jsxs("button", { type: "button", onClick: start, style: fab, title: `ZeroG · ${ui.title}`, children: [ui.emoji, " ", label ?? ui.fab] })) : (_jsxs("div", { style: panel, children: [_jsxs("div", { style: panelHead, children: [_jsxs("span", { style: { fontWeight: 600 }, children: [ui.emoji, " ZeroG \u00B7 ", ui.title] }), _jsx("button", { type: "button", onClick: () => setOpen(false), style: xBtn, "aria-label": "Close", children: "\u2715" })] }), shot ? (
            // eslint-disable-next-line @next/next/no-img-element
            _jsx("img", { src: shot, alt: "screenshot preview", style: preview })) : (_jsx("div", { style: { ...preview, display: "grid", placeItems: "center", color: "#94a3b8" }, children: "capturing\u2026" })), _jsx("textarea", { value: text, onChange: (e) => setText(e.target.value), placeholder: ui.placeholder, rows: 3, style: textarea, autoFocus: true }), result && (_jsx("p", { style: { margin: "2px 0", fontSize: 11, color: result.ok ? "#34d399" : "#f87171" }, children: result.msg })), _jsx("button", { type: "button", onClick: send, disabled: busy || text.trim().length === 0, style: { ...sendBtn, ...ui.accent, opacity: busy || text.trim().length === 0 ? 0.5 : 1 }, children: busy ? "Sending…" : "Send" })] }));
    if (!standalone)
        return content;
    return _jsx("div", { style: { ...BASE, ...anchorStyle(placement) }, children: content });
}
export function anchorStyle(p) {
    const v = p.startsWith("top") ? { top: 16 } : { bottom: 16 };
    const h = p.endsWith("right") ? { right: 16 } : { left: 16 };
    return { ...v, ...h };
}
export const BASE = {
    position: "fixed",
    zIndex: 2147483000,
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
};
const fab = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(15,23,42,0.92)",
    color: "#e2e8f0",
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
    backdropFilter: "blur(8px)",
    whiteSpace: "nowrap",
};
const panel = {
    width: 300,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(15,23,42,0.97)",
    color: "#e2e8f0",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
    backdropFilter: "blur(12px)",
};
const panelHead = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 12,
    marginBottom: 8,
};
const xBtn = {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 13,
};
const preview = {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: 8,
    background: "rgba(0,0,0,0.3)",
};
const textarea = {
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(2,6,23,0.6)",
    color: "#e2e8f0",
    fontSize: 12,
    padding: 8,
    marginBottom: 8,
};
const sendBtn = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
};
