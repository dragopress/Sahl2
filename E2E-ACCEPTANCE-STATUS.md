# SahlBiz End-to-End Acceptance Status

## Scope

The executable E2E suite covers the critical authenticated business paths and tenant isolation against a disposable PostgreSQL-backed API.

## Covered flows

1. Register two organizations and establish independent sessions.
2. Validate authenticated session state.
3. Create a customer in organization A and prove organization B cannot list or fetch it.
4. Create a catalog product and prove cross-tenant access is rejected.
5. Receive inventory into a warehouse.
6. Create a project and task, then complete the task.
7. Create → send → convert a quote into an invoice.
8. Send the invoice and verify inventory is decremented.
9. Seed accounting → create cash account → record customer payment.
10. Post the sales invoice and payment to the general ledger.
11. Verify P&L and VAT reporting.
12. Create → post → pay a supplier bill.
13. Create → approve → pay an expense.
14. Verify project profitability/reporting endpoints.
15. Verify global search is tenant-scoped.
16. Verify documents listing is tenant-scoped.
17. Verify AI context and automation notification endpoints are tenant-scoped/authenticated.
18. Prove a cross-tenant project lookup is rejected.
19. Logout and prove the session is invalidated.

## Running

Start a built API against the test database, then run:

`E2E_BASE_URL=http://127.0.0.1:3001/api/v1 npm run e2e`

The GitHub Actions pipeline starts the API on port 3001 and runs the suite automatically after the health check.

## Isolation invariant

Every E2E entity lookup/mutation is expected to be constrained by the authenticated organization membership. A successful cross-tenant read is a release-blocking failure.
