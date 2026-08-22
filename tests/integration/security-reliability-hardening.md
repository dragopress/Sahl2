# Security & Reliability Hardening — Acceptance Tests

- [ ] Every API response contains a stable `X-Request-Id`.
- [ ] Client-supplied request IDs longer than 128 characters are replaced.
- [ ] Validation rejects unknown DTO properties with HTTP 400.
- [ ] API responses never expose exception stack traces.
- [ ] Production responses include HSTS, X-Content-Type-Options, X-Frame-Options and restrictive Permissions-Policy.
- [ ] A cookie-authenticated cross-origin POST/PATCH/PUT/DELETE is rejected unless its Origin is configured in `CORS_ORIGINS`.
- [ ] Requests marked `Sec-Fetch-Site: cross-site` are rejected for cookie-authenticated state changes.
- [ ] Authentication endpoints are rate limited separately from normal API traffic.
- [ ] Normal API traffic receives HTTP 429 after the configured threshold and includes `Retry-After`.
- [ ] `/health/live` succeeds when PostgreSQL is unavailable.
- [ ] `/health/ready` returns HTTP 503 when PostgreSQL is unavailable.
- [ ] `TRUST_PROXY=false` does not trust arbitrary `X-Forwarded-For` headers.
- [ ] Tenant authorization continues to run before business services.
