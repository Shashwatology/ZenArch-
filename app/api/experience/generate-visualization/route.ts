import { NextResponse } from 'next/server';
import { GeminiImageGenerationProvider } from '@/lib/vision/generation-provider';
import prisma from '@/lib/prisma';
import { uploadExperienceImage } from '@/lib/experience/storage';

export async function POST(req: Request) {
  try {
    const { visualizationId, imageBase64 } = await req.json();

    if (!visualizationId || !imageBase64) {
      return NextResponse.json({ error: "Missing visualization request data" }, { status: 400 });
    }

    const visualization = await prisma.visualization.findUnique({
      where: { id: visualizationId },
      include: {
        session: true,
        product: {
          include: { images: { orderBy: { order: 'asc' } } }
        }
      }
    });

    if (!visualization || !visualization.session || !visualization.product) {
      return NextResponse.json({ error: "Invalid visualization record" }, { status: 400 });
    }

    const product = visualization.product;
    const analysis = visualization.session.rawAnalysisJson as any;
    const productReferenceUrl = product.images[0]?.url;

    if (!productReferenceUrl) {
      return NextResponse.json({ error: "Product missing reference image" }, { status: 400 });
    }

    const request = {
      roomImageBase64: imageBase64,
      productId: product.id,
      productName: product.name,
      productDimensions: product.dimensions || undefined,
    };

    const generationProvider = new GeminiImageGenerationProvider();
    const result = await generationProvider.generateVisualization(request, analysis, productReferenceUrl);

    if (result.success && result.imageUrl) {
      // result.imageUrl is a data URI with base64
      let uploadedPath = "";
      try {
        uploadedPath = await uploadExperienceImage(result.imageUrl, 'image/jpeg', 'results');
      } catch (e) {
        console.error("Failed to upload generated result to storage:", e);
      }

      const resultImageExpiresAt = new Date();
      resultImageExpiresAt.setDate(resultImageExpiresAt.getDate() + 7);

      await prisma.visualization.update({
        where: { id: visualizationId },
        data: {
          resultImagePath: uploadedPath,
          resultImageExpiresAt,
          generationModel: 'gemini-3.1-flash-image'
        }
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate visualization" }, { status: 500 });
  }
}
