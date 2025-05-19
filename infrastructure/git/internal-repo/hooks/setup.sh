root_dir=$(git rev-parse --show-toplevel)
cp "$root_dir/git/internal-repo/hooks/pre-push" "$root_dir/.git/hooks/pre-push"
chmod +x "$root_dir/.git/hooks/pre-push"