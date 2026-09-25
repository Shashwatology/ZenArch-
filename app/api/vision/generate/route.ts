import { NextResponse } from 'next/server';
import { GeminiImageGenerationProvider } from '@/lib/vision/generation-provider';

export async function POST(req: Request) {
  try {
    const { request, analysis, productReferenceUrl } = await req.json();

    if (!request || !analysis) {
      return NextResponse.json({ error: "Missing visualization request data" }, { status: 400 });
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
