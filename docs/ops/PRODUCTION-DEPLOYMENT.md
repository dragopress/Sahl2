# SahlBiz production deployment

## Components

- `web`: Next.js frontend
- `api`: NestJS API
- `worker`: BullMQ automation worker
- `postgres`: PostgreSQL 17
- `redis`: Redis 7 with AOF + password
- `minio`: S3-compatible object storage
- `migrate`: one-shot Prisma migration job

## First deployment

1. Copy `.env.production.example` to `.env.production`.
2. Replace every `CHANGE_ME...` value with long random secrets.
3. Set `CORS_ORIGINS` to the exact HTTPS frontend origin.
4. Set `DATABASE_URL`, `DIRECT_URL`, and `REDIS_URL` using the production credentials. `DIRECT_URL` must be a direct PostgreSQL connection suitable for Prisma migrations; do not point it at a transaction pooler.
5. Configure an external reverse proxy/TLS terminator in front of `web` and `api`.
6. Build and start:

```sh
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

The `migrate` service runs `prisma migrate deploy` once. API containers do not run migrations on startup, avoiding migration races during horizontal scaling.

## Baseline migration safety

`20260912000000_init` replaces the feature migration history and may be deployed directly only to a new, empty, or otherwise disposable database. Do not run `prisma migrate deploy` against a persistent database until its migration history and schema have been reconciled.

For each persistent target:

1. Take and verify a restorable backup, then perform the remaining steps against a restored staging copy.
2. Record the applied history from `"_prisma_migrations"`, including failed or rolled-back entries, and retain the exact migration directories from the application release that produced it.
3. Compare the restored database with `packages/database/prisma/schema.prisma` using `prisma migrate diff`. Review any schema or data differences; do not apply the baseline while differences remain unexplained.
4. If the schemas are equivalent, record `20260912000000_init` as applied with `prisma migrate resolve --applied 20260912000000_init`; do not execute its DDL against the populated database.
5. If the schemas differ, preserve the existing migration history and create reviewed forward-only reconciliation migrations. Validate them against the restored copy before scheduling a controlled production deployment.
6. Re-run the schema diff, require no unexpected differences, and retain the history snapshot and rollback/restore plan with the deployment record.

If the target's history cannot be established, treat it as persistent and do not apply the baseline.

## Health checks

- API live: `/api/v1/health/live`
- API ready: `/api/v1/health/ready`
- Web: `/`

A load balancer should route traffic only to healthy containers.

## Backups

PostgreSQL is the source of truth for business data. Run `scripts/backup-postgres.sh` from a host with `pg_dump` installed and store backups outside the application host. Keep encrypted off-site copies and test restores regularly.

Example:

```sh
DATABASE_URL='...' BACKUP_DIR=/secure/backups ./scripts/backup-postgres.sh
```

Restore only during a controlled maintenance window:

```sh
DATABASE_URL='...' ./scripts/restore-postgres.sh /secure/backups/sahlbiz-YYYYMMDDTHHMMSSZ.dump
```

MinIO/object storage must have its own versioned/off-site backup strategy; PostgreSQL backups do not contain uploaded files.

## Rollback

Application rollback:

1. Stop ingress to the affected deployment.
2. Deploy the previous immutable image tag.
3. Verify `/api/v1/health/ready`.
4. Run the critical E2E suite against the rollback deployment.

Database migrations are forward-only in normal operation. Do not automatically downgrade production migrations. Use a forward corrective migration or restore from a tested backup for destructive failures.

## Secrets

Do not commit `.env.production` or credentials. Use the deployment platform's secret manager. Rotate session, database, Redis, and object-storage credentials independently.

## Observability

Collect structured container logs and preserve `X-Request-Id` for support investigations. Alert on:

- readiness failures
- repeated 5xx responses
- queue backlog/retries
- PostgreSQL storage growth
- Redis memory pressure
- object-storage failures
- failed backups

## Scaling

The API and web services are stateless apart from the session cookie/database. They can be horizontally scaled behind a load balancer. Run multiple workers only when Redis/BullMQ capacity and idempotency behavior have been verified.
