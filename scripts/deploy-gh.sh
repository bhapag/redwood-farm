#!/usr/bin/env bash
# Build the GitHub Pages copy (base /redwood-farm/) and push it to branch gh-pages.
# Usage: bash scripts/deploy-gh.sh "commit message"
# The address and base path come from SITE_URL in site.config.mjs (one value).
set -euo pipefail
cd "$(dirname "$0")/.."
SITE_DIR="$(pwd)"
REPO="${REPO:-$SITE_DIR/../repo}"
MSG="${1:-Deploy GitHub Pages copy}"

python scripts/build_menu.py
npx astro build --outDir dist-gh
# QA runs against the GitHub build layout.
MSYS_NO_PATHCONV=1 PYTHONIOENCODING=utf8 DIST=dist-gh BASE=/redwood-farm python scripts/qa_check.py | tail -1

cd "$REPO"
git checkout -q gh-pages
git rm -rq . >/dev/null 2>&1 || true
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r "$SITE_DIR/dist-gh/." .
rm -f _headers _redirects
touch .nojekyll
git add -A
git -c user.name="bhapag" commit -qm "$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || echo "nothing to commit"
timeout 170 env GIT_TERMINAL_PROMPT=0 git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -q origin gh-pages
git checkout -q main
echo "pushed gh-pages"
