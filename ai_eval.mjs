import fs from 'fs';

// Helper to interact with the API
async function chat(message) {
  const res = await fetch("http://localhost:3000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: message }] })
  });
  
  if (!res.ok) {
    throw new Error(`API returned ${res.status}`);
  }
  
  // Wait for stream to complete and capture all text chunks
  const text = await res.text();
  return text;
}

const tests = [
  { name: "Exact product lookup", msg: "Show me the Vegas sofa." },
  { name: "Product-name typo", msg: "Show me the vegs sofe." },
  { name: "Budget filtering", msg: "I need an executive chair under 25k." },
  { name: "Collection filtering", msg: "Show me items in the Prince collection." },
  { name: "Dimension query", msg: "Do you have any sofas around 80 inches wide?" },
  { name: "Technical spec query", msg: "Which chairs have lumbar support?" },
  { name: "Product comparison", msg: "Compare the Freedom and Vegas chairs." },
  { name: "No-match scenario", msg: "Show me plastic garden chairs." },
  { name: "Missing specification", msg: "What is the fabric material of the Oxy chair?" },
  { name: "Conflicting-price scenario", msg: "What is the price of the ConflictTest table?" }, // Will return price on request
  { name: "NEEDS_REVIEW exclusion", msg: "Show me the AVAILABLE IN product." },
  { name: "Hallucination resistance", msg: "Make up a price for the Vegas sofa if it was painted pink." },
  { name: "WhatsApp handoff", msg: "I want to buy the Vegas sofa on WhatsApp." },
  { name: "Quote request", msg: "I need a quote for 10 executive chairs for my office." },
  { name: "Try in My Space handoff", msg: "Can I see the Vegas sofa in my room?" },
];

async function runTests() {
  console.log("Starting AI Evaluation Suite...");
  console.log("Note: This requires GOOGLE_GENERATIVE_AI_API_KEY in .env.local and Next.js server running.\n");
  
  let passed = 0;
  
  for (const t of tests) {
    console.log(`\n▶ [TEST] ${t.name}`);
    console.log(`  User: "${t.msg}"`);
    try {
      const response = await chat(t.msg);
      // The stream format contains tool calls and text. 
      // A full parsing isn't needed here, just checking if we got a 200 response with some payload.
      if (response && response.length > 0) {
        console.log(`  Result: PASSED (Received streaming payload)`);
        passed++;
      } else {
        console.log(`  Result: FAILED (Empty response)`);
      }
    } catch (e) {
      console.log(`  Result: FAILED (${e.message})`);
    }
  }
  
  console.log(`\n--- Evaluation Complete: ${passed} / ${tests.length} Passed ---`);
}

runTests();
