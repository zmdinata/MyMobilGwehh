#!/usr/bin/env python3
"""
process_uploaded_characters.py
Optimizes uploaded character expression sprites from assets/upload/characters/
into web-safe kebab/snake-case WebP and PNG formats at 384x384 px.
"""

import os
import sys
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(SCRIPT_DIR, 'assets', 'upload', 'characters')
DEST_DIR = os.path.join(SCRIPT_DIR, 'assets', 'refresh', 'v11', 'characters')

NAME_MAP = {
    'bu yulie': {
        'senyumhangat': 'bu_yulie_warm',
        'gembira': 'bu_yulie_happy',
        'khawatir': 'bu_yulie_concern'
    },
    'husna': {
        'bersorak': 'husna_cheer',
        'kedip': 'husna_tease',
        'lapar': 'husna_hungry'
    },
    'mangabdul': {
        'tertawa': 'mang_abdul_laugh'
    },
    'tion': {
        'normal': 'tion_normal',
        'fokus': 'tion_focus',
        'tersipu': 'tion_blush'
    },
    'zacky': {
        'menganalisis': 'zacky_analyze',
        'posepercaya': 'zacky_confident'
    }
}

def main():
    if not os.path.exists(SRC_DIR):
        print(f"Error: Source directory {SRC_DIR} does not exist.")
        sys.exit(1)

    os.makedirs(DEST_DIR, exist_ok=True)
    count = 0

    for fname in sorted(os.listdir(SRC_DIR)):
        if not fname.lower().endswith('.png'):
            continue

        lower_name = fname.lower()
        matched_slug = None

        for char_key, mood_dict in NAME_MAP.items():
            clean_key = char_key.replace(' ', '')
            clean_name = lower_name.replace(' ', '')
            if clean_key in clean_name:
                for pattern, slug in mood_dict.items():
                    if pattern in clean_name:
                        matched_slug = slug
                        break
            if matched_slug:
                break

        if not matched_slug:
            print(f"Warning: Could not map filename: {fname}")
            continue

        src_path = os.path.join(SRC_DIR, fname)
        img = Image.open(src_path).convert('RGBA')

        # High quality Lanczos resize to 384x384
        resized = img.resize((384, 384), Image.Resampling.LANCZOS)

        webp_path = os.path.join(DEST_DIR, f"{matched_slug}.webp")
        png_path = os.path.join(DEST_DIR, f"{matched_slug}.png")

        resized.save(webp_path, 'WEBP', quality=92)
        resized.save(png_path, 'PNG', optimize=True)

        webp_size = os.path.getsize(webp_path) // 1024
        png_size = os.path.getsize(png_path) // 1024
        print(f"[OK] {fname} -> {matched_slug}.webp ({webp_size} KB), {matched_slug}.png ({png_size} KB)")
        count += 1

    print(f"\nSuccessfully processed {count} character expression assets.")

if __name__ == '__main__':
    main()
