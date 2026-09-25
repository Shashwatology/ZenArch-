import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function testGeneration(imagePath, productSlug, style, outputPath) {
    console.log(`\nTesting ${productSlug} with ${imagePath}...`)
    
    const product = await prisma.product.findUnique({
        where: { slug: productSlug }
    })
    
    if (!product) {
        console.error(`Product ${productSlug} not found!`)
        return
    }
    
    console.log(`Found product: ${product.name} (${product.id})`)
    
    const base64Img = 'data:image/jpeg;base64,' + fs.readFileSync(imagePath).toString('base64')
    
    // 1. Analyze
    console.log('Sending Analysis Request...')
    const t0 = Date.now()
    const analyzeRes = await fetch('http://localhost:3000/api/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Img })
    })
    const analysis = await analyzeRes.json()
    const t1 = Date.now()
    console.log(`Analysis done in ${t1 - t0}ms. Room Type: ${analysis.roomType}`)
    
    // 2. Generate
    console.log('Sending Generation Request...')
    const t2 = Date.now()
    const genRes = await fetch('http://localhost:3000/api/vision/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            request: {
                productId: product.id,
                style: style,
                roomImageBase64: base64Img
            },
            analysis: analysis
        })
    })
    const result = await genRes.json()
    const t3 = Date.now()
    
    console.log(`Generation done in ${t3 - t2}ms. Success: ${result.success}`)
    
    if (result.success && result.resultUrl) {
        const b64Data = result.resultUrl.split(',')[1]
        fs.writeFileSync(outputPath, Buffer.from(b64Data, 'base64'))
        console.log(`Saved result to ${outputPath}`)
    } else {
        console.error('Failed to generate:', result.error)
    }
}

async function main() {
    await testGeneration('public/images/cinematic_hero.jpg', 'vegas-sofas', 'Zen Minimalist', 'public/images/test_out_1.jpg')
    await testGeneration('public/images/project-monolith.jpg', 'freedom-executive', 'Contemporary Editorial', 'public/images/test_out_2.jpg')
    await testGeneration('public/images/project-juhu.jpg', 'albert-puffy', 'Quiet Luxury', 'public/images/test_out_3.jpg')
    
    // Failure tests
    console.log('\n--- Running Failure Tests ---')
    // Missing product ID
    const base64Img = 'data:image/jpeg;base64,' + fs.readFileSync('public/images/cinematic_hero.jpg').toString('base64')
    const genRes = await fetch('http://localhost:3000/api/vision/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            request: { productId: '', style: 'Zen Minimalist', roomImageBase64: base64Img },
            analysis: {}
        })
    })
    console.log(`Missing Product ID test -> Status: ${genRes.status}, Error: ${(await genRes.json()).error}`)

    // Invalid product ID
    const genRes2 = await fetch('http://localhost:3000/api/vision/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            request: { productId: 'invalid-1234', style: 'Zen Minimalist', roomImageBase64: base64Img },
            analysis: {}
        })
    })
    console.log(`Invalid Product ID test -> Status: ${genRes2.status}, Error: ${(await genRes2.json()).error}`)
    
    await prisma.$disconnect()
}

main().catch(console.error)
