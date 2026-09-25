import fitz
for pdf, name in [("catalogues/ZEN PUFFY SERIES 2 -PRICELIST WEF 1ST MAY 2026.pdf", "puffy"), ("catalogues/ZEN  PRINCE SERIES 2 - PRICELIST WEF 1STMAY 2026.pdf", "prince")]:
    doc = fitz.open(pdf)
    page = doc[2] # 3rd page
    images = page.get_image_info(xrefs=True)
    text = page.get_text("dict")
    print(f"--- {name.upper()} ---")
    print(f"Images: {len(images)}")
    for i, img in enumerate(images):
        if img['width']>100:
            print(f"Img {i}: {img['bbox']}")
    for b in text["blocks"]:
        if "lines" in b:
            for l in b["lines"]:
                for s in l["spans"]:
                    txt = s["text"].strip()
                    if txt and len(txt)>1:
                        print(f"Text: '{txt}' at {s['bbox']}")
