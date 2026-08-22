CREATE TYPE "ProductType" AS ENUM ('PRODUCT','SERVICE');
CREATE TABLE "ProductCategory" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "categoryId" TEXT,
  "type" "ProductType" NOT NULL DEFAULT 'PRODUCT',
  "sku" TEXT,
  "barcode" TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "purchasePrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "sellingPrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 20,
  "unit" TEXT NOT NULL DEFAULT 'unité',
  "stock" DECIMAL(14,3) NOT NULL DEFAULT 0,
  "minimumStock" DECIMAL(14,3) NOT NULL DEFAULT 0,
  "supplier" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "QuoteItem" ADD COLUMN "productId" TEXT;
ALTER TABLE "InvoiceItem" ADD COLUMN "productId" TEXT;
CREATE UNIQUE INDEX "ProductCategory_organizationId_name_key" ON "ProductCategory"("organizationId","name");
CREATE INDEX "ProductCategory_organizationId_active_idx" ON "ProductCategory"("organizationId","active");
CREATE UNIQUE INDEX "Product_organizationId_sku_key" ON "Product"("organizationId","sku");
CREATE INDEX "Product_organizationId_name_idx" ON "Product"("organizationId","name");
CREATE INDEX "Product_organizationId_type_active_idx" ON "Product"("organizationId","type","active");
CREATE INDEX "QuoteItem_productId_idx" ON "QuoteItem"("productId");
CREATE INDEX "InvoiceItem_productId_idx" ON "InvoiceItem"("productId");
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
