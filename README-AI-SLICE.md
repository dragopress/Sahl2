# SahlBiz AI Assistant slice

Adds a tenant-scoped AI/decision-assistance layer without pretending a generative model is configured.

## Endpoints

- `GET /api/v1/ai/insights`
- `POST /api/v1/ai/insights/:id/dismiss`
- `POST /api/v1/ai/ask`
- `GET /api/v1/ai/context`

## Safety and architecture

The current implementation is a deterministic rules engine over server-side aggregate business data. No organization data leaves the application. A future LLM provider must sit behind an explicit adapter and configuration boundary.
