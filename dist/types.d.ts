import { z } from "zod";
/** Bumped only on breaking payload changes; lets a collector reject stale clients. */
export declare const ZEROGUB_PROTOCOL_VERSION = 1;
export declare const deviceSchema: z.ZodObject<{
    userAgent: z.ZodString;
    platform: z.ZodOptional<z.ZodString>;
    os: z.ZodOptional<z.ZodString>;
    viewport: z.ZodOptional<z.ZodObject<{
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, z.core.$strip>>;
    hardware: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ZerogubDevice = z.infer<typeof deviceSchema>;
/**
 * The uniform report contract — identical for every platform. Only the capture
 * client that fills it in is platform-specific (web html2canvas, native, …).
 */
export declare const reportSchema: z.ZodObject<{
    v: z.ZodOptional<z.ZodLiteral<1>>;
    projectKey: z.ZodString;
    screen: z.ZodString;
    timestamp: z.ZodString;
    reportText: z.ZodString;
    reporter: z.ZodOptional<z.ZodString>;
    device: z.ZodObject<{
        userAgent: z.ZodString;
        platform: z.ZodOptional<z.ZodString>;
        os: z.ZodOptional<z.ZodString>;
        viewport: z.ZodOptional<z.ZodObject<{
            w: z.ZodNumber;
            h: z.ZodNumber;
        }, z.core.$strip>>;
        hardware: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    consoleErrors: z.ZodDefault<z.ZodArray<z.ZodString>>;
    screenshot: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ZerogubReport = z.infer<typeof reportSchema>;
export type ZerogubCreateResult = {
    ok: true;
    issueNumber: number;
    issueUrl: string;
    screenshotUrl?: string;
};
/** `app:<projectKey>` — the per-app GitHub label every report carries. */
export declare function appLabel(projectKey: string): string;
/** Marks every ZeroG-filed issue, so the viewer can scope to its own reports. */
export declare const ZEROGUB_LABEL = "zerogub";
