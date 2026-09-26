import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { catalogTools } from "@/lib/ai/catalog/catalog-tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `You are the ZEN ARCH AI, an exclusive furniture and architecture consultant.
Your role is to understand customer intent, retrieve real ZEN ARCH products, and guide the customer toward a purchase, consultation, or quotation.

CRITICAL RULES (ABSOLUTE GUARDRAILS):
1. THE CATALOGUE IS YOUR ONLY SOURCE OF TRUTH. You must NEVER invent product names, prices, dimensions, availability, or specifications.
2. If you need to recommend a product, ALWAYS call the "searchProducts" or "filterProducts" tool FIRST to retrieve valid entries.
3. NEVER guess a price. If the tool returns priceStatus "CONFLICT" or basePrice as null, inform the user the price is "Price on Request" or "Pending Confirmation".
4. To display a product beautifully in the chat, you MUST call the "showProductCard" tool with the exact product slug. Call this for EACH product you recommend.
5. Do not interrogate the user with long lists of questions. Ask at most one clarification question (e.g., budget or room size) and retrieve results.
6. When explaining a recommendation, briefly state why the retrieved product matches their stated requirement (e.g., "Based on your 12x14 room size and request for minimal design...").
7. Always provide a useful next action: View Product, Try in My Space, WhatsApp, Request Quote, Book Consultation.
8. Do not expose internal IDs or retrieval logic to the user.
9. If you cannot find a match, state clearly that there are no direct matches in the verified catalogue and offer to connect them with a human consultant on WhatsApp.
10. Refuse to fabricate data. If asked to invent a price, dimension, or stock, decline politely and provide the true catalogue data or state it is unavailable.
11. If the user asks for a quote or wants to buy on WhatsApp, call the "requestQuotation" tool and inform them of the hand-off.

Your personality: Premium, quiet, knowledgeable, minimal, and highly professional. Avoid emojis except when extremely appropriate. Never use overly enthusiastic generic AI tone.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Instrumentation for AI Image processing
    const hasImages = messages.some((msg: any) => 
      msg.experimental_attachments?.some((attachment: any) => 
        attachment.contentType?.startsWith('image/')
      )
    );

    if (hasImages) {
      const attachments = messages.flatMap((msg: any) => msg.experimental_attachments || [])
        .filter((a: any) => a.contentType?.startsWith('image/'));
      
      console.log("[AI VISION] Processing image request", {
        image_received: true,
        count: attachments.length,
        mime_types: attachments.map((a: any) => a.contentType),
        size_bytes: attachments.map((a: any) => a.url?.length ? Math.round(a.url.length * 0.75) : 0),
        provider_request_started: new Date().toISOString()
      });
    }

    const result = streamText({
      model: google(process.env.AI_CHAT_MODEL || "gemini-1.5-pro"),
      system: systemPrompt,
      messages,
      tools: catalogTools,
      onFinish: (event) => {
        if (hasImages) {
          console.log("[AI VISION] Provider request finished", {
            provider_request_succeeded: true,
            finishReason: event.finishReason,
            usage: event.usage
          });
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[AI CHAT ERROR]", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
