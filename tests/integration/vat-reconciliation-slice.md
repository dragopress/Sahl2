# VAT + supplier accounting + bank reconciliation acceptance tests

## Supplier accounting
- [ ] Create Supplier A in organization A; organization B cannot read it.
- [ ] Create a supplier bill with HT 10,000 and VAT 2,000; API persists TTC 12,000 from server-side calculation.
- [ ] Post supplier bill: debit 613000 10,000 + 445660 2,000; credit 401000 12,000.
- [ ] Supplier bill posting is idempotent.
- [ ] Pay 5,000: debit 401000 / credit bank, status becomes PARTIALLY_PAID.
- [ ] Pay remaining 7,000: status becomes PAID.
- [ ] Overpayment is rejected.
- [ ] Payment is rejected until the supplier bill is posted.

## VAT
- [ ] Customer invoice VAT posts to 445710.
- [ ] Supplier bill VAT posts to 445660.
- [ ] VAT report returns collected, deductible, and net position for a date range.
- [ ] VAT report is organization-scoped.

## Bank reconciliation
- [ ] Import a statement line for an organization cash account.
- [ ] Suggested matches prioritize exact signed amount and nearby date.
- [ ] Match requires exact signed amount and same cash account.
- [ ] Match marks statement line MATCHED and stores the cash transaction id.
- [ ] Unmatch restores UNMATCHED state.
- [ ] Statement lines cannot access another organization's cash account.
