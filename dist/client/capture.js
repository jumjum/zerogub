import { ZEROGUB_PROTOCOL_VERSION, } from "../types";
import { recentConsoleErrors } from "./console-buffer";
/** Raster the current page to a PNG data URL. Returns undefined on failure. */
export async function captureScreenshot() {
    if (typeof document === "undefined")
        return undefined;
    try {
        // html2canvas-pro understands modern CSS color spaces (oklch/lab) that the
        // original html2canvas chokes on — required for Tailwind v4 apps.
        const { default: html2canvas } = await import("html2canvas-pro");
        const canvas = await html2canvas(document.body, {
            logging: false,
            useCORS: true,
            // Cap pixel ratio so the data URL stays small.
            scale: Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.5),
        });
        return canvas.toDataURL("image/png");
    }
    catch {
        return undefined;
    }
}
/** Auto-collect device/URL/console context. Pair with captureScreenshot(). */
export function collectContext(projectKey, reportText, opts = {}) {
    const kind = opts.kind ?? "bug";
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    return {
        v: ZEROGUB_PROTOCOL_VERSION,
        kind,
        projectKey,
        screen: typeof location !== "undefined" ? location.href : "unknown",
        timestamp: new Date().toISOString(),
        reportText,
        reporter: opts.reporter,
        device: {
            userAgent: nav?.userAgent ?? "unknown",
            platform: nav?.platform,
            os: guessOs(nav?.userAgent ?? ""),
            viewport: typeof window !== "undefined"
                ? { w: window.innerWidth, h: window.innerHeight }
                : undefined,
            hardware: nav?.hardwareConcurrency ? `${nav.hardwareConcurrency} cores` : undefined,
        },
        // Console errors only matter for bugs; a feature request doesn't need them.
        consoleErrors: kind === "bug" ? recentConsoleErrors() : [],
    };
}
function guessOs(ua) {
    if (/Mac OS X/.test(ua))
        return "macOS";
    if (/Windows/.test(ua))
        return "Windows";
    if (/Android/.test(ua))
        return "Android";
    if (/iPhone|iPad|iPod/.test(ua))
        return "iOS";
    if (/Linux/.test(ua))
        return "Linux";
    return undefined;
}
