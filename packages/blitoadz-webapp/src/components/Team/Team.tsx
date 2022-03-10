import React from "react";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";

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
            alt="Name 1"
            src="https://ik.imagekit.io/bayc/assets/ape1.png"
          />
          <h2>Name 1</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </Box>
        <Box marginTop="48px">
          <img
            className="profile-picture"
            alt="Name 1"
            src="https://ik.imagekit.io/bayc/assets/ape1.png"
          />
          <h2>Name 2</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </Box>
        <Box marginTop="48px">
          <img
            className="profile-picture"
            alt="Name 1"
            src="https://ik.imagekit.io/bayc/assets/ape1.png"
          />
          <h2>Name 3</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </Box>
        <Box marginTop="48px">
          <img
            className="profile-picture"
            alt="Name 1"
            src="https://ik.imagekit.io/bayc/assets/ape1.png"
          />
          <h2>Name 4</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </Box>
        <Box marginTop="48px">
          <img
            className="profile-picture"
            alt="Name 1"
            src="https://ik.imagekit.io/bayc/assets/ape1.png"
          />
          <h2>Name 5</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </Box>
      </Box>
    </Box>
  );
}

export default Team;
