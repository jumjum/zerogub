/** Rolling buffer of recent console/window errors, attached to each report. */
const MAX = 30;
const buffer = [];
let installed = false;
/** Idempotently patch console.error + window error events. No-op on the server. */
export function installConsoleCapture() {
    if (installed || typeof window === "undefined")
        return;
    installed = true;
    const orig = console.error.bind(console);
    console.error = (...args) => {
        push(args.map(fmt).join(" "));
        orig(...args);
    };
    window.addEventListener("error", (e) => {
        push(`${e.message} @ ${e.filename}:${e.lineno}:${e.colno}`);
    });
    window.addEventListener("unhandledrejection", (e) => {
        push(`unhandledrejection: ${fmt(e.reason)}`);
    });
}
export function recentConsoleErrors() {
    return [...buffer];
}
function push(s) {
    buffer.push(s.slice(0, 2000));
    if (buffer.length > MAX)
        buffer.shift();
}
function fmt(x) {
    if (x instanceof Error)
        return `${x.name}: ${x.message}`;
    if (typeof x === "string")
        return x;
    try {
        return JSON.stringify(x);
    }
    catch {
        return String(x);
    }
}
