import React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import logo from "./logo.png";

function Header() {
  return (
    <Box sx={{ padding: "24px" }}>
      <Box
        sx={{
          display: "flex",
          borderTop: "2px solid black",
          borderBottom: "2px solid black",
          position: "relative",
          justifyContent: "space-between",

          "::before": {
            content: '""',
            height: "8px",
            width: "8px",
            backgroundColor: "black",
            position: "absolute",
            bottom: "-10px",
            right: "-8px",
          },

          "& .link-button": {
            padding: "16px 12px",
            fontSize: "16px",
            lineHeight: "24px",
            textDecoration: "none",
            color: "black",
            display: "flex",
            alignItems: "center",

            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
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
            <img src={logo} width={28} height={28} alt="logo" />
          </Link>
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
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link to="/faq" className="link-button">
            FAQ
          </Link>
          <Link to="/team" className="link-button">
            Team
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
