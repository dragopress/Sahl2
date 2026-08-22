#!/bin/sh
set -eu
: "${STORAGE_ENDPOINT:?STORAGE_ENDPOINT is required}"
: "${STORAGE_ACCESS_KEY:?STORAGE_ACCESS_KEY is required}"
: "${STORAGE_SECRET_KEY:?STORAGE_SECRET_KEY is required}"
: "${STORAGE_BUCKET:?STORAGE_BUCKET is required}"
DEST="${1:-backups/objects-$(date -u +%Y%m%dT%H%M%SZ)}"
mkdir -p "$DEST"
export AWS_ACCESS_KEY_ID="$STORAGE_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$STORAGE_SECRET_KEY"
export AWS_DEFAULT_REGION="${STORAGE_REGION:-us-east-1}"
export AWS_ENDPOINT_URL="$STORAGE_ENDPOINT"
command -v aws >/dev/null 2>&1 || { echo 'aws CLI is required' >&2; exit 1; }
aws s3 sync "s3://${STORAGE_BUCKET}" "$DEST" --only-show-errors
printf '%s\n' "Object storage backup complete: $DEST"
