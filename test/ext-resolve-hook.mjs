// Test-only resolver: the shipped dist uses extensionless relative imports
// (e.g. `from "../types"`) — fine for bundler consumers (Next), but raw Node
// ESM needs the `.js`. This hook appends it so `node --test` can load dist
// directly with zero deps. It does NOT touch shipped code.
// NOTE: before npm publish, emit explicit `.js` extensions in dist so non-bundler
// Node consumers work without this hook (tracked in docs/BUILD_PLAN.md B3).
export async function resolve(specifier, context, next) {
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && !/\.[mc]?js$/.test(specifier)) {
    try {
      return await next(specifier + ".js", context);
    } catch {
      // fall through to the original specifier
    }
  }
  return next(specifier, context);
}
