import type { EthSdkConfig } from "@dethcrypto/eth-sdk";
import { extractContractAddresses } from "../scripts/extract-contract-addresses";

const NETWORK = process.env.REACT_APP_NETWORK || "rinkeby";
const contracts = extractContractAddresses(NETWORK);

const mainRpc =
  NETWORK === "localhost"
    ? "http://localhost:8545/"
    : `https://${NETWORK}.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`;

const etherscanURL =
  NETWORK === "rinkeby"
    ? "https://api-rinkeby.etherscan.io/api"
    : "https://api.etherscan.io/api";

const config: EthSdkConfig = {
  contracts: {
    main: contracts as Record<string, `0x${string}`>,
  },
  etherscanURLs:
    NETWORK !== "localhost"
      ? {
          main: etherscanURL,
        }
      : undefined,
  rpc: {
    main: mainRpc,
  },
};

export default config;
