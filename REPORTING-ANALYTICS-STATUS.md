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
