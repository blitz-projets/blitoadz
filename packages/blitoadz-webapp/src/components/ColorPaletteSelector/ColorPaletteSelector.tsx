import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { blitmap } from "../../blitmap";

const blitmapIds: number[] = [];

for (let i = 0; i <= 99; i++) {
  blitmapIds.push(i);
}

type ColorPaletteSelectorProps = {
  onBlitmapClick: (id: number) => void;
  sx?: BoxProps["sx"];
};

const ITEM_PER_LINE = 10;

function ColorPaletteSelector({
  onBlitmapClick,
  sx,
}: ColorPaletteSelectorProps) {
  return (
    <Box sx={{ padding: "12px", ...sx }}>
      <Box
        sx={{
          marginBottom: "24px",
          fontWeight: 600,
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        Select a color palette
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {blitmapIds.map((id) => (
          <img
            key={id}
            onClick={() => onBlitmapClick(id)}
            alt={`blitmap #${id}`}
            src={blitmap[id].image}
            style={{ width: `${100 / ITEM_PER_LINE}%`, cursor: "pointer" }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default ColorPaletteSelector;
