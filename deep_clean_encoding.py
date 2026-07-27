import os, glob, re

# Detailed replacement dictionary for Mojibake characters -> clean UTF-8
MOJIBAKE_MAP = {
    'Â·': ' • ',
    'â€¢': ' • ',
    'â€“': '–',
    'â€”': '—',
    'â€"': '–',
    'âœ•': '✕',
    'âœ': '✅',
    'âœ…': '✅',
    'â‚¹': '₹',
    'â€˜': '‘',
    'â€™': '’',
    'â€œ': '“',
    'â€': '”',
    'â†': '→',
    '”¥': '⭐',
    'â˜…': '★',
    'â˜': '★',
    'ðŸŽ“': '🎓',
    'ðŸ“ž': '📞',
    'ðŸŽ¯': '🎯',
    'ðŸ †': '🏆',
    'ðŸ’¼': '💼',
    'ðŸ ›ï¸ ': '🏛️',
    'ðŸ ›': '🏛️',
    'ðŸ‘¨â€ ðŸ «': '👨‍🏫',
    'ðŸ’»': '💻',
    'ðŸš€': '🚀',
    'ðŸ¤ ': '🤝',
    'âŒ„': '⌄',
    'ðŸ“': '📚',
    'ðŸ“°': '📰',
    'ðŸ”': '🔍',
    'ðŸŽ🎉': '🎉',
    'ðŸ”🔒': '🔒',
    'Â ': ' ',
    ' Â ': ' ',
}

files = glob.glob('*.html') + glob.glob('*.js') + glob.glob('*.css')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    original = content
    # Remove standalone spurious 'Â' before spaces or punctuation
    content = re.sub(r'Â(?=[\s\·\•\₹\$\d\-\|\.\,\:\!\?\(\)])', '', content)
    
    for bad, good in MOJIBAKE_MAP.items():
        if bad in content:
            content = content.replace(bad, good)

    # Clean up any leftover stray 'Â'
    content = content.replace('Â', '')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed encoding in: {filepath}')
    else:
        print(f'Clean file: {filepath}')

print('Deep encoding cleanup completed successfully!')
