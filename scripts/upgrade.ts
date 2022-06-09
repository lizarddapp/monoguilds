// scripts/upgrade-box.js
import { ethers, upgrades } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    const GuildAction = await ethers.getContractFactory("GuildAction");
    const guildAction = await upgrades.upgradeProxy("0xEc6551D7f65D520E639E0813e16F5a6fB57EeaCA", GuildAction);
    console.log("GuildAction upgraded", guildAction.address);

}

main();