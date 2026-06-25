import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # clamp(28px, 5vw, 44px) -> clamp(32px, 5vw, 48px)
    # clamp(24px, 4vw, 36px) -> clamp(28px, 4vw, 40px)
    # clamp(32px, 6vw, 52px) -> clamp(36px, 6vw, 56px)
    replacements = {
        r"clamp\(28px, 5vw, 44px\)": "clamp(32px, 5vw, 48px)",
        r"clamp\(24px, 4vw, 36px\)": "clamp(28px, 4vw, 40px)",
        r"clamp\(32px, 6vw, 52px\)": "clamp(36px, 6vw, 56px)"
    }

    new_content = content
    for pattern, repl in replacements.items():
        new_content = re.sub(pattern, repl, new_content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)

for root, _, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            replace_in_file(os.path.join(root, file))
