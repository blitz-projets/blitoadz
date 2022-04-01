import chai from "chai";
import { deployments, ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { TAGS } from "../../utils/constants";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";
import { Strings } from "../../typechain";

chai.use(jestSnapshotPlugin());
chai.use(solidity);
const { expect } = chai;

const setup = async () => {
  await deployments.fixture([TAGS.STRINGS]);
  const contracts = {
    Strings: (await ethers.getContract("Strings")) as Strings,
  };
  return {
    ...contracts,
  };
};

describe("Strings", function () {
  describe("join", async function () {
    [
      [
        "a".repeat(20),
        "b".repeat(20),
        "c".repeat(20),
        "d".repeat(20),
        "e".repeat(20),
        "f".repeat(20),
        "s".repeat(20),
        "e".repeat(20),
        "s".repeat(20),
        "a".repeat(20),
        "b".repeat(20),
        "c".repeat(20),
        "d".repeat(20),
        "e".repeat(20),
        "f".repeat(20),
        "s".repeat(20),
        "e".repeat(20),
        "s".repeat(20),
      ],
    ].forEach((test) => {
      it(`should join ${test} as ${test.join("")}`, async function () {
        const { Strings } = await setup();
        const asmGas = await Strings.estimateGas["join(string[])"](test);
        console.log(`asm gas: ${asmGas.toString()}`);
        const loopGas = await Strings.estimateGas["joinConcatLoop"](test);
        console.log(`loop gas: ${loopGas.toString()}`);
        const result = await Strings.functions["join(string[])"](test);
        expect(result[0]).to.equal(test.join(""));
      });
    });
  });
});
