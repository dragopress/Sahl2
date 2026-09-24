# Testing & CI/CD slice

## Delivered

- API unit-test harness using Node's test runner through `tsx`.
- Security regression tests for password hashing, token hashing, rate limiting, and CSRF/origin protection.
- Repository validation script that checks critical security bootstrap files, tenant models, and Prisma migrations.
- Root `typecheck`, `test`, `validate`, and `ci` scripts.
- GitHub Actions CI for PostgreSQL/Redis-backed validation, Prisma generation/migrations, typechecking, tests, builds, and API liveness smoke test.
- Test Docker Compose stack for PostgreSQL, Redis, and MinIO.

## CI gate

A merge should be blocked when any of these fail:

1. repository validation
2. Prisma generation
3. migration deployment
4. TypeScript typecheck
5. unit tests
6. web/API/worker build
7. API health smoke test

## Current status

The authenticated E2E layer is now executable and wired into CI. It uses disposable organizations and validates both direct and header-based cross-tenant isolation.

## E2E expansion

Added an executable authenticated end-to-end suite covering:

- registration/session lifecycle
- cross-tenant customer/product/project/document/search isolation
- catalog → inventory receipt → quote → invoice → stock issue
- payment → accounting posting → P&L/VAT
- supplier → supplier bill → posting → supplier payment
- expense → approval → payment
- project/task completion and profitability
- AI context and automation notifications
- logout/session invalidation

Run against a live API with `E2E_BASE_URL` (defaults to `http://127.0.0.1:3001/api/v1`) using `npm run e2e`.


---

## Repository-wide audit reconciliation — 2026-09-24

Latest SahlBiz CI/CD validation on `main` is green, including repository validation, Prisma generation/migration checks, API/web typechecks, unit tests, API/web builds, API startup/health, authenticated E2E and production Prisma migration deployment.

CI nevertheless does not close these release blockers:

- [ ] Normalize `S3_*` versus `STORAGE_*` configuration across storage, Compose, environment examples and backup scripts.
- [ ] Remove/hard-disable the in-memory/demo web API from production.
- [ ] Replace hardcoded/prototype dashboard, finance/VAT and other business screens with real API-backed flows.
- [ ] Remove Next.js TypeScript/ESLint build-error suppression.
- [ ] Normalize frontend API URL and organization-context handling.
- [ ] Reconcile regulatory/compliance claims with implemented and validated functionality.
- [ ] Reconcile deployment documentation with the actual two-migration tree.
- [ ] Complete Docker, staging, backup/restore, rollback and production smoke validation.

A green CI run is therefore a necessary quality gate, not a production approval by itself.
