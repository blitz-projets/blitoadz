// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TAGS } from "../utils/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer, integersLib } = await getNamedAccounts();

  await deploy("PaletteRenderer", {
    from: deployer,
    log: true,
    libraries: { Integers: integersLib },
  });
};
export default func;
func.tags = [TAGS.PALETTE_RENDERER];
