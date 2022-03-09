import metamaskLogo from "./metamask-fox.svg";
import walletconnectLogo from "./walletconnect-logo.svg";
import coinbasewalletLogo from "./coinbase-wallet.svg";
import Button, { ButtonProps } from "@mui/material/Button";
import Box from "@mui/material/Box";

export enum WALLET_TYPE {
  metamask = "Metamask",
  walletconnect = "WalletConnect",
  coinbasewallet = "CoinBaseWallet",
}

const logo = (walletType: WALLET_TYPE) => {
  switch (walletType) {
    case WALLET_TYPE.metamask:
      return metamaskLogo;
    case WALLET_TYPE.walletconnect:
      return walletconnectLogo;
    case WALLET_TYPE.coinbasewallet:
      return coinbasewalletLogo;
    default:
      return "";
  }
};

const WalletButton: React.FC<{
  onClick: () => void;
  walletType: WALLET_TYPE;
  sx?: ButtonProps["sx"];
}> = (props) => {
  const { onClick, walletType, sx } = props;

  return (
    <Box
      sx={{
        padding: "8px",
        ...sx,
      }}
    >
      <Box
        onClick={onClick}
        sx={{
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "19px",
          padding: "24px 16px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "&:hover": { backgroundColor: "rgba(195, 195, 195, 0.14)" },
        }}
      >
        <img
          src={logo(walletType)}
          alt={`${walletType} logo`}
          style={{
            height: "45px",
            width: "45px",
          }}
        />
        <Box sx={{ marginTop: "12px", fontSize: "24px", fontWeight: 700 }}>
          {walletType}
        </Box>
        <Box
          sx={{
            marginTop: "12px",
            fontSize: "18px",
            fontWeight: 400,
            color: "rgb(169, 169, 188)",
          }}
        >
          Connect with {walletType}
        </Box>
      </Box>
    </Box>
  );
};
export default WalletButton;
