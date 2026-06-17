"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { captureScreenshot, collectContext } from "./capture";
import { installConsoleCapture } from "./console-buffer";

type Placement = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type BugReportButtonProps = {
  /** App slug → GitHub label `app:<projectKey>`, e.g. "govaj". */
  projectKey: string;
  /** Collector endpoint. Default: the app's own mounted route. */
  collectorUrl?: string;
  /** Optional reporter name/handle stamped on the issue. */
  reporter?: string;
  placement?: Placement;
  /** Render nothing when false — gate to dev/admin in the consumer. */
  enabled?: boolean;
  label?: string;
};

/**
 * Floating "Report bug" button. Click → screenshot + auto context → popup with
 * a text field → POST to the collector. Self-contained inline styles; depends on
 * none of the host app's CSS.
 */
export function BugReportButton({
  projectKey,
  collectorUrl = "/api/zerogub/report",
  reporter,
  placement = "bottom-right",
  enabled = true,
  label = "Report bug",
}: BugReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [shot, setShot] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

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
      const payload = { ...collectContext(projectKey, text, reporter), screenshot: shot };
      const res = await fetch(collectorUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `collector ${res.status}`);
      setResult({ ok: true, msg: `Filed #${data.issueNumber}` });
      setText("");
      setTimeout(() => {
        setOpen(false);
        setResult(null);
      }, 1500);
    } catch (e) {
      setResult({ ok: false, msg: e instanceof Error ? e.message : "send failed" });
    } finally {
      setBusy(false);
    }
  }, [collectorUrl, projectKey, reporter, shot, text]);

  if (!enabled) return null;

  const anchor = anchorStyle(placement);

  return (
    <div style={{ ...BASE, ...anchor }}>
      {!open ? (
        <button type="button" onClick={start} style={fab} title="Report a bug (ZeroG)">
          🐞 {label}
        </button>
      ) : (
        <div style={panel}>
          <div style={panelHead}>
            <span style={{ fontWeight: 600 }}>🐞 ZeroG · report bug</span>
            <button type="button" onClick={() => setOpen(false)} style={xBtn} aria-label="Close">
              ✕
            </button>
          </div>

          {shot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shot} alt="screenshot preview" style={preview} />
          ) : (
            <div style={{ ...preview, display: "grid", placeItems: "center", color: "#94a3b8" }}>
              capturing…
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What went wrong? What did you expect?"
            rows={3}
            style={textarea}
            autoFocus
          />

          {result && (
            <p style={{ margin: "2px 0", fontSize: 11, color: result.ok ? "#34d399" : "#f87171" }}>
              {result.msg}
            </p>
          )}

          <button
            type="button"
            onClick={send}
            disabled={busy || text.trim().length === 0}
            style={{ ...sendBtn, opacity: busy || text.trim().length === 0 ? 0.5 : 1 }}
          >
            {busy ? "Sending…" : "Send"}
          </button>
        </div>
      )}
    </div>
  );
}

function anchorStyle(p: Placement): CSSProperties {
  const v = p.startsWith("top") ? { top: 16 } : { bottom: 16 };
  const h = p.endsWith("right") ? { right: 16 } : { left: 16 };
  return { ...v, ...h };
}

const BASE: CSSProperties = {
  position: "fixed",
  zIndex: 2147483000,
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const fab: CSSProperties = {
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
};

const panel: CSSProperties = {
  width: 300,
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(15,23,42,0.97)",
  color: "#e2e8f0",
  boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
  backdropFilter: "blur(12px)",
};

const panelHead: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 12,
  marginBottom: 8,
};

const xBtn: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#94a3b8",
  cursor: "pointer",
  fontSize: 13,
};

const preview: CSSProperties = {
  width: "100%",
  height: 120,
  objectFit: "cover",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  marginBottom: 8,
  background: "rgba(0,0,0,0.3)",
};

const textarea: CSSProperties = {
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

const sendBtn: CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(129,140,248,0.5)",
  background: "rgba(99,102,241,0.25)",
  color: "#c7d2fe",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
