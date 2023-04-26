require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  settings: {
    optimizer: {
      enabled: true,
      runs: 100,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MainnetRPC,
        blockNumber: 17115740,
      },
    },
    mainnet: {
      url: process.env.MainnetRPC,
      accounts: [process.env.MainPKK],
      gas: 10000000,
      gasPrice: 15000000000,
    }
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21,
    enabled: true,
  },
  mocha: {
    timeout: 4000000
  }
};
