import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def update_fonts_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine relative path prefix for font files
    rel_depth = os.path.relpath(os.path.dirname(filepath), BASE_DIR)
    font_prefix = '../public/fonts/' if rel_depth != '.' else 'public/fonts/'

    critical_preloads = f'''<!-- Critical Self-Hosted Fonts Preload -->
  <link rel="preload" href="{font_prefix}PlusJakartaSans-700.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="{font_prefix}Inter-400.woff2" as="font" type="font/woff2" crossorigin />'''

    # Pattern to match Google Fonts preconnect and link tags
    pattern = r'<!-- Google Fonts -->\s*<link rel="preconnect" href="https://fonts\.googleapis\.com"[^>]*>\s*(?:<link rel="preconnect" href="https://fonts\.gstatic\.com"[^>]*>\s*)?<link href="https://fonts\.googleapis\.com/css2\?[^"]+" rel="stylesheet"[^>]*>'

    if re.search(pattern, content):
        new_content = re.sub(pattern, critical_preloads, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Updated font links in: {os.path.relpath(filepath, BASE_DIR)}")
    else:
        # Generic fallback replacement
        generic_pattern = r'<link rel="preconnect" href="https://fonts\.googleapis\.com"[^>]*>\s*(?:<link rel="preconnect" href="https://fonts\.gstatic\.com"[^>]*>\s*)?<link href="https://fonts\.googleapis\.com/css2\?[^"]+" rel="stylesheet"[^>]*>'
        if re.search(generic_pattern, content):
            new_content = re.sub(generic_pattern, critical_preloads, content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Updated generic font links in: {os.path.relpath(filepath, BASE_DIR)}")

def main():
    print("🚀 Updating HTML files with critical self-hosted font preloads...\n")
    for root, dirs, files in os.walk(BASE_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                update_fonts_in_file(os.path.join(root, file))
    print("\n🎉 Font tags successfully updated across all HTML pages!")

if __name__ == '__main__':
    main()
