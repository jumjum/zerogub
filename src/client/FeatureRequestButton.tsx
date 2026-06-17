"use client";

import { ReportWidget, type ReportButtonProps } from "./ReportWidget";

/** Floating "Request feature" button — lighter capture (no console errors). */
export function FeatureRequestButton(props: ReportButtonProps) {
  return <ReportWidget kind="feature" {...props} />;
}
