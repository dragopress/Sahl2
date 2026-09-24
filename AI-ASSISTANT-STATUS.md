# AI Assistant — Implementation Status

## Implemented

- Tenant-scoped AI insight generation.
- Priority-ranked recommendations for cash, receivables, inventory, tasks, and project budgets.
- Idempotent 24-hour insight persistence per user.
- Insight dismissal.
- Natural-language-like deterministic question routing for treasury, unpaid invoices, stock, and tasks.
- Normalized management context endpoint.
- `ai:read` / `ai:write` permissions.
- French web assistant at `/ai`.
- Explicit disclosure that the current mode is local rules, not a generative provider.

## Security

- Authentication and tenant guards run before AI endpoints.
- Organization ID is taken from the validated request tenant context.
- No raw tenant dataset is sent to an external provider.
- The context endpoint exposes only aggregate management values.

## Next AI phase

Add a provider adapter (for example an LLM service) behind an explicit environment configuration, with prompt redaction, token budgets, tool allowlists, audit logging, and opt-in data controls.


---

## Repository-wide audit reconciliation — 2026-09-24

Status is **implemented but not production-complete** where the feature depends on unfinished frontend integration or environment-dependent validation.

- The latest SahlBiz CI/CD validation on `main` is green, including authenticated E2E and Prisma migration deployment.
- Production storage configuration still requires normalization between `S3_*` variables consumed by the storage package and `STORAGE_*` variables used by production Compose/backup configuration.
- The web application still contains an in-memory/demo API layer. This feature/status document must not be interpreted as evidence that every UI screen is connected to the real API.
- Frontend pages must not present hardcoded/demo business or financial values as production data.
- Environment-dependent production verification remains required before release.
