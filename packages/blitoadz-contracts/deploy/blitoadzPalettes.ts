// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { loadPalettesEncoded, TAGS } from "../utils/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();
  await deployments.get("BlitoadzRenderer");

  const palettesEncoded = loadPalettesEncoded();

  await execute(
    "BlitoadzRenderer",
    {
      from: deployer,
      log: true,
    },
    "setToadz",
    palettesEncoded.toadz
  );
};

export default func;
func.tags = [TAGS.BLITOADZ_PALETTES];
func.dependencies = [TAGS.BLITOADZ];
