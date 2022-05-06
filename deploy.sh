
BRANCH="dev"
NOW_BRANCH=$(git symbolic-ref --short HEAD)

if [ $NOW_BRANCH != $BRANCH ] ; then
    echo "invalid branch '$BRANCH'"
    exit 1
fi

COMMAND_CNT=8

git add .
echo "[1/$COMMAND_CNT] command finished"
git commit
echo "[2/$COMMAND_CNT] command finished"

git checkout main
echo "[3/$COMMAND_CNT] command finished"

git merge dev
echo "[4/$COMMAND_CNT] command finished"
git add .
echo "[5/$COMMAND_CNT] command finished"
git commit -m "merge dev"
echo "[6/$COMMAND_CNT] command finished"

git checkout dev
echo "[7/$COMMAND_CNT] command finished"

git push --all
echo "[8/$COMMAND_CNT] command finished"

echo "finish"


