# SahlBiz — Repository Audit & Release Next Steps

**Audit date:** 2026-09-24
**Branch:** `main`
**Release:** `0.2.0-rc.1`

## Executive status

The repository has a solid backend/security/testing foundation and the latest SahlBiz CI/CD validation on `main` is green, including authenticated E2E and Prisma migration deployment. **Production release remains NO-GO** because several production-integrity issues remain outside the passing CI path.

## Critical blockers

1. **Storage configuration mismatch.** The storage package consumes `S3_*` variables while production Compose and backup scripts use `STORAGE_*`. Normalize package, Compose, environment examples and operational scripts to one vocabulary.
2. **Demo API in production path.** `apps/web/app/api/data-store.ts` and the related Next.js catch-all route provide an in-memory/demo API with hardcoded business data. Production must not silently use this path.
3. **Hardcoded financial/product UI.** Dashboard, Finance/VAT and other prototype screens contain demo values/actions. Replace them with authenticated API-backed data and real mutations.
4. **Build-error suppression.** Next.js currently permits TypeScript/ESLint build errors. Remove these release bypasses and make type correctness part of the actual build gate.
5. **Frontend API/tenant context inconsistency.** Normalize API URL construction and organization context behind one shared client/context implementation.
6. **Compliance claims.** DGI/SIMPL-TVA/PCGM and similar claims must only describe implemented and validated functionality. Planned exports/integrations must be labeled accordingly.
7. **Stale documentation.** Migration names/counts and old verification notes must match the current repository. Current migration count is 2: `00000000000000_init` and `20260921190000_atomic_number_sequences`.
8. **Release manifest.** Regenerate `release/manifest.json` for the final release commit.

## High-priority hardening

- Make root typecheck/build scripts represent the full monorepo gate.
- Audit dependency ownership and remove unused direct dependencies.
- Keep Prisma 6.19.3 isolated to application/database workspaces and Prisma 8 Composer tooling isolated to deployment.
- Add storage failure/DB failure consistency tests.
- Replace process-local rate limiting before horizontal API scaling.
- Complete backup/restore and rollback drills.

## Product work still not production-complete

- PDF rendering
- Email delivery and reminders
- Credit notes/refunds
- Recurring invoices
- Configurable tax rules
- Payment-provider integrations
- CSV/OFX bank adapters
- Country-specific Moroccan VAT filing/export formats
- Full production infrastructure validation

## Verified foundation

- Tenant-scoped server-side authorization and RBAC.
- Secure session/password implementation.
- Prisma/PostgreSQL data model and migrations.
- Immutable inventory movement model.
- Double-entry accounting invariants.
- Tenant-scoped analytics/search/documents.
- Redis/BullMQ automation architecture.
- Authenticated E2E coverage.
- Green latest CI/CD including production Prisma migration deployment.

## Next execution order

### P0
- Normalize storage variables.
- Disable/remove demo API from production.
- Replace hardcoded dashboard/finance/VAT/prototype business data.
- Remove build-error suppression.

### P1
- Normalize frontend API/organization context.
- Reconcile compliance copy.
- Reconcile all deployment/status docs.
- Regenerate release manifest.
- Align root quality scripts.

### P2
- Finish PDF/email/VAT/export/payment-provider features.
- Complete staging and recovery drills.
- Run load/security/operational validation.

## Release rule

A green CI run is necessary but not sufficient. Do not promote `0.2.0-rc.1` to production until every P0/P1 blocker is resolved and every environment-dependent release gate has evidence.
