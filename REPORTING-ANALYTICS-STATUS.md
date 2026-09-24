# Reporting & Analytics

Implemented tenant-scoped management reporting endpoints and a French reports workspace.

## API
- GET `/api/v1/analytics/executive`
- GET `/api/v1/analytics/sales`
- GET `/api/v1/analytics/finance`
- GET `/api/v1/analytics/operations`

All endpoints require authentication, an organization membership, and `analytics:read`.

## Coverage
- Executive KPIs
- Receivables/payables
- Stock valuation
- Quote conversion
- Top customers/products
- P&L summary
- Cash position
- VAT position
- Low stock
- Open tasks
- Project margins

Calculations are server-side from tenant-scoped operational/accounting records.


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
