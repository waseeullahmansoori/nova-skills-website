import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def fix_components_js():
    comp_path = os.path.join(BASE_DIR, 'components.js')
    with open(comp_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace relative links with root-relative paths in components.js
    replacements = [
        ('href="index.html"', 'href="/"'),
        ('href="index.html#why-nova"', 'href="/#why-nova"'),
        ('href="index.html#mentors"', 'href="/#mentors"'),
        ('href="index.html#certifications"', 'href="/#certifications"'),
        ('href="index.html#counselling"', 'href="/#counselling"'),
        ('href="index.html#testimonials"', 'href="/#testimonials"'),
        ('href="index.html#faq"', 'href="/#faq"'),
        ('href="index.html#placements"', 'href="/#placements"'),
        ('href="courses.html"', 'href="/courses.html"'),
        ('href="courses.html?', 'href="/courses.html?'),
        ('href="placements.html"', 'href="/placements.html"'),
        ('href="assessment.html"', 'href="/assessment.html"'),
        ('href="blog.html"', 'href="/blog.html"'),
        ('href="contact.html"', 'href="/contact/"'),
        ('href="login.html"', 'href="/login.html"'),
        ('href="privacy-policy/"', 'href="/privacy-policy/"'),
        ('href="refund-policy/"', 'href="/refund-policy/"'),
        ('href="terms-and-conditions/"', 'href="/terms-and-conditions/"'),
        ('src="branding%20content/Horizontal Logo.svg"', 'src="/branding%20content/Horizontal%20Logo.svg"'),
        ('src="branding%20content/White Logo.svg"', 'src="/branding%20content/White%20Logo.svg"'),
        ('src="branding%20content/icon 2.svg"', 'src="/branding%20content/icon%202.svg"'),
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    with open(comp_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ Updated components.js with root-relative URLs")

def remove_duplicate_root_files():
    root_files = ['contact.html', 'thank-you.html', 'lead-success.html']
    for file in root_files:
        path = os.path.join(BASE_DIR, file)
        if os.path.exists(path):
            os.remove(path)
            print(f"🗑️ Removed duplicate root file: {file} (handover to directory route /{file.replace('.html', '')}/)")

def main():
    print("🚀 Fixing contact page routing & root file conflicts...\n")
    fix_components_js()
    remove_duplicate_root_files()
    print("\n🎉 Routing fix completed!")

if __name__ == '__main__':
    main()
