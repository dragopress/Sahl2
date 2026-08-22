# SahlBiz — Catalog implementation slice

Implemented in this slice:

- Multi-tenant products/services catalog.
- Product/service categories.
- SKU and barcode fields.
- Purchase and selling prices in MAD.
- Configurable VAT rate and unit.
- Stock and minimum-stock fields for products.
- Supplier text field.
- Active/inactive lifecycle with archive action.
- Search by name/SKU/barcode.
- Low-stock API endpoint.
- Audit logging for catalog mutations.
- RBAC permissions: `products:read`, `products:write`.
- Quote and invoice lines can reference a catalog item while retaining a price/description snapshot.
- French catalog UI under `/products`.

Intentional boundary: stock quantities are visible and low-stock detection is available, but stock changes are not yet implemented as direct mutations. The next inventory slice should introduce warehouses and immutable stock movements so stock cannot change without an auditable reason.
