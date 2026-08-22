# Global Search API

`GET /api/v1/search?q=<query>&page=1&pageSize=30`

Requires authentication, organization membership, and `search:read`.

Searches tenant-scoped customers, products/services, quotes, invoices, projects, tasks, suppliers, supplier bills, expenses, documents and warehouses. Restricted documents are returned only to their creator or explicitly permitted users.

Results are ranked by exact/prefix/substring title match and then recency. The endpoint returns lightweight navigation metadata rather than full records.
