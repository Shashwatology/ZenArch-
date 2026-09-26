-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "asset3dUrl" TEXT,
ADD COLUMN     "assetArUrl" TEXT,
ADD COLUMN     "canonical" TEXT,
ADD COLUMN     "has3dModel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasArModel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "canonical" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "canonical" TEXT,
ADD COLUMN     "ctaLink" TEXT,
ADD COLUMN     "ctaText" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;
