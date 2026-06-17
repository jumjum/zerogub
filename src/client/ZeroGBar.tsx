"use client";

import { anchorStyle, BASE, ReportWidget, type ReportButtonProps } from "./ReportWidget";

/** Bug + feature buttons side by side in one floating bar. */
export function ZeroGBar({
  projectKey,
  collectorUrl,
  reporter,
  placement = "bottom-right",
  enabled = true,
}: ReportButtonProps) {
  if (!enabled) return null;
  const shared = { projectKey, collectorUrl, reporter, standalone: false as const };
  return (
    <div style={{ ...BASE, ...anchorStyle(placement), display: "flex", gap: 8, alignItems: "flex-start" }}>
      <ReportWidget kind="bug" {...shared} />
      <ReportWidget kind="feature" {...shared} />
    </div>
  );
}
