"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { anchorStyle, BASE, ReportWidget } from "./ReportWidget";
/** Bug + feature buttons side by side in one floating bar. */
export function ZeroGBar({ projectKey, collectorUrl, reporter, placement = "bottom-right", enabled = true, }) {
    if (!enabled)
        return null;
    const shared = { projectKey, collectorUrl, reporter, standalone: false };
    return (_jsxs("div", { style: { ...BASE, ...anchorStyle(placement), display: "flex", gap: 8, alignItems: "flex-start" }, children: [_jsx(ReportWidget, { kind: "bug", ...shared }), _jsx(ReportWidget, { kind: "feature", ...shared })] }));
}
