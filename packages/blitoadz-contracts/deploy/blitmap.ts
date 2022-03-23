// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { loadBlitmap, TAGS } from "../utils/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  if (!network.tags.staging) {
    return;
  }
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const blitmap = loadBlitmap();
  const tokenData =
    "0x" + blitmap.map((item) => item.data.slice(2, 2 + 12 * 2)).join("");
  const creators = "0x" + blitmap.map((item) => item.creator.slice(2)).join("");
  const names = blitmap.map((item) => item.name.split(" - ")[1]);

  await deploy("Blitmap", {
    from: deployer,
    log: true,
    args: [tokenData, creators, names],
  });
};
export default func;
func.tags = [TAGS.BLITMAP];
