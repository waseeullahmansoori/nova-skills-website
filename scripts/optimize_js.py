import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_DIR = os.path.join(BASE_DIR, 'js')
os.makedirs(JS_DIR, exist_ok=True)

def simple_js_minify(js_code):
    # Remove block comments /* ... */
    js_code = re.sub(r'/\*[\s\S]*?\*/', '', js_code)
    # Remove single line comments // ... (except inside strings or URLs)
    lines = js_code.split('\n')
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('//'):
            continue
        # Remove console.log in production build (preserve console.error and console.warn)
        if 'console.log(' in line and 'color:' not in line:
            line = re.sub(r'console\.log\([^\);]+\);?', '', line)
        cleaned_lines.append(line)

    js_code = '\n'.join(cleaned_lines)
    # Collapse extra blank lines
    js_code = re.sub(r'\n\s*\n', '\n', js_code)
    return js_code.strip()

def process_js_files():
    files = ['data.js', 'components.js', 'main.js', 'nova-ai-widget.js', 'blog.js', 'blog-detail.js']
    stats = []

    for f_name in files:
        src_path = os.path.join(BASE_DIR, f_name)
        if not os.path.exists(src_path):
            continue

        with open(src_path, 'r', encoding='utf-8') as f:
            code = f.read()

        orig_size = len(code.encode('utf-8'))
        min_code = simple_js_minify(code)
        min_size = len(min_code.encode('utf-8'))

        out_name = f_name.replace('.js', '.min.js')
        out_path = os.path.join(JS_DIR, out_name)

        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(min_code)

        savings = (1 - min_size / orig_size) * 100
        stats.append((f_name, out_name, orig_size / 1024, min_size / 1024, savings))
        print(f"⚡ Built js/{out_name}: {min_size / 1024:.1f} KB (was {orig_size / 1024:.1f} KB - {savings:.1f}% savings)")

    return stats

def update_html_script_tags():
    print("\n🚀 Updating HTML files to use minified JS production bundles with defer...")
    count = 0

    for root, dirs, files in os.walk(BASE_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                rel_depth = os.path.relpath(os.path.dirname(file_path), BASE_DIR)
                js_prefix = '../js/' if rel_depth != '.' else 'js/'

                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                updated = False

                # Replace data.js
                if 'data.js' in content and 'data.min.js' not in content:
                    content = re.sub(r'src="[^"]*data\.js(?:\?[^"]*)?"', f'src="{js_prefix}data.min.js" defer', content)
                    updated = True

                # Replace components.js
                if 'components.js' in content and 'components.min.js' not in content:
                    content = re.sub(r'src="[^"]*components\.js(?:\?[^"]*)?"', f'src="{js_prefix}components.min.js" defer', content)
                    updated = True

                # Replace main.js
                if 'main.js' in content and 'main.min.js' not in content:
                    content = re.sub(r'src="[^"]*main\.js(?:\?[^"]*)?"', f'src="{js_prefix}main.min.js" defer', content)
                    updated = True


                if updated:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    count += 1
                    print(f"  ✅ Updated script tags in: {os.path.relpath(file_path, BASE_DIR)}")

    print(f"\n🎉 Successfully updated {count} HTML pages with deferred minified JS bundles!")

def main():
    print("🚀 Starting Nova Skills JavaScript Optimization Pipeline...\n")
    process_js_files()
    update_html_script_tags()
    print("\n🎉 JavaScript Optimization Pipeline completed successfully!")

if __name__ == '__main__':
    main()
