import { z } from "zod";

/** Bumped only on breaking payload changes; lets a collector reject stale clients. */
export const ZEROGUB_PROTOCOL_VERSION = 1;

export const deviceSchema = z.object({
  userAgent: z.string(),
  platform: z.string().optional(),
  os: z.string().optional(),
  viewport: z.object({ w: z.number().int(), h: z.number().int() }).optional(),
  hardware: z.string().optional(),
});
export type ZerogubDevice = z.infer<typeof deviceSchema>;

/**
 * The uniform report contract — identical for every platform. Only the capture
 * client that fills it in is platform-specific (web html2canvas, native, …).
 */
/** A bug report or a feature request — routed to different repos, labeled `type:<kind>`. */
export const reportKindSchema = z.enum(["bug", "feature"]);
export type ZerogubKind = z.infer<typeof reportKindSchema>;

export const reportSchema = z.object({
  v: z.literal(ZEROGUB_PROTOCOL_VERSION).optional(),
  /** "bug" (default) or "feature". */
  kind: reportKindSchema.default("bug"),
  /** App identity — becomes the GitHub label `app:<projectKey>`. */
  projectKey: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9][a-z0-9-]*$/, "lowercase slug, e.g. govaj"),
  /** URL (web) or screen name (native). */
  screen: z.string().max(2000),
  /** ISO 8601. */
  timestamp: z.string(),
  reportText: z.string().max(10_000),
  reporter: z.string().max(200).optional(),
  device: deviceSchema,
  consoleErrors: z.array(z.string().max(2000)).max(50).default([]),
  /** PNG data URL from the capture client; the collector uploads + links it. */
  screenshot: z.string().optional(),
});
export type ZerogubReport = z.infer<typeof reportSchema>;

export type ZerogubCreateResult = {
  ok: true;
  issueNumber: number;
  issueUrl: string;
  screenshotUrl?: string;
};

/** `app:<projectKey>` — the per-app GitHub label every report carries. */
export function appLabel(projectKey: string): string {
  return `app:${projectKey}`;
}

/** `type:bug` / `type:feature` — distinguishes the two streams. */
export function typeLabel(kind: ZerogubKind): string {
  return `type:${kind}`;
}

/** Marks every ZeroG-filed issue, so the viewer can scope to its own reports. */
export const ZEROGUB_LABEL = "zerogub";
