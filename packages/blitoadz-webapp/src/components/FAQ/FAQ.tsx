import React from "react";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";

function FAQ() {
  const isNarrow = useMediaQuery("(max-width:768px)");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <Box
        sx={{
          padding: "24px",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            fontFamily: "Snap ITC",
            marginBottom: "24px",
            fontSize: isNarrow ? "48px" : "96px",
            lineHeight: "142px",
          }}
        >
          Blitoadz
        </Box>
        <Box
          sx={{
            marginBottom: "24px",
            fontSize: isNarrow ? "32px" : "48px",
            lineHeight: "54px",
            fontWeight: 600,
          }}
        >
          Frequently asked questions for Blitoadz
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1185px",
          margin: "auto",
        }}
      >
        <Box>
          <h2>Question 1</h2>
          <p>answer 1</p>
        </Box>
        <Box>
          <h2>Question 2</h2>
          <p>answer 2</p>
        </Box>
        <Box>
          <h2>Question 3</h2>
          <p>answer 3</p>
        </Box>
        <Box>
          <h2>Question 4</h2>
          <p>answer 4</p>
        </Box>
        <Box>
          <h2>Question 5</h2>
          <p>answer 5</p>
        </Box>
        <Box>
          <h2>Question 6</h2>
          <p>answer 6</p>
        </Box>
      </Box>
    </Box>
  );
}

export default FAQ;
