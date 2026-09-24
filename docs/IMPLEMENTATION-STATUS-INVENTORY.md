# SahlBiz Inventory — implementation status

## Delivered

- Tenant-scoped warehouses with a default warehouse.
- Warehouse-level product balances.
- Immutable stock movement ledger.
- Opening stock migration for existing product aggregate balances.
- Receipts, issues, adjustments and atomic transfers.
- Low-stock endpoint.
- Inventory RBAC permissions.
- Invoice-to-stock integration: sending an invoice posts product quantities once.
- Invoice cancellation creates compensating stock entries.
- Product stock can no longer be edited through product update; changes go through inventory movements.
- Inventory UI with stock balances, movement history, adjustments and transfers.
- Acceptance tests covering tenant isolation, negative-stock prevention, transfer atomicity and sales integration.

## Accounting / inventory rules

1. `Product.stock` is an aggregate cache of warehouse balances, not an editing surface.
2. `WarehouseStock` is the operational balance by warehouse and product.
3. `StockMovement` is append-only from the application layer; corrections are compensating movements.
4. Invoice stock is posted when an invoice is sent, not when it is drafted.
5. Service lines never affect stock.
6. Cancelling a stock-posted invoice restores product quantities with a compensating movement.
7. Every movement is tenant-scoped and checked against the authenticated organization.


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
