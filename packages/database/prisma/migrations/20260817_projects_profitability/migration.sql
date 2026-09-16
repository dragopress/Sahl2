ALTER TABLE "Quote" ADD COLUMN "projectId" TEXT;
CREATE INDEX "Quote_organizationId_projectId_idx" ON "Quote"("organizationId", "projectId");
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Invoice" ADD COLUMN "projectId" TEXT;
CREATE INDEX "Invoice_organizationId_projectId_idx" ON "Invoice"("organizationId", "projectId");
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
