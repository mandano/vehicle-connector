#!/bin/bash

# If testing locally, run before: export GITHUB_ENV=/tmp/github_env
# cd to root folder of repo when run locally

set -e

source "$(dirname "$0")/package-deps.sh"

if [ "$(git rev-parse --abbrev-ref HEAD)" = "master" ]; then
  echo "On master – comparing with previous commit"
  BASE="HEAD~1"
else
  echo "On branch other than master – comparing with origin/master"
  BASE=$(git merge-base HEAD origin/master)
fi

CHANGED=()
for pkg in "${!packageDeps[@]}"; do
  changed=false
  for path in ${packageDeps[$pkg]}; do
    if ! git diff --quiet "$BASE"...HEAD -- "$path"; then
      changed=true
      break
    fi
  done
  $changed && CHANGED+=("$pkg")
done

if [ -z "${CHANGED[*]}" ]; then
  echo "SKIP=true" >> $GITHUB_ENV
  echo "No changed packages detected. Stopping workflow."
  exit 0
fi

echo "Changed packages: ${CHANGED[*]:-none}"
echo "CHANGED=${CHANGED[*]}" >> "$GITHUB_ENV"
