import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { blitmap } from "../../blitmap";
import { toadz } from "../../toadz";

type ResultProps = {
  toadzId?: number;
  blitmapId?: number;
  sx?: BoxProps["sx"];
};

function Result({ blitmapId, toadzId, sx }: ResultProps) {
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
        {blitmapId !== undefined && blitmap[blitmapId].name}{" "}
        {toadzId !== undefined && toadz[toadzId].name}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          {toadzId !== undefined && (
            <img
              alt={toadz[toadzId].name}
              src={toadz[toadzId].image}
              style={{ width: "100%" }}
            />
          )}
        </Box>
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
              style={{ width: "100%" }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Result;
