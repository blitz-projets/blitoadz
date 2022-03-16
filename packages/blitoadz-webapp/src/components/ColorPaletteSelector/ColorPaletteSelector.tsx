import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { blitmap } from "../../blitmap";
import { useBlitoadzContract } from "../../hooks/useBlitoadzContract";

const blitmapIds: number[] = [];

for (let i = 0; i <= 99; i++) {
  blitmapIds.push(i);
}

type ColorPaletteSelectorProps = {
  onBlitmapClick: (id: number) => void;
  toadzId?: number;
  sx?: BoxProps["sx"];
};

const ITEM_PER_LINE = 10;

function ColorPaletteSelector({
  onBlitmapClick,
  toadzId,
  sx,
}: ColorPaletteSelectorProps) {
  return (
    <Box sx={{ padding: "12px", ...sx }}>
      <Box
        sx={{
          marginBottom: "24px",
          lineHeight: "32px",
          fontWeight: 600,
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        Select blitmap color palette
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          border: "2px solid black",
          padding: "4px",
          position: "relative",

          "::before": {
            content: '""',
            height: "8px",
            width: "8px",
            backgroundColor: "black",
            position: "absolute",
            top: "-10px",
            right: "-10px",
          },
        }}
      >
        {blitmapIds.map((id) => (
          <ColorPaletteSelectorImage
            key={id}
            id={id}
            onClick={() => onBlitmapClick(id)}
            toadzId={toadzId}
          />
        ))}
      </Box>
    </Box>
  );
}

type ColorPaletteSelectorImageProps = {
  onClick: () => void;
  id: number;
  toadzId?: number;
};

function ColorPaletteSelectorImage({
  id,
  onClick,
  toadzId,
}: ColorPaletteSelectorImageProps) {
  const [isAvailable, setIsAvailable] = React.useState<boolean>(true);
  const { blitoadzExists } = useBlitoadzContract();

  React.useEffect(() => {
    if (toadzId !== undefined) {
      blitoadzExists(toadzId, id).then((exists) => setIsAvailable(!exists));
    }
  }, [toadzId, blitoadzExists, id]);

  return (
    <img
      onClick={onClick}
      alt={`blitmap #${id}`}
      src={blitmap[id].image}
      style={{
        width: `${100 / ITEM_PER_LINE}%`,
        cursor: "pointer",
        filter: isAvailable ? "none" : "grayscale(100%)",
        opacity: isAvailable ? 1 : 0.2,
        backgroundColor: "grey !important",
      }}
    />
  );
}

export default ColorPaletteSelector;
