# Notifications & Automation

Implemented: in-app notifications, automation rules, Redis/BullMQ scheduled automation scans, overdue invoice alerts, low-stock alerts, task deadline alerts, expense approval alerts, notification read state, RBAC, tenant isolation, and French notifications UI.

The worker runs an automation scan every 15 minutes. Each automation rule is tenant-scoped and idempotent within a 24-hour unread window.

Production follow-up: connect an email provider for external delivery and add dedicated integration/e2e tests once dependencies and PostgreSQL/Redis are available.


---

## Repository-wide audit reconciliation — 2026-09-24

Status is **implemented but not production-complete** where the feature depends on unfinished frontend integration or environment-dependent validation.

- The latest SahlBiz CI/CD validation on `main` is green, including authenticated E2E and Prisma migration deployment.
- Production storage configuration still requires normalization between `S3_*` variables consumed by the storage package and `STORAGE_*` variables used by production Compose/backup configuration.
- The web application still contains an in-memory/demo API layer. This feature/status document must not be interpreted as evidence that every UI screen is connected to the real API.
- Frontend pages must not present hardcoded/demo business or financial values as production data.
- Environment-dependent production verification remains required before release.
