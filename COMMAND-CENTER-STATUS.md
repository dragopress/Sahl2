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
