/** Minimal GitHub REST helpers (fetch-based, no SDK). Server-side only. */
const API = "https://api.github.com";
function headers(token) {
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "zerogub",
    };
}
export async function createIssue(opts) {
    const res = await fetch(`${API}/repos/${opts.repo}/issues`, {
        method: "POST",
        headers: { ...headers(opts.token), "Content-Type": "application/json" },
        body: JSON.stringify({ title: opts.title, body: opts.body, labels: opts.labels }),
    });
    if (!res.ok) {
        throw new Error(`GitHub create issue ${res.status}: ${await res.text()}`);
    }
    const json = (await res.json());
    return { number: json.number, html_url: json.html_url };
}
/** Commit a base64 file (PNG, no `data:` prefix) to the repo; returns its URLs. */
export async function commitFile(opts) {
    const res = await fetch(`${API}/repos/${opts.repo}/contents/${opts.path.split("/").map(encodeURIComponent).join("/")}`, {
        method: "PUT",
        headers: { ...headers(opts.token), "Content-Type": "application/json" },
        body: JSON.stringify({ message: opts.message, content: opts.base64 }),
    });
    if (!res.ok) {
        throw new Error(`GitHub commit file ${res.status}: ${await res.text()}`);
    }
    const json = (await res.json());
    return {
        downloadUrl: json.content?.download_url ?? null,
        htmlUrl: json.content?.html_url ?? null,
    };
}
export async function listIssues(opts) {
    const params = new URLSearchParams({
        state: opts.state ?? "all",
        per_page: String(opts.perPage ?? 50),
        sort: "created",
        direction: "desc",
    });
    if (opts.labels?.length)
        params.set("labels", opts.labels.join(","));
    const res = await fetch(`${API}/repos/${opts.repo}/issues?${params.toString()}`, {
        headers: headers(opts.token),
    });
    if (!res.ok) {
        throw new Error(`GitHub list issues ${res.status}: ${await res.text()}`);
    }
    return (await res.json());
}
