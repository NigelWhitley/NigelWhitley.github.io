#!/bin/sh
# input parameter 1 is the base folder
# input parameter 2 is the output xml file


BASE_FOLDER=${1:-content}
OUTPUT_NAME=${2:-duplicates}
#du -a -b -S $BASE_FOLDER | awk -f ci2.awk | sort - | awk -f ci3.awk >${OUTPUT_NAME}.xml
#du -a -b -S $BASE_FOLDER | awk -f ci2.awk | sort - >${OUTPUT_NAME}.xml
du -a -b -S $BASE_FOLDER | awk -f ci2.awk >${OUTPUT_NAME}.xml
#du -a -b -S $BASE_FOLDER >${OUTPUT_NAME}.xml
