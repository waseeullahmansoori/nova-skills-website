import os
import sys
import urllib.request
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS_DIR = os.path.join(BASE_DIR, 'public', 'fonts')
os.makedirs(FONTS_DIR, exist_ok=True)

# Google Fonts URL for modern WOFF2 files
FONT_URL = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

TARGET_FONTS = {
    ('Plus Jakarta Sans', '600', 'normal'): 'PlusJakartaSans-600.woff2',
    ('Plus Jakarta Sans', '700', 'normal'): 'PlusJakartaSans-700.woff2',
    ('Plus Jakarta Sans', '800', 'normal'): 'PlusJakartaSans-800.woff2',
    ('Inter', '400', 'normal'): 'Inter-400.woff2',
    ('Inter', '500', 'normal'): 'Inter-500.woff2',
    ('Inter', '600', 'normal'): 'Inter-600.woff2',
}

def main():
    print("🚀 Fetching WOFF2 fonts from Google Fonts API...")

    req = urllib.request.Request(FONT_URL, headers=HEADERS)
    css_content = urllib.request.urlopen(req).read().decode('utf-8')

    # Parse @font-face blocks
    blocks = css_content.split('@font-face')
    downloaded_files = {}

    for block in blocks:
        if not block.strip():
            continue
        
        # Check subset: latin
        if 'latin' not in block and 'unicode-range' in block and 'U+0000-00FF' not in block:
            continue

        family_m = re.search(r"font-family:\s*['\"]?([^'\";\n]+)", block)
        style_m = re.search(r"font-style:\s*([^;\n]+)", block)
        weight_m = re.search(r"font-weight:\s*([^;\n]+)", block)
        url_m = re.search(r"url\((https://[^\)]+\.woff2)\)", block)

        if family_m and weight_m and url_m:
            family = family_m.group(1).strip()
            weight = weight_m.group(1).strip()
            style = style_m.group(1).strip() if style_m else 'normal'
            url = url_m.group(1).strip()

            key = (family, weight, style)
            if key in TARGET_FONTS and key not in downloaded_files:
                filename = TARGET_FONTS[key]
                dest_path = os.path.join(FONTS_DIR, filename)

                print(f"Downloading {filename} ({family} {weight})...")
                urllib.request.urlretrieve(url, dest_path)
                file_size = os.path.getsize(dest_path)
                print(f"✅ Saved {filename} ({file_size / 1024:.1f} KB)")
                downloaded_files[key] = filename

    # Build local fonts.css
    css_lines = [
        "/* ============================================================",
        "   NOVA SKILLS – Self-Hosted WOFF2 Fonts CSS",
        "   Zero Render-Blocking • font-display: swap • Subsetting",
        "   ============================================================ */",
        ""
    ]

    font_definitions = [
        ("Plus Jakarta Sans", "600", "PlusJakartaSans-600.woff2"),
        ("Plus Jakarta Sans", "700", "PlusJakartaSans-700.woff2"),
        ("Plus Jakarta Sans", "800", "PlusJakartaSans-800.woff2"),
        ("Inter", "400", "Inter-400.woff2"),
        ("Inter", "500", "Inter-500.woff2"),
        ("Inter", "600", "Inter-600.woff2"),
    ]

    for family, weight, file_name in font_definitions:
        css_lines.append(f"@font-face {{")
        css_lines.append(f"  font-family: '{family}';")
        css_lines.append(f"  font-style: normal;")
        css_lines.append(f"  font-weight: {weight};")
        css_lines.append(f"  font-display: swap;")
        css_lines.append(f"  src: url('{file_name}') format('woff2');")
        css_lines.append(f"  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+2082, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;")
        css_lines.append(f"}}\n")

    css_path = os.path.join(FONTS_DIR, 'fonts.css')
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(css_lines))

    print(f"\n🎉 Successfully created public/fonts/fonts.css with {len(font_definitions)} @font-face rules!")

if __name__ == '__main__':
    main()
