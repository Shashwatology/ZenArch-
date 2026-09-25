import { NextResponse } from 'next/server';
import { GeminiImageGenerationProvider } from '@/lib/vision/generation-provider';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { request, analysis } = await req.json();

    if (!request || !request.productId || !analysis) {
      return NextResponse.json({ error: "Missing visualization request data" }, { status: 400 });
    }

    // Resolve product server-side to prevent fake products
    const product = await prisma.product.findUnique({
      where: { id: request.productId },
      include: { images: { orderBy: { order: 'asc' } } }
    });

    if (!product) {
      return NextResponse.json({ error: "Invalid product selected" }, { status: 400 });
    }

    // Merge validated product data into the request
    request.productName = product.name;
    request.productDimensions = product.dimensions;
    const productReferenceUrl = product.images[0]?.url;

    if (!productReferenceUrl) {
      return NextResponse.json({ error: "Product missing reference image" }, { status: 400 });
    }

    // In a real production system, rate limiting goes here
    
    // Abstracted Provider Pattern
    const generationProvider = new GeminiImageGenerationProvider();
    
    const result = await generationProvider.generateVisualization(request, analysis, productReferenceUrl);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Image Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate visualization" }, { status: 500 });
  }
}
