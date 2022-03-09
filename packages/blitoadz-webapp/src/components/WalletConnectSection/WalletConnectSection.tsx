import React from "react";
import Box from "@mui/material/Box";
import WalletConnectDialog from "../WalletConnectDialog/WalletConnectDialog";

function WalletConnectSection() {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      <Box sx={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px" }}>
        Connect your wallet to view Blitoadz.
      </Box>
      <Box>
        <button
          style={{
            fontSize: "24px",
            fontWeight: 700,
            backgroundColor: "rgb(127, 254, 168)",
            color: "black",
            boxShadow: "none",
            padding: "11px 24px",
            border: 0,
            borderRadius: "4px",
            height: "60px",
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        >
          Connect Wallet
        </button>
      </Box>
      <WalletConnectDialog open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
}

export default WalletConnectSection;
