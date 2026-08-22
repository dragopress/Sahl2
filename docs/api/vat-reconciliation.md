# VAT, supplier accounting and bank reconciliation API

All routes require an authenticated session, tenant context, and finance permission.

## Suppliers
- `GET /api/v1/suppliers`
- `POST /api/v1/suppliers`
- `GET /api/v1/suppliers/bills`
- `POST /api/v1/suppliers/bills`
- `POST /api/v1/suppliers/bills/:id/post`
- `GET /api/v1/suppliers/balances`
- `GET /api/v1/suppliers/payments`
- `POST /api/v1/suppliers/payments`

Supplier bill TTC is calculated server-side as `subtotal + tax`; browser totals are ignored.

## VAT
- `GET /api/v1/finance/vat-report?from=YYYY-MM-DD&to=YYYY-MM-DD`

Uses account `445710` for collected VAT and `445660` for deductible VAT.

## Bank reconciliation
- `GET /api/v1/finance/reconciliation/lines?cashAccountId=...&status=UNMATCHED`
- `POST /api/v1/finance/reconciliation/lines`
- `GET /api/v1/finance/reconciliation/lines/:id/suggestions`
- `POST /api/v1/finance/reconciliation/lines/:id/match`
- `POST /api/v1/finance/reconciliation/lines/:id/unmatch`
- `GET /api/v1/finance/reconciliation/summary?cashAccountId=...`
