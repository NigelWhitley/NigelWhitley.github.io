#!/bin/sh

SOURCE_DIR=${1:-"content/demo"}
RESIZED_DIR=${2:-"content/resized"}

declare -a type_array=("jpg" "JPG")
declare -a image_array

for TYPE in ${type_array[@]}; do
image_array=`ls ${SOURCE_DIR}/*.${TYPE}`

for SOURCE_FILE in ${image_array[@]}; do

FILE_ONLY=${SOURCE_FILE#${SOURCE_DIR}/}

TARGET_FILE=${RESIZED_DIR}/${FILE_ONLY}

convert ${SOURCE_FILE} -resize 800x800 ${TARGET_FILE}

echo "resized ${SOURCE_FILE} to ${TARGET_FILE}"

done

done
