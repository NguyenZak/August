from bs4 import BeautifulSoup
import re

with open('august_source.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print("--- LOGOS / IMAGES IN HEADER ---")
for img in soup.find_all('img'):
    src = img.get('src')
    if src and ('logo' in src.lower() or 'header' in src.lower() or 'svg' in src.lower()):
        print(src)

for svg in soup.find_all('svg'):
    # print some identifying info
    print(svg.get('class'), str(svg)[:100])

print("\n--- COLORS ---")
colors = set(re.findall(r'#[0-9a-fA-F]{3,6}', str(soup)))
print("Colors found in HTML:", colors)
