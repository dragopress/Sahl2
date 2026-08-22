# SahlBiz — Projects & Profitability Slice

## Delivered
- Tenant-scoped projects and tasks API.
- Project/customer relationship.
- Project budget and status.
- Project-linked customer invoices.
- Project-linked expenses from the existing expense workflow.
- Task statuses: TODO, IN_PROGRESS, BLOCKED, DONE.
- Project progress derived from completed tasks.
- Revenue, actual cost, committed cost, margin, margin rate, and budget variance computed server-side.
- Project profitability endpoint.
- RBAC permissions for projects and tasks.
- Audit logs for project/task mutations.
- French project and task web screens.

## Accounting rule
Revenue is derived from non-cancelled project invoices. Actual project cost is derived from PAID project expenses; committed cost includes APPROVED and PAID expenses. No browser-calculated financial metric is trusted by the API.

## Tenant isolation
Every project/task/invoice reference is validated against the current organization. Cross-tenant project IDs, customers, assignees, and invoices must be rejected.
