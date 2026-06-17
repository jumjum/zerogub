import { type ZerogubCreateResult, type ZerogubReport } from "../types";
/** Pluggable screenshot sink — return a URL to link in the issue body. */
export type ScreenshotUploader = (dataUrl: string, meta: {
    projectKey: string;
    timestamp: string;
}) => Promise<string>;
export type CollectorConfig = {
    /** GitHub token with `repo` scope. Server-side only — never ship to clients. */
    token: string;
    /** `owner/name` of a repo YOU control — a shared bug bucket, or the app's own repo. */
    repo: string;
    /**
     * Where to put the screenshot. Defaults to committing it into the bugs repo.
     * Swap for a blob uploader (R2 / Vercel Blob) to get inline rendering on
     * private repos without auth.
     */
    uploadScreenshot?: ScreenshotUploader;
};
/** Create one GitHub issue from a report (+ optional screenshot upload). */
export declare function createReport(input: ZerogubReport, cfg: CollectorConfig): Promise<ZerogubCreateResult>;
/**
 * Next.js App Router route factory. In a consumer:
 *
 *   export const POST = createZerogubRoute(() => ({
 *     token: process.env.GITHUB_TOKEN!,
 *     repo: process.env.ZEROGUB_REPO!,
 *   }));
 */
export declare function createZerogubRoute(getConfig: () => CollectorConfig | Promise<CollectorConfig>): (req: Request) => Promise<Response>;
