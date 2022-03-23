import type { EthSdkConfig } from "@dethcrypto/eth-sdk";
import { extractContractAddresses } from "../scripts/extract-contract-addresses";
import { extractContractAbis } from "../scripts/extract-contract-abis";

const NETWORK = process.env.REACT_APP_NETWORK || "rinkeby";
const CONTRACT_INPUT_NAME = "main";

extractContractAbis(NETWORK, CONTRACT_INPUT_NAME);
const contracts = extractContractAddresses(NETWORK);

const mainRpc =
  NETWORK === "localhost"
    ? "http://localhost:8545/"
    : `https://${NETWORK}.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`;

const etherscanURL =
  NETWORK === "rinkeby"
    ? "https://api-rinkeby.etherscan.io/api"
    : "https://api.etherscan.io/api";

if (process.env.REACT_APP_BLITMAP_CONTRACT_ADDRESS) {
  contracts.Blitmap = process.env.REACT_APP_BLITMAP_CONTRACT_ADDRESS;
}

const config: EthSdkConfig = {
  contracts: {
    [CONTRACT_INPUT_NAME]: contracts as Record<string, `0x${string}`>,
  },
  etherscanURLs:
    NETWORK !== "localhost"
      ? {
          [CONTRACT_INPUT_NAME]: etherscanURL,
        }
      : undefined,
  rpc: {
    [CONTRACT_INPUT_NAME]: mainRpc,
  },
  etherscanKey: process.env.REACT_APP_ETHERSCAN_API_KEY,
};

export default config;
