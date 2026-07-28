# Targeted clean fix for index.html

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Replace corrupted testimonial stars
text = text.replace('testimonial-stars">', 'testimonial-stars">⭐⭐⭐⭐⭐')

# Fix footer heart & project ROI
text = text.replace('Made with  in India', 'Made with ❤️ in India')

# Clean regex for bad unprintable characters
import re
text = re.sub(r'[\x80-\x9F\xAD]', '', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Targeted index.html clean done!')
