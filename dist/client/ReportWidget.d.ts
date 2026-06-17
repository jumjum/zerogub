import { type CSSProperties } from "react";
import type { ZerogubKind } from "../types";
export type Placement = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type ReportButtonProps = {
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
 * Floating report widget — bug or feature. Click → screenshot + auto context →
 * popup with a text field → POST to the collector. Self-contained inline styles.
 * `standalone={false}` drops the fixed wrapper so a parent (ZeroGBar) can lay out
 * several side by side.
 */
export declare function ReportWidget({ kind, projectKey, collectorUrl, reporter, placement, enabled, label, standalone, }: ReportButtonProps & {
    kind: ZerogubKind;
    standalone?: boolean;
}): import("react").JSX.Element | null;
export declare function anchorStyle(p: Placement): CSSProperties;
export declare const BASE: CSSProperties;
