# Tenant isolation acceptance tests

1. Create user A with organization A and user B with organization B.
2. Authenticate as user A.
3. Create customer A1 with `x-organization-id: orgA`.
4. Request customers with `x-organization-id: orgB`; expect 403.
5. Attempt GET/PATCH/DELETE on A1 using orgB; expect 404/403 and no mutation.
6. Verify audit log for create/update/delete belongs to orgA and actor A.
7. Authenticate as a VIEWER and verify GET succeeds while POST/PATCH/DELETE return 403.
8. Authenticate as SALES and verify create/update succeeds while delete returns 403.
