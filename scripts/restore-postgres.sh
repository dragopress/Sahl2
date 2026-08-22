#!/bin/sh
set -eu
: "${DATABASE_URL:?DATABASE_URL is required}"
: "${1:?usage: restore-postgres.sh <backup.dump>}"
pg_restore "$1" --dbname="$DATABASE_URL" --clean --if-exists --no-owner
