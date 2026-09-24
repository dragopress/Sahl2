# Implementation status — Expenses & Cash Flow

Implemented in this slice:

- Tenant-scoped expense creation/listing.
- Categories, amount, VAT rate/amount, supplier, employee, project, attachment URL, payment method and date.
- Status workflow: SUBMITTED → APPROVED → PAID, or REJECTED.
- Only approved expenses can be paid.
- Paying an expense creates a balanced double-entry journal and cash transaction atomically.
- VAT is split between expense net amount and deductible VAT account 445660.
- Expense posting is idempotent.
- Cash-flow forecast combines current cash, unpaid customer receivables, unpaid supplier bills and approved future expenses.
- Forecast supports 30/60/90-day views and daily projected balances.
- All mutations are tenant-scoped and audited.


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
