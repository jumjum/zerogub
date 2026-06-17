import { type ZerogubReport } from "../types";
/** Raster the current page to a PNG data URL. Returns undefined on failure. */
export declare function captureScreenshot(): Promise<string | undefined>;
/** Auto-collect device/URL/console context. Pair with captureScreenshot(). */
export declare function collectContext(projectKey: string, reportText: string, reporter?: string): Omit<ZerogubReport, "screenshot">;
