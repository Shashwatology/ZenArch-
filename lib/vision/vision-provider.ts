import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { IVisionProvider, RoomAnalysisResult } from "./types";

export class GeminiVisionProvider implements IVisionProvider {
  async analyzeRoom(imageBase64: string, mimeType: string): Promise<RoomAnalysisResult> {
    const prompt = `You are an expert architectural vision system for Zen Arch Interior Solution.
Analyze this room photograph and return a structured JSON response understanding its spatial constraints.

DO NOT invent precise dimensions. Use OBSERVED, INFERRED, and UNKNOWN categories strictly.
Determine if the room is suitable for placing a piece of luxury furniture (i.e., is there visible free floor space, or is it too cluttered/unclear?).

Return ONLY raw JSON, with exactly this structure:
{
  "roomType": "living room | bedroom | office | unknown",
  "floor": "describe the visible floor material",
  "walls": "describe visible walls/colors",
  "lighting": "describe lighting conditions",
  "existingFurniture": ["list", "of", "items"],
  "observed": ["Fact 1", "Fact 2"],
  "inferred": ["Inference 1", "Inference 2"],
  "unknown": ["Unknown 1"],
  "isSuitableForPlacement": true/false,
  "reasonIfNotSuitable": "reason if false, else null"
}`;

    try {
      const modelName = process.env.VISION_MODEL || 'gemini-3.8-flash';
      const response = await generateText({
        model: google(modelName),
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image",
                image: imageBase64,
              },
            ],
          },
        ],
        temperature: 0.1,
      });

      // Strip markdown code blocks if present
      let jsonStr = response.text;
      if (jsonStr.startsWith("\`\`\`json")) {
        jsonStr = jsonStr.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      } else if (jsonStr.startsWith("\`\`\`")) {
        jsonStr = jsonStr.replace(/\`\`\`/g, "").trim();
      }

      const result = JSON.parse(jsonStr) as RoomAnalysisResult;
      return result;
    } catch (error) {
      console.error("GeminiVisionProvider Error:", error);
      throw new Error("Failed to analyze room image.");
    }
  }
}
