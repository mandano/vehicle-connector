### use repo (without gitea)
```
git remote add origin git@CONFIG_NAME:/home/git/repositories/vehicle-connector.git
```
or
```
git clone git@CONFIG_NAME:/home/git/repositories/vehicle-connector.git
```

### add remote (gitea)
```
git remote add public-test git@CONFIG_NAME:/user/repo-name.git
```

### Publish commits back from public repo
```
git remote add public-test git@CONFIG_NAME:/user/repo-name.git
get fetch public-test
git checkout -b public-test/main public-test/main
```
- push to remote of internal repo, create PR, review and merge

