
nowBranch="$(git branch --contains | cut -d " " -f 2)"
git checkout main
git merge $nowBranch
git checkout nowBranch
