#!/usr/bin/env python3
"""Generate the QR code for the talk landing page.

Usage:
    python tools/make_qr.py

Outputs qr/landing-qr.png and qr/landing-qr.svg at error-correction level H
(30% recovery), which survives projection glare and phone-camera blur.
"""

from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.svg import SvgPathImage

URL = "https://hlpatw.github.io"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "qr"


def main() -> None:
    OUT.mkdir(exist_ok=True)

    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=32,
        border=4,
    )
    qr.add_data(URL)
    qr.make(fit=True)

    png_path = OUT / "landing-qr.png"
    qr.make_image(fill_color="black", back_color="white").save(png_path)

    svg_path = OUT / "landing-qr.svg"
    qr.make_image(image_factory=SvgPathImage).save(svg_path)

    print(f"version  : {qr.version}")
    print(f"modules  : {qr.modules_count}x{qr.modules_count}")
    print(f"png      : {png_path}")
    print(f"svg      : {svg_path}")


if __name__ == "__main__":
    main()
