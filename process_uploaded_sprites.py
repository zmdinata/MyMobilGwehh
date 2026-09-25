"""Create versioned, transparent game sprites from the uploaded PNG references.

This removes the light checkerboard matte connected to image edges and clears
the enclosed checkerboard apertures in the wheel art. It is deliberately tuned
to these supplied assets, not arbitrary photographs. Originals are untouched.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, PngImagePlugin


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "assets" / "refresh" / "sprites"
DEFAULT_OUTPUT = ROOT / "assets" / "refresh" / "v11" / "sprites"
SPRITES = {
    "Truk kurir—sprite bodi transparan.png": ("truck_body.png", (320, 160)),
    "Roda — sprite transparan.png": ("truck_wheel.png", (192, 192)),
    "Jeriken bahan bakar — sprite transparan.png": ("fuel_can.png", (120, 160)),
    "Koin gizi — sprite transparan.png": ("coin_gizi.png", (96, 96)),
    "Kayu rintangan — sprite transparan.png": ("obstacle_log.png", (192, 80)),
    "Paket makanan — sprite transparan.png": ("food_parcel.png", (160, 160)),
    "Gerbang sekolah SD, SMP, SMA — ilustrasi lebar transparan.png": ("finish_gate.png", (520, 200)),
    "logo.png": ("logo.png", (350, 350)),
}


def clear_checker_aperture(rgba: np.ndarray, center: tuple[int, int], radius: int) -> None:
    """Remove checker pixels within a known, ink-bounded wheel opening."""
    height, width = rgba.shape[:2]
    cx, cy = center
    y, x = np.ogrid[:height, :width]
    distance = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    # Preserve the dark illustrated ring and antialias the cutout at its edge.
    alpha = np.clip((distance - radius) / 3.0, 0, 1)
    current = rgba[:, :, 3].astype(np.float32)
    rgba[:, :, 3] = np.minimum(current, np.round(alpha * 255).astype(np.uint8))


def cutout(image: Image.Image, name: str) -> tuple[Image.Image, float]:
    rgba = np.asarray(image.convert("RGBA")).copy()
    alpha = rgba[:, :, 3]
    if alpha.min() == 255:
        rgb = rgba[:, :, :3].astype(np.int16)
        neutral_bright = (rgb.max(axis=2) - rgb.min(axis=2) <= 20) & (rgb.mean(axis=2) >= 178)

        # Bridge the tiny antialiased gaps between checkerboard squares before
        # flooding from the canvas edge. Thick ink outlines keep interior ivory
        # panels and the wheel hub isolated from that flood.
        expanded = Image.fromarray(neutral_bright.astype(np.uint8) * 255, "L")
        expanded = expanded.filter(ImageFilter.MaxFilter(5))
        mask = Image.fromarray(np.where(np.asarray(expanded) > 0, 0, 255).astype(np.uint8), "L").copy()
        pixels = mask.load()
        width, height = mask.size
        seeds = set()
        for x in range(width):
            if pixels[x, 0] == 0:
                seeds.add((x, 0))
            if pixels[x, height - 1] == 0:
                seeds.add((x, height - 1))
        for y in range(height):
            if pixels[0, y] == 0:
                seeds.add((0, y))
            if pixels[width - 1, y] == 0:
                seeds.add((width - 1, y))
        for x, y in seeds:
            if pixels[x, y] == 0:
                ImageDraw.floodfill(mask, (x, y), 128, thresh=0)

        background = Image.fromarray((np.asarray(mask) == 128).astype(np.uint8) * 255, "L")
        background = np.asarray(background.filter(ImageFilter.MaxFilter(3))) > 0
        rgba[:, :, 3][background] = 0

        # The checkerboard is also visible through the closed, outlined wheel
        # apertures. Remove those pixels by geometry while retaining the ink ring.
        if name == "Roda — sprite transparan.png":
            clear_checker_aperture(rgba, (512, 512), 50)
        elif name == "Truk kurir—sprite bodi transparan.png":
            clear_checker_aperture(rgba, (304, 677), 39)
            clear_checker_aperture(rgba, (711, 677), 39)

    result = Image.fromarray(rgba, "RGBA")
    a = np.asarray(result.getchannel("A"))
    mask = a > 20
    if mask.any():
        rows = np.where(mask.any(axis=1))[0]
        cols = np.where(mask.any(axis=0))[0]
        crop_box = (int(cols.min()), int(rows.min()), int(cols.max() + 1), int(rows.max() + 1))
    else:
        bbox = result.getchannel("A").getbbox()
        if not bbox:
            raise ValueError("Cutout removed the entire image")
        crop_box = bbox
    result = result.crop(crop_box)
    alpha_zero_ratio = float((np.asarray(result.getchannel("A")) == 0).mean())
    return result, alpha_zero_ratio


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="New versioned sprite directory. Existing output files are never overwritten.",
    )
    args = parser.parse_args()
    output = args.output_dir if args.output_dir.is_absolute() else ROOT / args.output_dir

    output.mkdir(parents=True, exist_ok=True)
    for source_name, (target_name, size) in SPRITES.items():
        with Image.open(SOURCE / source_name) as source:
            sprite, transparent_ratio = cutout(source, source_name)
        sprite = sprite.resize(size, Image.Resampling.LANCZOS)
        if source_name == "Truk kurir—sprite bodi transparan.png":
            # Remove the remaining checkerboard only from the visible pocket
            # below the chassis. Constrain this to its matte colors to protect
            # the blue/yellow body and the inked wheel outlines.
            rgba = np.asarray(sprite).copy()
            rgb = rgba[:, :, :3].astype(np.int16)
            neutral_matte = (rgb.max(axis=2) - rgb.min(axis=2) <= 20) & (rgb.mean(axis=2) >= 178)
            pocket = np.zeros(neutral_matte.shape, dtype=bool)
            pocket[134:156, 95:224] = True
            rgba[:, :, 3][pocket & neutral_matte] = 0
            sprite = Image.fromarray(rgba, "RGBA")
        target = output / target_name
        if source_name == "logo.png":
            meta = PngImagePlugin.PngInfo()
            meta.add_text("brand_color", "#0d2b52")
            meta.add_text("title", "MBG: Road To School")
            sprite.save(target, "PNG", optimize=True, pnginfo=meta)
        else:
            sprite.save(target, "PNG", optimize=True)
        print(
            f"{target.relative_to(ROOT)}: {size[0]}x{size[1]}, "
            f"transparent={transparent_ratio:.1%}, {target.stat().st_size:,} bytes"
        )


if __name__ == "__main__":
    main()
