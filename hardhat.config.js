require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",

  networks: {
    sepolia: {
      url: process.env.sepolia_network,
      accounts: [process.env.admin_private_key],
    },
    bnb: {
      url: process.env.bsc_network,
      accounts: [process.env.admin_private_key],
    },
    polygon: {
      url: process.env.polygon_network,
      accounts: [process.env.admin_private_key],
    },
  },
};
