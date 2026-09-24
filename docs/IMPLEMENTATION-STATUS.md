# SahlBiz implementation status

## Current release status — 2026-09-24

The repository has a strong server-side foundation and the latest CI/CD validation is green, but **0.2.0-rc.1 is not production-approved**. Backend implementation status must be distinguished from frontend/demo surfaces and environment-dependent release validation.

## Slice 2 — Authentication + tenant context

Implemented:
- Email/password registration and login.
- Password hashing with Node `scrypt` and per-password random salts.
- Opaque 256-bit session tokens; only SHA-256 token hashes are stored in PostgreSQL.
- HttpOnly, SameSite=Lax session cookie.
- Logout and current-user endpoints.
- Atomic first-organization creation and OWNER membership.
- Session expiration and last-seen tracking.
- Reusable server-side AuthGuard and tenant membership validation.
- French login and registration UI.

## API

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

## Security boundary

The client must not be trusted for authorization or tenant selection. Protected business endpoints must use authentication plus validated tenant context and scope every Prisma query with the resolved `organizationId`.

`X-Organization-Id` is a selector only; access is granted only when the authenticated session has the matching membership.

## Current verification

Latest SahlBiz CI/CD on `main` passes repository validation, Prisma generation/migration checks, typechecks, tests, builds, API health, authenticated E2E and Prisma production migration deployment.

## Remaining release blockers

- Production storage configuration uses inconsistent `S3_*` versus `STORAGE_*` variable names.
- Frontend still contains an in-memory/demo API and hardcoded/prototype business screens; these must not be used as production data paths.
- Next.js build configuration suppresses TypeScript/ESLint build failures and must be hardened.
- Frontend API/organization context must be normalized.
- Production documentation and compliance claims must match actual implementation.
- Docker/staging/backup-restore/rollback validation remains required.
