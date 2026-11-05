import base64
import os
import shutil
from PIL import Image

def main():
    print("Synchronizing brand assets from 02_BRAND_REFERENCES...")

    # 1. Favicon (64x64, 192x192)
    burger = Image.open('public/brand/beffger-icon.png')
    max_dim = max(burger.size)
    fav = Image.new('RGBA', (max_dim + 40, max_dim + 40), (0, 0, 0, 0))
    fav.paste(burger, ((fav.width - burger.width) // 2, (fav.height - burger.height) // 2), burger)
    fav.resize((64, 64), Image.Resampling.LANCZOS).save('public/brand/favicon.png')
    fav.resize((192, 192), Image.Resampling.LANCZOS).save('public/brand/app-icon.png')

    # 2. Horizontal logo SVG
    horiz = Image.open('public/brand/beffger-logo-horizontal.png')
    with open('public/brand/beffger-logo-horizontal.png', 'rb') as f:
        b64_h = base64.b64encode(f.read()).decode('utf-8')

    svg_h = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {horiz.width} {horiz.height}" width="100%" height="100%">\n  <image href="data:image/png;base64,{b64_h}" width="{horiz.width}" height="{horiz.height}"/>\n</svg>\n'
    with open('public/brand/beffger-logo-horizontal.svg', 'w', encoding='utf-8') as f:
        f.write(svg_h)

    # 3. Master vertical logo SVG
    master = Image.open('public/brand/beffger-logo.png')
    with open('public/brand/beffger-logo.png', 'rb') as f:
        b64_m = base64.b64encode(f.read()).decode('utf-8')

    svg_m = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {master.width} {master.height}" width="100%" height="100%">\n  <image href="data:image/png;base64,{b64_m}" width="{master.width}" height="{master.height}"/>\n</svg>\n'
    with open('public/brand/beffger-logo.svg', 'w', encoding='utf-8') as f:
        f.write(svg_m)

    # 4. Favicon SVG
    with open('public/brand/favicon.png', 'rb') as f:
        b64_fav = base64.b64encode(f.read()).decode('utf-8')
    svg_fav = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n  <image href="data:image/png;base64,{b64_fav}" width="64" height="64"/>\n</svg>\n'
    with open('public/brand/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_fav)

    # 5. Standalone icon SVG
    with open('public/brand/beffger-icon.png', 'rb') as f:
        b64_icon = base64.b64encode(f.read()).decode('utf-8')
    svg_icon = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {burger.width} {burger.height}" width="100%" height="100%">\n  <image href="data:image/png;base64,{b64_icon}" width="{burger.width}" height="{burger.height}"/>\n</svg>\n'
    with open('public/brand/beffger-icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_icon)

    # 6. Copy 3D Billboard Banner
    os.makedirs('public/images/hero', exist_ok=True)
    shutil.copyfile('02_BRAND_REFERENCES/Logo de hamburguesas Beff-Ger-1.png', 'public/brand/beffger-banner-3d.png')
    shutil.copyfile('02_BRAND_REFERENCES/Logo de hamburguesas Beff-Ger-1.png', 'public/images/hero/beffger-banner-3d.png')

    print("SUCCESS: All official brand assets synchronized.")

if __name__ == '__main__':
    main()
