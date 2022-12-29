#!/bin/bash

# Usage: Build a package.
# The build pipeline is typically handled by `turbo`, though its handy to have a
# script for building locally, rather than from the monorepo root directory.

# Note: To be run from inside a `packages/*/` directory.

yarn clean:all
yarn build:tsc
yarn build:esm
yarn build:types
