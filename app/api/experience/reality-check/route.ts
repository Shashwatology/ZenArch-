import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateRealityCheck } from '@/lib/experience/reality-check';

export async function POST(req: Request) {
  try {
    const { sessionId, productId, imageBase64, mimeType, storagePath } = await req.json();

    if (!sessionId || !productId || !imageBase64) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch Session and Product
    const session = await prisma.spatialSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 2. Run Reality Check
    const result = await generateRealityCheck(imageBase64, mimeType || 'image/jpeg', session.rawAnalysisJson, product);

    // 3. Persist to Visualization
    const originalImageExpiresAt = new Date();
    originalImageExpiresAt.setDate(originalImageExpiresAt.getDate() + 7);

    const visualization = await prisma.visualization.create({
      data: {
        sessionId,
        productId,
        originalImagePath: storagePath,
        originalImageExpiresAt,
        fitLevel: result.fitLevel,
        fitReason: result.fitReason,
        scaleLevel: result.scaleLevel,
        scaleReason: result.scaleReason,
        styleLevel: result.styleLevel,
        styleReason: result.styleReason,
        assessmentConfidence: result.assessmentConfidence,
        generationProvider: 'Gemini 3.8 Flash',
      }
    });

    return NextResponse.json({
      realityCheck: result,
      visualizationId: visualization.id
    });
  } catch (error: any) {
    console.error("Reality Check Error:", error);
    return NextResponse.json({ error: error.message || "Failed to run reality check" }, { status: 500 });
  }
}
