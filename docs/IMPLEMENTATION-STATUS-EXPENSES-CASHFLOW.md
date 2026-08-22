# Implementation status — Expenses & Cash Flow

Implemented in this slice:

- Tenant-scoped expense creation/listing.
- Categories, amount, VAT rate/amount, supplier, employee, project, attachment URL, payment method and date.
- Status workflow: SUBMITTED → APPROVED → PAID, or REJECTED.
- Only approved expenses can be paid.
- Paying an expense creates a balanced double-entry journal and cash transaction atomically.
- VAT is split between expense net amount and deductible VAT account 445660.
- Expense posting is idempotent.
- Cash-flow forecast combines current cash, unpaid customer receivables, unpaid supplier bills and approved future expenses.
- Forecast supports 30/60/90-day views and daily projected balances.
- All mutations are tenant-scoped and audited.
