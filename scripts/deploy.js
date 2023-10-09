const hre = require("hardhat");
const fs = require("fs");
const icoAbi = require("../artifacts/contracts/ICO.sol/ico.json");
const tokenAbi = require("../artifacts/contracts/Token.sol/CFNC.json");
async function main() {
  const token = await hre.ethers.deployContract("CFNC");
  await token.waitForDeployment();

  const ico = await hre.ethers.deployContract("ico", [
    token.target,
    1696836600,
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
    "../artifacts/contracts/scriptData.json",
    data,
    "utf8",
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
  console.log(`Token deployed @ ${token.target}`);
  console.log(`ICO deployed @ ${ico.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
