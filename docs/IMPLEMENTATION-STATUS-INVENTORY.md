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
