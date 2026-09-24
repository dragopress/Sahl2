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


---

## Repository-wide audit reconciliation — 2026-09-24

Status is **implemented but not production-complete** where the feature depends on unfinished frontend integration or environment-dependent validation.

- The latest SahlBiz CI/CD validation on `main` is green, including authenticated E2E and Prisma migration deployment.
- Production storage configuration still requires normalization between `S3_*` variables consumed by the storage package and `STORAGE_*` variables used by production Compose/backup configuration.
- The web application still contains an in-memory/demo API layer. This feature/status document must not be interpreted as evidence that every UI screen is connected to the real API.
- Frontend pages must not present hardcoded/demo business or financial values as production data.
- Environment-dependent production verification remains required before release.
