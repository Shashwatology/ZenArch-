import fitz
import json

doc = fitz.open('catalogues/ZEN EXECUTIVE SERIES - PRICELIST MAY 26_.pdf')

exec_specs = {}

for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text()
    lines = text.split('\n')
    
    current_product = None
    current_specs = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith('•'):
            if current_product:
                current_specs.append(line[1:].strip())
        elif 'IMP' in line or 'IND' in line or '/-' in line:
            # New product section
            if current_product and current_specs:
                exec_specs[current_product] = current_specs
            
            # Try to extract base name
            name_part = line.split('(')[0].strip() if '(' in line else line.split(':')[0].strip()
            # Clean up HB/MB
            name_part = name_part.replace(' HB', '').replace(' MB', '').replace(' DLX', '').replace(' ECO', '')
            name_part = name_part.replace(' WHITE', '').replace(' BLACK', '').replace(' GREY', '').strip()
            if len(name_part) > 2:
                current_product = name_part
                current_specs = []

if current_product and current_specs:
    exec_specs[current_product] = current_specs

print(f"Extracted specs for {len(exec_specs)} executive product families.")
for k, v in list(exec_specs.items())[:3]:
    print(f"{k}: {v}")

with open('lib/data/exec_specs.json', 'w') as f:
    json.dump(exec_specs, f, indent=2)
