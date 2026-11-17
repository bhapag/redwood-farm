#!/usr/bin/env bash
# Publish the GitHub Pages copy (bhapag.github.io/redwood-farm/, the printed QR address) as a redirect site:
# every path forwards to the same path on https://redwoodfarm.in. Run only once the domain is live.
# Usage: bash scripts/deploy-gh-redirect.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SITE_DIR="$(pwd)"
REPO="${REPO:-$SITE_DIR/../repo}"
ORIGIN="${ORIGIN:-https://redwoodfarm.in}"
# The page list comes from the GitHub-layout build.
MSYS_NO_PATHCONV=1 BASE_PATH=/redwood-farm PUBLIC_CANONICAL_ORIGIN="$ORIGIN" npx astro build --outDir dist-gh >/dev/null
python scripts/make_redirect_site.py "$ORIGIN"
cd "$REPO"
git checkout -q gh-pages
git rm -rq . >/dev/null 2>&1 || true
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r "$SITE_DIR/dist-redirect/." .
git add -A
git -c user.name="bhapag" commit -qm "GitHub Pages copy now redirects every path to $ORIGIN

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || echo "nothing to commit"
timeout 170 env GIT_TERMINAL_PROMPT=0 git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -q origin gh-pages
git checkout -q main
echo "pushed redirect site to gh-pages"
