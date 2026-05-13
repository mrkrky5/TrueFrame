import json
import re

file_path = r'c:\Users\Emre\Desktop\Tarih\data\cards.en.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for the corrupted saveButton blocks
# It looks like: "saveButton": ( \n <button ... \n </button> \n )
# And isSelected blocks too if any.

# Remove the saveButton corrupted blocks
content = re.sub(r',\s*"saveButton":\s*\(\s*<button.*?</button>\s*\)', '', content, flags=re.DOTALL)

# Re-check the content
try:
    data = json.loads(content)
    print("JSON is valid now.")
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("JSON saved successfully.")
except Exception as e:
    print(f"JSON is still invalid: {e}")
    # Show snippet of error
    match = re.search(r'\(.*?\)', content, re.DOTALL)
    if match:
        print(f"Found remaining corruption: {match.group(0)}")
