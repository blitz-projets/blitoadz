import { setupUser, setupUsers } from "./utils";
import chai from "chai";
import {
  deployments,
  ethers,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";
import { solidity } from "ethereum-waffle";
import { TAGS } from "../../utils/constants";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";

chai.use(jestSnapshotPlugin());
chai.use(solidity);
const { expect } = chai;

const setup = async () => {
  await deployments.fixture([TAGS.BLITOADZ, TAGS.BLITOADZ_PALETTES]);
  const contracts = {
    Blitoadz: await ethers.getContract("Blitoadz"),
  };
  const constants = {
    MINT_PUBLIC_PRICE: await contracts.Blitoadz.MINT_PUBLIC_PRICE(),
    TOADZ_COUNT: await contracts.Blitoadz.TOADZ_COUNT(),
    BLITMAP_COUNT: await contracts.Blitoadz.BLITMAP_COUNT(),
    BLITOADZ_COUNT: await contracts.Blitoadz.BLITOADZ_COUNT(),
  };
  const { deployer } = await getNamedAccounts();
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
    ...constants,
    deployer: await setupUser(deployer, contracts),
  };
};

const publicSaleFixture = deployments.createFixture(async ({ network }) => {
  const contractsAndUsers = await setup();
  await contractsAndUsers.deployer.Blitoadz.openPublicSale();
  await network.provider.send("evm_mine");
  return contractsAndUsers;
});

describe("Blitoadz", function () {
  describe("mintPublicSale", async function () {
    it("should revert when minting is not open", async () => {
      const { users } = await setup();
      await expect(
        users[0].Blitoadz.mintPublicSale([0], [0])
      ).to.be.revertedWith("Public sale not open");
    });
    it("should revert when price is not good", async () => {
      const { users } = await publicSaleFixture();
      await expect(
        users[0].Blitoadz.mintPublicSale([0], [0])
      ).to.be.revertedWith("Price does not match");
    });
    it("should revert when toadzIds and blitmapIds length do not match", async () => {
      const { users, MINT_PUBLIC_PRICE } = await publicSaleFixture();
      await expect(
        users[0].Blitoadz.mintPublicSale([0], [0, 1], {
          value: MINT_PUBLIC_PRICE,
        })
      ).to.be.revertedWith("There should be one toadzId for each blitmapId");
    });
    it("should mint one blitoadz", async () => {
      const { users, Blitoadz, MINT_PUBLIC_PRICE } = await publicSaleFixture();
      await users[0].Blitoadz.mintPublicSale([0], [0], {
        value: MINT_PUBLIC_PRICE,
      });
      const owner = await Blitoadz.ownerOf(0);
      expect(owner).to.eq(users[0].address);
      const toadzId = await Blitoadz.blitoadz(0);
      const blitmapId = await Blitoadz.blitoadz(1);
      expect(toadzId).to.eq(0);
      expect(blitmapId).to.eq(0);
    });
    it("should batch mint blitoadz", async () => {
      const { users, Blitoadz, MINT_PUBLIC_PRICE } = await publicSaleFixture();
      await users[0].Blitoadz.mintPublicSale([0, 1, 2], [10, 11, 12], {
        value: MINT_PUBLIC_PRICE.mul(3),
      });
      const owners = await Promise.all(
        [...Array(3).keys()].map(
          async (tokenId) => await Blitoadz.ownerOf(tokenId)
        )
      );
      expect(new Set(owners).size).to.eq(1);
      expect(owners[0]).to.eq(users[0].address);
    });
    it("should revert when trying to mint an existing combination", async () => {
      const { users, MINT_PUBLIC_PRICE } = await publicSaleFixture();
      await users[0].Blitoadz.mintPublicSale([0], [0], {
        value: MINT_PUBLIC_PRICE,
      });
      await expect(
        users[1].Blitoadz.mintPublicSale([0], [0], {
          value: MINT_PUBLIC_PRICE,
        })
      ).to.be.revertedWith("Blitoadz already exists");
    });
  });
});
