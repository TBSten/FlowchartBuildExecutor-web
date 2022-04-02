
nowBranch="$(git branch --contains | cut -d " " -f 2)"
git add .
git commit 
git checkout main
git merge dev
git checkout $nowBranch

