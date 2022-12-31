#!/bin/bash

echo "copying ./build/**/*.js to ./dist/esm/"
mkdir -p dist/esm
rsync -a --prune-empty-dirs --include '*/' --include '*.js' --exclude '*' build/ dist/esm
