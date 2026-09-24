# SahlBiz AI Assistant slice

Adds a tenant-scoped AI/decision-assistance layer without pretending a generative model is configured.

## Endpoints

- `GET /api/v1/ai/insights`
- `POST /api/v1/ai/insights/:id/dismiss`
- `POST /api/v1/ai/ask`
- `GET /api/v1/ai/context`

## Safety and architecture

The current implementation is a deterministic rules engine over server-side aggregate business data. No organization data leaves the application. A future LLM provider must sit behind an explicit adapter and configuration boundary.


---

## Repository-wide audit reconciliation — 2026-09-24

Status is **implemented but not production-complete** where the feature depends on unfinished frontend integration or environment-dependent validation.

- The latest SahlBiz CI/CD validation on `main` is green, including authenticated E2E and Prisma migration deployment.
- Production storage configuration still requires normalization between `S3_*` variables consumed by the storage package and `STORAGE_*` variables used by production Compose/backup configuration.
- The web application still contains an in-memory/demo API layer. This feature/status document must not be interpreted as evidence that every UI screen is connected to the real API.
- Frontend pages must not present hardcoded/demo business or financial values as production data.
- Environment-dependent production verification remains required before release.
