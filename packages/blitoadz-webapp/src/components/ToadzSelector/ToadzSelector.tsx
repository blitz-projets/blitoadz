import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { toadz } from "../../toadz";

const toadzIds: number[] = [];

for (let i = 0; i <= 55; i++) {
  toadzIds.push(i);
}

type ToadzSelectorProps = {
  onToadzClick: (id: number) => void;
  sx?: BoxProps["sx"];
};

const ITEM_PER_LINE = 8;

function ToadzSelector({ onToadzClick, sx }: ToadzSelectorProps) {
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
            <img
              key={id}
              onClick={() => onToadzClick(id)}
              alt={toadz[id].name}
              src={toadz[id].image}
              style={{ width: "100%", cursor: "pointer" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ToadzSelector;
