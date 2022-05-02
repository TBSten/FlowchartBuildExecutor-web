
BRANCH="dev"
NOW_BRANCH=$(git symbolic-ref --short HEAD)

if [ $NOW_BRANCH != $BRANCH ] ; then
    echo "invalid branch '$BRANCH'"
    exit 1
fi


git add .
git commit

git checkout main

git merge dev
git add .
git commit -m "merge dev"

git checkout dev


