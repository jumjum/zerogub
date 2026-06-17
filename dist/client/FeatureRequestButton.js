"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { ReportWidget } from "./ReportWidget";
/** Floating "Request feature" button — lighter capture (no console errors). */
export function FeatureRequestButton(props) {
    return _jsx(ReportWidget, { kind: "feature", ...props });
}
