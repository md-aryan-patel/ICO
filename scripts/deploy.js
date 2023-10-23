const hre = require("hardhat");
const fs = require("fs");
const icoAbi = require("../artifacts/contracts/ICO.sol/ico.json");
const tokenAbi = require("../artifacts/contracts/Token.sol/CFNC.json");
async function main() {
  const token = await hre.ethers.deployContract("CFNC");
  await token.waitForDeployment();

  const ico = await hre.ethers.deployContract("ico", [
    token.target,
    1698055216,
    1698062416,
  ]);
  await ico.waitForDeployment();

  await token.transferToIco(ico.target);

  console.log(`Token deployed @ ${token.target}`);
  console.log(`ICO deployed @ ${ico.target}`);
  await token.transferToIco(ico.target);
  console.log("Token transferd to ICO");
}

const deployBEP20 = async () => {
  const token = await hre.ethers.deployContract("USDT", [
    "0xe7144c6dbab38ef5787f7403dea6e1b9b267ed2c",
  ]);
  await token.waitForDeployment();

  console.log(`token deploy at: ${token.target}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// deployBEP20().catch((err) => {
//   console.log(err);
// });
