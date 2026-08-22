# Documents & File Management — Slice

## Implemented
- Tenant-scoped document metadata in PostgreSQL; file bytes remain in S3-compatible object storage.
- S3/MinIO storage provider abstraction with upload, download, deletion and signed URLs.
- Document categories: contracts, invoices, quotations, receipts, company, customer, project, other.
- Multipart upload with a 20 MB API limit.
- SHA-256 checksum captured in metadata.
- Versioning with immutable `DocumentVersion` rows.
- Organization/restricted visibility with per-user document permissions.
- Tags and entity links (`entityType`/`entityId`).
- Expiration dates and expiring-document endpoint.
- Audit events for create/version/delete.
- Download endpoint and signed URL endpoint.
- French Documents workspace.

## Storage configuration
See `.env.storage.example`. Local development uses MinIO via `docker compose`.

## API
- `GET /api/v1/documents`
- `POST /api/v1/documents` (multipart field: `file`)
- `POST /api/v1/documents/:id/versions` (multipart field: `file`)
- `GET /api/v1/documents/:id/download`
- `GET /api/v1/documents/:id/url`
- `DELETE /api/v1/documents/:id`
- `GET /api/v1/documents/meta/tags`
- `POST /api/v1/documents/meta/tags`
- `GET /api/v1/documents/meta/expiring`

## Security invariants
- Every query is constrained by `organizationId`.
- Restricted documents require creator or explicit user permission.
- Document files are never stored in PostgreSQL.
- Storage keys are server-generated; client filenames are sanitized.
- Version numbers are assigned server-side.
