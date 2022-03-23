import { ChainId } from "@usedapp/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
  openSeaBaseUrl: string;
  etherScanBaseUrl: string;
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | ChainId.Hardhat;

export const CHAIN_ID: SupportedChains = parseInt(
  process.env.REACT_APP_CHAIN_ID ?? "1"
);

export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID ?? "";

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];
  return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];
  return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
};

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Rinkeby]: {
    jsonRpcUri: createNetworkHttpUrl("rinkeby"),
    wsRpcUri: createNetworkWsUrl("rinkeby"),
    subgraphApiUri:
      "https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby-v4",
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === "true",
    openSeaBaseUrl: "https://testnets.opensea.io",
    etherScanBaseUrl: "https://rinkeby.etherscan.io",
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl("mainnet"),
    wsRpcUri: createNetworkWsUrl("mainnet"),
    subgraphApiUri:
      "https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph",
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === "true",
    openSeaBaseUrl: "https://opensea.io",
    etherScanBaseUrl: "https://etherscan.io",
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: "http://localhost:8545",
    wsRpcUri: "ws://localhost:8545",
    subgraphApiUri: "",
    enableHistory: false,
    openSeaBaseUrl: "https://testnets.opensea.io",
    etherScanBaseUrl: "https://rinkeby.etherscan.io",
  },
};

const config = {
  app: app[CHAIN_ID],
};

export default config;
