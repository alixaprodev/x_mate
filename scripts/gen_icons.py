from pathlib import Path
from PIL import Image, ImageDraw

ICONS_DIR = Path(__file__).resolve().parent.parent / "icons"

def make_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # black rounded-square background
    radius = size * 0.22
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=(0, 0, 0, 255))

    # white "X" glyph, thick crossing bars
    pad = size * 0.28
    w = max(2, round(size * 0.11))
    d.line([(pad, pad), (size - pad, size - pad)], fill=(255, 255, 255, 255), width=w)
    d.line([(size - pad, pad), (pad, size - pad)], fill=(255, 255, 255, 255), width=w)

    # red "blocked" badge in the corner
    badge_r = size * 0.30
    cx, cy = size - badge_r * 0.78, size - badge_r * 0.78
    bbox = [cx - badge_r, cy - badge_r, cx + badge_r, cy + badge_r]
    d.ellipse(bbox, fill=(244, 33, 46, 255), outline=(0, 0, 0, 255), width=max(1, round(size * 0.02)))
    slash_w = max(1, round(size * 0.045))
    d.line(
        [(cx - badge_r * 0.55, cy - badge_r * 0.55), (cx + badge_r * 0.55, cy + badge_r * 0.55)],
        fill=(255, 255, 255, 255),
        width=slash_w,
    )

    return img

for size in (16, 48, 128):
    make_icon(size).save(ICONS_DIR / f"icon{size}.png")

print("done")
