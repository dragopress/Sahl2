ALTER TYPE "JournalSourceType" ADD VALUE IF NOT EXISTS 'SUPPLIER_BILL';
ALTER TYPE "JournalSourceType" ADD VALUE IF NOT EXISTS 'SUPPLIER_PAYMENT';
ALTER TYPE "JournalSourceType" ADD VALUE IF NOT EXISTS 'VAT_SETTLEMENT';
INSERT INTO "Account" ("id","organizationId","code","name","type","active","createdAt","updatedAt")
SELECT md5(random()::text || clock_timestamp()::text), o."id", '401000', 'Fournisseurs', 'LIABILITY', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "Organization" o
WHERE NOT EXISTS (SELECT 1 FROM "Account" a WHERE a."organizationId"=o."id" AND a."code"='401000');
CREATE TABLE "Supplier" ("id" TEXT NOT NULL,"organizationId" TEXT NOT NULL,"name" TEXT NOT NULL,"ice" TEXT,"ifNumber" TEXT,"rc" TEXT,"phone" TEXT,"email" TEXT,"address" TEXT,"paymentTermsDays" INTEGER NOT NULL DEFAULT 30,"active" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SupplierBill" ("id" TEXT NOT NULL,"organizationId" TEXT NOT NULL,"supplierId" TEXT NOT NULL,"number" TEXT NOT NULL,"externalNumber" TEXT,"status" TEXT NOT NULL DEFAULT 'OPEN',"subtotal" DECIMAL(14,2) NOT NULL,"tax" DECIMAL(14,2) NOT NULL DEFAULT 0,"total" DECIMAL(14,2) NOT NULL,"dueAt" TIMESTAMP(3),"issuedAt" TIMESTAMP(3),"notes" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "SupplierBill_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SupplierPayment" ("id" TEXT NOT NULL,"organizationId" TEXT NOT NULL,"supplierBillId" TEXT NOT NULL,"supplierId" TEXT NOT NULL,"cashAccountId" TEXT NOT NULL,"amount" DECIMAL(14,2) NOT NULL,"paidAt" TIMESTAMP(3) NOT NULL,"method" TEXT,"reference" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "SupplierPayment_pkey" PRIMARY KEY ("id"));
CREATE TABLE "BankStatementLine" ("id" TEXT NOT NULL,"organizationId" TEXT NOT NULL,"cashAccountId" TEXT NOT NULL,"externalId" TEXT,"transactionDate" TIMESTAMP(3) NOT NULL,"description" TEXT,"reference" TEXT,"amount" DECIMAL(14,2) NOT NULL,"direction" TEXT NOT NULL DEFAULT 'CREDIT',"status" TEXT NOT NULL DEFAULT 'UNMATCHED',"matchedCashTransactionId" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "BankStatementLine_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Supplier_organizationId_name_key" ON "Supplier"("organizationId","name");
CREATE INDEX "Supplier_organizationId_name_idx" ON "Supplier"("organizationId","name");
CREATE UNIQUE INDEX "SupplierBill_organizationId_number_key" ON "SupplierBill"("organizationId","number");
CREATE INDEX "SupplierBill_organizationId_status_dueAt_idx" ON "SupplierBill"("organizationId","status","dueAt");
CREATE INDEX "SupplierBill_supplierId_issuedAt_idx" ON "SupplierBill"("supplierId","issuedAt");
CREATE INDEX "SupplierPayment_organizationId_paidAt_idx" ON "SupplierPayment"("organizationId","paidAt");
CREATE INDEX "SupplierPayment_supplierBillId_idx" ON "SupplierPayment"("supplierBillId");
CREATE UNIQUE INDEX "BankStatementLine_organizationId_cashAccountId_externalId_key" ON "BankStatementLine"("organizationId","cashAccountId","externalId");
CREATE INDEX "BankStatementLine_organizationId_cashAccountId_transactionDate_idx" ON "BankStatementLine"("organizationId","cashAccountId","transactionDate");
CREATE INDEX "BankStatementLine_organizationId_status_idx" ON "BankStatementLine"("organizationId","status");
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupplierBill" ADD CONSTRAINT "SupplierBill_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON UPDATE CASCADE;
ALTER TABLE "SupplierBill" ADD CONSTRAINT "SupplierBill_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON UPDATE CASCADE;
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_supplierBillId_fkey" FOREIGN KEY ("supplierBillId") REFERENCES "SupplierBill"("id") ON UPDATE CASCADE;
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_cashAccountId_fkey" FOREIGN KEY ("cashAccountId") REFERENCES "CashAccount"("id") ON UPDATE CASCADE;
ALTER TABLE "BankStatementLine" ADD CONSTRAINT "BankStatementLine_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BankStatementLine" ADD CONSTRAINT "BankStatementLine_cashAccountId_fkey" FOREIGN KEY ("cashAccountId") REFERENCES "CashAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
