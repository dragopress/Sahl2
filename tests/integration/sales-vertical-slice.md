# Sales vertical-slice acceptance tests

## Tenant isolation
- A quote/invoice/payment lookup with an organization header belonging to another tenant returns `403` before service access.
- A valid user cannot create a quote for a customer belonging to another tenant.
- A valid user cannot convert a quote belonging to another tenant.
- A valid user cannot record a payment against an invoice belonging to another tenant.

## Quote → invoice
- Create quote with line items and 20% TVA by default.
- Send draft quote; status becomes `SENT` and `issuedAt` is populated.
- Convert `SENT`/`ACCEPTED` quote once; creates exactly one invoice and marks quote `CONVERTED`.
- Invoice preserves customer and line-item snapshots.

## Payments
- Payment cannot exceed outstanding balance.
- First valid payment changes invoice to `PARTIALLY_PAID` when balance remains.
- Final payment changes invoice to `PAID`.
- Cancelled invoices reject payments.

## Authorization
- `SALES` can read/write/send quotes and read/create/send invoices but cannot cancel invoices or write payments.
- `ACCOUNTANT` can read/write/send/cancel invoices and write payments.
- `VIEWER` is read-only.
