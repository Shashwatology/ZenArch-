import { NextResponse } from 'next/server';
import { GeminiVisionProvider } from '@/lib/vision/vision-provider';

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    // In a real production system, rate limiting goes here
    
    const visionProvider = new GeminiVisionProvider();
    
    const analysis = await visionProvider.analyzeRoom(imageBase64, mimeType);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Room Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze room" }, { status: 500 });
  }
}
