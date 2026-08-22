# Sales API

All routes require the authenticated session and `x-organization-id`; tenant membership is checked server-side.

- `GET /api/v1/quotes`
- `GET /api/v1/quotes/:id`
- `POST /api/v1/quotes`
- `POST /api/v1/quotes/:id/send`
- `POST /api/v1/quotes/:id/convert`
- `GET /api/v1/invoices`
- `GET /api/v1/invoices/:id`
- `POST /api/v1/invoices`
- `POST /api/v1/invoices/:id/send`
- `POST /api/v1/invoices/:id/cancel`
- `GET /api/v1/payments`
- `POST /api/v1/payments`

Money values are MAD-compatible decimal amounts. Quote and invoice line items retain immutable commercial snapshots so later customer/product changes do not rewrite historical documents.
