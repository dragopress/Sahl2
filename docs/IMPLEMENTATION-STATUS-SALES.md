# SahlBiz — Sales vertical slice

Implemented on top of authentication, RBAC and tenant-scoped CRM.

### Delivered
- Tenant-safe quote CRUD creation/list/detail.
- Quote line-item snapshots with quantity, unit price, TVA rate, HT/TVA/TTC totals.
- Configurable quote discount at creation time.
- Moroccan-friendly numbering: `DEV-YYYY-####`.
- Quote send workflow.
- One-click quote → invoice conversion.
- Invoice creation/list/detail.
- Invoice numbering: `INV-YYYY-####` using tenant/year sequences.
- Invoice send/cancel workflow.
- Payment recording with outstanding-balance validation.
- Automatic `PARTIALLY_PAID` / `PAID` transitions.
- Overdue presentation when a sent invoice passes its due date.
- Audit events for quote/invoice/payment mutations.
- French UI pages for Devis, Factures and Paiements.

### Not yet claimed
PDF rendering, email delivery, reminders, credit notes, recurring invoices, configurable tax rules, payment-provider integrations, and production end-to-end execution still require their dedicated slices.

### Verification note
The repository dependency install could not complete within the build environment timeout, so this slice has not been represented as a successful `npm run build` result. TypeScript source parsing was inspected, while full framework/database compilation requires dependency installation.
