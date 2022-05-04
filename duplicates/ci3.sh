FILE1=${1:-content/1.jpg}
FILE2=${2:-content/2.jpg}
DIFFERS=`diff $FILE1 $FILE2`

if [ -z "$DIFFERS" ]
then
exit 0
else
exit 1
fi

