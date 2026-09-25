import fs from 'fs';
import path from 'path';
import { IImageGenerationProvider, RoomAnalysisResult, VisualizationRequest, VisualizationResult } from "./types";

/**
 * V1.3.1 - Real Gemini Image Generation Provider
 * Uses Gemini 3.1 Flash Image (Nano Banana 2) for photo-realistic, architecture-preserving furniture insertion.
 */
export class GeminiImageGenerationProvider implements IImageGenerationProvider {
  
  private async getLocalImageBase64(imageUrl: string): Promise<string> {
    try {
      // In production, this might fetch from an S3/GCS bucket or a CDN.
      // For Zen Arch, images are stored in public/images/
      const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
      const filePath = path.join(process.cwd(), 'public', cleanPath);
      const fileBuffer = await fs.promises.readFile(filePath);
      return fileBuffer.toString('base64');
    } catch (e) {
      console.error("Failed to load local product reference image:", e);
      return "";
    }
  }

  async generateVisualization(
    request: VisualizationRequest,
    analysis: RoomAnalysisResult,
    productReferenceUrl?: string
  ): Promise<VisualizationResult> {
    
    // 1. Validation & Safety Checks
    if (!request.productId || !request.roomImageBase64) {
      throw new Error("Missing critical generation parameters.");
    }
    
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Generation API key is not configured.");
    }

    const modelName = process.env.IMAGE_GENERATION_MODEL || 'gemini-3.1-flash-image';

    // 2. Fetch Catalogue Product Reference
    let productBase64 = "";
    if (productReferenceUrl) {
      productBase64 = await this.getLocalImageBase64(productReferenceUrl);
    }
    
    if (!productBase64) {
      throw new Error("Product reference image is missing or cannot be loaded. Cannot safely generate without inventing product identity.");
    }

    // 3. Construct the Spatial Prompt
    let scaleNote = "Estimated visual placement based on catalogue dimensions.";
    if (!request.productDimensions) {
      scaleNote = "Scale is approximate because catalogue dimensions are unavailable.";
    }

    const prompt = `
      EDIT THE USER'S EXISTING ROOM PHOTO.
      Preserve walls, floor, ceiling, windows, doors, architecture, camera perspective, lighting direction, and overall room identity exactly as they are.
      
      TASK: Add the requested ZEN ARCH furniture piece into the room.
      Product: ${request.productName}
      Dimensions: ${request.productDimensions || 'Standard proportions'}
      
      ROOM CONTEXT:
      - Type: ${analysis.roomType}
      - Floor: ${analysis.floor}
      - Lighting: ${analysis.lighting}
      - Placement clues: ${analysis.inferred.join(", ")}
      
      INSTRUCTIONS:
      - Preserve the original room architecture and perspective.
      - Place the selected furniture naturally on the floor plane.
      - Create realistic contact shadows and preserve lighting consistency.
      - Maintain correct occlusion.
      - Prioritize the exact silhouette, shape, and upholstery appearance of the reference product image provided.
      - DO NOT add extra furniture. DO NOT redesign the room.
    `.trim();

    // 4. API Request to Google Generative Language API
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateImages?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt,
              image: {
                bytesBase64Encoded: request.roomImageBase64
              },
              referenceImages: [
                {
                  bytesBase64Encoded: productBase64,
                  referenceType: "SUBJECT"
                }
              ]
            }
          ],
          parameters: {
            sampleCount: 1,
            mode: "EDIT",
            aspectRatio: "AS_INPUT"
          }
        })
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized: Invalid or expired generation API key.");
        }
        if (response.status === 429) {
          throw new Error("Rate limit exceeded for image generation.");
        }
        throw new Error(`Generation API returned status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.predictions || !data.predictions[0]) {
        throw new Error("Generation API returned an empty or malformed response.");
      }

      const generatedBase64 = data.predictions[0].bytesBase64Encoded;

      return {
        success: true,
        imageUrl: `data:image/jpeg;base64,${generatedBase64}`,
        appliedPreset: request.presetStyle || 'KEEP_ROOM',
        scaleNote,
      };

    } catch (error: any) {
      console.error("Gemini Image Generation Error:", error.message);
      return {
        success: false,
        imageUrl: "",
        errorMessage: error.message || "Failed to generate visualization.",
        scaleNote: "",
      };
    }
  }
}
