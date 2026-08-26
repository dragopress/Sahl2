# SahlBiz OS Consolidation

## Purpose

Sahl2 is the technical foundation for the SahlBiz OS consolidation. SahlBiz contributes Moroccan business capabilities; SahlBizOS contributes product/UX concepts; Sahl is retained only as a historical reference.

## Non-negotiable architecture

- PostgreSQL is the authoritative business data store.
- Sahl2's NestJS API, Prisma, tenant isolation, RBAC, audit trail, Redis/BullMQ and S3 architecture remain authoritative.
- Firebase/Firestore is not introduced as a second source of truth.
- Business mutations occur in domain services and database transactions, never in frontend state or AI code.
- Financial calculations are server-side and auditable.
- AI proposes actions through permission-checked domain tools; it never writes directly to the database.
- Domain events propagate consequences between bounded contexts.

## Repository roles

| Repository | Role | Treatment |
| --- | --- | --- |
| Sahl2 | Technical foundation | Preserve and extend |
| SahlBiz | Moroccan business differentiation | Port domain behavior, not infrastructure |
| SahlBizOS | Product/UX reference | Rebuild UX on Sahl2 APIs |
| Sahl | Historical reference | Selective recovery only |

## First vertical: Customer 360

The existing Sahl2 Customer domain is intentionally extended rather than duplicated.

Target customer capabilities:

- Identity: name, type, ICE, IF, RC, TP, CNSS
- Contact: email, phone, address, contacts
- Commercial: leads, opportunities, quotes, orders, deliveries, invoices
- Financial: payments, receivables, credit, aging
- Activity: timeline, tasks, notes, documents, calendar
- Intelligence: customer score, revenue, last activity, risk, AI insights

## API direction

Existing customer CRUD remains backward compatible. The domain evolves toward:

- `GET /customers`
- `GET /customers/:id`
- `GET /customers/:id/360`
- `GET /customers/:id/timeline`
- `GET /customers/:id/financials`
- `GET /customers/:id/sales`
- `GET /customers/:id/documents`
- `GET /customers/:id/tasks`
- `GET /customers/:id/insights`

The 360 endpoint should aggregate only through existing domain services/repositories and must preserve organization scoping.

## Customer financial model

Kreddy must be ledger-based rather than a mutable customer balance:

`Opening balance + credit sales - payments - returns +/- adjustments = current balance`

The customer 360 projection may expose a balance, but the ledger remains authoritative.

## Integration sequence

1. Customer 360 / CRM foundation
2. POS + cash sessions + Kreddy
3. Moroccan accounting/fiscal extensions
4. HR + payroll
5. OCR + AI action layer
6. Workflow automation
7. Offline POS synchronization
8. Production/security hardening

## Definition of done for each domain

- Tenant isolation tested
- RBAC tested
- DTO validation tested
- Domain mutation is transactional
- Audit events cover material mutations
- Idempotency is present where retries are possible
- API contract is documented
- UI consumes API rather than duplicating business rules
- Relevant unit/integration/E2E tests pass

## Current baseline observation

The existing Customer service already scopes reads/writes by `organizationId`, uses Prisma transactions for list/count, and records CREATE/UPDATE/DELETE audit events. The current customer shape is intentionally small, so the next implementation should extend the model carefully rather than bypassing the existing service boundary.
