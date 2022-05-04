#!/bin/sh
# Only input parameter is the base folder

. base_folder.txt
BASE_FOLDER=${1:-$DEFAULT_BASE_FOLDER}

du -a -b -S $BASE_FOLDER >ci.du

awk -f ci2.awk ci.du >ci2.du

sort ci2.du >ci3.du

awk -f ci3.awk ci3.du >ci4.du
