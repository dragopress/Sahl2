# Notifications & Automation

Implemented: in-app notifications, automation rules, Redis/BullMQ scheduled automation scans, overdue invoice alerts, low-stock alerts, task deadline alerts, expense approval alerts, notification read state, RBAC, tenant isolation, and French notifications UI.

The worker runs an automation scan every 15 minutes. Each automation rule is tenant-scoped and idempotent within a 24-hour unread window.

Production follow-up: connect an email provider for external delivery and add dedicated integration/e2e tests once dependencies and PostgreSQL/Redis are available.
