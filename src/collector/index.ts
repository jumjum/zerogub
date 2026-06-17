import {
  appLabel,
  reportSchema,
  ZEROGUB_LABEL,
  type ZerogubCreateResult,
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
  /** `owner/name` of a repo YOU control — a shared bug bucket, or the app's own repo. */
  repo: string;
  /**
   * Where to put the screenshot. Defaults to committing it into the bugs repo.
   * Swap for a blob uploader (R2 / Vercel Blob) to get inline rendering on
   * private repos without auth.
   */
  uploadScreenshot?: ScreenshotUploader;
};

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

  let screenshotUrl: string | undefined;
  if (report.screenshot) {
    const upload = cfg.uploadScreenshot ?? repoUploader(cfg.token, cfg.repo);
    try {
      screenshotUrl = await upload(report.screenshot, {
        projectKey: report.projectKey,
        timestamp: report.timestamp,
      });
    } catch {
      // Non-fatal: still file the bug, just without the image.
      screenshotUrl = undefined;
    }
  }

  const { number, html_url } = await createIssue({
    token: cfg.token,
    repo: cfg.repo,
    title: titleFrom(report),
    body: renderIssueBody(report, screenshotUrl),
    labels: [appLabel(report.projectKey), ZEROGUB_LABEL],
  });

  return { ok: true, issueNumber: number, issueUrl: html_url, screenshotUrl };
}

/**
 * Next.js App Router route factory. In a consumer:
 *
 *   export const POST = createZerogubRoute(() => ({
 *     token: process.env.GITHUB_TOKEN!,
 *     repo: process.env.ZEROGUB_REPO!,
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
  return first || `Bug report (${r.projectKey})`;
}

function renderIssueBody(r: ZerogubReport, screenshotUrl?: string): string {
  const d = r.device;
  const vp = d.viewport ? `${d.viewport.w}×${d.viewport.h}` : "—";
  const lines: string[] = [
    r.reportText.trim(),
    "",
    "---",
    `**App:** \`${r.projectKey}\``,
    `**Screen:** ${r.screen}`,
    `**When:** ${r.timestamp}`,
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
