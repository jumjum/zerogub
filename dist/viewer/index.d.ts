export type ZerogubBug = {
    number: number;
    title: string;
    url: string;
    state: "open" | "closed";
    createdAt: string;
    assignee?: string;
    labels: string[];
};
export type ViewerConfig = {
    /** GitHub token with `repo` scope (read). Server-side only. */
    token: string;
    repo: string;
};
/**
 * List ZeroG bug reports from the configured repo, newest first. Scope to one
 * app with `projectKey`; omit it to show the whole fleet. Server-side only —
 * call this from an MC server component / route, never the client.
 */
export declare function listReports(cfg: ViewerConfig, opts?: {
    projectKey?: string;
    state?: "open" | "closed" | "all";
    limit?: number;
}): Promise<ZerogubBug[]>;
