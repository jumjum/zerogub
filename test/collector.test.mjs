// Collector routing tests — the money-path: bug vs feature → correct repo,
// correct labels, screenshot-upload failure is non-fatal. Stubs global fetch so
// no network/token is needed. Runs against compiled dist.
//   node --test
import test from "node:test";
import assert from "node:assert/strict";
import { createReport } from "../dist/collector/index.js";

function jsonRes(obj, status = 200) {
  return {
    ok: status < 400,
    status,
    json: async () => obj,
    text: async () => JSON.stringify(obj),
  };
}

/** Records every fetch; answers GitHub create-issue + commit-file shapes. */
function installFetch({ failUpload = false } = {}) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    calls.push({ url: u, init });
    if (u.includes("/contents/")) {
      if (failUpload) return jsonRes({ message: "boom" }, 500);
      return jsonRes({ content: { download_url: "https://img.test/s.png" } }, 201);
    }
    if (u.endsWith("/issues")) {
      return jsonRes({ number: 42, html_url: "https://github.com/x/issues/42" }, 201);
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
  return calls;
}

function report(over = {}) {
  return {
    projectKey: "demo",
    screen: "https://demo.test/x",
    timestamp: "2026-06-17T12:00:00.000Z",
    reportText: "first line\nrest",
    device: { userAgent: "node-test" },
    ...over,
  };
}

const cfg = { token: "t", repo: "owner/bugs", featureRepo: "owner/features" };

function issueCall(calls) {
  return calls.find((c) => c.url.endsWith("/issues"));
}

test("a bug files into the bug repo with app/type/zerogub labels", async () => {
  const calls = installFetch();
  const res = await createReport(report({ kind: "bug" }), cfg);
  assert.equal(res.ok, true);
  assert.equal(res.issueNumber, 42);
  const ic = issueCall(calls);
  assert.ok(ic.url.includes("/repos/owner/bugs/issues"), ic.url);
  const body = JSON.parse(ic.init.body);
  assert.deepEqual(body.labels, ["app:demo", "type:bug", "zerogub"]);
  assert.equal(body.title, "first line");
});

test("a feature routes to the feature repo", async () => {
  const calls = installFetch();
  await createReport(report({ kind: "feature" }), cfg);
  const ic = issueCall(calls);
  assert.ok(ic.url.includes("/repos/owner/features/issues"), ic.url);
  assert.deepEqual(JSON.parse(ic.init.body).labels, ["app:demo", "type:feature", "zerogub"]);
});

test("feature falls back to the bug repo when no featureRepo is set", async () => {
  const calls = installFetch();
  await createReport(report({ kind: "feature" }), { token: "t", repo: "owner/bugs" });
  assert.ok(issueCall(calls).url.includes("/repos/owner/bugs/issues"));
});

test("a failed screenshot upload still files the issue (non-fatal)", async () => {
  const calls = installFetch({ failUpload: true });
  const res = await createReport(
    report({ kind: "bug", screenshot: "data:image/png;base64,AAAA" }),
    cfg,
  );
  assert.equal(res.ok, true);
  assert.equal(res.screenshotUrl, undefined);
  assert.ok(issueCall(calls), "issue was still created");
});

test("a valid screenshot upload is linked on the result", async () => {
  installFetch();
  const res = await createReport(
    report({ kind: "bug", screenshot: "data:image/png;base64,AAAA" }),
    cfg,
  );
  assert.equal(res.screenshotUrl, "https://img.test/s.png");
});
