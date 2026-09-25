import fitz
import json

doc = fitz.open('catalogues/ZEN TABLE & STAND SERIES - PRICELIST MAY 2026.pdf')
page = doc[3] # random page

images = page.get_image_info(xrefs=True)
text = page.get_text("dict")

print(f"Found {len(images)} images")
for i, img in enumerate(images):
    print(f"Image {i}: bbox={img['bbox']}")

for b in text["blocks"]:
    if "lines" in b:
        for l in b["lines"]:
            for s in l["spans"]:
                txt = s["text"].strip()
                if txt:
                    print(f"Text: '{txt}' at {s['bbox']}")
