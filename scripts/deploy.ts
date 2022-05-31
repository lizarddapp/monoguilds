// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const Piece = await ethers.getContractFactory("Piece");
  const PieceAction = await ethers.getContractFactory("PieceAction");
  const Profile = await ethers.getContractFactory("Profile");
  const Guild = await ethers.getContractFactory("Guild");
  const GuildAction = await ethers.getContractFactory("GuildAction");
  const piece = await upgrades.deployProxy(Piece, [deployer.address, "https://api.monoguilds.com/piece"]);
  const profile = await upgrades.deployProxy(Profile, [deployer.address]);
  await piece.deployed();
  await profile.deployed();
  const pieceAction = await upgrades.deployProxy(PieceAction, [deployer.address, deployer.address, piece.address, profile.address]);
  await pieceAction.deployed();

  console.log("Piece deployed to:", piece.address);
  console.log("Profile deployed to:", profile.address);

  console.log("Granting Manager role to PieceAction");
  await piece.grantRole(piece.MANAGER_ROLE(), pieceAction.address);

  console.log("PieceAction  deployed to:", pieceAction.address);
  const SapphireToken = await ethers.getContractFactory("SapphireToken");
  const sapphire = await upgrades.deployProxy(SapphireToken);

  await sapphire.deployed();
  console.log("SapphireToken deployed to:", sapphire.address);

  const guild = await upgrades.deployProxy(Guild, [deployer.address, "https://api.monoguilds.com/guild"]);
  console.log("Guild deployed to:", guild.address);
  const guildAction = await upgrades.deployProxy(GuildAction, [deployer.address, guild.address, profile.address, sapphire.address]);
  await guildAction.deployed();
  await guild.grantRole(guild.MANAGER_ROLE(), guildAction.address);
  console.log("GuildAction deployed to:", guildAction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
