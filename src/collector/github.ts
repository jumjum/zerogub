/** Minimal GitHub REST helpers (fetch-based, no SDK). Server-side only. */

const API = "https://api.github.com";

export type GitHubIssue = {
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  created_at: string;
  assignee: { login: string } | null;
  labels: Array<string | { name: string }>;
  /** Present when the "issue" is actually a pull request — filter these out. */
  pull_request?: unknown;
};

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "zerogub",
  };
}

export async function createIssue(opts: {
  token: string;
  repo: string;
  title: string;
  body: string;
  labels: string[];
}): Promise<{ number: number; html_url: string }> {
  const res = await fetch(`${API}/repos/${opts.repo}/issues`, {
    method: "POST",
    headers: { ...headers(opts.token), "Content-Type": "application/json" },
    body: JSON.stringify({ title: opts.title, body: opts.body, labels: opts.labels }),
  });
  if (!res.ok) {
    throw new Error(`GitHub create issue ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { number: number; html_url: string };
  return { number: json.number, html_url: json.html_url };
}

/** Commit a base64 file (PNG, no `data:` prefix) to the repo; returns its URLs. */
export async function commitFile(opts: {
  token: string;
  repo: string;
  path: string;
  base64: string;
  message: string;
}): Promise<{ downloadUrl: string | null; htmlUrl: string | null }> {
  const res = await fetch(
    `${API}/repos/${opts.repo}/contents/${opts.path.split("/").map(encodeURIComponent).join("/")}`,
    {
      method: "PUT",
      headers: { ...headers(opts.token), "Content-Type": "application/json" },
      body: JSON.stringify({ message: opts.message, content: opts.base64 }),
    },
  );
  if (!res.ok) {
    throw new Error(`GitHub commit file ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as {
    content?: { download_url?: string; html_url?: string };
  };
  return {
    downloadUrl: json.content?.download_url ?? null,
    htmlUrl: json.content?.html_url ?? null,
  };
}

export async function listIssues(opts: {
  token: string;
  repo: string;
  labels?: string[];
  state?: "open" | "closed" | "all";
  perPage?: number;
}): Promise<GitHubIssue[]> {
  const params = new URLSearchParams({
    state: opts.state ?? "all",
    per_page: String(opts.perPage ?? 50),
    sort: "created",
    direction: "desc",
  });
  if (opts.labels?.length) params.set("labels", opts.labels.join(","));
  const res = await fetch(`${API}/repos/${opts.repo}/issues?${params.toString()}`, {
    headers: headers(opts.token),
  });
  if (!res.ok) {
    throw new Error(`GitHub list issues ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as GitHubIssue[];
}
