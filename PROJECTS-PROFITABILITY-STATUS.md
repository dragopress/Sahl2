# SahlBiz — Projects & Profitability Slice

## Delivered
- Tenant-scoped projects and tasks API.
- Project/customer relationship.
- Project budget and status.
- Project-linked customer invoices.
- Project-linked expenses from the existing expense workflow.
- Task statuses: TODO, IN_PROGRESS, BLOCKED, DONE.
- Project progress derived from completed tasks.
- Revenue, actual cost, committed cost, margin, margin rate, and budget variance computed server-side.
- Project profitability endpoint.
- RBAC permissions for projects and tasks.
- Audit logs for project/task mutations.
- French project and task web screens.

## Accounting rule
Revenue is derived from non-cancelled project invoices. Actual project cost is derived from PAID project expenses; committed cost includes APPROVED and PAID expenses. No browser-calculated financial metric is trusted by the API.

## Tenant isolation
Every project/task/invoice reference is validated against the current organization. Cross-tenant project IDs, customers, assignees, and invoices must be rejected.


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
