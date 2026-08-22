# SahlBiz Release Candidate & Deployment Status

## Candidate

- Version: **0.2.0-rc.1**
- Release manifest: `release/manifest.json`

## Implemented

- Production Dockerfiles for API, web, and worker
- Next.js standalone runtime image
- Non-root production containers
- One-shot Prisma migration container that exits successfully
- PostgreSQL/Redis/MinIO health checks
- API/web readiness checks
- Production environment template
- PostgreSQL backup/restore scripts
- S3/MinIO object-storage backup/restore scripts
- Release repository validation
- Release candidate GitHub Actions workflow
- Version consistency checks across workspaces
- Release manifest with SHA-256 hashes
- Deployment/rollback/secrets/observability runbook

## Local verification completed

- Repository validation: passed
- Release candidate checks: passed
- Migration naming/SQL presence checks: passed (10 migrations)
- Compose YAML parsing: passed for development, test, and production files
- Shell syntax checks: passed for operational scripts and migration entrypoint
- Node syntax checks: passed for release scripts
- Release manifest generated successfully

## Still requires a Docker-enabled CI/staging environment

- `npm install` with the full dependency tree
- Prisma client generation against real dependencies
- Typecheck and production builds with installed dependencies
- Docker image builds
- Production Compose startup
- Migration execution against disposable PostgreSQL
- Full E2E suite
- PostgreSQL backup/restore drill
- S3/MinIO backup/restore drill
- HTTPS reverse-proxy/TLS validation
- Load/performance smoke test

A release candidate is **not** considered production-ready until those environment-dependent checks pass.
