# Implementation status — VAT, suppliers and bank reconciliation

Implemented in this slice:

- Supplier master data with Moroccan ICE / IF / RC fields.
- Supplier bills with server-side TTC calculation and payment terms.
- Supplier bill accounting: 613000 + 445660 -> 401000.
- Supplier payment accounting: 401000 -> bank/cash.
- Supplier balance and payment tracking.
- VAT report derived from posted journal lines.
- Bank statement line ingestion.
- Exact-amount bank reconciliation with match/unmatch.
- Tenant isolation on all new endpoints.
- Finance permission enforcement and audit logging.
- Migration for new tables, indexes, foreign keys and 401000 account.

Not yet production-verified in this environment:

- Prisma client generation.
- Full NestJS/Next.js compilation.
- Database migration execution against PostgreSQL.
- CSV/OFX bank import adapters.
- Country-specific Moroccan VAT filing/export formats.
