// scripts/upgrade-box.js
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const Test = await ethers.getContractFactory("OMGV2");
  const test = await upgrades.upgradeProxy("0x05c2587Fe78c382A935b90870a4400b0c26ED953", Test);
  console.log("Test upgraded", test.address);

}

main();