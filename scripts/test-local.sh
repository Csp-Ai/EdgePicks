#!/usr/bin/env bash
set -e
if [ -f .env.test ]; then
  export $(grep -v '^#' .env.test | xargs)
fi
npm test "$@"
