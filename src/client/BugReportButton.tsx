"use client";

import { ReportWidget, type ReportButtonProps } from "./ReportWidget";

export type { ReportButtonProps };
export type BugReportButtonProps = ReportButtonProps;

/** Floating "Report bug" button — full capture (screenshot + console + device). */
export function BugReportButton(props: ReportButtonProps) {
  return <ReportWidget kind="bug" {...props} />;
}
