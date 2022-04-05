
nowBranch="$(git branch --contains | cut -d " " -f 2)"

git checkout main
echo ======================================
git branch

git merge $nowBranch

git checkout $nowBranch
echo ======================================
git branch
