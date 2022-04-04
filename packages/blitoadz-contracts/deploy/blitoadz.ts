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
    blitmap,
    dhof,
    numo,
    cdt,
    matsnft,
  } = await getNamedAccounts();
  const founders = {
    [focusPoint]: {
      shares: 1680,
      withdrawnAmount: 0,
      remainingAllocation: 5,
    },
    [treasury]: {
      shares: 1400,
      withdrawnAmount: 0,
      remainingAllocation: 9,
    },
    [gb]: {
      shares: 628,
      withdrawnAmount: 0,
      remainingAllocation: 5,
    },
    [clemlaflemme]: {
      shares: 628,
      withdrawnAmount: 0,
      remainingAllocation: 5,
    },
    [gremplin]: {
      shares: 312,
      withdrawnAmount: 0,
      remainingAllocation: 2,
    },
    [dhof]: {
      shares: 0,
      withdrawnAmount: 0,
      remainingAllocation: 1,
    },
    [numo]: {
      shares: 0,
      withdrawnAmount: 0,
      remainingAllocation: 1,
    },
    [cdt]: {
      shares: 0,
      withdrawnAmount: 0,
      remainingAllocation: 1,
    },
    [matsnft]: {
      shares: 0,
      withdrawnAmount: 0,
      remainingAllocation: 1,
    },
  };
  const blitmapCreatorShares = 952;

  let blitmapAddress = blitmap;
  if (network.tags.staging) {
    const Blitmap = await get("Blitmap");
    blitmapAddress = Blitmap.address;
  }

  const PaletteRenderer = await get("PaletteRenderer");
  const Array = await get("Array");

  // Deploy renderer
  const rendererTx = await deploy("BlitoadzRenderer", {
    from: deployer,
    log: true,
    args: [blitmapAddress],
    libraries: {
      PaletteRenderer: PaletteRenderer.address,
      Array: Array.address,
    },
  });

  // Deploy token
  await deploy("Blitoadz", {
    from: deployer,
    log: true,
    args: [
      "Blitoadz",
      "BLTZ",
      rendererTx.address,
      Object.keys(founders),
      Object.values(founders),
      blitmapCreatorShares,
      blitmapAddress,
    ],
  });
};
export default func;
func.tags = [TAGS.BLITOADZ];
func.dependencies = [TAGS.BLITMAP, TAGS.PALETTE_RENDERER, TAGS.ARRAY];
