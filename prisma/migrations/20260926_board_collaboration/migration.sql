-- CreateEnum
CREATE TYPE "BoardRole" AS ENUM ('OWNER', 'COLLABORATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "CollaboratorStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "BoardComment" ADD COLUMN     "boardItemId" TEXT;

-- CreateTable
CREATE TABLE "BoardCollaborator" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "role" "BoardRole" NOT NULL DEFAULT 'VIEWER',
    "status" "CollaboratorStatus" NOT NULL DEFAULT 'PENDING',
    "inviteToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "BoardCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardCollaborator_inviteToken_key" ON "BoardCollaborator"("inviteToken");

-- CreateIndex
CREATE INDEX "BoardCollaborator_boardId_idx" ON "BoardCollaborator"("boardId");

-- CreateIndex
CREATE INDEX "BoardCollaborator_inviteToken_idx" ON "BoardCollaborator"("inviteToken");

-- CreateIndex
CREATE UNIQUE INDEX "BoardCollaborator_boardId_email_key" ON "BoardCollaborator"("boardId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "BoardCollaborator_boardId_userId_key" ON "BoardCollaborator"("boardId", "userId");

-- CreateIndex
CREATE INDEX "BoardComment_boardItemId_idx" ON "BoardComment"("boardItemId");

-- AddForeignKey
ALTER TABLE "BoardComment" ADD CONSTRAINT "BoardComment_boardItemId_fkey" FOREIGN KEY ("boardItemId") REFERENCES "DesignBoardItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardCollaborator" ADD CONSTRAINT "BoardCollaborator_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "DesignBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardCollaborator" ADD CONSTRAINT "BoardCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

