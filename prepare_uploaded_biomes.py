"""Prepare uploaded biome PNGs as lightweight, layered, versioned WebP assets.

The supplied PNGs remain unchanged in assets/refresh/backgrounds. Midground
copies fade in vertically so their baked sky does not hide the distant layer.
This script is specific to the eight named game illustrations.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "assets" / "refresh" / "backgrounds"
OUTPUT = ROOT / "assets" / "refresh" / "v11" / "backgrounds"
BIOMES = {
    "biome1Distant": "Pesisir Pantura — layer jauh.png",
    "biome1Midground": "Pantura — layer tengah.png",
    "biome2Distant": "Sawah -- Layer Jauh.png",
    "biome2Midground": "Sawah -- Layer Tengah.png",
    "biome3Distant": "Pegunungan -- Layer Jauh.png",
    "biome3Midground": "Pegunungan -- Layer Tengah.png",
    "biome4Distant": "Pemukiman dan Sekolah -- Layer Jauh.png",
    "biome4Midground": "Pemukiman dan Sekolah -- Layer Tengah.png",
}
MIDGROUND_CROP = {
    "biome1Midground": 0.42,
    "biome2Midground": 0.36,
    "biome3Midground": 0.39,
    "biome4Midground": 0.27,
}
MAX_WIDTH = 1600


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    targets = [OUTPUT / f"{key}.webp" for key in BIOMES]
    if any(path.exists() for path in targets):
        raise SystemExit(f"Refusing to overwrite versioned biome assets in {OUTPUT}.")

    for key, source_name in BIOMES.items():
        with Image.open(SOURCE / source_name) as source:
            image = source.convert("RGBA")
        if image.width > MAX_WIDTH:
            height = round(image.height * MAX_WIDTH / image.width)
            image = image.resize((MAX_WIDTH, height), Image.Resampling.LANCZOS)

        if key.endswith("Midground"):
            # The source has a lot of baked sky. Crop its top so scene features
            # sit above the road with the renderer's existing placement ratios.
            crop_top = round(image.height * MIDGROUND_CROP[key])
            image = image.crop((0, crop_top, image.width, image.height))
            alpha = np.asarray(image.getchannel("A")).copy()
            height = alpha.shape[0]
            fade_start, fade_end = round(height * 0.02), round(height * 0.16)
            ramp = np.clip(
                (np.arange(height, dtype=np.float32) - fade_start)
                / (fade_end - fade_start),
                0,
                1,
            )
            alpha = np.minimum(alpha, np.round(ramp[:, None] * 255).astype(np.uint8))
            image.putalpha(Image.fromarray(alpha, "L"))

        target = OUTPUT / f"{key}.webp"
        image.save(target, "WEBP", quality=96, method=6)
        print(
            f"{target.relative_to(ROOT)}: {image.width}x{image.height}, "
            f"alpha={'layer fade' if key.endswith('Midground') else 'opaque'}, "
            f"{target.stat().st_size:,} bytes"
        )


if __name__ == "__main__":
    main()
