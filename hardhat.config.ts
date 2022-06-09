import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: 'https://eth-goerli.alchemyapi.io/v2/7f-ppg9A-SnKpqsx9Vg4y-XshUq_O6FY',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],

    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    harmony_testnet: {
      url: `https://api.s0.ps.hmny.io/`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],


      gas: 21000000,
      gasPrice: 80000000000
    },
    harmony: {
      url: `https://api.harmony.one`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],

      chainId: 1666600000,
    },
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
