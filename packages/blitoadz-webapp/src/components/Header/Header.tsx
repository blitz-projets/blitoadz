import React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Box
      sx={{
        height: "52px",
        display: "flex",

        "& .link-button": {
          padding: "8px 12px",
          fontSize: "16px",
          lineHeight: "24px",
          textDecoration: "none",
          color: "black",
          display: "flex",
          alignItems: "center",

          "&:hover": {
            backgroundColor: "#f2f2f2",
          },
        },
      }}
    >
      <Link
        to="/"
        className="link-button"
        style={{
          fontFamily: "Snap ITC",
          fontSize: "24px",
          textDecoration: "none",
          color: "black",
        }}
      >
        Blitoadz
      </Link>
      <Link to="/faq" className="link-button">
        FAQ
      </Link>
      <Link to="/" className="link-button">
        Team
      </Link>
    </Box>
  );
}

export default Header;
