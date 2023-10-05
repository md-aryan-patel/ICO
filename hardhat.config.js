require("@nomicfoundation/hardhat-toolbox");
const env = require("./backend/env/index");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",

  networks: {
    sepolia: {
      url: env.SPOLIA_NETWORK,
      accounts: [env.ADMIN_PRIVATE_KEY],
    },
  },
};
