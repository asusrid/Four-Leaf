// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  const FourLeaf = await hre.ethers.getContractFactory("FourLeaf");
  // depends on the network
  // https://docs.chain.link/vrf/v2/subscription/supported-networks/#polygon-matic-mumbai-testnet
  // key hash
  const keyHash = "0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd";
  // TEST --------->
  // const keyHash = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";
  // VRF coordinator 
  const consumerAddress = "0xAE975071Be8F8eE67addBC1A82488F1C24858067";
  // TEST --------->
  // const consumerAddress = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
  // vrf consumer ID
  const subscriptionId = 638;
  // TEST --------->
  // const subscriptionId = 2893;
  // upkeep address
  const oracleAddress = "0x5B97c3A6A1235bbaB47c27A91Ed3c2826CB4826B";
  // TEST --------->
  // const oracleAddress = "0x60b9ecad0cF0D65b0B82135393BeafF8bD6C2047";
  // price feed
  const priceFeed = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0";
  // TEST --------->
  // const priceFeed = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada";
  const requestConfirmations = 3;
  const callbackGasLimit = 300000;
  const numWords = 6;

  const fourleaf = await FourLeaf.deploy(
    consumerAddress, 
    subscriptionId, 
    oracleAddress,
    keyHash,
    priceFeed,
    requestConfirmations,
    callbackGasLimit,
    numWords
  );

  await fourleaf.deployed();

  console.log(
    `Deployed Four-Leaf: ${fourleaf.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
