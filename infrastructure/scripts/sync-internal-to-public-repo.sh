#!/bin/bash
set -e

COMMIT_MSG="$1"
PUBLIC_REPO_PATH="$2"
INTERNAL_REPO_PATH="$(git rev-parse --show-toplevel)"
BRANCH="sync/internal-to-public"
DATE="$(date +%F)"
PUBLIC_REPO_PATH_BRANCH_NAME="sync/internal-to-public-$DATE"
EXPORT_TAR="/tmp/vehicle-connector.tar"

INTERNAL_REPO_PATH_REQUIRED_BRANCH="sync/internal-to-public"
INTERNAL_REPO_PATH_CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ -z "$INTERNAL_REPO_PATH" ]; then
  echo "INTERNAL_REPO_PATH not found. Please run this script from the internal repo."
  exit 1
fi
if [ -z "$PUBLIC_REPO_PATH" ]; then
  echo "PUBLIC_REPO_PATH not provided. Please provide the path to the public repo."
  exit 1
fi

if [ "$INTERNAL_REPO_PATH" == "$PUBLIC_REPO_PATH" ]; then
  echo "❌ Internal and public repo paths should not be the same."
  exit 1
fi

if [ -z "$COMMIT_MSG" ]; then
  echo "Commit message for public repo missing."
  exit 1
fi

if [ "$INTERNAL_REPO_PATH_CURRENT_BRANCH" != "$INTERNAL_REPO_PATH_REQUIRED_BRANCH" ]; then
  echo "❌ You must be on branch '$INTERNAL_REPO_PATH_REQUIRED_BRANCH' to run this script. (Current: $INTERNAL_REPO_PATH_CURRENT_BRANCH)"
  exit 1
fi

cd "$INTERNAL_REPO_PATH"

echo "📦 Creating git archive..."
git archive HEAD --format=tar --output="$EXPORT_TAR"

echo "Switching to public repo at $PUBLIC_REPO_PATH"
cd "$PUBLIC_REPO_PATH"
echo "Current directory: $(pwd)"

if [[ -n $(git status --porcelain) ]]; then
  echo "❌ Public repo working directory is not clean. Please commit or stash changes."
  exit 1
fi

# checkout main branch so that subsequent deletion of sync branch possible
if git show-ref --verify --quiet refs/heads/main; then
  echo "Branch main already exists. Recreating..."
  git checkout main
else
  echo "Creating new branch main..."
  git checkout -b main
fi

# create branch $PUBLIC_REPO_PATH_BRANCH_NAME
if git show-ref --verify --quiet refs/heads/"$PUBLIC_REPO_PATH_BRANCH_NAME"; then
  echo "Branch $PUBLIC_REPO_PATH_BRANCH_NAME already exists. Recreating..."
  #git worktree remove $(git worktree list | grep "$PUBLIC_REPO_PATH_BRANCH_NAME" | awk '{print $1}')
  git branch -D "$PUBLIC_REPO_PATH_BRANCH_NAME"
  git checkout -b "$PUBLIC_REPO_PATH_BRANCH_NAME"
else
  echo "Creating new branch $PUBLIC_REPO_PATH_BRANCH_NAME..."
  git checkout -b "$PUBLIC_REPO_PATH_BRANCH_NAME"
fi

echo "🧹 Cleaning old files (except .git)..."
find . -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf {} +

echo "📂 Extracting archive..."
tar -xf "$EXPORT_TAR"

echo "✂️ Removing internal in files in modules/protocols/common..."
echo "✂️ Removing internal reference from Protocols.ts..."
sed -i '/import INTERNAL/d' modules/protocols/common/src/Protocols.ts
sed -i 's/ | INTERNAL//' modules/protocols/common/src/Protocols.ts

echo "✂️ Removing internal reference from Actions.ts..."
sed -i '/import INTERNAL/d' modules/protocols/common/src/Actions.ts
sed -i 's/ | INTERNAL//' modules/protocols/common/src/Actions.ts

echo "✂️ Removing internal reference from Pakets.ts..."
sed -i '/import INTERNAL/d' modules/protocols/common/src/Pakets.ts
sed -i 's/ | INTERNAL//' modules/protocols/common/src/Pakets.ts

echo "✂️ Remove line with internal reference from package-deps.sh..."
sed -i '/internal/d' infrastructure/scripts/workflows/package-deps.sh

echo "✂️ Remove line with internal reference from root package.json..."
sed -i '/_internal/d' package.json

git add .
git commit -m "$COMMIT_MSG"
echo "Committed changes to public repo with message: $COMMIT_MSG"
#git push -u origin "$BRANCH_NAME"

#echo "✅ Sync complete: pushed to branch $BRANCH_NAME"
