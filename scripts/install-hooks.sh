#!/usr/bin/env bash
# Wire the pre-push guard into git. Run once after cloning.
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
hook="$root/.git/hooks/pre-push"
printf '#!/usr/bin/env bash\nexec "%s/scripts/prepush-guard.sh"\n' "$root" > "$hook"
chmod +x "$hook" "$root/scripts/prepush-guard.sh"
echo "installed pre-push guard → $hook"
