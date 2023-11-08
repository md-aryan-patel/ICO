const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const token = await hre.ethers.deployContract("CFNC");
  await token.waitForDeployment();

  const ico = await hre.ethers.deployContract("ico", [
    token.target,
    process.env.startTime,
    process.env.endTime,
    5,
  ]);
  await ico.waitForDeployment();

  await token.transferToIco(ico.target);

  console.log(`Token deployed @ ${token.target}`);
  console.log(`ICO deployed @ ${ico.target}`);
  await token.transferToIco(ico.target);
  console.log("Token transferd to ICO");
}

const deployUsdt = async () => {
  const token = await hre.ethers.deployContract("USDT");
  const mintAddress = "0x80A344d8095d099bb72e6298aA8bA2C9E82A4Cbe";
  await token.waitForDeployment();
  await token.mint(mintAddress, hre.ethers.parseEther("10000"));

  console.log(`Token minted to ${mintAddress}`);

  console.log(`token deploy at: ${token.target}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// deployUsdt().catch((err) => {
//   console.log(err);
// });
