# Catalog vertical-slice acceptance tests

## Tenant isolation
- A product created in organization A must never appear in organization B.
- Product category lookup must require membership in the active organization.
- Updating/archiving a product ID from another organization must return not-found/deny, not mutate it.
- Quote/invoice `productId` must be validated against the same organization as the document.

## Commercial integrity
- Product selection defaults the quote line to catalog selling price and VAT rate.
- Quote/invoice line stores the selected product reference and a snapshot of description, quantity, unit price and tax.
- Later catalog price changes must not rewrite existing quote/invoice totals.
- Inactive products cannot be selected for new documents.

## Catalog lifecycle
- Product and service types are supported.
- SKU is unique per organization when present.
- Categories are unique per organization.
- Archive makes an item inactive without deleting historical document references.
- Products below minimum stock are returned by `/api/v1/products/low-stock`.
