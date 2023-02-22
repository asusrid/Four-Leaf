require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_GOERLI_API_KEY_URL = process.env.ALCHEMY_GOERLI_API_KEY_URL;
const METAMASK_GOERLI_PRIVATE_KEY = process.env.METAMASK_GOERLI_PRIVATE_KEY;

const ALCHEMY_MUMBAI_API_KEY_URL = process.env.ALCHEMY_MUMBAI_API_KEY_URL;
const METAMASK_MUMBAI_PRIVATE_KEY = process.env.METAMASK_MUMBAI_PRIVATE_KEY;

const ALCHEMY_POLYGON_API_KEY_URL = process.env.ALCHEMY_POLYGON_API_KEY_URL;
const METAMASK_POLYGON_PRIVATE_KEY = process.env.METAMASK_POLYGON_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: ALCHEMY_GOERLI_API_KEY_URL,
      accounts: [METAMASK_GOERLI_PRIVATE_KEY]
    },
    mumbai: {
      url: ALCHEMY_MUMBAI_API_KEY_URL,
      accounts: [METAMASK_MUMBAI_PRIVATE_KEY]
    },
    polygon: {
      url: ALCHEMY_POLYGON_API_KEY_URL,
      accounts: [METAMASK_POLYGON_PRIVATE_KEY]
    }
  }
};
