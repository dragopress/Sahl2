# RBAC and tenant isolation

## Roles

- OWNER / ADMIN: full CRM customer access plus organization management and audit read access.
- MANAGER: customer read/write and audit read.
- SALES: customer read/write.
- ACCOUNTANT / EMPLOYEE / VIEWER: customer read-only.

## Tenant boundary

Every customer query requires a valid `x-organization-id` header. The tenant context is resolved from the authenticated session's memberships before the controller executes. Every Prisma customer query includes `organizationId` in its predicate, including lookup, update, delete, list, and count operations.

The client cannot select an arbitrary organization ID to bypass access because the ID is matched against the session membership list.

## Audit

Customer create/update/delete mutations write an `AuditLog` containing the actor, organization, entity, action, previous state where applicable, next state where applicable, IP, and user agent.
