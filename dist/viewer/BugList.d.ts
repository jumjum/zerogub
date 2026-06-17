import type { ZerogubBug } from "./index";
/**
 * Drop-in list for an app's Mission Control. Pure render (server-component
 * friendly); self-contained inline styles. For bespoke styling, call
 * `listReports()` and render your own — this is the fast path.
 */
export declare function BugList({ bugs }: {
    bugs: ZerogubBug[];
}): import("react").JSX.Element;
