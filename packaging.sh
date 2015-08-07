#!/bin/bash

BASEDIR=$(dirname $0)
BUILD_DIR=${BASEDIR}/build
if [ ! -d "$BUILD_DIR" ]; then
	mkdir $BUILD_DIR
fi

VERSION=$(sed -rn 's/.*"version" *: *"([.0-9]+)".*/\1/p' manifest.json)

APP_DIR=${BUILD_DIR}/trellomino-${VERSION}
if [ -d "$APP_DIR" ]; then
	echo "Error : application directory ${APP_DIR} already exists";
	exit 1;
fi

mkdir $APP_DIR

cp -rf $(ls -a . | egrep -v "^build$|^packaging\.sh$|^README\.md$|^\.$|^\..$|^\.project$|^\.git$") $APP_DIR

cd $BUILD_DIR
zip -r trellomino-${VERSION}.zip $(basename $APP_DIR)