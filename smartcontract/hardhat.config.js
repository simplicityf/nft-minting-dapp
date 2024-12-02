require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const INFURA_KEY = process.env.INFURA_KEY;
const SEPOLIA_KEY = process.env.SEPOLIA_KEY;
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      accounts: [SEPOLIA_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_KEY
    },
    sourcify: {
      enabled: true
    }
  }
};


// 0x07F841163149BBf3d6Bc809a1D38DE83Ab7d6AD5