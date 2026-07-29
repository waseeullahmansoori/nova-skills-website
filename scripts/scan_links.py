import os
import sys
import re
import urllib.parse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def resolve_href(source_file, url):
    url = urllib.parse.unquote(url.split('#')[0].split('?')[0])
    if not url:
        return True, "Empty / Hash only"


    if url.startswith('http://') or url.startswith('https://') or url.startswith('tel:') or url.startswith('mailto:') or url.startswith('data:'):
        return True, "External / Protocol link"

    # Handle domain absolute links like /contact/ or /public/images/...
    if url.startswith('/'):
        clean_url = url.lstrip('/')
        target_path = os.path.join(BASE_DIR, clean_url.replace('/', os.sep))
    else:
        file_dir = os.path.dirname(source_file)
        target_path = os.path.join(file_dir, url.replace('/', os.sep))

    # Check file or directory/index.html
    if os.path.exists(target_path):
        if os.path.isdir(target_path):
            index_path = os.path.join(target_path, 'index.html')
            if os.path.exists(index_path):
                return True, "Directory index exists"
            else:
                return False, f"Directory missing index.html: {target_path}"
        return True, "File exists"

    # Try appending .html
    if not target_path.endswith('.html'):
        if os.path.exists(target_path + '.html'):
            return True, "File exists (.html)"

    # Try index.html under path if path is directory route
    if os.path.exists(os.path.join(target_path, 'index.html')):
        return True, "Directory index exists"

    return False, f"Missing file: {target_path}"

def scan_all_files():
    print("🔍 Scanning all HTML, JS, CSS, and Sitemap files for broken links & missing assets...\n")
    broken = []

    for root, dirs, files in os.walk(BASE_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html') or file.endswith('.js') or file.endswith('.xml'):
                source_path = os.path.join(root, file)
                rel_source = os.path.relpath(source_path, BASE_DIR)

                with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

                # Extract href and src and og:image / twitter:image content
                urls = set()

                # 1. href="..."
                for m in re.finditer(r'href=["\']([^"\']+)["\']', content, re.IGNORECASE):
                    val = m.group(1).strip()
                    if val and not val.startswith('#') and not val.startswith('javascript:'):
                        urls.add(('href', val))

                # 2. src="..." or srcset="..."
                for m in re.finditer(r'src(?:set)?=["\']([^"\']+)["\']', content, re.IGNORECASE):
                    val = m.group(1).strip()
                    # Handle srcset space separation
                    for part in val.split(','):
                        sub_val = part.strip().split(' ')[0]
                        if sub_val and not sub_val.startswith('data:'):
                            urls.add(('src', sub_val))

                # 3. og:image / twitter:image
                for m in re.finditer(r'<meta\s+(?:property|name)=["\'](?:og:image|twitter:image|og:image:secure_url)["\']\s+content=["\']([^"\']+)["\']', content, re.IGNORECASE):
                    val = m.group(1).strip()
                    urls.add(('og:image', val))

                for tag, url in urls:
                    ok, reason = resolve_href(source_path, url)
                    if not ok:
                        broken.append((rel_source, tag, url, reason))
                        print(f"❌ 404 BROKEN: [{rel_source}] ({tag}) -> \"{url}\" ({reason})")


    print(f"\nSummary: Found {len(broken)} broken link / missing asset references.")
    return broken

if __name__ == '__main__':
    scan_all_files()
