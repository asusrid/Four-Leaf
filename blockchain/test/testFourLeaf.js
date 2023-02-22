const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("@openzeppelin/test-helpers");
const { utils } = require("web3");

describe("FourLeaf", function () {

  let fourleaf;
  let contract, user1, user2;

  before(async function () {

    var fourleafContract = await ethers.getContractFactory("FourLeaf");
    const consumerAddress = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
    const subscriptionId = 2893;
    const oracleAddress = "0x60b9ecad0cF0D65b0B82135393BeafF8bD6C2047";
    fourleaf = await fourleafContract.deploy(consumerAddress, subscriptionId, oracleAddress);
    // fourleaf = await fourleafContract.deploy();
    await fourleaf.deployed();

    [contract, user1, user2] = await ethers.getSigners();
    console.log("Contract address: ", contract.address);
    console.log("User1 address: ", user1.address);
    console.log("User2 address: ", user2.address);
    // to know all functions available for testing
    console.log(Object.keys(fourleaf));

    // console.log("Test ", await fourleaf.games(0).winnerNumber(0));
  });

  it("Winning", async function () {
    console.log(await fourleaf.connect(user1).betNumber(123455,
      { value: 100 }
    ));
    console.log("Test ", await fourleaf.games(0));
  })

  // it("Winning", async function () {

  //   console.log("----- ANTES -------");
  //   console.log(await contract.getBalance());
  //   console.log(await user1.getBalance());
  //   console.log(await user2.getBalance());

  //   await fourleaf.connect(contract).testingApp(
  //     user1.address,
  //     user2.address,
  //     { value: 100 }
  //   )

  //   console.log("----- DESPUES -------");
  //   console.log(await contract.getBalance());
  //   console.log(await user1.getBalance());
  //   console.log(await user2.getBalance());

  // });

  // it("Baker put on sale", async function () {

  //   await fourleaf.putOnSale(
  //     utils.toWei("0.0001")
  //   );

  //   expect(await fourleaf.getPrice()).to.equal(utils.toWei("0.0001"));
  // });

  // it("Customer buy", async function () {

  //   user1Balance = await user1.getBalance();
  //   console.log("Farmer balance: ", user1Balance);
  //   user2Balance = await user2.getBalance();
  //   console.log("Baker balance: ", user2Balance);

  //   const price = await fourleaf.getLatestPrice();
  //   console.log("------------->", price);
  //   const tx = await fourleaf.connect(user1).betNumber(
  //     user2.address,
  //     1234,
  //     // { value: ethers.utils.parseUnits( (await fourleaf.getLatestPrice() / 10 ** 10).toString(), "ether") }
  //     { value: price }
  //   );

  //   user1Balance = await user1.getBalance();
  //   console.log("Farmer balance: ", user1Balance);
  //   user2Balance = await user2.getBalance();
  //   console.log("Baker balance: ", user2Balance);
  // });

  // it("Get number", async function () {

  //   var user1Balance = await user1.getBalance();
  //   console.log("Farmer balance: ", user1Balance);
  //   var user2Balance = await user2.getBalance();
  //   console.log("Baker balance: ", user2Balance);

  //   console.log((await fourleaf.getLatestPrice() / 10 ** 10) * 10 ** 18 < await user1.getBalance());

  //   const price = await fourleaf.getPrice();
  //   console.log(price)
  //   // await fourleaf.connect(user1).betNumber(
  //   //   user2.address,
  //   //   // { value: ethers.utils.parseUnits( (await fourleaf.getLatestPrice() / 10 ** 10).toString(), "ether") }
  //   //   { value: price }
  //   // );

  //   user1Balance = await user1.getBalance();
  //   console.log("Farmer balance: ", user1Balance);
  //   user2Balance = await user2.getBalance();
  //   console.log("Baker balance: ", user2Balance);

  // });

});
