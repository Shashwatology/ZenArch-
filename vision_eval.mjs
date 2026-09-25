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
    // 1. Test Analysis Endpoint
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

    console.log("\n==========================================");
    console.log(`API EVALUATION COMPLETE: ${passed} Passed, ${failed} Failed`);
    console.log("==========================================");
    
    console.log(`\n==========================================`);
    console.log(`MANUAL PRODUCT FIDELITY & ACCEPTANCE TESTS`);
    console.log(`==========================================`);
    console.log(`To evaluate the Real Generation Pipeline, use the Transform Space UI.`);
    console.log(`For each generation, record the following:\n`);
    
    const manualTestTemplate = `
PRODUCT: [Product Name]
IMAGE REFERENCE: [Original Room Photo URL]
GENERATED RESULT: [Generated Image URL]

Observations:
A. generation succeeded: PASS / FAIL
B. correct product used: PASS / FAIL
C. product recognizable (identity): PASS / PARTIAL / FAIL
D. original room preserved: PASS / PARTIAL / FAIL
E. perspective plausible: PASS / PARTIAL / FAIL
F. placement plausible: PASS / PARTIAL / FAIL
G. scale plausible: PASS / PARTIAL / FAIL
H. lighting consistent: PASS / PARTIAL / FAIL
I. unwanted room changes: PASS / FAIL (Fail if unwanted changes exist)
J. metadata correct: PASS / FAIL
K. PDP link correct: PASS / FAIL
L. quote handoff correct: PASS / FAIL
M. WhatsApp handoff correct: PASS / FAIL

Shape: PASS / PARTIAL / FAIL
Proportion: PASS / PARTIAL / FAIL
`;

    console.log(manualTestTemplate);
    console.log("Do not claim numerical accuracy that was not measured. Treat this as a product-quality acceptance test.");

  } catch (err) {
    console.error("Evaluation Suite Crashed:", err);
  }
}

runEvaluations();

