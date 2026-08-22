# Documents API

All routes are under `/api/v1/documents` and require the authenticated session plus `x-organization-id` membership context.

| Method | Route | Permission | Purpose |
|---|---|---|---|
| GET | `/documents` | `documents:read` | Search/list documents |
| POST | `/documents` | `documents:write` | Multipart upload |
| POST | `/documents/:id/versions` | `documents:write` | Upload a new version |
| GET | `/documents/:id/download` | `documents:read` | Stream a file |
| GET | `/documents/:id/url` | `documents:read` | Get a short-lived signed URL |
| DELETE | `/documents/:id` | `documents:write` | Delete document and versions |
| GET | `/documents/meta/tags` | `documents:read` | List tags |
| POST | `/documents/meta/tags` | `documents:write` | Create an organization tag |
| GET | `/documents/meta/expiring` | `documents:read` | Find documents nearing expiration |

Upload field: `file`. Maximum size: 20 MB.
