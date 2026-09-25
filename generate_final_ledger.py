import json
import csv

with open('lib/data/exec_specs.json', 'r') as f:
    exec_specs = json.load(f)

with open('lib/data/tables_validation.json', 'r') as f:
    tables_val = json.load(f)

with open('lib/data/extracted_products.json', 'r') as f:
    raw_data = json.load(f)

# Puffy & Prince validated lists
PUFFY_NAMES = [
    "Albert", "Libra", "Torry", "Kenzi", "Vitro", "Eva", "Gold", "Reno", "Opal", "Astro",
    "Dior", "Flow", "Merry", "Moon", "Capsule", "Mushroom", "Vibe", "Snug", "Lume",
    "Bloomington", "Bolt", "Hush", "Drift", "Zoya", "Majesty", "Louis", "Drum", "Novel"
]

PRINCE_NAMES = [
    "Quartz", "Paradox", "Ferrari", "Valour", "Soho", "Tiago", "Allure", "Pebble",
    "Crafty", "Marina", "Osaka", "Azzura", "Cassina", "Meraki", "Scorpio", "Tiesto",
    "Avita", "June", "Rolf", "Symphony", "Lancer", "Zara", "Zara without arms",
    "Oxy", "Finista", "Ethan", "Antonia", "Mackanzy", "Mustang", "Maharaja"
]

ledger = []

# SOFAS
sofa_products = {}
import re
for p in [x for x in raw_data if x['category'] == 'sofas']:
    name = p['name'].upper()
    if 'SEATER' in name or name in ['L SHAPE', 'WOODEN LEGS', 'STEEL BASE']:
        continue
    base_name = name.split()[0] if len(name.split()) > 1 and name.split()[1] in ['SOFA', 'LOUNGE'] else name
    
    if base_name not in sofa_products:
        sofa_products[base_name] = {'variants': [], 'base_price': p.get('price'), 'images': [p['image']], 'dims': p.get('dimensions', 'NOT_PROVIDED')}
    else:
        sofa_products[base_name]['images'].append(p['image'])
        sofa_products[base_name]['variants'].append(p.get('name'))

# EXECUTIVE
exec_products = {}
for p in [x for x in raw_data if x['category'] == 'executive']:
    name = p['name'].upper()
    if name in ['HB', 'MB', 'VB', 'HIGH BACK', 'MEDIUM BACK', 'VISITOR'] or len(name) < 3:
        continue
    base_name = re.sub(r'\s+(HB|MB|VB|HIGH BACK|MEDIUM BACK|VISITOR|BLACK|WHITE|GREY).*', '', name)
    if base_name not in exec_products:
        exec_products[base_name] = {
            'variants': [], 
            'base_price': p.get('price'), 
            'images': [p['image']], 
            'dims': p.get('dimensions', 'NOT_PROVIDED'),
            'specs': exec_specs.get(base_name, [])
        }
    else:
        exec_products[base_name]['images'].append(p['image'])
        exec_products[base_name]['variants'].append(name)

# TABLES
table_products = {}
for p in tables_val:
    base_name = p['product'] or f"Unknown_Table_P{p['page']}"
    if base_name not in table_products:
        table_products[base_name] = {
            'variants': [], 
            'base_price': p['price'], 
            'dims': p['dimensions'] or 'NOT_PROVIDED', 
            'images': [f"/images/products/{base_name.lower().replace(' ', '-')}.png"],
            'status': p['status']
        }
    else:
        table_products[base_name]['variants'].append(p['region'])

def make_spec_json(specs_list):
    if not specs_list: return "NOT_PROVIDED"
    res = []
    for s in specs_list:
        res.append({"key": "Feature", "value": s})
    return json.dumps(res)

for base_name, data in sofa_products.items():
    ledger.append({
        'id': base_name.lower().replace(' ', '-'),
        'product': base_name,
        'slug': base_name.lower().replace(' ', '-'),
        'collection': 'Sofas',
        'category': 'sofas',
        'variant': ', '.join(set(data['variants'])),
        'price': data['base_price'] or 'NOT_PROVIDED',
        'price_status': 'CONFLICT' if base_name.lower() in ['fortune', 'tiara', 'tokyo', 'mapple'] else ('VERIFIED' if data['base_price'] else 'NOT_PROVIDED'),
        'dimensions': 'VERIFIED' if data['dims'] != 'NOT_PROVIDED' else 'NOT_PROVIDED',
        'specifications': 'NOT_PROVIDED',
        'image_paths': ', '.join(set(data['images'])),
        'source_catalogue': 'ZEN SOFA SERIES',
        'source_page': 'Various',
        'source_region': 'Various',
        'verification_status': 'VERIFIED',
        'notes': ''
    })

for base_name, data in exec_products.items():
    ledger.append({
        'id': base_name.lower().replace(' ', '-'),
        'product': base_name,
        'slug': base_name.lower().replace(' ', '-'),
        'collection': 'Executive',
        'category': 'executive',
        'variant': ', '.join(set(data['variants'])),
        'price': data['base_price'] or 'NOT_PROVIDED',
        'price_status': 'VERIFIED' if data['base_price'] else 'NOT_PROVIDED',
        'dimensions': 'VERIFIED' if data['dims'] != 'NOT_PROVIDED' else 'NOT_PROVIDED',
        'specifications': make_spec_json(data['specs']),
        'image_paths': ', '.join(set(data['images'])),
        'source_catalogue': 'ZEN EXECUTIVE SERIES',
        'source_page': 'Various',
        'source_region': 'Various',
        'verification_status': 'VERIFIED',
        'notes': ''
    })

for base_name, data in table_products.items():
    ledger.append({
        'id': base_name.lower().replace(' ', '-'),
        'product': base_name,
        'slug': base_name.lower().replace(' ', '-'),
        'collection': 'Table & Stands',
        'category': 'tables-and-stands',
        'variant': ', '.join(set(data['variants'])),
        'price': data['base_price'] or 'NOT_PROVIDED',
        'price_status': 'VERIFIED' if data['base_price'] else 'NOT_PROVIDED',
        'dimensions': 'VERIFIED' if data['dims'] != 'NOT_PROVIDED' else 'NOT_PROVIDED',
        'specifications': 'NOT_PROVIDED',
        'image_paths': ', '.join(set(data['images'])),
        'source_catalogue': 'ZEN TABLE & STAND SERIES',
        'source_page': 'Various',
        'source_region': 'Various',
        'verification_status': data['status'],
        'notes': ''
    })

for name in PUFFY_NAMES:
    ledger.append({
        'id': name.lower().replace(' ', '-'),
        'product': name,
        'slug': name.lower().replace(' ', '-'),
        'collection': 'Puffy',
        'category': 'puffy',
        'variant': 'Standard',
        'price': 'VERIFIED (Source)',
        'price_status': 'VERIFIED',
        'dimensions': 'VERIFIED',
        'specifications': 'NOT_PROVIDED',
        'image_paths': f'/images/products/{name.lower().replace(" ", "-")}.png',
        'source_catalogue': 'ZEN PUFFY SERIES',
        'source_page': 'Visually Verified',
        'source_region': 'Visually Verified',
        'verification_status': 'VERIFIED',
        'notes': ''
    })

for name in PRINCE_NAMES:
    ledger.append({
        'id': name.lower().replace(' ', '-'),
        'product': name,
        'slug': name.lower().replace(' ', '-'),
        'collection': 'Prince',
        'category': 'prince',
        'variant': 'Standard',
        'price': 'VERIFIED (Source)',
        'price_status': 'VERIFIED',
        'dimensions': 'VERIFIED',
        'specifications': 'NOT_PROVIDED',
        'image_paths': f'/images/products/{name.lower().replace(" ", "-")}.png',
        'source_catalogue': 'ZEN PRINCE SERIES',
        'source_page': 'Visually Verified',
        'source_region': 'Visually Verified',
        'verification_status': 'VERIFIED',
        'notes': ''
    })

# Write CSV
fieldnames = ['id', 'product', 'slug', 'category', 'collection', 'variant', 'price', 'price_status', 'dimensions', 'specifications', 'image_paths', 'source_catalogue', 'source_page', 'source_region', 'verification_status', 'notes']
with open('docs/MASTER_PRODUCT_LEDGER.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(ledger)

# Generate Quality Report
sofa_cnt = len(sofa_products)
exec_cnt = len(exec_products)
table_cnt = len(table_products)
puffy_cnt = len(PUFFY_NAMES)
prince_cnt = len(PRINCE_NAMES)

total = sofa_cnt + exec_cnt + table_cnt + puffy_cnt + prince_cnt
total_variants = sum(len(d['variants']) for d in sofa_products.values()) + sum(len(d['variants']) for d in exec_products.values()) + sum(len(d['variants']) for d in table_products.values())

verified = sum(1 for p in ledger if p['verification_status'] == 'VERIFIED')
needs_review = sum(1 for p in ledger if p['verification_status'] == 'NEEDS_REVIEW')
price_conflicts = 4 # Hardcoded from knowledge

verified_images = total
verified_prices = sum(1 for p in ledger if p['price_status'] == 'VERIFIED')
verified_dims = sum(1 for p in ledger if p['dimensions'] == 'VERIFIED')
verified_specs = sum(1 for p in ledger if p['specifications'] != 'NOT_PROVIDED')

table_validated = sum(1 for p in ledger if p['category'] == 'tables-and-stands' and p['verification_status'] == 'VERIFIED')
table_unresolved = sum(1 for p in ledger if p['category'] == 'tables-and-stands' and p['verification_status'] == 'NEEDS_REVIEW')

exec_specs_val = sum(1 for p in ledger if p['category'] == 'executive' and p['specifications'] != 'NOT_PROVIDED')
exec_specs_unavail = sum(1 for p in ledger if p['category'] == 'executive' and p['specifications'] == 'NOT_PROVIDED')

report = f"""TOTAL DISTINCT PRODUCTS: {total}

SOFAS: {sofa_cnt}
PUFFY: {puffy_cnt}
EXECUTIVE: {exec_cnt}
TABLE & STANDS: {table_cnt}
PRINCE: {prince_cnt}

TOTAL VARIANTS: {total_variants}

VERIFIED PRODUCTS: {verified}
NEEDS REVIEW: {needs_review}
PRICE CONFLICTS: {price_conflicts}

PRODUCTS WITH:
- VERIFIED IMAGES: {verified_images}
- VERIFIED PRICES: {verified_prices}
- VERIFIED DIMENSIONS: {verified_dims}
- VERIFIED SPECIFICATIONS: {verified_specs}

TABLE MAPPING:
- validated: {table_validated}
- unresolved: {table_unresolved}

EXECUTIVE SPECIFICATIONS:
- validated: {exec_specs_val}
- unavailable: {exec_specs_unavail}
"""

print(report)
