#!/bin/bash
CURRENT_PATH=`pwd`;
CALL_PATH=`dirname $0`
REPOS_HOME=$CALL_PATH"/";
SOURCE_PATH=$REPOS_HOME"src/"
BUILD_DIR=`realpath $REPOS_HOME"/build"`

if [ $# -eq 1 ];  then
    BUILD_DIR=`realpath $REPOS_HOME$1`
fi
echo "building in $BUILD_DIR!"
if [ ! -d $BUILD_DIR ]; then
    echo " - making build directory..."
    mkdir $BUILD_DIR
    echo "directory created successfully!"
fi
echo " - generating make files..."
cd $BUILD_DIR
cmake $BUILD_DIR/../src/
echo " - running make..."

make 
# I don't have install rules working yet...
#make install

