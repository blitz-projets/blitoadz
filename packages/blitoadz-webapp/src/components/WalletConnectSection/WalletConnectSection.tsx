import React from "react";
import { isMobile } from "react-device-detect";
import Box from "@mui/material/Box";
import WalletConnectDialog from "../WalletConnectDialog/WalletConnectDialog";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import config, { CHAIN_ID } from "../../config";
import { useEthers } from "@usedapp/core";

const supportedChainIds = [CHAIN_ID];

function WalletConnectSection() {
  const { activate } = useEthers();
  const [open, setOpen] = React.useState<boolean>(false);

  const openConnectDialogMobile = React.useCallback(() => {
    const walletlink = new WalletConnectConnector({
      supportedChainIds,
      chainId: CHAIN_ID,
      rpc: {
        [CHAIN_ID]: config.app.jsonRpcUri,
      },
    });
    activate(walletlink);
  }, [activate]);

  const openConnectDialog = React.useCallback(
    () => (isMobile ? openConnectDialogMobile() : setOpen(true)),
    [openConnectDialogMobile]
  );

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
          onClick={openConnectDialog}
        >
          Connect Wallet
        </button>
      </Box>
      <WalletConnectDialog open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
}

export default WalletConnectSection;
