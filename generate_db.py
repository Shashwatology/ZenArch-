import csv
import json

ledger = []
with open('docs/MASTER_PRODUCT_LEDGER.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Skip needs review products from the public array
        if row['verification_status'] == 'NEEDS_REVIEW':
            continue
            
        # Parse variants
        variants = []
        raw_variants = row['variant'].split(',')
        for v in raw_variants:
            v = v.strip()
            if v:
                variants.append({
                    "name": v,
                    "priceInr": int(row['price'].replace('/-','').replace(',','').strip()) if row['price'].replace('/-','').replace(',','').strip().isdigit() else None,
                })
        if not variants:
            variants.append({
                "name": "Standard",
                "priceInr": int(row['price'].replace('/-','').replace(',','').strip()) if row['price'].replace('/-','').replace(',','').strip().isdigit() else None,
            })
            
        # Parse specifications
        specs = []
        if row['specifications'] != 'NOT_PROVIDED':
            try:
                specs = json.loads(row['specifications'])
            except:
                pass
                
        # Parse images
        images = [img.strip() for img in row['image_paths'].split(',') if img.strip()]
        
        base_id = row['id']
        category_slug = row['category']
        unique_id = f"{base_id}-{category_slug}"
        
        ledger.append({
            "id": unique_id,
            "slug": unique_id,
            "name": row['product'],
            "category": row['category'],
            "collection": row['collection'],
            "basePrice": variants[0]['priceInr'] if variants[0]['priceInr'] else None,
            "priceStatus": row['price_status'],
            "dimensions": row['dimensions'] if row['dimensions'] != 'NOT_PROVIDED' else None,
            "specifications": specs,
            "images": images,
            "variants": variants,
            "has3dModel": False # Defaulting to false until specifically assigned
        })

with open('lib/data/furniture_db.json', 'w', encoding='utf-8') as f:
    json.dump(ledger, f, indent=2)
print(f"Generated furniture_db.json with {len(ledger)} verified products.")
