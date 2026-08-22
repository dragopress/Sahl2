# SahlBiz Finance — implementation status

## Delivered
- Tenant-scoped chart of accounts with Moroccan-friendly default codes.
- Double-entry journal entries and immutable journal lines.
- Idempotent posting for sales invoices, customer payments and expenses.
- Bank/cash/mobile-wallet accounts and cash transactions.
- Server-side trial balance, profit & loss and cash-position calculations.
- Finance RBAC: `finance.read` and `finance.write`.
- Audit events for finance mutations.

## Default chart
- 101000 Capital
- 411000 Clients
- 445710 TVA collectée
- 512000 Banque
- 530000 Caisse
- 701000 Ventes de marchandises
- 706000 Prestations de services
- 613000 Achats et charges externes
- 445660 TVA déductible

## Invariants
1. Every manual journal must balance: total debit = total credit.
2. Journal entries are tenant scoped.
3. Source-backed postings are idempotent through `(organizationId, sourceType, sourceId)`.
4. Financial totals are calculated server-side.
5. Cash balances are derived from opening balance + immutable cash transactions.
6. Posting a sales invoice debits receivables and credits revenue/VAT.
7. Posting a customer payment debits the selected cash/bank account and credits receivables.
8. Posting an expense debits the configured/default expense account and credits cash/bank.

## Next finance hardening
- VAT return by period and tax code.
- Supplier-bill journal posting when the purchasing schema is fully connected.
- Bank reconciliation workflow.
- Credit notes/refunds.
- Closing periods and locked accounting periods.
