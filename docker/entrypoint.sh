#!/bin/sh
set -e

# Run standard application startup sequence if no custom arguments were passed
if [ "$#" -eq 0 ] || [ "${1#-}" != "$1" ]; then
  echo "==> Deploying Prisma migrations..."
  node ./node_modules/prisma/build/index.js migrate deploy

  echo "==> Starting Next.js production server..."
  exec node server.js "$@"
fi

# Execute passed command directly (e.g. custom management commands, shell)
exec "$@"
