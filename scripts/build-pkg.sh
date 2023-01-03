#!/bin/bash

# Usage: Build the package.

# If not in CI environment, clean for a fresh build.
if [ -z $CI ] || [ $CI = false ] ; then
  yarn clean:all
fi

yarn build:tsc
yarn build:esm
yarn build:types
