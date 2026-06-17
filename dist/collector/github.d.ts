/** Minimal GitHub REST helpers (fetch-based, no SDK). Server-side only. */
export type GitHubIssue = {
    number: number;
    title: string;
    html_url: string;
    state: "open" | "closed";
    created_at: string;
    assignee: {
        login: string;
    } | null;
    labels: Array<string | {
        name: string;
    }>;
    /** Present when the "issue" is actually a pull request — filter these out. */
    pull_request?: unknown;
};
export declare function createIssue(opts: {
    token: string;
    repo: string;
    title: string;
    body: string;
    labels: string[];
}): Promise<{
    number: number;
    html_url: string;
}>;
/** Commit a base64 file (PNG, no `data:` prefix) to the repo; returns its URLs. */
export declare function commitFile(opts: {
    token: string;
    repo: string;
    path: string;
    base64: string;
    message: string;
}): Promise<{
    downloadUrl: string | null;
    htmlUrl: string | null;
}>;
export declare function listIssues(opts: {
    token: string;
    repo: string;
    labels?: string[];
    state?: "open" | "closed" | "all";
    perPage?: number;
}): Promise<GitHubIssue[]>;
