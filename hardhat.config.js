require("@nomicfoundation/hardhat-toolbox");
const env = require("./backend/env/index");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",

  networks: {
    sepolia: {
      url: env.sepolia_network,
      accounts: [env.admin_private_key],
    },
  },
};
