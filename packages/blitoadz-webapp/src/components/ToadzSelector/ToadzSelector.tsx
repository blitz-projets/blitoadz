import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { toadz } from "../../toadz";
import { useBlitoadzContract } from "../../hooks/useBlitoadzContract";

const toadzIds: number[] = [];

for (let i = 0; i <= 55; i++) {
  toadzIds.push(i);
}

type ToadzSelectorProps = {
  onToadzClick: (id: number) => void;
  blitmapId?: number;
  sx?: BoxProps["sx"];
};

const ITEM_PER_LINE = 8;

function ToadzSelector({ onToadzClick, blitmapId, sx }: ToadzSelectorProps) {
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
        Select a CrypToadz
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {toadzIds.map((id) => (
          <Box
            key={id}
            sx={{
              width: `${100 / ITEM_PER_LINE}%`,
              display: "flex",
              alignItems: "end",
            }}
          >
            <ToadzSelectorImage
              id={id}
              onClick={() => onToadzClick(id)}
              blitmapId={blitmapId}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

type ToadzSelectorImageProps = {
  onClick: () => void;
  id: number;
  blitmapId?: number;
};

function ToadzSelectorImage({
  id,
  onClick,
  blitmapId,
}: ToadzSelectorImageProps) {
  const [isAvailable, setIsAvailable] = React.useState<boolean>(true);
  const { blitoadzExists } = useBlitoadzContract();

  React.useEffect(() => {
    if (blitmapId !== undefined) {
      blitoadzExists(id, blitmapId).then((exists) => setIsAvailable(!exists));
    }
  }, [blitmapId, blitoadzExists, id]);

  return (
    <img
      onClick={onClick}
      alt={toadz[id].name}
      src={toadz[id].image}
      style={{
        width: "100%",
        cursor: "pointer",
        filter: isAvailable ? "none" : "grayscale(100%)",
      }}
    />
  );
}

export default ToadzSelector;
