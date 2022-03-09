import React from "react";
import Box from "@mui/material/Box";
import { useEthers } from "@usedapp/core";
import WalletConnectSection from "../WalletConnectSection/WalletConnectSection";

function Home() {
  const { account } = useEthers();

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
          Flipping the lost Blitoadz
        </Box>
      </Box>
      {!account && <WalletConnectSection />}
    </Box>
  );
}

export default Home;
