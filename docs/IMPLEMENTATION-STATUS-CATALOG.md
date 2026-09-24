# SahlBiz — Catalog implementation status

## Delivered

- Multi-tenant products/services catalog.
- Product/service categories.
- SKU and barcode fields.
- Purchase/selling prices in MAD.
- Configurable VAT rate and unit.
- Product stock/minimum-stock fields.
- Active/inactive lifecycle and archive action.
- Search by name/SKU/barcode.
- Low-stock API endpoint.
- Audit logging for catalog mutations.
- RBAC permissions: `products:read`, `products:write`.
- Quote/invoice line snapshots.
- French catalog UI under `/products`.

## Inventory boundary is now implemented

The earlier catalog-slice note that stock mutations were a future slice is obsolete. The current repository contains warehouses, warehouse balances and immutable stock movements. Product stock is an aggregate/cache and is not a direct editing surface.

Stock changes now flow through the inventory movement system and are covered by acceptance tests including tenant isolation, negative-stock prevention, transfer atomicity and sales integration.

## Release caveat

The backend catalog/inventory implementation must not be confused with the frontend demo API. Production screens must use the authenticated NestJS API and PostgreSQL data only.

Storage configuration, build-error suppression, frontend integration, compliance claims and environment-dependent release validation remain repository-level release gates.
