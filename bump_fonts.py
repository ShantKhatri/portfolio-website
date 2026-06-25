import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We need to be careful with replacement order. Replace largest first to avoid double replacement if they overlapped, though here they don't overlap as we look for exact `text-[Xpx]`.
    replacements = {
        r"text-\[9px\]": "text-[11px]",
        r"text-\[10px\]": "text-[12px]",
        r"text-\[11px\]": "text-[13px]",
        r"text-\[12px\]": "text-[14px]",
        r"text-\[13px\]": "text-[15px]",
        r"text-\[14px\]": "text-[16px]",
        r"text-\[16px\]": "text-[18px]"
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
