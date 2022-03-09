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
        }}
      >
        <Box
          sx={{
            fontFamily: "Snap ITC",
            marginBottom: "24px",
            fontSize: "96px",
          }}
        >
          Blitoadz
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
