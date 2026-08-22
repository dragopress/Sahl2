#!/bin/sh
set -eu
: "${DATABASE_URL:?DATABASE_URL is required}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="$BACKUP_DIR/sahlbiz-$STAMP.dump"
pg_dump "$DATABASE_URL" --format=custom --no-owner --file="$OUT"
sha256sum "$OUT" > "$OUT.sha256"
echo "Created $OUT"
