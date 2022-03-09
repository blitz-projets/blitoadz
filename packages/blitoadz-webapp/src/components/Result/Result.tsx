import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { blitmap } from "../../blitmap";

type ResultProps = {
  toadzId?: number;
  blitmapId?: number;
  sx?: BoxProps["sx"];
};

function Result({ blitmapId, sx }: ResultProps) {
  return (
    <Box sx={{ padding: "12px", ...sx }}>
      <Box
        sx={{
          textAlign: "center",
          fontSize: "32px",
          fontWeight: 600,
          marginBottom: "24px",
        }}
      >
        {blitmapId !== undefined && blitmap[blitmapId].name}
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1 }}></Box>
        <Box
          sx={{
            fontFamily: "Snap ITC",
            flex: 1,
            textAlign: "center",
            fontSize: "96px",
            lineHeight: "144px",
            fontWeight: 400,
          }}
        >
          +
        </Box>
        <Box sx={{ flex: 1 }}>
          {blitmapId !== undefined && (
            <img
              alt={`blitmap #${blitmapId}`}
              src={blitmap[blitmapId].image}
              style={{ width: "100%", cursor: "pointer" }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Result;
