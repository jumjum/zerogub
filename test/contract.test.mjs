// Contract tests — run against the compiled dist (no build step, no deps).
//   node --test
import test from "node:test";
import assert from "node:assert/strict";
import {
  reportSchema,
  appLabel,
  typeLabel,
  ZEROGUB_LABEL,
  ZEROGUB_PROTOCOL_VERSION,
} from "../dist/types.js";

const valid = {
  projectKey: "demo",
  screen: "https://demo.test/x",
  timestamp: new Date().toISOString(),
  reportText: "something broke",
  device: { userAgent: "node-test" },
};

test("labels are deterministic", () => {
  assert.equal(appLabel("govaj"), "app:govaj");
  assert.equal(typeLabel("bug"), "type:bug");
  assert.equal(typeLabel("feature"), "type:feature");
  assert.equal(ZEROGUB_LABEL, "zerogub");
});

test("protocol version is pinned", () => {
  assert.equal(ZEROGUB_PROTOCOL_VERSION, 1);
});

test("kind defaults to bug; consoleErrors defaults to []", () => {
  const r = reportSchema.parse(valid);
  assert.equal(r.kind, "bug");
  assert.deepEqual(r.consoleErrors, []);
});

test("feature kind is preserved", () => {
  const r = reportSchema.parse({ ...valid, kind: "feature" });
  assert.equal(r.kind, "feature");
});

test("rejects an invalid projectKey (must be a lowercase slug)", () => {
  assert.throws(() => reportSchema.parse({ ...valid, projectKey: "NotASlug" }));
});

test("rejects an unknown kind", () => {
  assert.throws(() => reportSchema.parse({ ...valid, kind: "question" }));
});

test("rejects a missing required field", () => {
  const { reportText, ...rest } = valid;
  void reportText;
  assert.throws(() => reportSchema.parse(rest));
});
