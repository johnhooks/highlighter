#!/bin/bash

args=()

if [ -z $CI ] || [ $CI = false ] ; then
  # Add `--local` flag if not present and not in CI
  args=$@
  if [[ ! " ${args[*]} " =~ " --local " ]] ; then
    args+=("--local")
  fi
elif [ $CI = true ] ; then
  # Strip out `--local` flag in CI
  for arg in "$@" ; do
      case "$arg" in
        '--local')
          true
        ;;
        *)
          args+=($arg)
        ;;
      esac
  done
fi

echo "api-extractor run ${args[@]}"
./node_modules/.bin/api-extractor run ${args[@]}
