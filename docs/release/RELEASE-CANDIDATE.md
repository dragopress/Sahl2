# SahlBiz Release Candidate

Current candidate: **0.2.0-rc.1**

## Release gate

A candidate is releasable only when all of these have been executed in a Docker-enabled environment:

- `npm install --no-audit --no-fund`
- `npm run validate`
- `npm run release:check`
- `npm run db:generate`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `docker compose -f docker-compose.test.yml up -d`
- `npm run db:migrate -- --deploy`
- `npm run e2e`
- `docker compose -f docker-compose.production.yml config`
- Production image build for API/web/worker
- Migration smoke test against a disposable PostgreSQL instance
- PostgreSQL backup and restore drill
- Object-storage backup/restore drill for MinIO/S3 data
- HTTPS reverse-proxy validation

## Database and storage backup rule

PostgreSQL backups do **not** contain S3/MinIO objects. Production operations must back up both:

1. PostgreSQL
2. S3-compatible object storage

A release cannot be called production-ready until both restore paths have been tested.

## Rollback

Application rollback and database rollback are different operations. Never assume an older application image can safely run against a newer schema. Prefer forward-compatible migrations and roll forward where possible.

## Secrets

Never commit real production secrets. Inject them through the deployment platform/secret manager.
