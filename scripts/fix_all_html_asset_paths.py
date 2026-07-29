import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def fix_html_file(file_path):
    rel_path = os.path.relpath(file_path, BASE_DIR)
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    original = content

    # 1. Update font-face src in critical CSS to root-absolute /public/fonts/
    content = content.replace("url('PlusJakartaSans-600.woff2')", "url('/public/fonts/PlusJakartaSans-600.woff2')")
    content = content.replace("url('PlusJakartaSans-700.woff2')", "url('/public/fonts/PlusJakartaSans-700.woff2')")
    content = content.replace("url('PlusJakartaSans-800.woff2')", "url('/public/fonts/PlusJakartaSans-800.woff2')")
    content = content.replace("url('Inter-400.woff2')", "url('/public/fonts/Inter-400.woff2')")
    content = content.replace("url('Inter-500.woff2')", "url('/public/fonts/Inter-500.woff2')")
    content = content.replace("url('Inter-600.woff2')", "url('/public/fonts/Inter-600.woff2')")
    content = content.replace("url('../public/fonts/", "url('/public/fonts/")

    # 2. Update CSS link preloads & stylesheets to /css/
    content = re.sub(r'href=["\'](?:\.\./)?css/styles\.min\.css["\']', 'href="/css/styles.min.css"', content)
    content = re.sub(r'href=["\'](?:\.\./)?css/critical\.min\.css["\']', 'href="/css/critical.min.css"', content)
    content = re.sub(r'href=["\'](?:\.\./)?css/styles\.css["\']', 'href="/css/styles.min.css"', content)

    # 3. Update Font preloads to /public/fonts/
    content = re.sub(r'href=["\'](?:\.\./)?public/fonts/([^"\']+)["\']', r'href="/public/fonts/\1"', content)

    # 4. Update JS scripts to /js/
    content = re.sub(r'src=["\'](?:\.\./)?js/data\.min\.js["\']', 'src="/js/data.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?js/components\.min\.js["\']', 'src="/js/components.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?js/main\.min\.js["\']', 'src="/js/main.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?js/nova-ai-widget\.min\.js["\']', 'src="/js/nova-ai-widget.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?js/data\.js["\']', 'src="/js/data.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?js/components\.js["\']', 'src="/js/components.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?js/main\.js["\']', 'src="/js/main.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?components\.js["\']', 'src="/js/components.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?data\.js["\']', 'src="/js/data.min.js"', content)
    content = re.sub(r'src=["\'](?:\.\./)?main\.js["\']', 'src="/js/main.min.js"', content)

    # 5. Update Branding icons / logos
    content = re.sub(r'href=["\'](?:\.\./)?branding%20content/icon%202\.svg["\']', 'href="/branding%20content/icon%202.svg"', content)
    content = re.sub(r'src=["\'](?:\.\./)?branding%20content/([^"\']+)["\']', r'src="/branding%20content/\1"', content)

    # 6. Update images to /public/images/
    content = re.sub(r'src=["\'](?:\.\./)?public/images/([^"\']+)["\']', r'src="/public/images/\1"', content)
    content = re.sub(r'srcset=["\'](?:\.\./)?public/images/([^"\']+)["\']', r'srcset="/public/images/\1"', content)
    content = re.sub(r'href=["\'](?:\.\./)?public/images/([^"\']+)["\']', r'href="/public/images/\1"', content)

    # 7. Update internal links targeting /contact/index.html to /contact/
    content = content.replace('/contact/index.html', '/contact/')
    content = content.replace('../contact/index.html', '/contact/')
    content = content.replace('contact/index.html', '/contact/')

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Root-absolute paths applied to: {rel_path}")

def main():
    print("🚀 Converting all HTML asset paths to root-absolute (/css/, /js/, /public/, /branding/)...\n")
    for root, dirs, files in os.walk(BASE_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                fix_html_file(os.path.join(root, file))

    print("\n🎉 All HTML asset paths converted to root-absolute successfully!")

if __name__ == '__main__':
    main()
