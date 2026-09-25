"use server"

import { getPublicProductBySlug } from "./publicProducts"

export async function getInitialAiRecommendations() {
  const slugs = ['vegas', 'arcus', 'albert']
  const products = await Promise.all(slugs.map(getPublicProductBySlug))
  return products.filter(Boolean)
}

export async function processAiMessage(text: string) {
  let replyText = ""
  let matchedProducts: any[] = []

  const query = text.toLowerCase()

  if (query.includes("vegas")) {
    const prod = await getPublicProductBySlug("vegas")
    if (prod) matchedProducts.push(prod)
    replyText =
      "The Vegas Sofa is an architectural centerpiece in our 2026 catalogue (Page 2). Available in Single Seater (3.50ft, ₹56,000), Two Seater (5.25ft, ₹74,000), and Three Seater (7.25ft, ₹92,000). Fabric allowance is included at ₹500/meter."
  } else if (query.includes("arcus") || query.includes("curve") || query.includes("curved")) {
    const arcus = await getPublicProductBySlug("arcus")
    const curve = await getPublicProductBySlug("curve")
    if (arcus) matchedProducts.push(arcus)
    if (curve) matchedProducts.push(curve)
    replyText =
      "For organic curved profiles, we recommend the Arcus and the Curve sofas. Arcus begins at ₹33,500 (3.25ft) with enveloping cocoon arms and bolster pillows. The Curve sofa (5.50ft to 7.00ft) creates a dramatic sweeping arc ideal for central salons."
  } else if (query.includes("puffy") || query.includes("pouf") || query.includes("ottoman") || query.includes("10,000") || query.includes("under")) {
    const albert = await getPublicProductBySlug("albert")
    const eva = await getPublicProductBySlug("eva")
    const gold = await getPublicProductBySlug("gold")
    if (albert) matchedProducts.push(albert)
    if (eva) matchedProducts.push(eva)
    if (gold) matchedProducts.push(gold)
    replyText =
      "Our 2026 Puffy Collection features sculptural accent poufs crafted with textured bouclé and architectural metal trims. The Albert (₹6,500), Eva (₹5,500), and Gold (₹6,250) provide tactile seating accents with zero visual clutter."
  } else if (query.includes("buy") || query.includes("quote") || query.includes("purchase") || query.includes("save")) {
    const slugs = ['vegas', 'arcus', 'albert']
    const prods = await Promise.all(slugs.map(getPublicProductBySlug))
    matchedProducts = prods.filter(Boolean)
    replyText =
      "To save products to your personal wishlist or request an official quotation, please sign in to your Zen Arch account. From any product page, you can click 'Save' or 'Quote' to build your project portfolio. Would you like to explore our collections?"
  } else if (query.includes("consultation") || query.includes("process") || query.includes("price") || query.includes("rohit")) {
    replyText =
      "Every architectural commission is directed by Rohit Pathak. We begin with our 8-step guided consultation to align floor area, investment budget, and custom joinery requirements. Would you like to launch the onboarding brief or connect directly on WhatsApp?"
  } else {
    const slugs = ['flame', 'montana', 'libra']
    const prods = await Promise.all(slugs.map(getPublicProductBySlug))
    matchedProducts = prods.filter(Boolean)
    replyText =
      "Based on your inquiry, I have curated these architectural selections from our catalogue. Each piece is constructed in our Mumbai atelier with custom dimensions and material specifications available upon request."
  }

  return { replyText, matchedProducts }
}
