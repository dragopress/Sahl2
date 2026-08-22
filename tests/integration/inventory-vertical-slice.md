# Inventory vertical slice acceptance tests

## Tenant isolation
- A user cannot list or mutate warehouses from another organization.
- A user cannot read stock balances or movements belonging to another organization.
- A product from another organization is rejected by every movement endpoint.

## Immutable stock ledger
- Product stock is not editable through product update.
- Every receipt creates one positive immutable movement.
- Every issue creates one negative stock effect represented by a positive movement quantity plus `SALE_ISSUE` type.
- Every adjustment is auditable.
- Transfers create paired `TRANSFER_OUT` and `TRANSFER_IN` movements atomically.
- A failed transfer leaves both warehouses unchanged.
- Negative available stock is rejected and the transaction is rolled back.

## Sales integration
- Sending an invoice posts product quantities from the selected/default warehouse exactly once.
- Services never affect stock.
- An invoice cannot be sent when required stock is insufficient.
- Cancelling a stock-posted invoice restores the quantities with a compensating movement.
- Re-sending or retrying a posted invoice cannot duplicate stock movements.

## Reporting
- Warehouse balances reconcile to movement history.
- Low-stock endpoint returns warehouse/product pairs at or below the product minimum.
