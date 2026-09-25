import fs from "fs";

// Create a dummy transparent 1x1 png in base64
const dummyImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const dummyMime = "image/png";

async function runEvaluations() {
  console.log("==========================================");
  console.log("ZEN ARCH — VISION AI EVALUATION SUITE");
  console.log("==========================================");

  let passed = 0;
  let failed = 0;
  
  const assert = (condition, name, details = "") => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details}`);
      failed++;
    }
  };

  try {
    // 1. Test Analysis Endpoint (Mocked via API call)
    console.log("\n--- Testing Room Analysis ---");
    let analysisRes;
    try {
      analysisRes = await fetch("http://localhost:3000/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: dummyImageBase64, mimeType: dummyMime })
      });
      const analysisData = await analysisRes.json();
      
      assert(analysisRes.status === 200, "Analysis endpoint returns 200 OK");
      assert(analysisData.roomType !== undefined, "Extracts roomType");
      assert(Array.isArray(analysisData.observed), "Extracts observed facts array");
      assert(typeof analysisData.isSuitableForPlacement === "boolean", "Returns boolean placement suitability");
      
    } catch (e) {
      console.error("Analysis Endpoint Unreachable (Is the dev server running?)");
    }

    // 2. Test Missing Data (Failure State)
    console.log("\n--- Testing Failure States ---");
    try {
      const failRes = await fetch("http://localhost:3000/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) // Missing image
      });
      assert(failRes.status === 400, "Handles missing image data gracefully (400 Bad Request)");
    } catch (e) {
      assert(false, "Failed to handle missing data");
    }

    // 3. Test Generation Endpoint
    console.log("\n--- Testing Image Generation Pipeline ---");
    try {
      const genReq = {
        request: {
          roomImageBase64: dummyImageBase64,
          productId: "test-id-123",
          productName: "Vegas Sofa",
          productDimensions: "Single: 3.50 ft",
          presetStyle: "KEEP_ROOM"
        },
        analysis: {
          roomType: "living room",
          floor: "wood",
          walls: "white",
          lighting: "natural",
          existingFurniture: [],
          observed: [],
          inferred: [],
          unknown: [],
          isSuitableForPlacement: true
        },
        productReferenceUrl: "/images/vegas.jpg"
      };

      const genRes = await fetch("http://localhost:3000/api/vision/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(genReq)
      });
      
      const genData = await genRes.json();
      
      assert(genRes.status === 200, "Generation endpoint returns 200 OK");
      assert(genData.success === true, "Generation marked as successful");
      assert(genData.imageUrl.includes("base64"), "Returns generated image data URI");
      assert(genData.scaleNote.includes("Estimated"), "Properly handles scale/dimension notes based on product data");
      
    } catch (e) {
      console.error("Generation Endpoint Error", e);
    }

    console.log("\n==========================================");
    console.log(`EVALUATION COMPLETE: ${passed} Passed, ${failed} Failed`);
    console.log("==========================================");

  } catch (err) {
    console.error("Evaluation Suite Crashed:", err);
  }
}

runEvaluations();
