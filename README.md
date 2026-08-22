# SahlBiz

**SahlBiz** is a multi-tenant business management SaaS platform for Moroccan SMEs and service businesses. It combines CRM, sales, purchasing, inventory, finance, projects, documents, automation, analytics, search, and decision intelligence in one application.

> **Release:** `0.2.0-rc.1` — Release Candidate  
> **Primary UI language:** French  
> **Currency:** MAD  
> **Architecture:** Next.js + NestJS + Prisma/PostgreSQL + Redis/BullMQ + S3-compatible storage

---

## Table of Contents

- [Overview](#overview)
- [Product Scope](#product-scope)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Core Modules](#core-modules)
- [Business Workflows](#business-workflows)
- [Security Model](#security-model)
- [Accounting Model](#accounting-model)
- [Inventory Model](#inventory-model)
- [Documents and Storage](#documents-and-storage)
- [Automation and Background Jobs](#automation-and-background-jobs)
- [Search](#search)
- [AI Assistant](#ai-assistant)
- [API](#api)
- [Web Application](#web-application)
- [Database and Migrations](#database-and-migrations)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Production Deployment](#production-deployment)
- [Backups and Disaster Recovery](#backups-and-disaster-recovery)
- [Observability and Health Checks](#observability-and-health-checks)
- [Release Process](#release-process)
- [Known Validation Limitations](#known-validation-limitations)
- [Security Checklist](#security-checklist)
- [Development Principles](#development-principles)
- [Roadmap](#roadmap)

---

## Overview

SahlBiz is built around one principle:

> **One trusted business data layer should power operations, finance, reporting, and decision-making.**

The platform is multi-tenant. Each organization has isolated customers, products, documents, transactions, projects, users, and financial records.

Server-side authorization is mandatory. A browser cannot gain access to another organization simply by changing an organization identifier.

The system is designed around auditable business state:

- stock changes are represented by stock movements;
- financial changes are represented by balanced journal entries;
- payments update receivables/payables;
- documents live in object storage with database metadata and versions;
- sensitive mutations produce audit events;
- background automation is idempotent;
- tenant context comes from authenticated sessions and memberships.

---

## Product Scope

### CRM
- Organizations, users, memberships
- Customers
- Customer search
- Tenant-scoped records

### Sales
- Quotes / Devis
- Quote lines
- Quote → invoice conversion
- Invoices / Factures
- Invoice lines
- Payments
- Receivables
- Moroccan document numbering

### Products & Services
- Products and services
- Categories
- SKU and barcode
- Purchase/selling prices
- VAT and units
- Stock thresholds
- Active/inactive catalog records

### Inventory
- Multiple warehouses
- Warehouse stock
- Immutable stock movements
- Receipts, issues, adjustments, transfers
- Low-stock reporting
- Sales/inventory integration

### Purchasing
- Suppliers
- Purchase orders
- Goods receipts
- Supplier invoices
- Supplier payments
- Payables
- Purchasing costs

### Finance & Accounting
- Chart of accounts
- Double-entry journal
- General ledger
- Trial balance
- Profit & Loss
- Cash position
- Receivables/payables
- Bank/cash accounts
- VAT collected/deductible
- VAT position

### Expenses
- Expense creation
- Approval/rejection
- Payment
- Supplier/employee/project links
- VAT
- Accounting integration
- Cash-flow forecasting

### Projects
- Projects and tasks
- Budgets
- Project revenue/cost
- Project margin
- Budget variance
- Task completion

### Documents
- Contracts, quotes, invoices, receipts
- Customer/project/company documents
- Versioning
- Tags
- Permissions
- Secure download/preview
- S3-compatible storage

### Reporting & Automation
- Executive dashboard
- Sales/finance/operations analytics
- Project profitability
- Notifications
- Automation rules
- Overdue invoice alerts
- Low-stock alerts
- Task deadline alerts
- Expense approval alerts

### Productivity & Intelligence
- Global search
- Command palette
- Quick actions
- Notifications center
- Rules-based AI assistant and business insights

---

## Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │       Next.js        │
                         └──────────┬───────────┘
                                    │ HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │      NestJS API      │
                         │      /api/v1         │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └──────────────┐
                    ▼                                   ▼
          ┌─────────────────┐                  ┌─────────────────┐
          │ PostgreSQL      │                  │ Redis / BullMQ  │
          │ Prisma          │                  │ Background jobs │
          └─────────────────┘                  └────────┬────────┘
                                                         ▼
                                                 ┌───────────────┐
                                                 │ Worker        │
                                                 └───────────────┘

                         ┌──────────────────────┐
                         │ S3 / MinIO           │
                         │ Object storage       │
                         └──────────────────────┘
```

| Layer | Technology |
|---|---|
| Web | Next.js / React / TypeScript |
| API | NestJS / TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Queue/cache | Redis + BullMQ |
| Storage | S3-compatible / MinIO |
| Auth | Server-side sessions + HttpOnly cookies |
| Authorization | RBAC + tenant membership |
| Containers | Docker / Docker Compose |
| CI | GitHub Actions |
| Currency | MAD |
| UI | French-first |

---

## Repository Structure

Typical monorepo layout:

```text
sahlbiz/
├── apps/
│   ├── api/
│   ├── web/
│   └── worker/
├── packages/
│   ├── database/
│   │   └── prisma/
│   └── storage/
├── scripts/
│   ├── backup-postgres.sh
│   ├── restore-postgres.sh
│   ├── backup-object-storage.sh
│   └── restore-object-storage.sh
├── .github/
│   └── workflows/
├── release/
├── docker-compose.yml
├── docker-compose.test.yml
├── docker-compose.production.yml
└── README.md
```

---

## Business Workflows

### Sales

```text
Customer → Quote → Accepted → Invoice → Payment → Receivable settled
```

### Purchasing

```text
Supplier → Purchase Order → Goods Receipt
         → Inventory increase → Supplier Invoice → Payment
```

### Expenses

```text
Expense → Submitted → Approved/Rejected → Paid → Accounting → Cash
```

### Projects

```text
Customer → Project
             ├── Tasks
             ├── Expenses
             └── Invoices → Revenue
                              ↓
                           Margin
```

### Inventory

```text
Product → Warehouse → Stock Movement
                    ├── Receipt
                    ├── Issue
                    ├── Adjustment
                    └── Transfer
```

Stock should never be directly edited as the source of truth. Every stock change must have a movement.

---

## Security Model

### Authentication

Endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Registration creates an organization and owner membership.

Sessions are server-side and exposed through an HttpOnly cookie.

### Roles

- `OWNER`
- `ADMIN`
- `MANAGER`
- `SALES`
- `ACCOUNTANT`
- `EMPLOYEE`
- `VIEWER`

Permissions are granular, for example:

```text
customers:read
customers:write
quotes:read
quotes:write
invoices:read
invoices:write
payments:write
inventory:read
inventory:write
purchasing:read
purchasing:write
finance:read
finance:write
documents:read
documents:write
search:read
ai:read
ai:write
```

### Tenant isolation

Every tenant-owned query must be scoped by the authenticated `organizationId`.

The API resolves tenant context from:

1. authenticated session;
2. organization membership;
3. requested organization context.

A client-provided organization ID is never sufficient by itself.

### API security

- DTO validation
- Unknown-field rejection
- CORS allowlist
- CSRF/origin protection
- Security headers
- HSTS in production
- Request IDs
- Sanitized errors
- Rate limiting

Default limits:

```text
Authentication: 10 requests/minute/IP
General API:    120 requests/minute/IP
```

### Audit logging

Sensitive mutations should record actor, organization, action, entity, entity ID, timestamp, and relevant context.

---

## Accounting Model

SahlBiz uses double-entry accounting.

Invariant:

```text
SUM(debits) = SUM(credits)
```

### Customer invoice

```text
Debit   Accounts Receivable
Credit  Revenue
Credit  VAT Collected
```

### Customer payment

```text
Debit   Bank/Cash
Credit  Accounts Receivable
```

### Supplier invoice

```text
Debit   Expense/Purchase
Debit   Deductible VAT
Credit  Accounts Payable
```

### Supplier payment

```text
Debit   Accounts Payable
Credit  Bank/Cash
```

Accounting totals are calculated server-side. Client-supplied totals must not be trusted.

---

## Inventory Model

Inventory is ledger-based.

Movement types include:

```text
OPENING
RECEIPT
ISSUE
ADJUSTMENT
TRANSFER
```

Rules:

- negative stock is prevented where policy requires it;
- transfers are atomic;
- cross-tenant access is rejected;
- invoice stock posting is idempotent;
- movements are retained for audit;
- warehouse totals remain reconcilable.

---

## Documents and Storage

Files are stored outside PostgreSQL in S3-compatible object storage. PostgreSQL stores metadata, permissions, versions, tags, checksums, and relationships.

Local development can use MinIO.

Production should use a private S3-compatible bucket with restricted credentials, lifecycle policies, encryption where available, and independent backups.

**A PostgreSQL backup alone is not a complete SahlBiz backup.**

---

## Automation and Background Jobs

Redis + BullMQ powers background work such as:

- overdue invoice notifications;
- low-stock alerts;
- task deadline alerts;
- expense approval reminders;
- scheduled automation.

Background jobs must be safe to retry and should suppress duplicate notifications.

---

## Search

```text
GET /api/v1/search?q=<query>&page=1&pageSize=30
```

Search covers major entities such as:

- customers
- products/services
- quotes
- invoices
- projects
- tasks
- suppliers
- supplier bills
- expenses
- documents
- warehouses

Results are tenant-scoped and intentionally lightweight.

---

## AI Assistant

The current AI layer is **rules-based decision intelligence**, not a simulated external LLM.

It can identify:

- critical/negative cash
- overdue receivables
- low stock
- overdue tasks
- project budget problems
- collection opportunities

Endpoints:

```text
GET  /api/v1/ai/insights
POST /api/v1/ai/insights/:id/dismiss
POST /api/v1/ai/ask
GET  /api/v1/ai/context
```

If an external LLM is introduced later, it should use a provider abstraction with explicit opt-in, redaction, tool allowlists, token limits, and audit logging.

---

## API

The API is versioned under:

```text
/api/v1
```

Major groups:

```text
/auth
/customers
/products
/quotes
/invoices
/payments
/inventory
/purchasing
/finance
/expenses
/projects
/documents
/analytics
/automation
/search
/ai
/health
```

Health:

```text
GET /api/v1/health/live
GET /api/v1/health/ready
```

`live` confirms process liveness. `ready` verifies required dependencies and should return an unavailable status when traffic cannot be safely served.

---

## Web Application

Representative routes:

```text
/
/customers
/products
/quotes
/invoices
/payments
/inventory
/purchasing
/finance
/expenses
/projects
/tasks
/documents
/reports
/notifications
/search
/command
/ai
```

Productivity shortcuts:

```text
Cmd+K  macOS
Ctrl+K Windows/Linux
N      Quick create
```

The command center handles navigation/actions while `/search` handles database-backed entity search.

---

## Database and Migrations

Prisma manages PostgreSQL.

Production migrations use:

```bash
npx prisma migrate deploy
```

Do not use development migration commands in production.

Migrations should run in a dedicated deployment step/container before application replicas serve traffic.

Recommended order:

1. backup;
2. validate migration compatibility;
3. migrate;
4. verify readiness;
5. deploy/scale application;
6. monitor.

---

## Environment Configuration

Production secrets must remain outside source control.

Typical variables:

```env
NODE_ENV=production

DATABASE_URL=postgresql://...

REDIS_URL=redis://...

SESSION_SECRET=...

CORS_ORIGINS=https://app.example.com

TRUST_PROXY=false

S3_ENDPOINT=...
S3_REGION=...
S3_BUCKET=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
```

Never commit production credentials, private keys, session secrets, or cloud credentials.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- Docker
- Docker Compose
- PostgreSQL 17
- Redis 7
- MinIO for local object storage

### Install

```bash
npm install
```

### Prisma

```bash
npm run db:generate
```

or:

```bash
npx prisma generate
```

### Infrastructure

```bash
docker compose up -d postgres redis minio
```

### Development migration

```bash
npx prisma migrate dev
```

### Deployment migration

```bash
npx prisma migrate deploy
```

### Start

```bash
npm run dev
```

Use the repository's workspace scripts when packages are run separately.

---

## Testing

### Repository validation

```bash
npm run validate
```

### Type checking

```bash
npm run typecheck
```

### Tests

```bash
npm test
```

### Full CI

```bash
npm run ci
```

Intended sequence:

```text
Validate → Prisma → Migrations → Typecheck → Tests → Builds
```

### E2E

E2E should run against disposable PostgreSQL, Redis, and MinIO.

Critical flows:

- authentication
- tenant isolation
- RBAC
- CRM
- quote/invoice/payment
- inventory
- purchasing
- supplier payments
- VAT
- expenses
- projects
- documents
- notifications
- search
- AI context

The highest-priority security test is:

> Organization A must never read or mutate Organization B's data, including through indirect relationships.

---

## CI/CD

The intended GitHub Actions release pipeline is:

```text
Validate
   ↓
Prisma generate
   ↓
Migrations
   ↓
Typecheck
   ↓
Unit/integration tests
   ↓
Build
   ↓
Docker images
   ↓
Production Compose validation
   ↓
API smoke test
   ↓
Authenticated E2E
   ↓
Release manifest
```

Failures must block release.

---

## Production Deployment

Recommended services:

```text
web
api
worker
migrate
postgres
redis
minio / external S3
```

Deployment order:

```text
1. Provision infrastructure
2. Configure secrets
3. Backup PostgreSQL
4. Backup object storage
5. Run migrations
6. Deploy API
7. Deploy worker
8. Deploy web
9. Verify readiness
10. Run smoke tests
11. Monitor
```

The migration container runs `prisma migrate deploy` and exits. It must not start the API.

Production containers should use multi-stage builds, non-root users, runtime-only dependencies, health checks, and externally managed secrets.

---

## Backups and Disaster Recovery

Two backup domains are required.

### PostgreSQL

```bash
scripts/backup-postgres.sh
scripts/restore-postgres.sh
```

Backups should include a checksum and be periodically restored in a disposable environment.

### Object storage

```bash
scripts/backup-object-storage.sh
scripts/restore-object-storage.sh
```

A complete recovery drill must prove that both database records and uploaded documents return successfully.

---

## Observability and Health

Requests should carry `X-Request-Id`.

Structured logs should cover:

- request lifecycle
- status
- duration
- request ID
- safe tenant/user context
- errors

Never log passwords, session secrets, authorization cookies, payment credentials, or private document contents.

Health endpoints:

```text
GET /api/v1/health/live
GET /api/v1/health/ready
```

---

## Release Process

Current release:

```text
0.2.0-rc.1
```

Release checks:

```bash
npm run release:check
npm run release:manifest
```

The release manifest records SHA-256 hashes of critical release files.

### Release checklist

- [ ] Dependencies install successfully
- [ ] Prisma client generates
- [ ] Migrations apply
- [ ] Typecheck passes
- [ ] Unit/integration tests pass
- [ ] Production builds pass
- [ ] Docker images build
- [ ] Production Compose validates
- [ ] API readiness passes
- [ ] Authenticated E2E passes
- [ ] Tenant-isolation tests pass
- [ ] Security regression tests pass
- [ ] PostgreSQL backup/restore succeeds
- [ ] Object-storage backup/restore succeeds
- [ ] HTTPS/reverse proxy verified
- [ ] Monitoring configured
- [ ] Error tracking configured
- [ ] Rollback plan tested
- [ ] Release manifest generated

---

## Known Validation Limitations

Source-level, structural, configuration, and archive checks have been performed throughout development.

The following require a Docker-enabled CI/staging environment for authoritative verification:

- complete dependency installation;
- final Prisma client generation;
- production Docker builds;
- real PostgreSQL migrations;
- Redis/BullMQ runtime;
- MinIO/S3 runtime;
- full authenticated E2E execution;
- backup/restore drills;
- production performance testing;
- HTTPS/reverse-proxy testing.

These are release gates, not documentation-only tasks.

---

## Security Checklist

### Authentication

- [ ] Production session secret configured
- [ ] Secure cookies enabled
- [ ] Session expiration enforced
- [ ] Logout invalidates sessions
- [ ] Password hashing configured
- [ ] Password reset tokens expire and are single-use

### Authorization

- [ ] Tenant scoping on every tenant-owned query
- [ ] Organization membership validated
- [ ] RBAC enforced server-side
- [ ] Restricted documents validated
- [ ] Cross-tenant E2E tests pass

### API

- [ ] DTO validation
- [ ] Unknown-field rejection
- [ ] CORS allowlist
- [ ] CSRF/origin protection
- [ ] Rate limits
- [ ] Security headers
- [ ] Sanitized errors

### Storage

- [ ] Private bucket
- [ ] Upload size limits
- [ ] Server-generated object keys
- [ ] Short-lived signed URLs
- [ ] Object-storage backup

### Finance

- [ ] Journal entries balanced
- [ ] Posting idempotent
- [ ] Overpayments rejected
- [ ] VAT calculated server-side
- [ ] Financial mutations audited

---

## Development Principles

### Tenant isolation first

Every new endpoint must prove why the current user can access the requested organization.

### Server-side truth

Never trust browser-provided:

- organization identity;
- totals;
- permissions;
- payment state;
- inventory balances;
- accounting balances.

### Immutable financial history

Corrections should use compensating transactions instead of rewriting posted history.

### Immutable stock history

Correct inventory through movements, not direct balance edits.

### Idempotency

Requests and background jobs should be safe to retry.

### Auditability

Sensitive changes need an auditable trail.

### Business workflows over isolated CRUD

Prefer complete flows such as:

```text
Quote → Invoice → Payment
```

over disconnected screens.

### Production honesty

A source-level check is not a production build. Release status must reflect what was actually executed.

---

## Roadmap

### Product layers completed

- [x] Authentication
- [x] Multi-tenancy
- [x] RBAC
- [x] CRM
- [x] Sales
- [x] Products & services
- [x] Inventory
- [x] Purchasing
- [x] Finance
- [x] VAT
- [x] Bank reconciliation
- [x] Expenses
- [x] Cash-flow forecasting
- [x] Projects
- [x] Project profitability
- [x] Reporting
- [x] Notifications
- [x] Automation
- [x] Documents
- [x] Global search
- [x] Command center
- [x] AI decision intelligence
- [x] Security hardening
- [x] CI/CD foundation
- [x] E2E acceptance foundation
- [x] Production deployment foundation
- [x] Release-candidate tooling

### Remaining release work

- [ ] Full dependency-backed build in CI
- [ ] Full Docker build
- [ ] Production-like staging environment
- [ ] Full E2E execution
- [ ] Backup/restore drill
- [ ] Security regression execution
- [ ] Performance smoke test
- [ ] Staging deployment
- [ ] Final production sign-off

---

## Project Status

**SahlBiz `0.2.0-rc.1`**

The platform has progressed from a feature prototype into a broad multi-tenant business system with operational, financial, reporting, automation, AI, security, testing, and deployment foundations.

The remaining work is primarily **runtime verification and release engineering**, not another major business-domain feature.

SahlBiz should only be promoted to production after the CI/staging environment successfully executes the complete build, migration, E2E, security, backup/restore, and deployment checks described above.
