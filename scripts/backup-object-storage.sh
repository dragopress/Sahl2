#!/bin/sh
set -eu
: "${S3_ENDPOINT:?S3_ENDPOINT is required}"
: "${S3_ACCESS_KEY_ID:?S3_ACCESS_KEY_ID is required}"
: "${S3_SECRET_ACCESS_KEY:?S3_SECRET_ACCESS_KEY is required}"
: "${S3_BUCKET:?S3_BUCKET is required}"
DEST="${1:-backups/objects-$(date -u +%Y%m%dT%H%M%SZ)}"
mkdir -p "$DEST"
export AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="${S3_REGION:-us-east-1}"
export AWS_ENDPOINT_URL="$S3_ENDPOINT"
command -v aws >/dev/null 2>&1 || { echo 'aws CLI is required' >&2; exit 1; }
aws s3 sync "s3://${S3_BUCKET}" "$DEST" --only-show-errors
printf '%s\n' "Object storage backup complete: $DEST"
