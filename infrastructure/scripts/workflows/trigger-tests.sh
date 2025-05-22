#!/bin/bash

source "infrastructure/scripts/workflows/package-deps.sh"

echo "Changed packages: $CHANGED"

for path in $CHANGED; do
  cd "$path" || exit 1
  echo "Running tests in $path"

  if npm run | grep -q "$1"; then
      npm run "$1";
  fi

  cd - || exit 1
done
