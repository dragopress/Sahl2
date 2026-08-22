# Security baseline

- Tenant context must come from authenticated membership, never from a frontend-supplied organization ID.
- Enforce RBAC server-side.
- Scope every business query by organization.
- Store password hashes only.
- Validate and reject unknown request fields.
- Use PostgreSQL Decimal/NUMERIC for money.
- Audit financial and permission changes.
- Add cross-tenant isolation tests before production.
