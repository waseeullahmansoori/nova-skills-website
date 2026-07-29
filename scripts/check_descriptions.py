import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def main():
    print("🔍 Auditing Meta Description Lengths (Target: 140–160 chars)...\n")
    issues = []
    
    for root, dirs, files in os.walk(BASE_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                rel_path = os.path.relpath(path, BASE_DIR)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                m = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', content, re.IGNORECASE)
                if not m:
                    m = re.search(r'<meta\s+content="([^"]+)"\s+name="description"', content, re.IGNORECASE)
                if not m:
                    m = re.search(r"<meta\s+name='description'\s+content='([^']+)'", content, re.IGNORECASE)

                
                if m:
                    desc = m.group(1).strip()
                    length = len(desc)
                    status = "OK" if 140 <= length <= 160 else "AFFECTED"
                    print(f"[{status}] {rel_path} ({length} chars)")
                    print(f"     \"{desc}\"\n")
                    if status == "AFFECTED":
                        issues.append((rel_path, desc, length, path))
                else:
                    print(f"[MISSING] {rel_path}: No meta description found!\n")

    print(f"\nSummary: Found {len(issues)} affected page(s) with meta description length outside 140–160 chars.")

if __name__ == '__main__':
    main()
