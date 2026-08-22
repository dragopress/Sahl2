# Global Search — implementation status

Implemented as the next SahlBiz vertical slice.

- Tenant-scoped unified search API.
- Searches customers, products/services, quotes, invoices, projects, tasks, suppliers, supplier bills, expenses, documents and warehouses.
- Restricted documents respect document permissions.
- Relevance ranking: exact > prefix > substring, then recency.
- Pagination with a maximum page size of 50.
- Global header search submits to `/search?q=...`.
- French search workspace at `/search` with grouped results and entity navigation.
- `search:read` added to all existing read-capable roles.
