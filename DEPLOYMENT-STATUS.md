# SahlBiz Release Candidate & Deployment Status

## Current candidate

- Version: **0.2.0-rc.1**
- Branch: **main**
- Current documentation date: **2026-09-24**
- Release manifest: `release/manifest.json`

## CI evidence

The latest `SahlBiz CI/CD` runs on `main` pass repository validation, Prisma generation and migration checks, API/web typechecks, unit tests, API/web builds, API startup/health, authenticated E2E, and production Prisma migration deployment.

This is CI evidence only; it does not replace staging, Docker, backup/restore, security and production smoke validation.

## Implemented infrastructure

- Production Dockerfiles for API, web and worker.
- Next.js standalone runtime image.
- Non-root production containers.
- One-shot Prisma migration container.
- PostgreSQL/Redis/MinIO health checks.
- API/web readiness checks.
- PostgreSQL backup/restore scripts.
- S3-compatible object-storage backup/restore scripts.
- Repository/release validation scripts.
- Release manifest generation.
- Deployment/rollback/secrets/observability runbook.

## Release blockers from 2026-09-24 audit

- [ ] Normalize storage configuration: the storage package consumes `S3_*` while production Compose/backup scripts use `STORAGE_*`.
- [ ] Remove or hard-disable the in-memory/demo Next.js API from production.
- [ ] Replace hardcoded dashboard, Finance/VAT and other prototype business data with real authenticated API flows.
- [ ] Remove Next.js build-error suppression.
- [ ] Normalize frontend API URL and organization-context handling.
- [ ] Reconcile DGI/SIMPL-TVA/other compliance claims with implemented and validated functionality.
- [ ] Reconcile all migration references/counts with the actual migration tree.
- [ ] Regenerate `release/manifest.json` for the final release commit.

## Current Prisma migration tree

The repository currently contains **2** migration directories:

1. `00000000000000_init`
2. `20260921190000_atomic_number_sequences`

Any older documentation claiming a different migration count/name is stale and must not be used as deployment evidence.

## Environment-dependent validation still required

- Clean dependency installation.
- Production Docker image builds.
- Production Compose startup.
- Migration execution against disposable PostgreSQL.
- Full staging E2E.
- PostgreSQL backup/restore drill.
- Object-storage backup/restore drill.
- HTTPS reverse-proxy/TLS validation.
- Load/performance smoke test.
- Final production smoke test and rollback rehearsal.

**Release status: NO-GO until the audit blockers and remaining environment-dependent gates are evidenced as complete.**
