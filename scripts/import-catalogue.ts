import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  console.log(`\n==================================================`);
  console.log(`ZEN ARCH - CATALOGUE MIGRATION`);
  console.log(`MODE: ${isDryRun ? 'DRY RUN' : 'EXECUTION'}`);
  console.log(`==================================================\n`);

  // 1. PRE-FLIGHT
  const dbPath = path.join(process.cwd(), 'lib/data/furniture_db.json');
  if (!fs.existsSync(dbPath)) {
    console.error(`ERROR: Could not find ${dbPath}`);
    process.exit(1);
  }

  let db: any[];
  try {
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    db = JSON.parse(fileContent);
  } catch (error) {
    console.error('ERROR: Failed to parse JSON:', error);
    process.exit(1);
  }

  const totalRecords = db.length;
  
  // Exclude NEEDS_REVIEW and specific artifacts
  const needsReviewArtifacts = ['AVAILABLE IN :', 'COLOUR :', 'DOUBLE MOTOR', 'MY CHAIR MY PRIDE', '750 Ø X 750 h'];
  
  const toImport = db.filter(p => {
    if (p.priceStatus === 'NEEDS_REVIEW') return false;
    
    const pStr = JSON.stringify(p).toUpperCase();
    for (const artifact of needsReviewArtifacts) {
      if (pStr.includes(artifact.toUpperCase())) {
        return false;
      }
    }
    return true;
  });

  const needsReviewCount = totalRecords - toImport.length;
  
  console.log(`Total Source Records: ${totalRecords}`);
  console.log(`Verified Records: ${toImport.length}`);
  console.log(`NEEDS_REVIEW Records Excluded: ${needsReviewCount}`);

  if (toImport.length !== 330) {
    console.warn(`\nWARNING: Expected exactly 330 verified products, but found ${toImport.length}.`);
  }

  // Detect duplicates
  const ids = new Set();
  const slugs = new Set();
  let hasDuplicates = false;

  for (const p of toImport) {
    if (ids.has(p.id)) {
      console.error(`ERROR: Duplicate Product ID detected: ${p.id}`);
      hasDuplicates = true;
    }
    if (slugs.has(p.slug)) {
      console.error(`ERROR: Duplicate Slug detected: ${p.slug}`);
      hasDuplicates = true;
    }
    ids.add(p.id);
    slugs.add(p.slug);
  }

  if (hasDuplicates) {
    console.error('Migration aborted due to duplicate identities in source JSON.');
    process.exit(1);
  }

  // Extract Collections & Categories
  const collectionsMap = new Map();
  const categoriesMap = new Map();
  
  for (const p of toImport) {
    if (p.collection) {
      const slug = p.collection.toLowerCase().replace(/\s+/g, '-');
      collectionsMap.set(slug, p.collection);
    }
    if (p.category) {
      const slug = p.category.toLowerCase().replace(/\s+/g, '-');
      categoriesMap.set(slug, p.category);
    }
  }

  let collectionsImported = 0;
  let categoriesImported = 0;
  let productsImported = 0;
  let variantsImported = 0;
  let imagesImported = 0;
  let inventoryCreated = 0;

  if (isDryRun) {
    console.log(`\n--- DRY RUN RESULTS ---`);
    console.log(`Collections to import: ${collectionsMap.size}`);
    console.log(`Categories to import: ${categoriesMap.size}`);
    console.log(`Products to import: ${toImport.length}`);
    
    let totalVariants = 0;
    let totalImages = 0;
    for (const p of toImport) {
      totalVariants += p.variants?.length || 0;
      totalImages += p.images?.length || 0;
    }
    console.log(`Variants to import: ${totalVariants}`);
    console.log(`Images to import: ${totalImages}`);
    
    // Inventory = base product + variants
    const totalInventory = toImport.length + totalVariants;
    console.log(`Inventory records to create (QTY 0): ${totalInventory}`);
    console.log(`\nDry run successful. Run without --dry-run to execute migration.`);
    return;
  }

  // EXECUTION MODE
  try {
    // 1. Collections
    for (const [slug, name] of collectionsMap.entries()) {
      await prisma.collection.upsert({
        where: { slug },
        update: { name },
        create: { slug, name }
      });
      collectionsImported++;
    }

    // 2. Categories
    for (const [slug, name] of categoriesMap.entries()) {
      await prisma.category.upsert({
        where: { slug },
        update: { name },
        create: { slug, name }
      });
      categoriesImported++;
    }

    // 3. Products
    for (const p of toImport) {
      await prisma.$transaction(async (tx) => {
        let collectionId = null;
        let categoryId = null;

        if (p.collection) {
          const colSlug = p.collection.toLowerCase().replace(/\s+/g, '-');
          const col = await tx.collection.findUnique({ where: { slug: colSlug } });
          if (col) collectionId = col.id;
        }

        if (p.category) {
          const catSlug = p.category.toLowerCase().replace(/\s+/g, '-');
          const cat = await tx.category.findUnique({ where: { slug: catSlug } });
          if (cat) categoryId = cat.id;
        }

        const priceStatus = p.priceStatus === 'NOT_PROVIDED' ? 'NOT_PROVIDED' : 
                            p.priceStatus === 'CONFLICT' ? 'CONFLICT' : 'VERIFIED';
        
        const basePrice = typeof p.basePrice === 'number' ? p.basePrice : null;

        // Create/Update Product
        const product = await tx.product.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            slug: p.slug,
            basePrice,
            priceStatus,
            collectionId,
            categoryId,
            dimensions: typeof p.dimensions === 'string' ? p.dimensions : null,
            status: 'PUBLISHED'
          },
          create: {
            id: p.id,
            name: p.name,
            slug: p.slug,
            basePrice,
            priceStatus,
            collectionId,
            categoryId,
            dimensions: typeof p.dimensions === 'string' ? p.dimensions : null,
            status: 'PUBLISHED'
          }
        });
        productsImported++;

        // Base Inventory (Product Level)
        const baseInventory = await tx.inventoryItem.findFirst({
          where: { productId: product.id, variantId: null }
        });
        if (!baseInventory) {
          await tx.inventoryItem.create({
            data: {
              productId: product.id,
              quantity: 0 // Explicitly NOT inventing stock
            }
          });
          inventoryCreated++;
        }

        // Variants
        if (p.variants && p.variants.length > 0) {
          // Clear existing variants to avoid orphans on re-run (idempotency)
          await tx.productVariant.deleteMany({ where: { productId: product.id } });
          
          for (const v of p.variants) {
            const variant = await tx.productVariant.create({
              data: {
                productId: product.id,
                name: v.name,
                priceInr: typeof v.priceInr === 'number' ? v.priceInr : null
              }
            });
            variantsImported++;

            // Variant Inventory
            await tx.inventoryItem.create({
              data: {
                productId: product.id,
                variantId: variant.id,
                quantity: 0
              }
            });
            inventoryCreated++;
          }
        }

        // Images
        if (p.images && p.images.length > 0) {
          await tx.productImage.deleteMany({ where: { productId: product.id } });
          
          for (let i = 0; i < p.images.length; i++) {
            await tx.productImage.create({
              data: {
                productId: product.id,
                url: p.images[i],
                isCover: i === 0,
                order: i
              }
            });
            imagesImported++;
          }
        }
      });
    }

    console.log(`\n--- EXECUTION RESULTS ---`);
    console.log(`Collections Imported: ${collectionsImported}`);
    console.log(`Categories Imported: ${categoriesImported}`);
    console.log(`Products Imported: ${productsImported}`);
    console.log(`Variants Imported: ${variantsImported}`);
    console.log(`Images Imported: ${imagesImported}`);
    console.log(`Inventory Records Created (QTY 0): ${inventoryCreated}`);
    
    console.log(`\nMigration completed successfully.`);
  } catch (error) {
    console.error(`\nERROR during transaction:`, error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
