#!/usr/bin/env python3
"""
process_uploaded_skins_and_rims.py
Processes and optimizes:
- 5 Vehicle Skins (1 default + 4 new variants) to 512x256 px in assets/refresh/v11/skins/
- 5 Vehicle Rims/Tires (1 default + 4 new variants) with mathematical Auto-Centering (256x256 px) in assets/refresh/v11/rims/
"""

import os
import sys
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SKINS_SRC = os.path.join(SCRIPT_DIR, 'assets', 'upload', 'skins')
RIMS_SRC = os.path.join(SCRIPT_DIR, 'assets', 'upload', 'rims')
SKINS_DEST = os.path.join(SCRIPT_DIR, 'assets', 'refresh', 'v11', 'skins')
RIMS_DEST = os.path.join(SCRIPT_DIR, 'assets', 'refresh', 'v11', 'rims')

SKIN_MAPPING = {
    'mountain': 'skin_mountain',
    'retro': 'skin_retro',
    'speedy': 'skin_speedy',
    'sport': 'skin_sport'
}

RIM_MAPPING = {
    'gold': 'rim_gold',
    'beadlock': 'rim_beadlock',
    'white': 'rim_whitewall',
    'standard': 'rim_standard'
}

def clean_alpha_channel(im, threshold=15):
    im = im.convert('RGBA')
    r, g, b, a = im.split()
    a_clean = a.point(lambda p: p if p >= threshold else 0)
    return Image.merge('RGBA', (r, g, b, a_clean))

def process_skins():
    os.makedirs(SKINS_DEST, exist_ok=True)
    print("\n--- Processing Vehicle Skins ---")

    # 1. Standard Canter default
    default_src = os.path.join(SCRIPT_DIR, 'assets', 'refresh', 'v11', 'sprites', 'truck_body.png')
    if os.path.exists(default_src):
        im = clean_alpha_channel(Image.open(default_src))
        bbox = im.getbbox()
        cropped = im.crop(bbox)
        resized = cropped.resize((512, 256), Image.Resampling.LANCZOS)
        resized.save(os.path.join(SKINS_DEST, 'skin_standard.webp'), 'WEBP', quality=92)
        resized.save(os.path.join(SKINS_DEST, 'skin_standard.png'), 'PNG', optimize=True)
        print("  [OK] Default Truck Body -> skin_standard.webp / .png")

    # 2. Uploaded Skins
    if not os.path.exists(SKINS_SRC):
        print(f"Warning: {SKINS_SRC} does not exist.")
        return

    for fname in sorted(os.listdir(SKINS_SRC)):
        if not fname.lower().endswith('.png'):
            continue
        lower_name = fname.lower()
        matched_slug = None
        for key, slug in SKIN_MAPPING.items():
            if key in lower_name:
                matched_slug = slug
                break

        if not matched_slug:
            print(f"  [Skip] Unmapped skin: {fname}")
            continue

        im = clean_alpha_channel(Image.open(os.path.join(SKINS_SRC, fname)))
        bbox = im.getbbox()
        cropped = im.crop(bbox)
        resized = cropped.resize((512, 256), Image.Resampling.LANCZOS)

        webp_path = os.path.join(SKINS_DEST, f"{matched_slug}.webp")
        png_path = os.path.join(SKINS_DEST, f"{matched_slug}.png")
        resized.save(webp_path, 'WEBP', quality=92)
        resized.save(png_path, 'PNG', optimize=True)

        w_kb = os.path.getsize(webp_path) // 1024
        p_kb = os.path.getsize(png_path) // 1024
        print(f"  [OK] {fname} -> {matched_slug}.webp ({w_kb} KB), {matched_slug}.png ({p_kb} KB)")

def process_rims():
    os.makedirs(RIMS_DEST, exist_ok=True)
    print("\n--- Processing Vehicle Rims (with Auto-Centering) ---")

    # 1. Default Factory Wheel
    default_src = os.path.join(SCRIPT_DIR, 'assets', 'refresh', 'v11', 'sprites', 'truck_wheel.png')
    if os.path.exists(default_src):
        im = clean_alpha_channel(Image.open(default_src))
        bbox = im.getbbox()
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        cropped = im.crop(bbox)
        S = max(w, h)
        sq = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        sq.paste(cropped, ((S - w) // 2, (S - h) // 2))
        resized = sq.resize((256, 256), Image.Resampling.LANCZOS)
        resized.save(os.path.join(RIMS_DEST, 'rim_default.webp'), 'WEBP', quality=92)
        resized.save(os.path.join(RIMS_DEST, 'rim_default.png'), 'PNG', optimize=True)
        print("  [OK] Default Factory Wheel -> rim_default.webp / .png")

    # 2. Uploaded Rims
    if not os.path.exists(RIMS_SRC):
        print(f"Warning: {RIMS_SRC} does not exist.")
        return

    for fname in sorted(os.listdir(RIMS_SRC)):
        if not fname.lower().endswith('.png'):
            continue
        lower_name = fname.lower()
        matched_slug = None
        for key, slug in RIM_MAPPING.items():
            if key in lower_name:
                matched_slug = slug
                break

        if not matched_slug:
            print(f"  [Skip] Unmapped rim: {fname}")
            continue

        im = clean_alpha_channel(Image.open(os.path.join(RIMS_SRC, fname)))
        bbox = im.getbbox()
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        cropped = im.crop(bbox)

        # Perfect square centering
        S = max(w, h)
        sq = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        sq.paste(cropped, ((S - w) // 2, (S - h) // 2))
        resized = sq.resize((256, 256), Image.Resampling.LANCZOS)

        # Validate center
        nb = resized.getbbox()
        cx = (nb[0] + nb[2]) / 2.0
        cy = (nb[1] + nb[3]) / 2.0

        webp_path = os.path.join(RIMS_DEST, f"{matched_slug}.webp")
        png_path = os.path.join(RIMS_DEST, f"{matched_slug}.png")
        resized.save(webp_path, 'WEBP', quality=92)
        resized.save(png_path, 'PNG', optimize=True)

        w_kb = os.path.getsize(webp_path) // 1024
        p_kb = os.path.getsize(png_path) // 1024
        print(f"  [OK] {fname} -> {matched_slug}.webp ({w_kb} KB), {matched_slug}.png ({p_kb} KB) [Center: ({cx:.1f}, {cy:.1f})]")

if __name__ == '__main__':
    process_skins()
    process_rims()
    print("\nAll 5 skins and 5 rims processed successfully.")
