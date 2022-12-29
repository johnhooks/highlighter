#!/bin/bash

echo "copying ./lib/**/*.js to ./dist/esm/"
mkdir -p dist/esm
rsync -a --prune-empty-dirs --include '*/' --include '*.js' --exclude '*' lib/ dist/esm
