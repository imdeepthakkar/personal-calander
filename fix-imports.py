import re
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    items = [x.strip() for x in match.group(1).split(',') if x.strip()]
    unique_items = list(dict.fromkeys(items))
    return f"import {{ {', '.join(unique_items)} }} from 'lucide-react';"

content = re.sub(r"import\s*\{([^\}]+)\}\s*from\s*'lucide-react';", replacer, content)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
