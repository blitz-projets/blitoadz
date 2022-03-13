import json
import shutil
from pathlib import Path
from string import Template

import numpy as np
import pandas as pd
from image_processing.constants import PALETTES_FILE, TOADZ_COMPUTED_DIR, TOADZ_DIR
from PIL import Image

#%% Define constants
RECT = Template("<rect x='$x' y='$y' width='1' height='1' fill='#$fill' />")


#%% Define functions
def parse_png(png_path):
    image = Image.open(png_path).convert("P", palette=Image.ADAPTIVE, colors=4)
    indexes = np.array(image)[::40, ::40].flatten().tolist()
    colors = (
        pd.Series({v: k for k, v in image.palette.colors.items()})
        .sort_index()
        .map(lambda c: "".join([("0" + format(_c, "x"))[-2:] for _c in c]))
        .tolist()
    )
    return colors, indexes


def generate_svg(colors, indexes):
    return (
        """<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" width=\"360px\" height=\"360px\">"""
        + (
            "".join(
                [
                    RECT.substitute(x=i % 36, y=i // 36, fill=colors[index])
                    for i, index in enumerate(indexes)
                ]
            )
        )
        + "</svg>"
    )


#%% Parse files
toadz_list = []
for file in TOADZ_DIR.glob("**/*.png"):
    _colors, _indexes = parse_png(file)
    toadz_list += [
        {
            "file": str(file),
            "colors": _colors,
            "indexes": _indexes,
        }
    ]

#%% Dump reconstructed SVG files for visual check
shutil.rmtree(TOADZ_COMPUTED_DIR, ignore_errors=True)
for toadz in toadz_list:
    file_name_computed = TOADZ_COMPUTED_DIR / Path(toadz["file"]).relative_to(
        TOADZ_DIR
    ).with_suffix(".svg")
    file_name_computed.parent.mkdir(exist_ok=True, parents=True)

    with open(file_name_computed, "w") as f:
        f.write(generate_svg(toadz["colors"], toadz["indexes"]))

#%% Dump palettes and traits
with open(PALETTES_FILE, "w") as f:
    json.dump(
        (
            pd.DataFrame(toadz_list)
            .assign(
                tokenId=lambda df: df.file.str.split("/", expand=True)[2]
                .str.replace(".png", "", regex=True)
                .astype(int)
            )
            .sort_values("tokenId")
            .to_dict("records")
        ),
        f,
        indent=2,
    )
