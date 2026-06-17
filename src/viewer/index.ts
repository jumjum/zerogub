import { appLabel, ZEROGUB_LABEL } from "../types";
import { listIssues } from "../collector/github";

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
 * List ZeroG bug reports from the fleet-bugs repo, newest first. Scope to one
 * app with `projectKey`; omit it to show the whole fleet. Server-side only —
 * call this from an MC server component / route, never the client.
 */
export async function listReports(
  cfg: ViewerConfig,
  opts: { projectKey?: string; state?: "open" | "closed" | "all"; limit?: number } = {},
): Promise<ZerogubBug[]> {
  const labels = [ZEROGUB_LABEL];
  if (opts.projectKey) labels.push(appLabel(opts.projectKey));

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
