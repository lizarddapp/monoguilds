import { expect, assert } from "chai";
import { Contract } from "ethers";
import { id, keccak256, parseEther, solidityKeccak256 } from "ethers/lib/utils";
import { ethers, upgrades } from "hardhat";

describe("Sapphire", function () {
  let manager: any, playerA: any, playerB: any;
  let sapphire: Contract;
  before(async function () {
    const Sapphire = await ethers.getContractFactory("SapphireToken");

    [manager, playerA, playerB] = await ethers.getSigners();
    sapphire = await upgrades.deployProxy(Sapphire);

    await sapphire.deployed();
  });

  it("check total Supply", async function () {
    sapphire.mint(manager.address, parseEther("11"));
    sapphire.burn(manager.address, parseEther("4"));
    console.log(await sapphire.cap());
    console.log(await sapphire.totalSupply());
  });
});
