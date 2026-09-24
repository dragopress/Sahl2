# Implementation status — VAT, suppliers and bank reconciliation

Implemented in this slice:

- Supplier master data with Moroccan ICE / IF / RC fields.
- Supplier bills with server-side TTC calculation and payment terms.
- Supplier bill accounting: 613000 + 445660 -> 401000.
- Supplier payment accounting: 401000 -> bank/cash.
- Supplier balance and payment tracking.
- VAT report derived from posted journal lines.
- Bank statement line ingestion.
- Exact-amount bank reconciliation with match/unmatch.
- Tenant isolation on all new endpoints.
- Finance permission enforcement and audit logging.
- Migration for new tables, indexes, foreign keys and 401000 account.

Not yet production-verified in this environment:

- Prisma client generation.
- Full NestJS/Next.js compilation.
- Database migration execution against PostgreSQL.
- CSV/OFX bank import adapters.
- Country-specific Moroccan VAT filing/export formats.


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
