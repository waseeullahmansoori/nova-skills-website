import os
import sys
import shutil
from PIL import Image

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_IMAGES_DIR = os.path.join(BASE_DIR, 'public', 'images')

FOLDERS = [
    'hero',
    'courses',
    'gallery',
    'blog',
    'faculty',
    'testimonials',
    'icons',
    'logo',
    'seo'
]

def ensure_folders():
    for f in FOLDERS:
        folder_path = os.path.join(PUBLIC_IMAGES_DIR, f)
        os.makedirs(folder_path, exist_ok=True)
    print("✅ Created all logical asset folders under public/images/")

def process_hero_image():
    src_hero = os.path.join(BASE_DIR, 'hero-student.jpg')
    hero_dir = os.path.join(PUBLIC_IMAGES_DIR, 'hero')

    if not os.path.exists(src_hero):
        print(f"⚠️ Source hero image not found at {src_hero}")
        return

    img = Image.open(src_hero)
    orig_w, orig_h = img.size
    aspect_ratio = orig_h / orig_w

    widths = [1200, 800, 400]
    processed_count = 0
    total_saved = 0

    # Save full resolution AVIF, WebP, JPG
    full_avif = os.path.join(hero_dir, 'hero-student.avif')
    full_webp = os.path.join(hero_dir, 'hero-student.webp')
    full_jpg = os.path.join(hero_dir, 'hero-student.jpg')

    img.save(full_avif, 'AVIF', quality=80)
    img.save(full_webp, 'WEBP', quality=82)
    img.save(full_jpg, 'JPEG', quality=85, optimize=True)

    orig_size = os.path.getsize(src_hero)
    avif_size = os.path.getsize(full_avif)
    webp_size = os.path.getsize(full_webp)

    print(f"📊 Original hero-student.jpg: {orig_size / 1024:.1f} KB")
    print(f"⚡ Full AVIF size: {avif_size / 1024:.1f} KB ({(1 - avif_size/orig_size)*100:.1f}% savings)")
    print(f"⚡ Full WebP size: {webp_size / 1024:.1f} KB ({(1 - webp_size/orig_size)*100:.1f}% savings)")

    # Generate responsive widths
    for w in widths:
        h = int(w * aspect_ratio)
        resized = img.resize((w, h), Image.Resampling.LANCZOS)

        avif_p = os.path.join(hero_dir, f'hero-student-{w}.avif')
        webp_p = os.path.join(hero_dir, f'hero-student-{w}.webp')
        jpg_p = os.path.join(hero_dir, f'hero-student-{w}.jpg')

        resized.save(avif_p, 'AVIF', quality=80)
        resized.save(webp_p, 'WEBP', quality=82)
        resized.save(jpg_p, 'JPEG', quality=85, optimize=True)
        processed_count += 3

    print(f"✅ Generated {processed_count} responsive hero variants (1200w, 800w, 400w) in AVIF, WebP & JPG")

def copy_and_organize_branding():
    branding_dir = os.path.join(BASE_DIR, 'branding content')
    logo_dir = os.path.join(PUBLIC_IMAGES_DIR, 'logo')
    icons_dir = os.path.join(PUBLIC_IMAGES_DIR, 'icons')

    if os.path.exists(branding_dir):
        for f in os.listdir(branding_dir):
            src_f = os.path.join(branding_dir, f)
            if os.path.isfile(src_f):
                if 'icon' in f.lower():
                    shutil.copy(src_f, os.path.join(icons_dir, f))
                else:
                    shutil.copy(src_f, os.path.join(logo_dir, f))
    print("✅ Organized SVG and PNG logos & icons into public/images/logo/ and public/images/icons/")

def generate_category_placeholders():
    # Generate high quality feature thumbnail placeholders for courses, gallery, blog, faculty, testimonials
    categories = {
        'courses': [('dm-course.jpg', 'Digital Marketing'), ('ai-course.jpg', 'AI & Automation'), ('web-course.jpg', 'Full Stack Development')],
        'gallery': [('campus-lab.jpg', 'Computer Lab'), ('classroom-session.jpg', 'Interactive Session')],
        'blog': [('blog-ai-2026.jpg', 'AI Job Trends 2026'), ('blog-seo-guide.jpg', 'SEO Mastery Guide')],
        'faculty': [('mentor-1.jpg', 'Senior Tech Mentor'), ('mentor-2.jpg', 'Design Faculty')],
        'testimonials': [('student-1.jpg', 'Graduate Reviewer'), ('student-2.jpg', 'Alumni Story')]
    }

    colors = {
        'courses': (5, 153, 168),
        'gallery': (1, 23, 49),
        'blog': (139, 92, 246),
        'faculty': (16, 185, 129),
        'testimonials': (245, 158, 11)
    }

    for cat, items in categories.items():
        cat_dir = os.path.join(PUBLIC_IMAGES_DIR, cat)
        color = colors.get(cat, (5, 153, 168))
        for filename, label in items:
            img = Image.new('RGB', (800, 500), color=color)
            base_name = os.path.splitext(filename)[0]

            avif_path = os.path.join(cat_dir, f'{base_name}.avif')
            webp_path = os.path.join(cat_dir, f'{base_name}.webp')
            jpg_path = os.path.join(cat_dir, f'{base_name}.jpg')

            img.save(avif_path, 'AVIF', quality=80)
            img.save(webp_path, 'WEBP', quality=82)
            img.save(jpg_path, 'JPEG', quality=85)

    print("✅ Generated category feature images (AVIF, WebP, JPG) for courses, gallery, blog, faculty, testimonials")

def main():
    print("🚀 Starting Nova Skills Image Optimization Pipeline...\n")
    ensure_folders()
    process_hero_image()
    copy_and_organize_branding()
    generate_category_placeholders()
    print("\n🎉 Image Optimization Pipeline completed successfully!")

if __name__ == '__main__':
    main()
