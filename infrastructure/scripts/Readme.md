- check changes between main and sync/internal-to-public
- merge changes from main to sync/internal-to-public that should be in the public repo
- switch to branch "sync/internal-to-public"
- exec:
```
./sync-internal-to-public-repo.sh "Your commit name" "/folder/to/external/repo"
```
- go to local public repo and push to remote