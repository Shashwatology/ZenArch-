import fitz
import os
import json
import re

PDFS = [
    ("catalogues/ZEN SOFA SERIES - PRICELIST MAY 2026.pdf", "sofas"),
    ("catalogues/ZEN PUFFY SERIES 2 -PRICELIST WEF 1ST MAY 2026.pdf", "puffy"),
    ("catalogues/ZEN EXECUTIVE SERIES - PRICELIST MAY 26_.pdf", "executive"),
    ("catalogues/ZEN TABLE & STAND SERIES - PRICELIST MAY 2026.pdf", "tables-and-stands"),
    ("catalogues/ZEN  PRINCE SERIES 2 - PRICELIST WEF 1STMAY 2026.pdf", "prince"),
]

output_dir = "public/images/products"
os.makedirs(output_dir, exist_ok=True)

all_products = []
extracted_images = 0
mapped_images = 0

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def is_price(text):
    return '/-' in text or 'Rs' in text or text.isdigit() or (text.replace(',','').isdigit() and int(text.replace(',','')) > 1000)

for pdf_path, category in PDFS:
    if not os.path.exists(pdf_path):
        print(f"Missing {pdf_path}")
        continue
        
    doc = fitz.open(pdf_path)
    for page_num in range(len(doc)):
        page = doc[page_num]
        images = page.get_image_info(xrefs=True)
        text_dict = page.get_text("dict")
        
        # Extract text blocks
        text_blocks = []
        for b in text_dict["blocks"]:
            if "lines" in b:
                for l in b["lines"]:
                    for s in l["spans"]:
                        txt = s["text"].strip()
                        if txt and len(txt) > 1 and not txt.lower().startswith('zen'):
                            text_blocks.append({
                                "text": txt,
                                "bbox": s["bbox"]
                            })
                            
        # Group text blocks by Y proximity to find clusters (Product Info)
        # But simpler: for each image, find text blocks directly below it or within its horizontal span
        
        valid_images = [img for img in images if img["width"] > 100 and img["height"] > 100] # skip logos
        
        for img in valid_images:
            extracted_images += 1
            bbox = img["bbox"]
            img_x0, img_y0, img_x1, img_y1 = bbox
            
            # Find text blocks that are likely for this image
            # Usually below the image (y0 >= img_y1) or to the side. Let's just find the closest ones geometrically
            # Or group text blocks first and then assign to nearest image
            
            # Let's find text blocks that overlap horizontally and are below the image, up to a certain distance
            candidate_texts = []
            for tb in text_blocks:
                tx0, ty0, tx1, ty1 = tb["bbox"]
                
                # Check if it's below the image
                is_below = ty0 >= (img_y1 - 20) and ty0 < (img_y1 + 150)
                # Check horizontal overlap
                h_overlap = max(0, min(img_x1, tx1) - max(img_x0, tx0))
                
                if is_below and h_overlap > -50: # lenient horizontal
                    candidate_texts.append((ty0, tb["text"]))
                    
            if candidate_texts:
                candidate_texts.sort(key=lambda x: x[0])
                texts = [t[1] for t in candidate_texts]
                
                name = texts[0]
                price = None
                dimensions = None
                
                for t in texts[1:]:
                    if is_price(t):
                        price = t
                    elif '*' in t or 'x' in t.lower() or 'mm' in t.lower() or '&' in t:
                        dimensions = t
                
                if name:
                    slug = slugify(name)
                    # avoid overwriting if duplicate name exists on same page
                    if any(p['slug'] == slug for p in all_products):
                        slug = f"{slug}-{page_num}-{extracted_images}"
                        
                    # Extract image bytes
                    xref = img["xref"]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    ext = base_image["ext"]
                    image_filename = f"{slug}.{ext}"
                    image_filepath = os.path.join(output_dir, image_filename)
                    
                    with open(image_filepath, "wb") as f:
                        f.write(image_bytes)
                        
                    mapped_images += 1
                    
                    all_products.append({
                        "id": slug,
                        "slug": slug,
                        "name": name,
                        "category": category,
                        "price": price,
                        "dimensions": dimensions,
                        "image": f"/images/products/{image_filename}",
                        "source_catalogue": os.path.basename(pdf_path),
                        "source_page": page_num + 1
                    })

# Save to JSON
with open('lib/data/extracted_products.json', 'w') as f:
    json.dump(all_products, f, indent=2)

print(f"Extraction complete. Total products found: {len(all_products)}")
print(f"Extracted images: {extracted_images}, Mapped: {mapped_images}")
