// noinspection JSUnusedGlobalSymbols

import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-spdx-license-identifier";
import { removeConsoleLog } from "hardhat-preprocessor";
import "./tasks";
import { accounts, node_url } from "./utils/network";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
        details: {
          yul: true,
          // Tuning options for the Yul optimizer.
          yulDetails: {
            //   // Improve allocation of stack slots for variables, can free up stack slots early.
            //   // Activated by default if the Yul optimizer is activated.
            stackAllocation: true,
            //   // Select optimization steps to be applied.
            //   // Optional, the optimizer will use the default sequence if omitted.
            optimizerSteps: "dhfoDgvulfnTUtnIf",
          },
        },
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    focusPoint: {
      default: "0xD246882E05D7DdB2C8476607312279f592789Cd6",
      hardhat: 1,
    },
    treasury: {
      default: "0x0C3c184C2c5Fc99aED927cE3513141eb3Ce684FA",
      hardhat: 2,
    },
    gremplin: {
      default: "0x4298e663517593284ad4fe199b21815bd48a9969",
      hardhat: 3,
    },
    gb: {
      default: "0x8CdbFB113D01b9832E58b15Eb224c7404853bB3f",
      hardhat: 4,
    },
    clemlaflemme: {
      default: "0xFc7c18A7F0d53A924D6aF07814c47eEf0Fb4F7d7",
      hardhat: 5,
    },
    opensea: {
      default: "0xa5409ec958C83C3f309868babACA7c86DCB077c1",
      rinkeby: "0xf57b2c51ded3a29e6891aba85459d600256cf317",
    },
    looksrare: {
      default: "0xf42aa99f011a1fa7cda90e5e98b277e306bca83e",
      rinkeby: "0x3f65a762f15d01809cdc6b43d8849ff24949c86a",
    },
    integersLib: {
      default: "0xe5d03576716d2D66Becf01a3F3BC7B80eb05952E",
      rinkeby: "0x03abFda4e7cec3484D518848B5e6aa10965F91DD",
    },
    blitmap: {
      default: "0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63",
    },
    dhof: {
      default: "0xF296178d553C8Ec21A2fBD2c5dDa8CA9ac905A00",
    },
  },
  networks: {
    mainnet: {
      url: node_url("mainnet"),
      accounts: accounts("mainnet"),
      tags: ["mainnet"],
    },
    rinkeby: {
      url: node_url("rinkeby"),
      accounts: accounts("rinkeby"),
      tags: ["staging"],
    },
    hardhat: {
      tags: ["local"],
      blockGasLimit: 10 * 50_000_000, // Geth new default is 50M, increased here for tests
      forking: {
        url: node_url("mainnet"),
      },
      accounts: {
        count: 501,
        ...accounts("mainnet"),
      },
    },
    localhost: {
      timeout: 1_000_000,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 500_000,
  },
  spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (hre) =>
        hre.network.name !== "hardhat" && hre.network.name !== "localhost"
    ),
  },
};

export default config;
