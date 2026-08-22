# Documents & File Management — Acceptance Tests

- [ ] User can upload a document only inside an organization they belong to.
- [ ] File bytes are stored in S3-compatible storage; PostgreSQL contains metadata only.
- [ ] Uploads over 20 MB are rejected.
- [ ] Storage keys are server-generated and do not trust the client path.
- [ ] SHA-256 checksum is recorded.
- [ ] Restricted documents are inaccessible to non-granted users in the same organization.
- [ ] Cross-organization document IDs return not-found/access denied and never leak metadata.
- [ ] New versions increment server-side and preserve prior versions.
- [ ] Download and signed URL access use the same tenant/document permission checks.
- [ ] Delete removes all stored versions and the metadata transactionally from the application workflow.
- [ ] Tags are organization-scoped and cannot be attached across tenants.
- [ ] Expiring-document query is tenant-scoped.
- [ ] Create/version/delete mutations produce audit events.
