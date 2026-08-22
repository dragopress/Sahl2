# SahlBiz — Security & Reliability Hardening

## Implemented

- Request IDs on every API response (`X-Request-Id`).
- Structured request/error logs without returning stack traces to clients.
- Strict global validation with `forbidNonWhitelisted`.
- Security response headers and production HSTS.
- Explicit CORS allowlist through `CORS_ORIGINS`.
- Cookie-session CSRF/origin protection for state-changing requests.
- IP-based API and authentication rate limiting.
- Liveness and PostgreSQL readiness endpoints.
- Proxy-aware client IP handling only when `TRUST_PROXY=true`.
- `Retry-After` response on rate-limit rejection.

## Operational notes

The in-process rate limiter is a safe baseline for a single API instance. For horizontally scaled production deployments, put a distributed rate limiter at the edge or back it with Redis before exposing multiple API instances.

## Health endpoints

- `GET /api/v1/health/live` — process liveness; no database dependency.
- `GET /api/v1/health/ready` — verifies PostgreSQL connectivity.

## Required production configuration

```env
NODE_ENV=production
CORS_ORIGINS=https://app.example.com
TRUST_PROXY=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
AUTH_RATE_LIMIT_MAX=10
```

Never expose PostgreSQL, Redis, or MinIO management ports directly to the public internet.
