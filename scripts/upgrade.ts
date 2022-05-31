// scripts/upgrade-box.js
import { ethers, upgrades } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(deployer.address)
    const GuildAction = await ethers.getContractFactory("GuildAction");
    const guildAction = await upgrades.upgradeProxy("0x26a9DE19Bfc49a9b83c86303804192326bE0AA3E", GuildAction);
    console.log("GuildAction upgraded", guildAction.address);

}

main();