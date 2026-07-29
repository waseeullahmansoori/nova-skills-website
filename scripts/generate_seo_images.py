import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.join(os.getcwd(), 'public', 'images', 'seo')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def draw_gradient(draw, width, height, start_color, end_color):
    r1, g1, b1 = start_color
    r2, g2, b2 = end_color
    for y in range(height):
        r = int(r1 + (r2 - r1) * (y / height))
        g = int(g1 + (g2 - g1) * (y / height))
        b = int(b1 + (b2 - b1) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def load_font(size):
    font_paths = [
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arial.ttf"
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_social_card(filename, title, subtitle, category_tag="NOVA SKILLS", theme="dark"):
    width, height = 1200, 630
    img = Image.new("RGB", (width, height), color=(1, 23, 49))
    draw = ImageDraw.Draw(img)

    if theme == "orange":
        start_c, end_c = (1, 23, 49), (40, 15, 5)
        accent_c = (255, 107, 0)
    elif theme == "purple":
        start_c, end_c = (1, 23, 49), (30, 10, 50)
        accent_c = (139, 92, 246)
    elif theme == "blue":
        start_c, end_c = (1, 23, 49), (5, 50, 90)
        accent_c = (37, 99, 235)
    else:
        start_c, end_c = (1, 23, 49), (3, 60, 70)
        accent_c = (5, 153, 168)

    draw_gradient(draw, width, height, start_c, end_c)

    draw.polygon([(850, 0), (1200, 0), (1200, 630), (700, 630)], fill=(*accent_c, 30))
    draw.line([(0, 620), (1200, 620)], fill=accent_c, width=10)
    draw.line([(0, 0), (1200, 0)], fill=accent_c, width=8)

    font_tag = load_font(22)
    font_title = load_font(48)
    font_subtitle = load_font(26)
    font_brand = load_font(34)
    font_footer = load_font(22)

    draw.rounded_rectangle([60, 60, 60 + len(category_tag)*15 + 30, 100], radius=8, fill=accent_c)
    draw.text((75, 68), category_tag.upper(), font=font_tag, fill=(255, 255, 255))

    draw.text((850, 65), "NOVA SKILLS", font=font_brand, fill=(255, 255, 255))
    draw.text((850, 105), "Learn • Grow • Achieve", font=font_tag, fill=(5, 153, 168))

    words = title.split(' ')
    lines = []
    current_line = ""
    for w in words:
        test_line = current_line + (" " if current_line else "") + w
        bbox = font_title.getbbox(test_line)
        if (bbox[2] - bbox[0]) > 800:
            lines.append(current_line)
            current_line = w
        else:
            current_line = test_line
    if current_line:
        lines.append(current_line)

    y_text = 170
    for line in lines[:3]:
        draw.text((60, y_text), line, font=font_title, fill=(255, 255, 255))
        y_text += 60

    y_text += 20
    sub_words = subtitle.split(' ')
    sub_lines = []
    current_sub = ""
    for w in sub_words:
        test_sub = current_sub + (" " if current_sub else "") + w
        bbox = font_subtitle.getbbox(test_sub)
        if (bbox[2] - bbox[0]) > 820:
            sub_lines.append(current_sub)
            current_sub = w
        else:
            current_sub = test_sub
    if current_sub:
        sub_lines.append(current_sub)

    for line in sub_lines[:2]:
        draw.text((60, y_text), line, font=font_subtitle, fill=(203, 213, 225))
        y_text += 36

    draw.line([(60, 530), (1140, 530)], fill=(255, 255, 255, 40), width=1)
    draw.text((60, 550), "🌐 www.novaskills.in", font=font_footer, fill=(255, 255, 255))
    draw.text((450, 550), "🎯 100% Practical Training & Placement Support", font=font_footer, fill=(5, 153, 168))

    filepath = os.path.join(OUTPUT_DIR, filename)
    img.save(filepath, "PNG")
    print(f"Generated: {filename} ({width}x{height})")

cards = [
    ("og-default.png", "Nova Skills — Learn. Grow. Achieve.", "India's premier skill development institute. 12 Academies, 100+ practical courses with placement support.", "INSTITUTE HOMEPAGE", "teal"),
    ("og-courses.png", "Explore 100+ Career Courses", "Master Digital Marketing, AI, Full-Stack Coding, UI/UX Design, Motion Graphics & more.", "COURSE CATALOG", "teal"),
    ("og-course-detail.png", "Job-Oriented Practical Skill Programs", "Hands-on projects, industry mentors, capstone campaigns & career placement guidance.", "NOVA SKILLS COURSE", "blue"),
    ("og-course-dm-professional.png", "AI Digital Marketing Professional", "Master Google Ads, Meta Ads, SEO & GEO, Analytics & AI Marketing in 3 Months.", "DIGITAL MARKETING", "orange"),
    ("og-course-dm-mastery.png", "AI Digital Marketing Mastery", "Complete 6-Month Master Program covering 15 Modules, Live Budgets & Agency Skills.", "DIGITAL MARKETING", "orange"),
    ("og-course-ai-mastery.png", "Generative AI & Automation Mastery", "Master ChatGPT, Prompt Engineering, LLM Fine-Tuning, n8n Automation & AI Agents.", "AI ACADEMY", "purple"),
    ("og-course-full-stack.png", "Full-Stack Web Development (MERN)", "Build scalable web applications with React, Node.js, Express, MongoDB & Python.", "PROGRAMMING", "blue"),
    ("og-course-design-mastery.png", "UI/UX Design & Product Design", "Master Figma, Photoshop, User Research, Wireframing & Modern Product Design.", "DESIGN ACADEMY", "purple"),
    ("og-course-motion-graphics.png", "Video Editing & Motion Graphics", "Master Premiere Pro, After Effects, DaVinci Resolve & 3D Motion Visualisation.", "VIDEO & MOTION", "orange"),
    ("og-academies.png", "12 Specialised Skill Academies", "Industry-tailored academies designed for fast-track career growth and freelancing.", "ACADEMIES", "teal"),
    ("og-blog.png", "Nova Skills Blog & Career Insights", "Expert guides, salary reports, tech tutorials, AI trends & freelancing strategies.", "BLOG & ARTICLES", "teal"),
    ("og-blog-detail.png", "Practical Insights & Industry Tutorials", "Read the latest in-depth articles written by tech experts and industry mentors.", "NOVA SKILLS BLOG", "blue"),
    ("og-blog-ai-jobs-india-2026.png", "Top AI & Automation Jobs in India 2026", "Discover high-paying AI careers, required skillsets, and hiring trends across top tech hubs.", "AI TRENDS", "purple"),
    ("og-blog-digital-marketing-salary-india.png", "Digital Marketing Salary Guide 2026", "Comprehensive breakdown of entry-level to manager salaries for SEO, Meta Ads & Performance Marketers.", "CAREER SALARIES", "orange"),
    ("og-blog-learn-graphic-design-beginner-guide.png", "How to Learn Graphic Design in 2026", "Step-by-step roadmap for beginners to master Figma, Photoshop & build a client portfolio.", "DESIGN GUIDE", "purple"),
    ("og-blog-freelancing-fiverr-india-guide.png", "Complete Freelancing Guide for Beginners", "Learn how to land high-paying international clients on Fiverr, Upwork & LinkedIn.", "FREELANCING", "teal"),
    ("og-blog-n8n-ai-automation-beginners.png", "n8n AI Workflow Automation Guide", "Build autonomous AI agents and automated business workflows without complex code.", "AI AUTOMATION", "purple"),
    ("og-blog-youtube-channel-monetise-2026.png", "How to Launch & Monetise a YouTube Channel", "Proven strategies to grow subscribers, optimize video SEO, and scale channel revenue.", "CREATOR ECONOMY", "orange"),
    ("og-blog-chatgpt-prompts-marketing.png", "50+ Best ChatGPT Prompts for Marketers", "Save 20+ hours weekly using high-converting AI prompts for copywriting, SEO & ads.", "AI PROMPTS", "purple"),
    ("og-blog-kids-coding-benefits-india.png", "Why Kids Should Learn Coding & AI Early", "How early STEM & programming education builds logic, creativity & problem-solving.", "KIDS TECH", "blue"),
    ("og-blog-python-vs-javascript-2026.png", "Python vs JavaScript: Which to Learn First?", "Detailed comparison of learning curve, job market demand, and career opportunities.", "PROGRAMMING", "blue"),
    ("og-placements.png", "95% Placement Rate & Hiring Support", "250+ hiring partners, resume reviews, 1-on-1 mock interviews & placement guidance.", "CAREER PLACEMENTS", "teal"),
    ("og-success-stories.png", "Alumni Success Stories & Testimonials", "See how 5,000+ graduates transformed their careers and landed dream jobs.", "STUDENT REVIEWS", "teal"),
    ("og-assessment.png", "AI Career Advisor & Skill Assessment", "Take our AI-powered assessment to discover your personalized career roadmap.", "AI ADVISOR", "purple"),
    ("og-privacy-policy.png", "Nova Skills Privacy Policy", "Official data protection practices, cookies policy, user rights & privacy information.", "LEGAL & PRIVACY", "teal"),
    ("og-refund-policy.png", "Nova Skills Refund Policy", "Official course registration fees, refund eligibility, cancellation windows & request process.", "LEGAL & REFUNDS", "teal"),
    ("og-terms-and-conditions.png", "Nova Skills Terms & Conditions", "Official terms of service, website usage rules, enrolment policies & legal framework.", "LEGAL & TERMS", "teal"),
    ("og-contact.png", "Contact Nova Skills — Admissions & Enquiries", "Get in touch with career counsellors, call +91 9695904440, or visit our Siddharth Nagar campus.", "CONTACT & ADMISSIONS", "teal"),
    ("og-thank-you.png", "Enquiry Received — Nova Skills", "Thank you for contacting Nova Skills Education Institute. Our team will get back to you shortly.", "ENQUIRY CONFIRMED", "teal"),
    ("og-lead-success.png", "Lead Success — Nova Skills Education Institute", "Your counselling session or callback request has been confirmed. View next steps and student resources.", "SUCCESS CONFIRMED", "teal")
]





for filename, title, subtitle, category_tag, theme in cards:
    create_social_card(filename, title, subtitle, category_tag, theme)

print(f"All {len(cards)} social share cards generated successfully!")

