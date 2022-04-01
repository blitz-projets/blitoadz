// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TAGS } from "../utils/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy renderer
  const BlitoadzRenderer = await get("BlitoadzRenderer");
  const rendererTx = await deploy("BlitoadzRendererV2", {
    from: deployer,
    log: true,
    args: [BlitoadzRenderer.address],
  });

  // Deploy token
  await execute(
    "Blitoadz",
    {
      from: deployer,
      log: true,
    },
    "setRenderingContractAddress",
    rendererTx.address
  );
};
export default func;
func.tags = [TAGS.BLITOADZ_RENDERER_V2];
func.dependencies = [TAGS.BLITOADZ];
