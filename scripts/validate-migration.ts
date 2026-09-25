// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`\n==================================================`);
  console.log(`ZEN ARCH - DATABASE VALIDATION`);
  console.log(`==================================================\n`);

  // 1. Duplicate products
  const products = await prisma.product.groupBy({
    by: ['slug'],
    _count: { slug: true },
    having: { slug: { _count: { gt: 1 } } }
  });
  console.log(`Duplicate product slugs: ${products.length}`);

  // 2. Orphan variants
  const orphanVariants = await prisma.productVariant.count({
    where: { product: null }
  });
  console.log(`Orphan variants: ${orphanVariants}`);

  // 3. Orphan images
  const orphanImages = await prisma.productImage.count({
    where: { product: null }
  });
  console.log(`Orphan images: ${orphanImages}`);

  // 4. Orphan inventory
  const orphanInventory = await prisma.inventoryItem.count({
    where: { product: null }
  });
  console.log(`Orphan inventory records: ${orphanInventory}`);

  // 5. Public product category/collection check
  const missingCatCol = await prisma.product.count({
    where: {
      status: 'PUBLISHED',
      OR: [
        { categoryId: null },
        { collectionId: null }
      ]
    }
  });
  console.log(`Published products missing category/collection: ${missingCatCol}`);

  // 6. Needs review check (ensure no NEEDS_REVIEW status in database)
  // Actually, priceStatus = VERIFIED, CONFLICT, NOT_PROVIDED, PRICE_ON_REQUEST
  // We can just verify total products
  const totalProducts = await prisma.product.count();
  console.log(`Total Products in DB: ${totalProducts}`);
  
  const conflictPrices = await prisma.product.count({
    where: { priceStatus: 'CONFLICT' }
  });
  console.log(`Products retaining CONFLICT price status: ${conflictPrices}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
