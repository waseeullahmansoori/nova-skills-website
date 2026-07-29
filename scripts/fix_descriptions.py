import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DESCRIPTIONS = {
    'index.html': "Nova Skills is India's premier skill institute offering 100+ practical courses across 12 academies with expert mentors, live projects, and placement support.", # 156 chars
    'contact.html': "Contact Nova Skills Education Institute in Siddharth Nagar. Call +91 9695904440 or book a free career counselling session with our expert admissions team.", # 152 chars
    'contact/index.html': "Contact Nova Skills Education Institute in Siddharth Nagar. Call +91 9695904440 or book a free career counselling session with our expert admissions team.", # 152 chars

    'courses.html': "Explore 100+ job-oriented courses across 12 academies at Nova Skills — Digital Marketing, Coding, AI, Design, and Video Editing with placement assistance.", # 155 chars
    'course-detail.html': "Explore comprehensive course details, syllabus modules, practical tools, live projects, certification info, and mentor profiles at Nova Skills Institute.", # 153 chars
    'thank-you.html': "Thank you for submitting your course enquiry to Nova Skills Education Institute. Our senior admissions counsellor will contact you within 2 hours.", # 146 chars
    'thank-you/index.html': "Thank you for submitting your course enquiry to Nova Skills Education Institute. Our senior admissions counsellor will contact you within 2 hours.", # 146 chars
    'lead-success.html': "Your counselling session or course request has been successfully received by Nova Skills Education Institute. Check next steps and calendar reminder details.", # 157 chars
    'lead-success/index.html': "Your counselling session or course request has been successfully received by Nova Skills Education Institute. Check next steps and calendar reminder details.", # 157 chars
    'privacy-policy/index.html': "Read the official Privacy Policy of Nova Skills Education Institute. Learn how we protect student data, manage cookies, and ensure user privacy and security.", # 156 chars
    'refund-policy/index.html': "Read the official Refund Policy of Nova Skills Education Institute covering course registration fees, refund eligibility, cancellation windows, and timelines.", # 159 chars
    'terms-and-conditions/index.html': "Read the official Terms & Conditions of Nova Skills Education Institute governing website usage, student enrolment, payment policies, and intellectual property.", # 160 chars
    '404.html': "Page not found. Explore Nova Skills job-oriented courses, 12 academies, career resources, and admissions assistance to find what you are looking for.", # 150 chars
}

def update_description(rel_path, new_desc):
    file_path = os.path.join(BASE_DIR, rel_path.replace('/', os.sep))
    if not os.path.exists(file_path):
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'(<meta\s+name=["\']description["\']\s+content=["\'])([^"\']+)(["\'])'
    if re.search(pattern, content, re.IGNORECASE):
        new_content = re.sub(pattern, f'\\g<1>{new_desc}\\g<3>', content, flags=re.IGNORECASE)
    else:
        pattern2 = r'(<meta\s+content=["\'])([^"\']+)(["\']\s+name=["\']description["\'])'
        if re.search(pattern2, content, re.IGNORECASE):
            new_content = re.sub(pattern2, f'\\g<1>{new_desc}\\g<3>', content, flags=re.IGNORECASE)
        else:
            return

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Updated {rel_path}: {len(new_desc)} chars")

def main():
    print("🚀 Updating meta descriptions to 140–160 chars...\n")
    for path, desc in DESCRIPTIONS.items():
        update_description(path, desc)
    print("\n🎉 Meta descriptions updated successfully!")

if __name__ == '__main__':
    main()
