-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN     "clientProjectId" TEXT,
ADD COLUMN     "designBoardId" TEXT,
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "leadId" TEXT,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "quoteRequestId" TEXT,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "template" TEXT;

-- CreateTable
CREATE TABLE "EmailSuppression" (
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailSuppression_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailLog_idempotencyKey_key" ON "EmailLog"("idempotencyKey");

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_clientProjectId_fkey" FOREIGN KEY ("clientProjectId") REFERENCES "ClientProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_designBoardId_fkey" FOREIGN KEY ("designBoardId") REFERENCES "DesignBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
