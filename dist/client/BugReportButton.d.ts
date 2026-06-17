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
export declare function BugReportButton({ projectKey, collectorUrl, reporter, placement, enabled, label, }: BugReportButtonProps): import("react").JSX.Element | null;
export {};
