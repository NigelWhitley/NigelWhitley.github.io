#!/bin/sh
# Only input parameter is the base folder

BASE_FOLDER=${1:-content}
#echo $BASE_FOLDER

FINAL_FOLDER=${BASE_FOLDER##*/}
#if [ "$FINAL_FOLDER" == "/" ]
if [ -z "$FINAL_FOLDER" ]
then
BASE_STUB=${BASE_FOLDER%%/}
#echo $BASE_STUB
FINAL_FOLDER=${BASE_STUB##*/}
fi
OUTPUT_FILE=${2:-${FINAL_FOLDER}.xml}
#echo $FINAL_FOLDER
#echo $OUTPUT_FILE

du -a -b -S $BASE_FOLDER | awk -f ci2.awk | sort - | awk -f ci3.awk  >$OUTPUT_FILE
#du -a -b -S $BASE_FOLDER | awk -f ci2.awk | sort - | awk -f ci3.awk | sort - | awk -f ci4.awk >$OUTPUT_FILE
