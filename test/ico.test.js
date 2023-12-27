const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe("ICO", () => {
  let ico;
  let owner = process.env.admin_address;
  let token;
  beforeEach(async () => {
    token = await hre.ethers.deployContract("CFNC");
    await token.waitForDeployment();

    ico = await ethers.deployContract("ico", [
      token.target,
      Math.floor(Date.now() / 1000) + 30,
      Math.floor(Date.now() / 1000) + 120,
      5,
    ]);
    await ico.waitForDeployment();
  });

  it("should set the correct owner", async () => {
    expect(await ico.owner()).to.equal(owner);
  });

  it("Should test global states", async () => {
    expect(await ico.pricePerToken()).to.equal(3 * 10 ** 4);
    expect(await ico.startTime()).to.be.above(0);
    expect(await ico.endTime()).to.be.above(0);
    expect(await ico.bonusPercentage()).to.equal(5);
  });

  it("should test ICO state", async () => {
    expect(await ico.getIcoStage()).to.equal(0);
  });
});
