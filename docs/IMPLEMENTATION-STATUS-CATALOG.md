# SahlBiz — Catalog implementation slice

Implemented in this slice:

- Multi-tenant products/services catalog.
- Product/service categories.
- SKU and barcode fields.
- Purchase and selling prices in MAD.
- Configurable VAT rate and unit.
- Stock and minimum-stock fields for products.
- Supplier text field.
- Active/inactive lifecycle with archive action.
- Search by name/SKU/barcode.
- Low-stock API endpoint.
- Audit logging for catalog mutations.
- RBAC permissions: `products:read`, `products:write`.
- Quote and invoice lines can reference a catalog item while retaining a price/description snapshot.
- French catalog UI under `/products`.

Intentional boundary: stock quantities are visible and low-stock detection is available, but stock changes are not yet implemented as direct mutations. The next inventory slice should introduce warehouses and immutable stock movements so stock cannot change without an auditable reason.


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
