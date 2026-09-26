import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export interface RealityCheckResult {
  fitLevel: "GOOD" | "CAUTION" | "NOT_SUPPORTED";
  fitReason: string;
  scaleLevel: "GOOD" | "CAUTION" | "NOT_SUPPORTED";
  scaleReason: string;
  styleLevel: "GOOD" | "CAUTION" | "NOT_SUPPORTED";
  styleReason: string;
  assessmentConfidence: number;
}

export async function generateRealityCheck(
  roomImageBase64: string,
  mimeType: string,
  analysis: any,
  product: any
): Promise<RealityCheckResult> {
  const prompt = `You are the Zen Arch Experience Lab Spatial Assessor.
Evaluate whether the provided product works in the provided room photograph.

ROOM CONTEXT (Room DNA):
Type: ${analysis.roomType}
Character: ${analysis.visualCharacter}
Notes: ${analysis.spatialNotes}
Observed: ${analysis.observed.join(", ")}
Inferred: ${analysis.inferred.join(", ")}

PRODUCT CONTEXT:
Name: ${product.name}
Category: ${product.category?.name || 'Unknown'}
Dimensions: ${product.dimensions || 'Unavailable'}

Assess FIT, SCALE, and STYLE.
FIT: Consider physical constraints, access, and spatial logic.
SCALE: Consider product dimensions vs visible room scale. If dimensions are missing, use CAUTION.
STYLE: Consider product aesthetics vs room palette/materials.

CRITICAL RULES:
- NEVER claim exact measurements. Use words like "approximate", "appears compatible".
- DO NOT invent product attributes not provided.
- If the image is unclear or product dimensions are missing, use CAUTION and explain why.

Return ONLY raw JSON with exactly this structure:
{
  "fitLevel": "GOOD" | "CAUTION" | "NOT_SUPPORTED",
  "fitReason": "Short explanation",
  "scaleLevel": "GOOD" | "CAUTION" | "NOT_SUPPORTED",
  "scaleReason": "Short explanation",
  "styleLevel": "GOOD" | "CAUTION" | "NOT_SUPPORTED",
  "styleReason": "Short explanation",
  "assessmentConfidence": 0-100
}`;

  const modelName = process.env.VISION_MODEL || 'gemini-3.8-flash';
  const response = await generateText({
    model: google(modelName),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image", image: roomImageBase64 },
        ],
      },
    ],
    temperature: 0.1,
  });

  let jsonStr = response.text;
  if (jsonStr.startsWith("\`\`\`json")) {
    jsonStr = jsonStr.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
  } else if (jsonStr.startsWith("\`\`\`")) {
    jsonStr = jsonStr.replace(/\`\`\`/g, "").trim();
  }

  return JSON.parse(jsonStr) as RealityCheckResult;
}
