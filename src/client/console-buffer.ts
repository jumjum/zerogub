/** Rolling buffer of recent console/window errors, attached to each report. */

const MAX = 30;
const buffer: string[] = [];
let installed = false;

/** Idempotently patch console.error + window error events. No-op on the server. */
export function installConsoleCapture(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const orig = console.error.bind(console);
  console.error = (...args: unknown[]) => {
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

export function recentConsoleErrors(): string[] {
  return [...buffer];
}

function push(s: string): void {
  buffer.push(s.slice(0, 2000));
  if (buffer.length > MAX) buffer.shift();
}

function fmt(x: unknown): string {
  if (x instanceof Error) return `${x.name}: ${x.message}`;
  if (typeof x === "string") return x;
  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}
