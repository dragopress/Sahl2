CREATE TABLE "AiInsight" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT,
  "type" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "source" TEXT NOT NULL DEFAULT 'rules',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dismissedAt" TIMESTAMP(3),
  CONSTRAINT "AiInsight_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AiInsight_organizationId_createdAt_idx" ON "AiInsight"("organizationId","createdAt");
CREATE INDEX "AiInsight_organizationId_dismissedAt_idx" ON "AiInsight"("organizationId","dismissedAt");
CREATE INDEX "AiInsight_organizationId_type_createdAt_idx" ON "AiInsight"("organizationId","type","createdAt");
ALTER TABLE "AiInsight" ADD CONSTRAINT "AiInsight_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiInsight" ADD CONSTRAINT "AiInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
