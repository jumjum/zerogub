import { appLabel, typeLabel, ZEROGUB_LABEL } from "../types";
import { listIssues } from "../collector/github";
/**
 * List ZeroG bug reports from the configured repo, newest first. Scope to one
 * app with `projectKey`; omit it to show the whole fleet. Server-side only —
 * call this from an MC server component / route, never the client.
 */
export async function listReports(cfg, opts = {}) {
    const labels = [ZEROGUB_LABEL];
    if (opts.projectKey)
        labels.push(appLabel(opts.projectKey));
    if (opts.kind)
        labels.push(typeLabel(opts.kind));
    const issues = await listIssues({
        token: cfg.token,
        repo: cfg.repo,
        labels,
        state: opts.state ?? "all",
        perPage: opts.limit ?? 50,
    });
    return issues
        .filter((i) => !i.pull_request)
        .map((i) => ({
        number: i.number,
        title: i.title,
        url: i.html_url,
        state: i.state,
        createdAt: i.created_at,
        assignee: i.assignee?.login,
        labels: i.labels.map((l) => (typeof l === "string" ? l : l.name)),
    }));
}
