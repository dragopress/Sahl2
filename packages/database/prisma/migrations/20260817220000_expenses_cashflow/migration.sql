CREATE TYPE "ExpenseStatus" AS ENUM ('SUBMITTED','APPROVED','REJECTED','PAID');
CREATE TYPE "ExpensePaymentMethod" AS ENUM ('CASH','BANK','CARD','MOBILE_WALLET','OTHER');
ALTER TABLE "Expense"
  ADD COLUMN "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN "taxAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN "netAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN "supplierId" TEXT,
  ADD COLUMN "employeeId" TEXT,
  ADD COLUMN "projectId" TEXT,
  ADD COLUMN "attachmentUrl" TEXT,
  ADD COLUMN "paymentMethod" "ExpensePaymentMethod",
  ADD COLUMN "status" "ExpenseStatus" NOT NULL DEFAULT 'SUBMITTED',
  ADD COLUMN "approvedAt" TIMESTAMP(3),
  ADD COLUMN "approvedById" TEXT,
  ADD COLUMN "paidAt" TIMESTAMP(3),
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "Expense_organizationId_status_incurredAt_idx" ON "Expense"("organizationId","status","incurredAt");
CREATE INDEX "Expense_organizationId_projectId_idx" ON "Expense"("organizationId","projectId");
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
UPDATE "Expense" SET "netAmount"="amount" WHERE "netAmount"=0;
