-- Inventory foundation: warehouses, warehouse balances and immutable stock movements.
CREATE TYPE "StockMovementType" AS ENUM ('OPENING','RECEIPT','SALE_ISSUE','ADJUSTMENT_IN','ADJUSTMENT_OUT','TRANSFER_IN','TRANSFER_OUT');

CREATE TABLE "Warehouse" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Warehouse_organizationId_code_key" ON "Warehouse"("organizationId","code");
CREATE INDEX "Warehouse_organizationId_active_idx" ON "Warehouse"("organizationId","active");
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "WarehouseStock" (
  "id" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
  CONSTRAINT "WarehouseStock_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WarehouseStock_warehouseId_productId_key" ON "WarehouseStock"("warehouseId","productId");
CREATE INDEX "WarehouseStock_productId_idx" ON "WarehouseStock"("productId");
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "StockMovement" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "type" "StockMovementType" NOT NULL,
  "sourceType" TEXT,
  "sourceId" TEXT,
  "note" TEXT,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StockMovement_organizationId_occurredAt_idx" ON "StockMovement"("organizationId","occurredAt");
CREATE INDEX "StockMovement_warehouseId_productId_occurredAt_idx" ON "StockMovement"("warehouseId","productId","occurredAt");
CREATE INDEX "StockMovement_organizationId_sourceType_sourceId_idx" ON "StockMovement"("organizationId","sourceType","sourceId");
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invoice" ADD COLUMN "warehouseId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "stockPostedAt" TIMESTAMP(3);
CREATE INDEX "Invoice_warehouseId_idx" ON "Invoice"("warehouseId");
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill one main warehouse per organization and mirror the existing product aggregate stock.
INSERT INTO "Warehouse" ("id","organizationId","name","code","active","isDefault","createdAt","updatedAt")
SELECT 'wh_' || md5(o."id" || ':MAIN'), o."id", 'Dépôt principal', 'MAIN', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Organization" o
WHERE NOT EXISTS (SELECT 1 FROM "Warehouse" w WHERE w."organizationId"=o."id");

INSERT INTO "WarehouseStock" ("id","warehouseId","productId","quantity")
SELECT 'ws_' || md5(w."id" || ':' || p."id"), w."id", p."id", p."stock"
FROM "Product" p
JOIN "Warehouse" w ON w."organizationId"=p."organizationId" AND w."isDefault"=true
WHERE p."type"='PRODUCT' AND p."stock" <> 0
ON CONFLICT ("warehouseId","productId") DO NOTHING;

INSERT INTO "StockMovement" ("id","organizationId","warehouseId","productId","quantity","type","sourceType","sourceId","note","occurredAt","createdAt")
SELECT 'sm_' || md5(p."id" || ':opening'), p."organizationId", w."id", p."id", p."stock", 'OPENING', 'MIGRATION', p."id", 'Stock existant avant activation de l''inventaire', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Product" p
JOIN "Warehouse" w ON w."organizationId"=p."organizationId" AND w."isDefault"=true
WHERE p."type"='PRODUCT' AND p."stock" > 0;
