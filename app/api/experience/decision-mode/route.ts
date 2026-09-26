import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const maxDuration = 60;

const EvidenceSchema = z.object({
  statement: z.string(),
  evidenceType: z.enum(['FACT', 'USER_PREFERENCE', 'INFERENCE', 'UNKNOWN']),
  source: z.string().optional()
});

const DecisionResponseSchema = z.object({
  shortlistSummary: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    price: z.number().nullable(),
    whatFits: z.array(EvidenceSchema),
    tradeOffs: z.array(EvidenceSchema),
    unknowns: z.array(EvidenceSchema)
  })),
  whatToConsider: z.array(EvidenceSchema)
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const body = await req.json();
    const { boardId, itemIds, priorities, question } = body;

    if (!boardId || !Array.isArray(itemIds) || itemIds.length < 2) {
      return NextResponse.json({ error: 'Invalid input. At least 2 items required.' }, { status: 400 });
    }

    // 1. Authorize Board Ownership
    const board = await prisma.designBoard.findUnique({
      where: { id: boardId },
      include: { items: { include: { product: { include: { specifications: true } } } } }
    });

    if (!board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    if (board.userId !== dbUser.id) {
      return NextResponse.json({ error: 'Unauthorized board access' }, { status: 403 });
    }

    // 2. Validate Items
    const selectedItems = board.items.filter(item => itemIds.includes(item.id));
    if (selectedItems.length !== itemIds.length) {
      return NextResponse.json({ error: 'Invalid item IDs or items not part of this board' }, { status: 400 });
    }

    // Get the most recent spatial session for this user for Room DNA context
    const session = await prisma.spatialSession.findFirst({
      where: { userId: dbUser.id, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: { visualizations: true }
    });

    // 3. Deterministic Calculations & Context Building
    const budget = priorities?.budget ? parseFloat(priorities.budget) : null;

    const productContexts = selectedItems.map(item => {
      const product = item.product;
      const isPriceConflict = product.priceStatus === 'CONFLICT';
      const price = isPriceConflict ? null : (item.approvedPrice ? Number(item.approvedPrice) : Number(product.basePrice));
      
      const budgetStatus = budget && price !== null
        ? (price <= budget ? 'WITHIN_BUDGET' : 'OVER_BUDGET')
        : 'UNKNOWN_BUDGET';

      const priceDiffToBudget = budget && price !== null ? budget - price : null;

      // Extract footprint dimensions if available (assumes WxDxH or similar in product.dimensions)
      const dims = product.dimensions || 'Unknown';
      
      // Look for a visualization (Reality Check) for this product in the user's latest session
      const realityCheck = session?.visualizations.find(v => v.productId === product.id);

      return {
        id: product.id,
        name: product.name,
        priceStatus: product.priceStatus,
        price: price,
        budgetStatus,
        priceDiffToBudget,
        dimensions: dims,
        specifications: product.specifications.map(s => `${s.key}: ${s.value}`),
        approvalStatus: item.status, // FACT: Customer previously approved/rejected
        realityCheck: realityCheck ? {
          fitLevel: realityCheck.fitLevel,
          scaleLevel: realityCheck.scaleLevel,
          styleLevel: realityCheck.styleLevel,
          reasons: {
            fit: realityCheck.fitReason,
            scale: realityCheck.scaleReason,
            style: realityCheck.styleReason
          }
        } : null
      };
    });

    // Sort by price for deterministic diffs
    const pricedItems = productContexts.filter(p => p.price !== null).sort((a, b) => (a.price as number) - (b.price as number));
    let priceComparisons = '';
    if (pricedItems.length >= 2) {
      priceComparisons = `Deterministic Price Math: 
      - Cheapest is ${pricedItems[0].name} (${pricedItems[0].price}). 
      - Most expensive is ${pricedItems[pricedItems.length - 1].name} (${pricedItems[pricedItems.length - 1].price}).
      - Difference between them is ${Number(pricedItems[pricedItems.length - 1].price) - Number(pricedItems[0].price)}.`;
    }

    const roomContext = session ? {
      roomType: session.roomType,
      palette: session.palette,
      materials: session.materials,
      notes: session.spatialNotes
    } : null;

    const promptContext = `
      You are the Zen Arch Decision Assistant. Your goal is to help the customer understand trade-offs between shortlisted products.
      DO NOT rank products. DO NOT declare a winner. DO NOT guess unsupported attributes like comfort, durability, or quality.
      
      If user asks about an unsupported attribute, categorize it as UNKNOWN with statement "That information isn't available in the current catalogue."
      
      User Priorities: ${JSON.stringify(priorities || 'None stated')}
      Room Context (Room DNA): ${JSON.stringify(roomContext || 'None available')}
      
      Selected Products Deterministic Context:
      ${JSON.stringify(productContexts, null, 2)}
      
      ${priceComparisons}
      
      User Question / Intent: ${question || 'Compare these options and outline trade-offs.'}
      
      Instructions:
      1. Use ONLY the data provided above.
      2. For each product, list "whatFits" (why it aligns with priorities, room, or budget), "tradeOffs" (constraints like size, over budget), and "unknowns" (missing data).
      3. Classify EVERY statement strictly as FACT (from database), USER_PREFERENCE (from priorities), INFERENCE (from room vision), or UNKNOWN.
      4. "APPROVED" status means "Customer previously approved this item on the board", NOT "AI considers it superior".
    `;

    // 4. LLM Call
    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: DecisionResponseSchema,
      prompt: promptContext,
      temperature: 0.1, // Keep it highly deterministic
    });

    return NextResponse.json(result.object);

  } catch (error: any) {
    console.error('Decision Mode Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
