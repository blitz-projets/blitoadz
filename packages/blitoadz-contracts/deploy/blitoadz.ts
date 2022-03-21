// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TAGS } from "../utils/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, get } = deployments;
  const {
    deployer,
    focusPoint,
    treasury,
    gremplin,
    gb,
    clemlaflemme,
    opensea,
    looksrare,
    integersLib,
    blitmap,
  } = await getNamedAccounts();
  const founders = {
    [focusPoint]: {
      shares: 1680,
      withdrawnAmount: 0,
    },
    [treasury]: {
      shares: 1400,
      withdrawnAmount: 0,
    },
    [gremplin]: {
      shares: 312,
      withdrawnAmount: 0,
    },
    [gb]: {
      shares: 628,
      withdrawnAmount: 0,
    },
    [clemlaflemme]: {
      shares: 628,
      withdrawnAmount: 0,
    },
  };
  const blitmapCreatorShares = 952;

  let blitmapAddress = blitmap;
  if (network.tags.staging) {
    const Blitmap = await get("Blitmap");
    blitmapAddress = Blitmap.address;
  }

  // Deploy renderer
  const rendererTx = await deploy("BlitoadzRenderer", {
    from: deployer,
    log: true,
    args: [blitmapAddress],
    libraries: { Integers: integersLib },
  });

  // Deploy token
  await deploy("Blitoadz", {
    from: deployer,
    log: true,
    args: [
      "Blitoadz",
      "BLTZ",
      rendererTx.address,
      opensea,
      looksrare,
      Object.keys(founders),
      Object.values(founders),
      blitmapCreatorShares,
      blitmapAddress,
    ],
  });
};
export default func;
func.tags = [TAGS.BLITOADZ];
func.dependencies = [TAGS.BLITMAP];
