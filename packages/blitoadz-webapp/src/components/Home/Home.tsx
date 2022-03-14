import React from "react";
import Box from "@mui/material/Box";
import { useEthers } from "@usedapp/core";
import WalletConnectSection from "../WalletConnectSection/WalletConnectSection";
import ColorPaletteSelector from "../ColorPaletteSelector/ColorPaletteSelector";
import Result from "../Result/Result";
import ToadzSelector from "../ToadzSelector/ToadzSelector";
import { useMediaQuery } from "@mui/material";
import { useBlitoadzContract } from "../../hooks/useBlitoadzContract";
import YourBlitoadz from "../YourBlitoadz/YourBlitoadz";

function Home() {
  const isNarrow = useMediaQuery("(max-width:768px)");
  const { account } = useEthers();
  const { userBlitoadzIds, fetchUserBlitoadz } = useBlitoadzContract();
  const [selectedBlitmapId, setSelectedBlitmapId] = React.useState<
    number | undefined
  >(undefined);
  const [selectedToadzId, setSelectedToadzId] = React.useState<
    number | undefined
  >(undefined);

  React.useEffect(() => {
    fetchUserBlitoadz();
  }, [fetchUserBlitoadz]);

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
          Flipping the lost Blitoadz
        </Box>
      </Box>
      {!account && <WalletConnectSection />}
      {account && (
        <Box>
          {userBlitoadzIds.length > 0 && <YourBlitoadz ids={userBlitoadzIds} />}
          <Box
            sx={{ display: "flex", flexDirection: isNarrow ? "column" : "row" }}
          >
            <ToadzSelector
              onToadzClick={(id) => setSelectedToadzId(id)}
              blitmapId={selectedBlitmapId}
              sx={{ flex: 1 }}
            />
            <Result
              toadzId={selectedToadzId}
              blitmapId={selectedBlitmapId}
              sx={{ flex: 1 }}
            />
            <ColorPaletteSelector
              onBlitmapClick={(id) => setSelectedBlitmapId(id)}
              toadzId={selectedToadzId}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Home;
