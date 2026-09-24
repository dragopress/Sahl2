# SahlBiz — Sales vertical slice

Implemented on top of authentication, RBAC and tenant-scoped CRM.

### Delivered
- Tenant-safe quote CRUD creation/list/detail.
- Quote line-item snapshots with quantity, unit price, TVA rate, HT/TVA/TTC totals.
- Configurable quote discount at creation time.
- Moroccan-friendly numbering: `DEV-YYYY-####`.
- Quote send workflow.
- One-click quote → invoice conversion.
- Invoice creation/list/detail.
- Invoice numbering: `INV-YYYY-####` using tenant/year sequences.
- Invoice send/cancel workflow.
- Payment recording with outstanding-balance validation.
- Automatic `PARTIALLY_PAID` / `PAID` transitions.
- Overdue presentation when a sent invoice passes its due date.
- Audit events for quote/invoice/payment mutations.
- French UI pages for Devis, Factures and Paiements.

### Not yet claimed
PDF rendering, email delivery, reminders, credit notes, recurring invoices, configurable tax rules, payment-provider integrations, and production end-to-end execution still require their dedicated slices.

### Verification note
The repository dependency install could not complete within the build environment timeout, so this slice has not been represented as a successful `npm run build` result. TypeScript source parsing was inspected, while full framework/database compilation requires dependency installation.


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
