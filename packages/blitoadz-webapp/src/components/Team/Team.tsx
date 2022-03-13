import React from "react";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";
import Georges from "./Georges.png";
import Clement from "./Clement.png";
import FocusPoints from "./FocusPoints.png";

function Team() {
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
          The Blitoadz team
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1185px",
          margin: "auto",
          textAlign: "center",

          "& .profile-picture": {
            borderRadius: "50%",
            width: "200px",
          },
        }}
      >
        <Box>
          <img
            className="profile-picture"
            alt="FocusPoints"
            src={FocusPoints}
          />
          <h2>FocusPoints</h2>
          <p>
            Trying to become a person of value, not success. Walked out of a
            master’s degree in Innovation to work a 9-5 and have had a bad case
            of the Mondays, ever since.
          </p>
          <p>First NFT: blitmap</p>
        </Box>
        <Box marginTop="48px">
          <img className="profile-picture" alt="Clément" src={Clement} />
          <h2>Clément</h2>
          <p>Scientist and engineer, currently experimenting in solidity.</p>
          <p>First NFT: Chain Dreamers</p>
        </Box>
        <Box marginTop="48px">
          <img className="profile-picture" alt="Georges" src={Georges} />
          <h2>Georges</h2>
          <p>Web developer based in Paris. Love to tell stories.</p>
          <p>First NFT: Chain Dreamers</p>
        </Box>
      </Box>
    </Box>
  );
}

export default Team;
