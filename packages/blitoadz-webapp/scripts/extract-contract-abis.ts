import { readdirSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const CONTRACT_DEPLOY_FILES_BASE_LOCATION = join(
  __dirname,
  "../../blitoadz-contracts/deployments"
);

const ABIS_OUTPUT_LOCATION = join(__dirname, "../eth-sdk/abis");

export function extractContractAbis(network: string, outputName: string) {
  const folderPath = `${CONTRACT_DEPLOY_FILES_BASE_LOCATION}/${network}`;
  const files = readdirSync(folderPath)
    .filter((file) => file.includes(".json"))
    .map((file) => ({
      fileName: file,
      filePath: join(folderPath, "/", file),
      contractName: file.replace(".json", ""),
    }));

  const contracts: Record<string, string> = {};

  for (const file of files) {
    const json = require(file.filePath);
    const outputFolderPath = `${ABIS_OUTPUT_LOCATION}/${outputName}`;
    const outputFilePath = `${outputFolderPath}/${file.contractName}.json`;
    mkdirSync(outputFolderPath, { recursive: true });
    writeFileSync(outputFilePath, JSON.stringify(json["abi"]));
  }

  return contracts;
}
