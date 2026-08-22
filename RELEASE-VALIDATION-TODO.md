# SahlBiz — Environment-Dependent Release & Production Validation TODO

**Target:** `0.2.0-rc.1 → 0.2.0 production`

**Purpose:** Validate clean installation, dependencies, database, Redis, object storage, builds, Docker images, security, authenticated E2E workflows, backups, restore, deployment, rollback, and operational readiness before production release.

## Release Gates

### Gate A — Installation
- [ ] Clean machine/CI runner
- [ ] Supported Node.js/npm/Docker versions verified
- [ ] Clean checkout at release commit
- [ ] `npm ci` succeeds
- [ ] Prisma generation succeeds
- [ ] Repository validation succeeds

### Gate B — Build
- [ ] Typecheck passes
- [ ] Unit/integration tests pass
- [ ] Web/API/worker builds pass
- [ ] Docker production images build
- [ ] No secrets embedded in images
- [ ] Containers run as intended

### Gate C — Infrastructure
- [ ] PostgreSQL starts and accepts connections
- [ ] Redis starts and accepts connections
- [ ] S3/MinIO starts and accepts uploads/downloads
- [ ] Empty database migrations apply successfully
- [ ] Existing-data upgrade migration succeeds
- [ ] Prisma reports no pending migrations
- [ ] Live/readiness health checks pass

### Gate D — Security
- [ ] Authentication passes
- [ ] Logout/session invalidation passes
- [ ] RBAC passes for all roles
- [ ] Tenant isolation passes for every major resource
- [ ] Organization-ID/header manipulation is rejected
- [ ] CSRF/origin protection passes
- [ ] CORS allowlist passes
- [ ] Rate limits pass
- [ ] Security headers pass
- [ ] No sensitive data appears in logs

### Gate E — Business Workflows
- [ ] CRM workflow
- [ ] Quote → invoice → payment
- [ ] Purchase order → receipt → supplier invoice → payment
- [ ] Inventory receipt/issue/adjustment/transfer
- [ ] Accounting journal/ledger/trial balance/P&L
- [ ] VAT
- [ ] Expenses approval/payment
- [ ] Projects/tasks/profitability
- [ ] Documents/upload/download/versioning
- [ ] Search
- [ ] Notifications/automation
- [ ] AI decision intelligence

### Gate F — Operations
- [ ] PostgreSQL backup succeeds
- [ ] Object-storage backup succeeds
- [ ] PostgreSQL restore succeeds
- [ ] Object-storage restore succeeds
- [ ] Full recovery drill succeeds
- [ ] Worker retry/idempotency verified
- [ ] Monitoring and alerting configured

### Gate G — Deployment
- [ ] Staging deployment from clean infrastructure succeeds
- [ ] HTTPS/reverse proxy succeeds
- [ ] Upgrade rehearsal succeeds
- [ ] Rollback rehearsal succeeds
- [ ] Production smoke test succeeds

### Gate H — Final GO/NO-GO
- [ ] Release evidence package archived
- [ ] Technical owner sign-off
- [ ] Business owner sign-off
- [ ] GO decision recorded

---

## 1. Clean-Machine Installation

- [ ] Install supported Node.js 20+.
- [ ] Install npm 10+.
- [ ] Install Docker and Docker Compose.
- [ ] Clone repository.
- [ ] Checkout exact release tag/commit.
- [ ] Verify clean Git status.
- [ ] Record host and tool versions.
- [ ] Verify disk/RAM/network prerequisites.

```bash
node --version
npm --version
docker --version
docker compose version
git --version
```

```bash
npm ci
npm run db:generate
npm run validate
```

**NO-GO:** if the tested commit differs from the release commit or clean installation fails.

---

## 2. Environment Configuration

- [ ] Start from `.env.example` and production-specific examples.
- [ ] Configure `DATABASE_URL`.
- [ ] Configure `REDIS_URL`.
- [ ] Configure `SESSION_SECRET`.
- [ ] Configure `CORS_ORIGINS`.
- [ ] Configure S3/MinIO endpoint, bucket, region, access key, and secret.
- [ ] Configure mail/integration credentials if enabled.
- [ ] Generate unique production secrets.
- [ ] Confirm staging and production secrets differ.
- [ ] Confirm secrets are not committed.
- [ ] Confirm secrets are not printed by CI or Docker build logs.

---

## 3. Local/Disposable Infrastructure

```bash
docker compose up -d postgres redis minio
docker compose ps
```

- [ ] PostgreSQL healthy.
- [ ] Redis healthy.
- [ ] MinIO healthy.
- [ ] Database connectivity verified.
- [ ] Redis connectivity verified.
- [ ] Object-storage bucket verified.
- [ ] Upload/download/delete behavior verified.

---

## 4. Database and Migration Validation

```bash
npx prisma migrate deploy
npx prisma migrate status
```

- [ ] All migrations apply to an empty database.
- [ ] No failed migrations.
- [ ] No pending migrations.
- [ ] Schema is consistent.
- [ ] Foreign keys and unique constraints are present.
- [ ] Required indexes exist.
- [ ] Existing-data upgrade succeeds from previous release.
- [ ] No business data is lost during upgrade.

### Financial invariants

```text
SUM(debits) = SUM(credits)
```

- [ ] Every posted journal is balanced.
- [ ] Duplicate payment retries do not double-post.
- [ ] Inventory remains reconcilable after migrations.

---

## 5. Build and Test

```bash
npm run typecheck
npm test
npm run build
npm run ci
```

- [ ] API typecheck.
- [ ] Web typecheck.
- [ ] Worker typecheck.
- [ ] Unit/integration tests.
- [ ] Security regression tests.
- [ ] Web build.
- [ ] API build.
- [ ] Worker build.
- [ ] Release check.
- [ ] Release manifest.

---

## 6. Production Docker Validation

```bash
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml up -d
```

- [ ] Migration job completes.
- [ ] API starts.
- [ ] Worker starts.
- [ ] Web starts.
- [ ] PostgreSQL starts.
- [ ] Redis starts.
- [ ] Storage starts/connection works.
- [ ] No crash loops.
- [ ] Containers use appropriate users/permissions.
- [ ] No development secrets/dependencies leak into runtime images.
- [ ] Health checks are present and meaningful.

---

## 7. Health and Readiness

```bash
curl /api/v1/health/live
curl /api/v1/health/ready
```

- [ ] Liveness succeeds.
- [ ] Readiness succeeds only when required dependencies are available.
- [ ] Stopping PostgreSQL makes readiness fail appropriately.
- [ ] Redis failure is detected where required.
- [ ] Storage failure is detected where required.
- [ ] Services recover after dependencies return.

---

## 8. Authentication

- [ ] Registration.
- [ ] Login.
- [ ] Logout.
- [ ] Session persistence.
- [ ] Session expiration.
- [ ] Invalid credentials.
- [ ] Password hashing.
- [ ] Password reset.
- [ ] Reset token expiration/single use.
- [ ] Session invalidation after logout.
- [ ] Production cookies are HttpOnly/Secure/SameSite as intended.

---

## 9. Multi-Tenant Security

Create Organization A/User A and Organization B/User B with overlapping test data.

- [ ] A cannot read B customers.
- [ ] A cannot read B products.
- [ ] A cannot read B quotes/invoices/payments.
- [ ] A cannot read B suppliers/purchases.
- [ ] A cannot read B inventory.
- [ ] A cannot read B expenses/projects/tasks.
- [ ] A cannot read B documents.
- [ ] A cannot read B search results.
- [ ] A cannot read B analytics.
- [ ] A cannot read B AI context/insights.
- [ ] A cannot mutate B records.
- [ ] Client-supplied organization identifiers cannot bypass membership.

Test hostile combinations such as a valid A session with a B organization header/parameter.

**NO-GO:** any cross-tenant data read or mutation.

---

## 10. RBAC

Validate all supported roles:

- [ ] OWNER
- [ ] ADMIN
- [ ] MANAGER
- [ ] SALES
- [ ] ACCOUNTANT
- [ ] EMPLOYEE
- [ ] VIEWER

For each role:

- [ ] Authorized reads work.
- [ ] Authorized writes work.
- [ ] Forbidden reads fail server-side.
- [ ] Forbidden writes fail server-side.
- [ ] UI restrictions are not relied on as the security boundary.

---

## 11. CRM E2E

- [ ] Create customer.
- [ ] Read customer.
- [ ] Update customer.
- [ ] Search customer.
- [ ] Archive/deactivate if supported.
- [ ] Customer is selectable from sales workflows.
- [ ] Tenant isolation remains intact.

---

## 12. Sales E2E

```text
Customer → Quote → Accept → Invoice → Payment
```

- [ ] Quote totals correct.
- [ ] VAT correct.
- [ ] Invoice totals correct.
- [ ] Payment allocation correct.
- [ ] Receivable balance correct.
- [ ] Invoice state correct.
- [ ] Accounting entries correct.
- [ ] Audit trail created.
- [ ] Inventory effect correct where configured.
- [ ] Retry is idempotent.

---

## 13. Purchasing E2E

```text
Supplier → Purchase Order → Goods Receipt → Inventory
         → Supplier Invoice → Payment
```

- [ ] Purchase order.
- [ ] Goods receipt.
- [ ] Stock increase.
- [ ] Supplier payable.
- [ ] VAT.
- [ ] Payment.
- [ ] Accounting entries.
- [ ] Final payable balance.

---

## 14. Inventory E2E

- [ ] Opening stock.
- [ ] Receipt.
- [ ] Issue.
- [ ] Adjustment.
- [ ] Transfer.
- [ ] Low-stock threshold.
- [ ] Negative-stock policy.
- [ ] Concurrent movement behavior.
- [ ] Invoice-driven stock movement.
- [ ] Retry/idempotency.

Reconcile:

```text
Opening + Receipts - Issues ± Adjustments ± Transfers = Expected stock
```

- [ ] Ledger and balance reconcile.

---

## 15. Finance and VAT E2E

- [ ] Chart of accounts.
- [ ] Bank/cash account.
- [ ] Customer invoice.
- [ ] Customer payment.
- [ ] Supplier invoice.
- [ ] Supplier payment.
- [ ] Expense.
- [ ] General ledger.
- [ ] Trial balance.
- [ ] P&L.
- [ ] Cash position.
- [ ] Receivables.
- [ ] Payables.
- [ ] VAT collected.
- [ ] VAT deductible.
- [ ] VAT position.
- [ ] Server-side totals cannot be overridden by client values.

---

## 16. Expenses and Projects

### Expenses
- [ ] Create.
- [ ] Submit.
- [ ] Approve.
- [ ] Reject.
- [ ] Pay.
- [ ] Accounting integration.
- [ ] VAT.
- [ ] Cash-flow impact.
- [ ] Duplicate payment protection.

### Projects
- [ ] Create project.
- [ ] Add customer.
- [ ] Add budget.
- [ ] Create/complete tasks.
- [ ] Add costs.
- [ ] Add revenue/invoices.
- [ ] Calculate margin.
- [ ] Calculate budget variance.

---

## 17. Documents and Storage

- [ ] Upload.
- [ ] Metadata.
- [ ] Versioning.
- [ ] Tags.
- [ ] Permissions.
- [ ] Preview/download.
- [ ] Signed URL expiry.
- [ ] Oversized upload rejection.
- [ ] Invalid object key rejection.
- [ ] Tenant isolation.
- [ ] Backup/restore of actual objects.

---

## 18. Search, Automation, Notifications, AI

### Search
- [ ] Customers.
- [ ] Products.
- [ ] Quotes.
- [ ] Invoices.
- [ ] Projects/tasks.
- [ ] Suppliers.
- [ ] Documents.
- [ ] Pagination/bounds.
- [ ] Tenant isolation.

### Worker/automation
- [ ] Worker connects.
- [ ] Jobs execute.
- [ ] Retries work.
- [ ] Failed jobs are observable.
- [ ] Duplicate jobs do not duplicate side effects.
- [ ] Notifications are not duplicated.

### AI
- [ ] AI context is tenant-scoped.
- [ ] Cash insight.
- [ ] Receivables insight.
- [ ] Low-stock insight.
- [ ] Task insight.
- [ ] Project insight.
- [ ] Dismissal works.
- [ ] Unauthorized access is blocked.
- [ ] Rules-based implementation is accurately represented.

---

## 19. Security Regression

- [ ] SQL injection attempts.
- [ ] Authorization bypass.
- [ ] Tenant ID manipulation.
- [ ] CSRF.
- [ ] CORS.
- [ ] Cookie security.
- [ ] Rate limiting.
- [ ] Login brute force.
- [ ] Malformed JSON.
- [ ] Oversized request.
- [ ] Unknown DTO fields.
- [ ] Path traversal.
- [ ] Storage-key traversal.
- [ ] Signed URL abuse.
- [ ] Error-information disclosure.

Verify production headers including HSTS, content-type protection, framing policy, referrer policy, permissions policy, and sensitive-response caching behavior.

---

## 20. Performance Smoke Test

Measure p50/p95/p99 and error rate for:

- [ ] Login.
- [ ] Dashboard.
- [ ] Customer list.
- [ ] Invoice list.
- [ ] Search.
- [ ] Invoice creation.
- [ ] Payment creation.
- [ ] Inventory movement.
- [ ] Document upload.
- [ ] Reporting.

Define release thresholds before production and record results.

---

## 21. Backup and Restore

### PostgreSQL

```bash
scripts/backup-postgres.sh
scripts/restore-postgres.sh
```

- [ ] Backup succeeds.
- [ ] Checksum exists.
- [ ] Backup is stored independently.
- [ ] Restore succeeds in a disposable environment.
- [ ] Users/organizations survive.
- [ ] Financial data survives.
- [ ] Inventory survives.

### Object storage

```bash
scripts/backup-object-storage.sh
scripts/restore-object-storage.sh
```

- [ ] Objects are backed up.
- [ ] Objects restore.
- [ ] Database references still work.
- [ ] Download/preview works after restore.

**NO-GO:** if either database or object-storage recovery cannot be demonstrated.

---

## 22. Disaster Recovery

Simulate:

- [ ] PostgreSQL failure.
- [ ] Redis failure.
- [ ] Object-storage failure.
- [ ] API failure.
- [ ] Worker failure.
- [ ] Web failure.

For each:

- [ ] Detect.
- [ ] Alert.
- [ ] Recover.
- [ ] Verify integrity.
- [ ] Verify no duplicate financial side effects.
- [ ] Verify no lost documents.

Record target RTO/RPO and actual recovery results.

---

## 23. HTTPS / Reverse Proxy / DNS

- [ ] Production DNS resolves.
- [ ] HTTPS works.
- [ ] HTTP redirects to HTTPS.
- [ ] Certificate is valid.
- [ ] Certificate renewal is configured.
- [ ] Secure cookies work behind proxy.
- [ ] CORS matches production domains.
- [ ] `TRUST_PROXY` is correct.
- [ ] Upload and timeout limits are compatible.

---

## 24. Monitoring and Logging

- [ ] Error tracking.
- [ ] API metrics.
- [ ] Database monitoring.
- [ ] Redis monitoring.
- [ ] Worker queue monitoring.
- [ ] Storage monitoring.
- [ ] Disk alerts.
- [ ] CPU/RAM alerts.
- [ ] Uptime monitoring.
- [ ] Backup failure alerts.
- [ ] Certificate-expiry alerts.

Logs must contain safe request/service context but must not contain passwords, cookies, secrets, private keys, payment credentials, or private document contents.

---

## 25. Staging Deployment Rehearsal

Run from clean infrastructure:

```text
Secrets → PostgreSQL → Redis → Object Storage → Migration
→ API → Worker → Web → Reverse Proxy → Health → E2E
```

- [ ] Deployment works from documentation alone.
- [ ] No undocumented manual steps.
- [ ] Deployment duration recorded.
- [ ] Failure points documented.

---

## 26. Upgrade and Rollback Rehearsal

### Upgrade
- [ ] Start previous release.
- [ ] Populate representative data.
- [ ] Back up.
- [ ] Apply migrations.
- [ ] Deploy new application.
- [ ] Run E2E.
- [ ] Verify no data loss.

### Rollback
- [ ] Restore previous application image.
- [ ] Verify migration compatibility.
- [ ] Restore database only if required by the migration strategy.
- [ ] Verify financial data.
- [ ] Verify inventory.
- [ ] Verify documents.
- [ ] Verify tenant isolation.

Do not assume database migrations are reversible. Prefer forward-compatible migrations and explicit recovery procedures.

---

## 27. Production Smoke Test

Immediately after deployment:

- [ ] Login.
- [ ] Logout.
- [ ] Create customer.
- [ ] Create quote.
- [ ] Create invoice.
- [ ] Record payment.
- [ ] Verify journal.
- [ ] Create inventory movement.
- [ ] Upload/download document.
- [ ] Search.
- [ ] Verify notification/job.
- [ ] Verify AI insight/context.
- [ ] Verify readiness.
- [ ] Verify monitoring.

---

## 28. Release Evidence Package

Create and archive:

```text
release-validation/
├── RELEASE.md
├── environment.txt
├── versions.txt
├── git-sha.txt
├── release-manifest.json
├── typecheck.log
├── test.log
├── build.log
├── docker-build.log
├── migration.log
├── e2e.log
├── security.log
├── performance.log
├── backup.log
├── restore.log
├── deployment.log
├── rollback.log
└── final-go-no-go.md
```

---

## 29. Automatic NO-GO Conditions

Release is **NO-GO** if any of these occur:

- [ ] Build failure.
- [ ] Migration failure.
- [ ] Critical E2E failure.
- [ ] Cross-tenant data leak.
- [ ] Authentication/authorization bypass.
- [ ] Unbalanced accounting.
- [ ] Inventory corruption.
- [ ] Duplicate payment posting.
- [ ] Backup failure.
- [ ] Restore failure.
- [ ] Production container cannot start.
- [ ] Readiness failure.
- [ ] Critical security vulnerability.
- [ ] Secret exposure.
- [ ] Rollback/recovery procedure cannot restore service safely.

---

## 30. Final GO Requirements

All must be true:

- [ ] CI green.
- [ ] Staging deployment green.
- [ ] E2E green.
- [ ] Security regression green.
- [ ] Tenant isolation green.
- [ ] Performance smoke test acceptable.
- [ ] PostgreSQL backup verified.
- [ ] Object-storage backup verified.
- [ ] Restore drill successful.
- [ ] Production deployment rehearsed.
- [ ] Rollback rehearsed.
- [ ] Monitoring active.
- [ ] Alerts active.
- [ ] Business owner approved.
- [ ] Technical owner approved.
- [ ] GO decision recorded against exact commit SHA.

---

## 31. Final Checklist

```text
[ ] Release commit frozen
[ ] Clean installation works
[ ] npm ci works
[ ] Prisma generation works
[ ] Repository validation passes
[ ] Typecheck passes
[ ] Tests pass
[ ] Builds pass
[ ] Docker builds pass
[ ] Migrations pass
[ ] PostgreSQL works
[ ] Redis works
[ ] Object storage works
[ ] API health passes
[ ] Worker works
[ ] Authentication passes
[ ] RBAC passes
[ ] Tenant isolation passes
[ ] CRM passes
[ ] Sales passes
[ ] Purchasing passes
[ ] Inventory passes
[ ] Finance passes
[ ] VAT passes
[ ] Expenses pass
[ ] Projects pass
[ ] Documents pass
[ ] Search passes
[ ] Automation passes
[ ] AI passes
[ ] Security regression passes
[ ] Performance smoke test passes
[ ] PostgreSQL backup passes
[ ] Object-storage backup passes
[ ] PostgreSQL restore passes
[ ] Object-storage restore passes
[ ] Disaster recovery passes
[ ] HTTPS passes
[ ] Monitoring passes
[ ] Alerts pass
[ ] Staging deployment passes
[ ] Upgrade rehearsal passes
[ ] Rollback rehearsal passes
[ ] Production smoke test passes
[ ] Business sign-off
[ ] Technical sign-off
[ ] GO decision recorded
```
