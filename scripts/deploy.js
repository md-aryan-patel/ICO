const hre = require("hardhat");
const fs = require("fs");
const icoAbi = require("../artifacts/contracts/ICO.sol/ico.json");
const tokenAbi = require("../artifacts/contracts/Token.sol/CFNC.json");
async function main() {
  const token = await hre.ethers.deployContract("CFNC");
  await token.waitForDeployment();

  const ico = await hre.ethers.deployContract("ico", [
    token.target,
    1697117400,
    1728126300,
  ]);
  await ico.waitForDeployment();

  const data = JSON.stringify({
    Token: token.target,
    ICO: ico.target,
    TtokenAbi: tokenAbi,
    IcoAbi: icoAbi,
  });

  fs.writeFile(
    "../backend/scripts/contractAddress.json",
    data,
    "utf8",
    (error) => {
      if (error) {
        console.log(error);
        return;
      }
    }
  );
  console.log(`Token deployed @ ${token.target}`);
  console.log(`ICO deployed @ ${ico.target}`);
}

const deployBEP20 = async () => {
  const token = await hre.ethers.deployContract("BEP20", [
    hre.ethers.parseEther("100000"),
  ]);
  await token.waitForDeployment();

  console.log(`BEP deploy at: ${token.target}`);
};

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

deployBEP20().catch((err) => {
  console.log(err);
});
