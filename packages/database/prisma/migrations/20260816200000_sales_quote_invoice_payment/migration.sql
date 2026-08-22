-- Sales vertical slice: quote/invoice line items and tenant-safe numbering.
CREATE TYPE "NumberSequenceType" AS ENUM ('QUOTE', 'INVOICE');

ALTER TABLE "Quote" ADD COLUMN "discount" DECIMAL(14,2) NOT NULL DEFAULT 0;
ALTER TABLE "Quote" ADD COLUMN "notes" TEXT;
ALTER TABLE "Quote" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Invoice" ADD COLUMN "discount" DECIMAL(14,2) NOT NULL DEFAULT 0;
ALTER TABLE "Invoice" ADD COLUMN "notes" TEXT;

CREATE TABLE "QuoteItem" (
  "id" TEXT NOT NULL,
  "quoteId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "unitPrice" DECIMAL(14,2) NOT NULL,
  "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 20,
  "lineSubtotal" DECIMAL(14,2) NOT NULL,
  "lineTax" DECIMAL(14,2) NOT NULL,
  "lineTotal" DECIMAL(14,2) NOT NULL,
  CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "QuoteItem_quoteId_idx" ON "QuoteItem"("quoteId");
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "InvoiceItem" (
  "id" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "unitPrice" DECIMAL(14,2) NOT NULL,
  "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 20,
  "lineSubtotal" DECIMAL(14,2) NOT NULL,
  "lineTax" DECIMAL(14,2) NOT NULL,
  "lineTotal" DECIMAL(14,2) NOT NULL,
  CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "NumberSequence" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "type" "NumberSequenceType" NOT NULL,
  "year" INTEGER NOT NULL,
  "nextValue" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "NumberSequence_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "NumberSequence_organizationId_type_year_key" ON "NumberSequence"("organizationId", "type", "year");
ALTER TABLE "NumberSequence" ADD CONSTRAINT "NumberSequence_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
