#!/bin/sh
a=$(git describe)
IFS='-' read -r -a array <<< "$a"
echo "REACT_APP_VERSION = '${array[0]}.${array[1]}'" > .env