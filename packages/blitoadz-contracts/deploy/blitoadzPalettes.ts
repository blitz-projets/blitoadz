// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { loadPalettesEncoded, loadToadz, TAGS } from "../utils/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { hexDataLength } = ethers.utils;
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

  const toadz = loadToadz();
  const names = toadz.map((t) =>
    t.attributes[1].value
      .split("")
      .map((c) => c.charCodeAt(0).toString(16))
      .join("")
  );

  let toadzNames = "0x";
  const indexes = [];
  for (let i = 0; i < names.length; i++) {
    indexes.push(hexDataLength(toadzNames).toString(16).padStart(4, "0"));
    toadzNames += names[i];
  }
  indexes.push(hexDataLength(toadzNames).toString(16).padStart(4, "0"));
  toadzNames = "0x" + indexes.join("") + toadzNames.slice(2);

  await execute(
    "BlitoadzRenderer",
    {
      from: deployer,
      log: true,
    },
    "setToadzNames",
    toadzNames
  );
};

export default func;
func.tags = [TAGS.BLITOADZ_PALETTES];
func.dependencies = [TAGS.BLITOADZ];
