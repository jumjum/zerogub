import {
  appLabel,
  reportSchema,
  typeLabel,
  ZEROGUB_LABEL,
  type ZerogubCreateResult,
  type ZerogubKind,
  type ZerogubReport,
} from "../types";
import { commitFile, createIssue } from "./github";

/** Pluggable screenshot sink — return a URL to link in the issue body. */
export type ScreenshotUploader = (
  dataUrl: string,
  meta: { projectKey: string; timestamp: string },
) => Promise<string>;

export type CollectorConfig = {
  /** GitHub token with `repo` scope. Server-side only — never ship to clients. */
  token: string;
  /** `owner/name` of a repo YOU control — the bug repo (and the default). */
  repo: string;
  /** Optional separate repo for feature requests. Falls back to `repo`. */
  featureRepo?: string;
  /**
   * Where to put the screenshot. Defaults to committing it into the target repo.
   * Swap for a blob uploader (R2 / Vercel Blob) to get inline rendering on
   * private repos without auth.
   */
  uploadScreenshot?: ScreenshotUploader;
};

/** Bugs → repo; features → featureRepo (or repo if unset). */
function repoFor(cfg: CollectorConfig, kind: ZerogubKind): string {
  return kind === "feature" ? cfg.featureRepo ?? cfg.repo : cfg.repo;
}

/** Default: commit the PNG into the repo and link its download URL. */
function repoUploader(token: string, repo: string): ScreenshotUploader {
  return async (dataUrl, meta) => {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const rand = Math.random().toString(36).slice(2, 8);
    const safeTs = meta.timestamp.replace(/[:.]/g, "-");
    const path = `screenshots/${meta.projectKey}/${safeTs}-${rand}.png`;
    const { downloadUrl } = await commitFile({
      token,
      repo,
      path,
      base64,
      message: `screenshot: ${meta.projectKey} ${meta.timestamp}`,
    });
    if (!downloadUrl) throw new Error("no download URL from GitHub");
    return downloadUrl;
  };
}

/** Create one GitHub issue from a report (+ optional screenshot upload). */
export async function createReport(
  input: ZerogubReport,
  cfg: CollectorConfig,
): Promise<ZerogubCreateResult> {
  const report = reportSchema.parse(input);
  const repo = repoFor(cfg, report.kind);

  let screenshotUrl: string | undefined;
  if (report.screenshot) {
    const upload = cfg.uploadScreenshot ?? repoUploader(cfg.token, repo);
    try {
      screenshotUrl = await upload(report.screenshot, {
        projectKey: report.projectKey,
        timestamp: report.timestamp,
      });
    } catch {
      // Non-fatal: still file the report, just without the image.
      screenshotUrl = undefined;
    }
  }

  const { number, html_url } = await createIssue({
    token: cfg.token,
    repo,
    title: titleFrom(report),
    body: renderIssueBody(report, screenshotUrl),
    labels: [appLabel(report.projectKey), typeLabel(report.kind), ZEROGUB_LABEL],
  });

  return { ok: true, issueNumber: number, issueUrl: html_url, screenshotUrl };
}

/**
 * Next.js App Router route factory. In a consumer:
 *
 *   export const POST = createZerogubRoute(() => ({
 *     token: process.env.GITHUB_TOKEN!,
 *     repo: process.env.ZEROGUB_REPO!,                // bugs
 *     featureRepo: process.env.ZEROGUB_FEATURES_REPO, // feature requests (optional)
 *   }));
 */
export function createZerogubRoute(
  getConfig: () => CollectorConfig | Promise<CollectorConfig>,
) {
  return async function POST(req: Request): Promise<Response> {
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
    }
    const parsed = reportSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "invalid report", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    try {
      const result = await createReport(parsed.data, await getConfig());
      return Response.json(result, { status: 201 });
    } catch (e) {
      return Response.json(
        { ok: false, error: e instanceof Error ? e.message : "collector failed" },
        { status: 502 },
      );
    }
  };
}

function titleFrom(r: ZerogubReport): string {
  const first = r.reportText.split("\n")[0]?.trim().slice(0, 120);
  const fallback = r.kind === "feature" ? "Feature request" : "Bug report";
  return first || `${fallback} (${r.projectKey})`;
}

/** "2026-06-17 17:22 UTC (`<iso>`)" — readable, with the precise ISO kept. */
function fmtWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const readable = d.toISOString().replace("T", " ").replace(/:\d\d\.\d+Z$/, " UTC");
  return `${readable} (\`${iso}\`)`;
}

function renderIssueBody(r: ZerogubReport, screenshotUrl?: string): string {
  const d = r.device;
  const vp = d.viewport ? `${d.viewport.w}×${d.viewport.h}` : "—";
  const lines: string[] = [
    r.reportText.trim(),
    "",
    "---",
    `**Type:** ${r.kind}`,
    `**App:** \`${r.projectKey}\``,
    `**Screen:** ${r.screen}`,
    `**When:** ${fmtWhen(r.timestamp)}`,
  ];
  if (r.reporter) lines.push(`**Reporter:** ${r.reporter}`);
  lines.push(
    `**Device:** ${d.os ?? "?"} · ${d.platform ?? "?"} · viewport ${vp}${d.hardware ? ` · ${d.hardware}` : ""}`,
    `**UA:** \`${d.userAgent}\``,
  );
  if (screenshotUrl) {
    lines.push("", `**Screenshot:** ${screenshotUrl}`, "", `![screenshot](${screenshotUrl})`);
  }
  if (r.consoleErrors.length) {
    lines.push(
      "",
      "<details><summary>Console errors</summary>",
      "",
      "```",
      ...r.consoleErrors.slice(0, 50),
      "```",
      "",
      "</details>",
    );
  }
  lines.push("", "<sub>filed by ZeroG · zerogub</sub>");
  return lines.join("\n");
}
