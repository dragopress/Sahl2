# Global Search acceptance tests

1. Authenticated member can search within the active organization.
2. Search results never include records from another organization.
3. Exact title matches rank above prefix and substring matches.
4. Search supports customers, products/services, quotes, invoices, projects, tasks, suppliers, supplier bills, expenses, documents and warehouses.
5. Restricted documents appear only for the creator or an explicit document permission.
6. Viewer and employee roles can search because `search:read` is read-only.
7. Search rejects queries shorter than two characters.
8. Pagination never returns more than 50 results per page.
9. Search returns navigation metadata rather than exposing sensitive financial fields beyond lightweight display values.
10. Header search navigates to the tenant-aware search workspace.
