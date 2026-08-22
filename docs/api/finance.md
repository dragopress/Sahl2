# Finance API

All endpoints require authentication and an active organization context via `x-organization-id`.

- `GET /api/v1/finance/accounts`
- `POST /api/v1/finance/accounts/seed`
- `POST /api/v1/finance/accounts`
- `GET /api/v1/finance/cash-accounts`
- `POST /api/v1/finance/cash-accounts`
- `GET /api/v1/finance/cash-transactions`
- `POST /api/v1/finance/cash-transactions`
- `POST /api/v1/finance/journals/manual`
- `POST /api/v1/finance/post/invoice/:id`
- `POST /api/v1/finance/post/payment/:id?cashAccountId=...`
- `POST /api/v1/finance/post/expense/:id?cashAccountId=...`
- `GET /api/v1/finance/ledger`
- `GET /api/v1/finance/trial-balance`
- `GET /api/v1/finance/pnl`
- `GET /api/v1/finance/cash-position`
