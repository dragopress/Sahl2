# Command Center / Quick Actions

## Implemented

- Ctrl/Cmd+K command palette
- Instant local command filtering
- Arrow-key navigation
- Enter to execute
- Escape to close
- N quick-create shortcut
- Quick-create modal for customer, invoice, quote, payment, expense, task and project entry points
- Navigation commands for dashboard, CRM, sales, projects and reports
- Header integration
- Dedicated `/command` productivity page
- Existing authentication and tenant boundaries are preserved because actions route into the existing tenant-aware modules.

## Product behavior

The palette is intentionally client-side and instant. It is a command/navigation layer, not a replacement for the global entity search API. Entity search remains available from the header search box and `/search`.

## Follow-up

Creation query parameters (`?create=1`) are reserved as the common contract for module-level create forms. Existing modules can progressively consume the contract without changing the command palette API.


---

## Repository-wide audit reconciliation — 2026-09-24

Status is **implemented but not production-complete** where the feature depends on unfinished frontend integration or environment-dependent validation.

- The latest SahlBiz CI/CD validation on `main` is green, including authenticated E2E and Prisma migration deployment.
- Production storage configuration still requires normalization between `S3_*` variables consumed by the storage package and `STORAGE_*` variables used by production Compose/backup configuration.
- The web application still contains an in-memory/demo API layer. This feature/status document must not be interpreted as evidence that every UI screen is connected to the real API.
- Frontend pages must not present hardcoded/demo business or financial values as production data.
- Environment-dependent production verification remains required before release.
