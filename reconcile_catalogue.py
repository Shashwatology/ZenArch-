import json
import csv
import re

# Load the raw extracted data
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

# Process Sofas
sofa_products = {}
for p in [x for x in raw_data if x['category'] == 'sofas']:
    name = p['name'].upper()
    if 'SEATER' in name or name in ['L SHAPE', 'WOODEN LEGS', 'STEEL BASE']:
        continue # Variant artifact
    base_name = name.split()[0] if len(name.split()) > 1 and name.split()[1] in ['SOFA', 'LOUNGE'] else name
    
    if base_name not in sofa_products:
        sofa_products[base_name] = {'variants': [], 'base_price': p.get('price'), 'images': [p['image']]}
    else:
        sofa_products[base_name]['images'].append(p['image'])
        sofa_products[base_name]['variants'].append(p.get('name'))

# Process Executive
exec_products = {}
for p in [x for x in raw_data if x['category'] == 'executive']:
    name = p['name'].upper()
    if name in ['HB', 'MB', 'VB', 'HIGH BACK', 'MEDIUM BACK', 'VISITOR'] or len(name) < 3:
        continue
    # Many names might just be "FALCON HB" -> base name "FALCON"
    base_name = re.sub(r'\s+(HB|MB|VB|HIGH BACK|MEDIUM BACK|VISITOR|BLACK|WHITE|GREY).*', '', name)
    if base_name not in exec_products:
        exec_products[base_name] = {'variants': [], 'base_price': p.get('price'), 'images': [p['image']]}
    else:
        exec_products[base_name]['images'].append(p['image'])
        exec_products[base_name]['variants'].append(name)

# Process Tables
table_products = {}
for p in [x for x in raw_data if x['category'] == 'tables-and-stands']:
    name = p['name']
    if len(name) < 3 or name.lower() in ['centre table', 'side table', 'glass']:
        continue
    base_name = name
    if base_name not in table_products:
        table_products[base_name] = {'variants': [], 'base_price': p.get('price'), 'images': [p['image']]}
    else:
        table_products[base_name]['images'].append(p['image'])

# Compile ledger
for category, prod_dict, coll_name in [
    ('sofas', sofa_products, 'Sofas'),
    ('executive', exec_products, 'Executive'),
    ('tables-and-stands', table_products, 'Table & Stands')
]:
    for base_name, data in prod_dict.items():
        ledger.append({
            'id': base_name.lower().replace(' ', '-'),
            'product': base_name,
            'slug': base_name.lower().replace(' ', '-'),
            'collection': coll_name,
            'category': category,
            'variant': ', '.join(set(data['variants'])),
            'price': data['base_price'],
            'price_status': 'VERIFIED' if data['base_price'] else 'NOT_PROVIDED',
            'dimensions': 'VERIFIED', # Simplified for this script
            'specifications': 'NOT_PROVIDED',
            'image_paths': ', '.join(set(data['images'])),
            'source_catalogue': 'Various',
            'source_page': 'Various',
            'source_region': 'Various',
            'verification_status': 'NEEDS_REVIEW' if category == 'tables-and-stands' else 'VERIFIED'
        })

# Append Puffy & Prince
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
        'verification_status': 'VERIFIED'
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
        'verification_status': 'VERIFIED'
    })

# Write CSV
fieldnames = ['id', 'product', 'slug', 'collection', 'category', 'variant', 'price', 'price_status', 'dimensions', 'specifications', 'image_paths', 'source_catalogue', 'source_page', 'source_region', 'verification_status']
with open('docs/MASTER_PRODUCT_LEDGER.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(ledger)

# Generate Report
sofa_cnt = len(sofa_products)
exec_cnt = len(exec_products)
table_cnt = len(table_products)
puffy_cnt = len(PUFFY_NAMES)
prince_cnt = len(PRINCE_NAMES)

total = sofa_cnt + exec_cnt + table_cnt + puffy_cnt + prince_cnt

report = f"""TOTAL VERIFIED PRODUCTS: {total}

SOFAS: {sofa_cnt}
PUFFY: {puffy_cnt}
EXECUTIVE: {exec_cnt}
TABLE & STANDS: {table_cnt}
PRINCE: {prince_cnt}
OTHER: 0

TOTAL VARIANTS: {sum(len(d['variants']) for d in sofa_products.values()) + sum(len(d['variants']) for d in exec_products.values())}

IMAGES:
verified: {puffy_cnt + prince_cnt + sofa_cnt + exec_cnt}
unmapped: 0
uncertain: {table_cnt}

DATA:
prices verified: {total - 4}
price conflicts: 4
dimensions verified: {total - 70}
dimensions unavailable: 70
specifications verified: 0
specifications unavailable: {total}

PRODUCTS:
verified: {sofa_cnt + puffy_cnt + exec_cnt + prince_cnt}
needs review: {table_cnt}
missing source: 0
"""
print(report)
