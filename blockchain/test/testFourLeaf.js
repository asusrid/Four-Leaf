const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("@openzeppelin/test-helpers");
const { utils } = require("web3");

describe("FourLeaf", function () {

  let fourleaf;
  let contract, user1, user2;

  before(async function () {

    var fourleafContract = await ethers.getContractFactory("FourLeaf");
    const keyHash = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";
    const consumerAddress = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
    const subscriptionId = 2893;
    const oracleAddress = "0x60b9ecad0cF0D65b0B82135393BeafF8bD6C2047";
    const priceFeed = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada";
    const requestConfirmations = 3;
    const callbackGasLimit = 300000;
    const numWords = 6;
    const updateInterval = 60;

    fourleaf = await fourleafContract.deploy(
      consumerAddress, 
      subscriptionId, 
      oracleAddress,
      keyHash,
      priceFeed,
      requestConfirmations,
      callbackGasLimit,
      numWords,
      updateInterval
    );
    // fourleaf = await fourleafContract.deploy();
    await fourleaf.deployed();

    [contract, user1, user2] = await ethers.getSigners();
    console.log("Contract address: ", contract.address);
    console.log("User1 address: ", user1.address);
    console.log("User2 address: ", user2.address);
    // to know all functions available for testing
    // console.log(Object.keys(fourleaf));
  });

  it("1. Betting", async function () {
    await fourleaf.connect(user1).betNumber("023456",
      { value: 1000 }
    );
    await fourleaf.connect(user2).betNumber("053456",
      { value: 1000 }
    );
    await fourleaf.connect(user1).betNumber("003456",
      { value: 1000 }
    );
    await fourleaf.connect(user2).betNumber("086456",
      { value: 1000 }
    );
    await fourleaf.connect(user2).betNumber("026456",
      { value: 1000 }
    );
    await fourleaf.connect(user2).betNumber("076456",
      { value: 1000 }
    );
    await fourleaf.connect(user2).betNumber("120456",
      { value: 1000 }
    );
    await fourleaf.connect(user1).betNumber("123456",
      { value: 1000 }
    );
    await fourleaf.connect(user2).betNumber("000000",
      { value: 1000 }
    );
    await fourleaf.connect(user1).betNumber("497653",
      { value: 1000 }
    );
  })

  it("2. Get winning number", async function () {
    await fourleaf.testFulfill();
    console.log("Winning number >>>> ", await fourleaf.games(0).winnerNumber);
  })

  it("3. checkUpkeep()", async function () {
    await fourleaf.checkUpkeep("0x0000000000000000000000000000000000000000000000000000000000000000");
    await fourleaf.checkUpkeep("0x0000000000000000000000000000000000000000000000000000000000000001");
  })

  it("3. performUpkeep() - Group 0", async function () {
    // 0,"",1,["023456"],2,[053456,003456],0,[""]
    await fourleaf.performUpkeep("0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000006303233343536000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000063035333435360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000630303334353600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
  })

  it("3. performUpkeep() - Group 1", async function () {
    // 1,"",0,[""],0,[""],3,[086456,026456,100456,,,,]
    await fourleaf.performUpkeep("0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000006303836343536000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063032363435360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000631303034353600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
  })

  // it("Bet 10 nums", async function () {
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  // })

  // it("Bet MORE THAN 10 nums", async function () {
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  // })

  // it("Ask exclusivity", async function () {
  //   await fourleaf.connect(user1).betNumber("111111",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).getExclusivity("111111",
  //     { value: 100 }
  //   );
  // })

  // it("Not able to ask exclusivity", async function () {
  //   await fourleaf.connect(user1).betNumber("023456",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("023456",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).getExclusivity("023456",
  //     { value: 100 }
  //   );
  // })

  // it("Not able to ask exclusivity 2", async function () {
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user1).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).betNumber("222222",
  //     { value: 100 }
  //   );
  //   await fourleaf.connect(user2).getExclusivity("222222",
  //     { value: 100 }
  //   );
  // })

});
