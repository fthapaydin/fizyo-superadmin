import os
import re

base_dir = r'c:\Users\Protek\Desktop\fizyo-superadmin'

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Rebrand globally
def global_rebrand():
    for root, dirs, files in os.walk(base_dir):
        if 'node_modules' in root or '.git' in root:
            continue
        for file in files:
            if file.endswith(('.jsx', '.js', '.html', '.json', '.css')):
                path = os.path.join(root, file)
                content = read_file(path)
                new_content = content.replace('FizyoPanel', 'Fizyotim').replace('admin@fizyopanel.com', 'admin@fizyotim.com')
                if new_content != content:
                    write_file(path, new_content)

global_rebrand()

print("Rebrand completed.")
