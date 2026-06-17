#!/usr/bin/env bash
# Pre-push guard for a PUBLIC repo. Aborts the push if the tracked tree contains
# things that must never be published: internal fleet files, .env files, or
# secret-shaped strings. Install once: scripts/install-hooks.sh
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 0
fail=0

noise=$(git ls-files | grep -E '^(FLEET_PLAYBOOK|NAPPS_DEV_PORTS)\.md$' || true)
if [ -n "$noise" ]; then
  echo "✗ BLOCKED: internal fleet files tracked here:"; echo "$noise" | sed 's/^/    /'; fail=1
fi

# Block real .env files, but allow committed templates (.env*.example / .sample
# / .template) — they hold placeholders, and the secret scan below still covers them.
envf=$(git ls-files | grep -E '(^|/)\.env' | grep -vE '\.(example|sample|template)$' || true)
if [ -n "$envf" ]; then
  echo "✗ BLOCKED: .env file tracked:"; echo "$envf" | sed 's/^/    /'; fail=1
fi

# Secret-shaped strings in tracked, non-markdown files (docs use placeholders).
if git grep -nIE 'github_pat_[A-Za-z0-9_]{30,}|ghp_[A-Za-z0-9]{36}|gho_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----' \
     -- . ':(exclude)*.md' >/dev/null 2>&1; then
  echo "✗ BLOCKED: possible secret in tracked files:"
  git grep -nIE 'github_pat_[A-Za-z0-9_]{30,}|ghp_[A-Za-z0-9]{36}|gho_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----' -- . ':(exclude)*.md' | sed 's/^/    /'
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo "→ push aborted by prepush-guard. Remove the above, then push again." >&2
  exit 1
fi
echo "prepush-guard: clean ✓"
exit 0
