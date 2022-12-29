#!/bin/bash

args=()

# Strip out `--local` flag in CI
if [ -z $CI ] || [ $CI = false ] ; then
  # CI is either unset or false
  args=$@
  if [[ ! " ${args[*]} " =~ " --local " ]] ; then
    args+=("--local")
  fi
elif [ $CI = true ] ; then
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
