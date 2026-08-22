#!/bin/sh
set -eu

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  npx prisma migrate deploy --schema=/app/packages/database/prisma/schema.prisma
  if [ "${START_AFTER_MIGRATIONS:-false}" != "true" ]; then
    exit 0
  fi
fi

exec node /app/apps/api/dist/main.js
