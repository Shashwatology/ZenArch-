-- CreateEnum
CREATE TYPE "AssessmentLevel" AS ENUM ('GOOD', 'CAUTION', 'NOT_SUPPORTED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('OWNER', 'CLIENT', 'DESIGNER', 'STAFF');

-- CreateEnum
CREATE TYPE "DocumentVisibility" AS ENUM ('CUSTOMER', 'INTERNAL');

-- AlterEnum
ALTER TYPE "ChangeRequestStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "ClientProject" DROP CONSTRAINT "ClientProject_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ClientProject" DROP CONSTRAINT "ClientProject_quoteId_fkey";

-- DropIndex
DROP INDEX "ClientProject_orderId_key";

-- DropIndex
DROP INDEX "ClientProject_quoteId_key";

-- AlterTable
ALTER TABLE "BoardComment" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "editedAt" TIMESTAMP(3),
ADD COLUMN     "isInternal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ChangeRequest" ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "customerNote" TEXT,
ADD COLUMN     "internalNote" TEXT,
ADD COLUMN     "priceAtRequest" DECIMAL(65,30),
ADD COLUMN     "priceAtResolution" DECIMAL(65,30),
ADD COLUMN     "resolvedByUserId" TEXT,
ADD COLUMN     "timelineAtRequest" INTEGER,
ADD COLUMN     "timelineAtResolution" INTEGER,
ALTER COLUMN "priceDelta" DROP NOT NULL,
ALTER COLUMN "priceDelta" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "timelineDelta" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ClientProject" DROP COLUMN "orderId",
DROP COLUMN "quoteId",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "DesignBoard" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "shareExpiresAt" TIMESTAMP(3),
ADD COLUMN     "shareRevokedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "DesignBoardItem" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedPrice" DECIMAL(65,30),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "removedAt" TIMESTAMP(3),
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "clientProjectId" TEXT,
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "priceAtTime" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "basePrice" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "priceInr" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "ProjectDocument" DROP COLUMN "fileUrl",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "storagePath" TEXT NOT NULL,
ADD COLUMN     "uploadedByUserId" TEXT,
ADD COLUMN     "visibility" "DocumentVisibility" NOT NULL DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE "ProjectMilestone" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completedByUserId" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuoteItem" ALTER COLUMN "priceAtTime" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN     "clientProjectId" TEXT,
ALTER COLUMN "budget" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "SpatialSession" ADD COLUMN     "analysisVersion" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "lastActiveAt" TIMESTAMP(3),
ADD COLUMN     "rawAnalysisJson" JSONB,
ADD COLUMN     "sessionToken" TEXT;

-- AlterTable
ALTER TABLE "Visualization" DROP COLUMN "fitScore",
DROP COLUMN "originalImageUrl",
DROP COLUMN "resultImageUrl",
DROP COLUMN "scaleScore",
DROP COLUMN "styleScore",
ADD COLUMN     "assessmentConfidence" INTEGER,
ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "fitLevel" "AssessmentLevel",
ADD COLUMN     "fitReason" TEXT,
ADD COLUMN     "generationModel" TEXT,
ADD COLUMN     "generationProvider" TEXT,
ADD COLUMN     "originalImageExpiresAt" TIMESTAMP(3),
ADD COLUMN     "originalImagePath" TEXT,
ADD COLUMN     "promptVersion" TEXT,
ADD COLUMN     "resultImageExpiresAt" TIMESTAMP(3),
ADD COLUMN     "resultImagePath" TEXT,
ADD COLUMN     "scaleLevel" "AssessmentLevel",
ADD COLUMN     "scaleReason" TEXT,
ADD COLUMN     "styleLevel" "AssessmentLevel",
ADD COLUMN     "styleReason" TEXT;

-- CreateTable
CREATE TABLE "ClientProjectMember" (
    "id" TEXT NOT NULL,
    "clientProjectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientProjectMember_clientProjectId_idx" ON "ClientProjectMember"("clientProjectId");

-- CreateIndex
CREATE INDEX "ClientProjectMember_userId_idx" ON "ClientProjectMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProjectMember_clientProjectId_userId_key" ON "ClientProjectMember"("clientProjectId", "userId");

-- CreateIndex
CREATE INDEX "BoardComment_boardId_idx" ON "BoardComment"("boardId");

-- CreateIndex
CREATE INDEX "BoardComment_userId_idx" ON "BoardComment"("userId");

-- CreateIndex
CREATE INDEX "ChangeRequest_clientProjectId_idx" ON "ChangeRequest"("clientProjectId");

-- CreateIndex
CREATE INDEX "ChangeRequest_status_idx" ON "ChangeRequest"("status");

-- CreateIndex
CREATE INDEX "ClientProject_userId_idx" ON "ClientProject"("userId");

-- CreateIndex
CREATE INDEX "ClientProject_phase_idx" ON "ClientProject"("phase");

-- CreateIndex
CREATE INDEX "ClientProject_status_idx" ON "ClientProject"("status");

-- CreateIndex
CREATE INDEX "DesignBoard_userId_idx" ON "DesignBoard"("userId");

-- CreateIndex
CREATE INDEX "DesignBoard_shareToken_idx" ON "DesignBoard"("shareToken");

-- CreateIndex
CREATE INDEX "DesignBoardItem_boardId_idx" ON "DesignBoardItem"("boardId");

-- CreateIndex
CREATE INDEX "DesignBoardItem_productId_idx" ON "DesignBoardItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignBoardItem_boardId_productId_variantId_key" ON "DesignBoardItem"("boardId", "productId", "variantId");

-- CreateIndex
CREATE INDEX "ProjectDocument_clientProjectId_idx" ON "ProjectDocument"("clientProjectId");

-- CreateIndex
CREATE INDEX "ProjectMilestone_clientProjectId_idx" ON "ProjectMilestone"("clientProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "SpatialSession_sessionToken_key" ON "SpatialSession"("sessionToken");

-- CreateIndex
CREATE INDEX "SpatialSession_userId_idx" ON "SpatialSession"("userId");

-- CreateIndex
CREATE INDEX "SpatialSession_expiresAt_idx" ON "SpatialSession"("expiresAt");

-- CreateIndex
CREATE INDEX "Visualization_sessionId_idx" ON "Visualization"("sessionId");

-- CreateIndex
CREATE INDEX "Visualization_productId_idx" ON "Visualization"("productId");

-- AddForeignKey
ALTER TABLE "QuoteRequest" ADD CONSTRAINT "QuoteRequest_clientProjectId_fkey" FOREIGN KEY ("clientProjectId") REFERENCES "ClientProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientProjectId_fkey" FOREIGN KEY ("clientProjectId") REFERENCES "ClientProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProjectMember" ADD CONSTRAINT "ClientProjectMember_clientProjectId_fkey" FOREIGN KEY ("clientProjectId") REFERENCES "ClientProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProjectMember" ADD CONSTRAINT "ClientProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

