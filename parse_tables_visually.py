import fitz
import json

doc = fitz.open('catalogues/ZEN TABLE & STAND SERIES - PRICELIST MAY 2026.pdf')

tables_validated = []
ambiguous = []

for page_num in range(1, len(doc)): # skip cover
    page = doc[page_num]
    images = page.get_image_info(xrefs=True)
    images = [img for img in images if img['width'] > 100] # skip small logos
    
    text_dict = page.get_text("dict")
    text_blocks = []
    for b in text_dict["blocks"]:
        if "lines" in b:
            for l in b["lines"]:
                for s in l["spans"]:
                    txt = s["text"].strip()
                    if txt and len(txt) > 2 and not txt.startswith('ZEN'):
                        text_blocks.append({
                            "text": txt,
                            "bbox": s["bbox"]
                        })
    
    # Sort images top-to-bottom, left-to-right
    images.sort(key=lambda img: (img['bbox'][1], img['bbox'][0]))
    
    for i, img in enumerate(images):
        img_x0, img_y0, img_x1, img_y1 = img['bbox']
        img_center_x = (img_x0 + img_x1) / 2
        
        # Find text blocks directly below this image, within the image's horizontal span,
        # and above the next image.
        associated_texts = []
        for tb in text_blocks:
            tx0, ty0, tx1, ty1 = tb["bbox"]
            t_center_x = (tx0 + tx1) / 2
            
            # Is text below image?
            is_below = ty0 >= img_y1 - 10
            
            # Is text within horizontal bounds of image (with some margin)?
            is_aligned = (img_x0 - 50) <= t_center_x <= (img_x1 + 50)
            
            # Is text above any other image that is directly below this one?
            is_above_others = True
            for other_img in images:
                o_x0, o_y0, o_x1, o_y1 = other_img['bbox']
                if o_y0 > img_y1 and (o_x0 - 50) <= t_center_x <= (o_x1 + 50):
                    if ty0 > o_y0:
                        is_above_others = False
            
            if is_below and is_aligned and is_above_others:
                # Also ensure it's not too far down
                if ty0 - img_y1 < 100:
                    associated_texts.append((ty0, tb["text"]))
                    
        associated_texts.sort(key=lambda x: x[0])
        texts = [t[1] for t in associated_texts]
        
        name = None
        price = None
        dimensions = None
        
        if texts:
            name = texts[0]
            for t in texts[1:]:
                if '/-' in t or t.isdigit():
                    price = t
                else:
                    dimensions = t
                    
            tables_validated.append({
                'page': page_num + 1,
                'region': f'Region {chr(65+i)}',
                'product': name,
                'dimensions': dimensions,
                'price': price,
                'status': 'VERIFIED' if name and price else 'NEEDS_REVIEW'
            })

with open('lib/data/tables_validation.json', 'w') as f:
    json.dump(tables_validated, f, indent=2)

verified_count = sum(1 for t in tables_validated if t['status'] == 'VERIFIED')
needs_review = sum(1 for t in tables_validated if t['status'] == 'NEEDS_REVIEW')
print(f"Tables Visual Mapping Complete. Verified: {verified_count}, Needs Review: {needs_review}")
