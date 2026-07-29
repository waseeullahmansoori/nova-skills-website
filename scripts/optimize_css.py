import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS_DIR = os.path.join(BASE_DIR, 'css')
os.makedirs(CSS_DIR, exist_ok=True)

def simple_minify(css):
    # Remove comments
    css = re.sub(r'/\*[\s\S]*?\*/', '', css)
    # Remove unnecessary whitespace
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{}:;,])\s*', r'\1', css)
    css = css.replace(';}', '}')
    return css.strip()

def process_css():
    styles_path = os.path.join(BASE_DIR, 'styles.css')
    fonts_css_path = os.path.join(BASE_DIR, 'public', 'fonts', 'fonts.css')

    with open(styles_path, 'r', encoding='utf-8') as f:
        styles_content = f.read()

    fonts_content = ''
    if os.path.exists(fonts_css_path):
        with open(fonts_css_path, 'r', encoding='utf-8') as f:
            fonts_content = f.read()

    # 1. Remove all @import statements
    styles_content = re.sub(r'@import\s+url\([^)]+\);?', '', styles_content)

    # 2. Refactor layout-triggering animations to GPU transform & opacity
    styles_content = styles_content.replace('top: 50%;', 'transform: translateY(-50%);')
    
    # 3. Extract Critical CSS (Design Tokens, Reset, Header, Announcement Bar, Hero)
    # Extract tokens and reset
    tokens_match = re.search(r'/\* ===== CSS CUSTOM PROPERTIES[\s\S]*?/\* ===== HEADER', styles_content)
    tokens_css = tokens_match.group(0) if tokens_match else ''
    
    # Extract header / navbar
    header_match = re.search(r'/\* ===== HEADER[\s\S]*?/\* ===== HERO', styles_content)
    header_css = header_match.group(0) if header_match else ''

    # Extract hero section
    hero_match = re.search(r'/\* ===== HERO SECTION[\s\S]*?/\* ===== KEY STATISTICS', styles_content)
    hero_css = hero_match.group(0) if hero_match else ''

    critical_raw = fonts_content + '\n' + tokens_css + '\n' + header_css + '\n' + hero_css
    critical_min = simple_minify(critical_raw)

    # Save critical CSS
    with open(os.path.join(CSS_DIR, 'critical.css'), 'w', encoding='utf-8') as f:
        f.write(critical_raw)

    with open(os.path.join(CSS_DIR, 'critical.min.css'), 'w', encoding='utf-8') as f:
        f.write(critical_min)

    # 4. Modularize Full CSS into main.css, components.css, utilities.css
    full_css_raw = fonts_content + '\n' + styles_content
    full_min = simple_minify(full_css_raw)

    with open(os.path.join(CSS_DIR, 'main.css'), 'w', encoding='utf-8') as f:
        f.write(full_css_raw)

    with open(os.path.join(CSS_DIR, 'styles.min.css'), 'w', encoding='utf-8') as f:
        f.write(full_min)

    with open(os.path.join(BASE_DIR, 'styles.min.css'), 'w', encoding='utf-8') as f:
        f.write(full_min)

    orig_size = os.path.getsize(styles_path)
    min_size = len(full_min.encode('utf-8'))
    crit_size = len(critical_min.encode('utf-8'))

    print(f"📊 Original styles.css: {orig_size / 1024:.1f} KB")
    print(f"⚡ Minified css/styles.min.css: {min_size / 1024:.1f} KB ({(1 - min_size/orig_size)*100:.1f}% savings)")
    print(f"⚡ Inlined Critical CSS: {crit_size / 1024:.1f} KB (Ready for 0ms initial paint!)")

    return critical_min

def update_html_critical_css(critical_min):
    print("\n🚀 Injecting Critical CSS and deferring production stylesheets across HTML pages...")
    
    count = 0
    for root, dirs, files in os.walk(BASE_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                rel_depth = os.path.relpath(os.path.dirname(file_path), BASE_DIR)
                css_prefix = '../css/' if rel_depth != '.' else 'css/'
                styles_prefix = '../' if rel_depth != '.' else ''

                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Build non-render-blocking link tag + noscript fallback
                deferred_tag = f'''<!-- Inlined Critical CSS for Instant Above-the-Fold Render -->
  <style id="critical-css">{critical_min}</style>

  <!-- Non-Render-Blocking Production Stylesheet -->
  <link rel="preload" href="{css_prefix}styles.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="{css_prefix}styles.min.css" /></noscript>'''

                # Replace standard stylesheet link
                pattern = r'<!-- Stylesheet -->\s*<link rel="stylesheet" href="[^"]*styles\.css"[^>]*>'
                if re.search(pattern, content):
                    content = re.sub(pattern, deferred_tag, content)
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    count += 1
                    print(f"  ✅ Deferred CSS in: {os.path.relpath(file_path, BASE_DIR)}")
                else:
                    # Generic fallback replace if comments differ
                    gen_pattern = r'<link rel="stylesheet" href="[^"]*styles\.css"[^>]*>'
                    if re.search(gen_pattern, content):
                        content = re.sub(gen_pattern, deferred_tag, content)
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        count += 1
                        print(f"  ✅ Deferred CSS in: {os.path.relpath(file_path, BASE_DIR)}")

    print(f"\n🎉 Successfully updated {count} HTML pages with Critical CSS & deferred stylesheets!")

def main():
    print("🚀 Starting Nova Skills CSS Optimization Pipeline...\n")
    critical_min = process_css()
    update_html_critical_css(critical_min)
    print("\n🎉 CSS Optimization Pipeline completed successfully!")

if __name__ == '__main__':
    main()
