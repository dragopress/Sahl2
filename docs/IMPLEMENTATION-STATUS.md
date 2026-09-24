# SahlBiz implementation status

## Slice 2 — Authentication + tenant context

Implemented from `Prompt.md` and `Project-detail.md`:

- Email/password registration and login.
- Password hashing with Node `scrypt` and per-password random salts.
- Opaque 256-bit session tokens; only SHA-256 token hashes are stored in PostgreSQL.
- HttpOnly, SameSite=Lax session cookie.
- Logout and current-user (`GET /api/v1/auth/me`) endpoints.
- First organization is created atomically with registration and the user receives `OWNER` membership.
- Organization memberships are returned without password/session secrets.
- Session expiration and last-seen tracking.
- Reusable Nest `AuthGuard` that derives identity from the server-side session.
- Reusable tenant decorator that verifies the authenticated user is actually a member of the requested organization.
- Prisma models for sessions, email verification tokens, and password reset tokens are now present for the next auth slices.
- French login and registration UI in the web app.

## API

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

## Security boundary

The client must not be trusted for authorization or tenant selection. Protected business endpoints should use `AuthGuard` and `Tenant` and then scope every Prisma query with the resolved `organizationId`.

Example header for the current API contract:

`X-Organization-Id: <organization-id>`

The header is only a selector; access is granted only when the authenticated session contains a matching membership.

## Verification

A full compile was not run in this environment because the repository currently has no installed `node_modules` and dependency installation previously timed out. Before merging, run:

```bash
npm install
npm run db:generate
npm run build
npm run db:migrate
```

Then add integration tests for cross-tenant denial before exposing customer/finance write endpoints.


---

## Repository-wide audit reconciliation — 2026-09-24

### Release status
This slice is **not, by itself, evidence of full production readiness**. The current repository audit found unfinished frontend integration and infrastructure/documentation inconsistencies outside the individual backend slice.

### Mandatory release blockers relevant to this slice
- Real production UI/API integration must replace any demo or hardcoded business data for this domain.
- Tenant authorization must remain server-side; client organization identifiers are selectors only and never authorization.
- Production storage configuration must use one canonical variable vocabulary; current package/Compose/backup configuration is inconsistent.
- Release documentation and migration references must match the actual repository state.
- Production claims must be limited to functionality that is implemented and validated.

### Verification evidence
Latest SahlBiz CI/CD validation on `main` is green, including authenticated E2E and Prisma migration deployment. Environment-dependent staging, Docker, backup/restore and production checks remain separate release gates.
