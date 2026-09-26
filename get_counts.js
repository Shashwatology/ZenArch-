const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  console.log('User:', await prisma.user.count());
  console.log('Product:', await prisma.product.count());
  console.log('ProductVariant:', await prisma.productVariant.count());
  console.log('ProductImage:', await prisma.productImage.count());
  console.log('InventoryItem:', await prisma.inventoryItem.count());
  console.log('InventoryMovement:', await prisma.inventoryMovement.count());
  console.log('QuoteRequest:', await prisma.quoteRequest.count());
  console.log('CustomerProfile:', await prisma.customerProfile.count());
  console.log('Order:', await prisma.order.count());
  console.log('OrderItem:', await prisma.orderItem.count());
  console.log('AuditLog:', await prisma.auditLog.count());
  console.log('Project:', await prisma.project.count());
}
run()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
