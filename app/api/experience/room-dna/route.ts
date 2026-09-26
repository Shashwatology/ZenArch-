import { NextResponse } from 'next/server';
import { GeminiVisionProvider } from '@/lib/vision/vision-provider';
import { uploadExperienceImage } from '@/lib/experience/storage';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType, userId, existingSessionToken } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    // 1. Analyze the room
    const visionProvider = new GeminiVisionProvider();
    const analysis = await visionProvider.analyzeRoom(imageBase64, mimeType || 'image/jpeg');

    if (!analysis.isSuitableForPlacement) {
      return NextResponse.json({ 
        error: analysis.reasonIfNotSuitable || "Room photo is not suitable for furniture placement." 
      }, { status: 400 });
    }

    // 2. Upload image to private bucket
    const storagePath = await uploadExperienceImage(imageBase64, mimeType || 'image/jpeg');

    // 3. Persist to SpatialSession
    let sessionToken = existingSessionToken;
    if (!sessionToken && !userId) {
      sessionToken = crypto.randomBytes(32).toString('hex');
    }

    // Expiry: 7 days for anonymous, or longer if needed, let's say 7 days for now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await prisma.spatialSession.create({
      data: {
        userId: userId || null,
        sessionToken: sessionToken || null,
        expiresAt,
        lastActiveAt: new Date(),
        roomType: analysis.roomType,
        visualCharacter: analysis.visualCharacter,
        materials: analysis.materials,
        palette: analysis.palette,
        spatialNotes: analysis.spatialNotes,
        rawAnalysisJson: analysis as any,
      }
    });

    // Actually, where do we store the original image? 
    // We return the storagePath to the frontend so it can be passed to Reality Check.
    
    return NextResponse.json({
      session,
      analysis,
      storagePath
    });
  } catch (error: any) {
    console.error("Room DNA Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze room" }, { status: 500 });
  }
}
