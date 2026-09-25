import os

def fix_brand(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or '.next' in root:
            continue
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.md'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if 'Zen Arc' in content or 'ZEN ARC' in content or 'Zen Arth' in content or 'ZenArt' in content:
                        new_content = content.replace('Zen Arc', 'Zen Arch')
                        new_content = new_content.replace('ZEN ARC', 'ZEN ARCH')
                        new_content = new_content.replace('Zen Arth', 'Zen Arch')
                        new_content = new_content.replace('ZenArt', 'ZenArch')
                        
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                except Exception as e:
                    print(f"Failed {path}: {e}")

fix_brand('app')
fix_brand('components')
fix_brand('lib')
fix_brand('docs')
