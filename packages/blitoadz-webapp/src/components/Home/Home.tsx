import React from "react";
import Box from "@mui/material/Box";
import { useEthers } from "@usedapp/core";
import WalletConnectSection from "../WalletConnectSection/WalletConnectSection";
import ColorPaletteSelector from "../ColorPaletteSelector/ColorPaletteSelector";
import Result from "../Result/Result";
import ToadzSelector from "../ToadzSelector/ToadzSelector";

function Home() {
  const { account } = useEthers();
  const [selectedBlitmapId, setSelectedBlitmapId] = React.useState<
    number | undefined
  >(undefined);
  const [selectedToadzId, setSelectedToadzId] = React.useState<
    number | undefined
  >(undefined);

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
      {account && (
        <Box sx={{ display: "flex" }}>
          <ToadzSelector
            onToadzClick={(id) => setSelectedToadzId(id)}
            sx={{ flex: 1 }}
          />
          <Result
            toadzId={selectedToadzId}
            blitmapId={selectedBlitmapId}
            sx={{ flex: 1 }}
          />
          <ColorPaletteSelector
            onBlitmapClick={(id) => setSelectedBlitmapId(id)}
            sx={{ flex: 1 }}
          />
        </Box>
      )}
    </Box>
  );
}

export default Home;
