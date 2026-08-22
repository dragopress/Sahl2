# Projects & Profitability Acceptance Tests

1. A user cannot read a project belonging to another organization.
2. A user cannot attach an invoice to a project in another organization.
3. A user cannot attach an expense/task to a project in another organization.
4. Revenue excludes CANCELLED invoices.
5. Actual cost includes only PAID expenses.
6. Committed cost includes APPROVED and PAID expenses.
7. Margin equals non-cancelled project revenue minus actual project cost.
8. Task progress equals DONE tasks divided by total project tasks.
9. A user without `projects:write` cannot create/update projects.
10. A user without `tasks:write` cannot create/update tasks.
11. Project and task mutations create audit records.
12. Invoice project linkage remains tenant-scoped after the invoice is created.
