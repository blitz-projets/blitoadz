import React from "react";
import Box from "@mui/material/Box";

function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px",
      }}
    >
      <Box
        sx={{
          padding: "48px",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            fontFamily: "Snap ITC",
            marginBottom: "24px",
            fontSize: "96px",
            lineHeight: "142px",
          }}
        >
          Blitoadz
        </Box>
        <Box
          sx={{
            marginBottom: "24px",
            fontSize: "48px",
            lineHeight: "54px",
            fontWeight: 600,
          }}
        >
          Flipping the lost Blitmaps
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
