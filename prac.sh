
BRANCH="dev"

if [ $(git symbolic-ref --short HEAD) = $BRANCH ] ; then
    echo "yes"
else
    echo "no"
fi
