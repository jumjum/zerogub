"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { ReportWidget } from "./ReportWidget";
/** Floating "Report bug" button — full capture (screenshot + console + device). */
export function BugReportButton(props) {
    return _jsx(ReportWidget, { kind: "bug", ...props });
}
