# AI Assistant API

All endpoints require authentication, a validated organization context, and the corresponding `ai:*` permission.

- `GET /api/v1/ai/insights?limit=10` — prioritized business recommendations derived from tenant data.
- `POST /api/v1/ai/insights/:id/dismiss` — dismiss a persisted insight.
- `POST /api/v1/ai/ask` — answers a supported business question from live tenant data.
- `GET /api/v1/ai/context` — returns the normalized, non-sensitive management context used by the rules engine.

The current implementation is deterministic and local (`source=rules`). It does not claim to be a generative model and does not transmit tenant data to an external AI provider. A provider adapter can be added later behind the same module boundary.
