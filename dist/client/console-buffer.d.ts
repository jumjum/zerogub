/** Rolling buffer of recent console/window errors, attached to each report. */
/** Idempotently patch console.error + window error events. No-op on the server. */
export declare function installConsoleCapture(): void;
export declare function recentConsoleErrors(): string[];
