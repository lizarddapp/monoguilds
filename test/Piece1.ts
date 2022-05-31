// import { expect, assert } from "chai";
// import { Contract } from "ethers";
// import { id, keccak256, solidityKeccak256 } from "ethers/lib/utils";
// import { ethers, upgrades } from "hardhat";

// describe("Piece", function () {
//   let manager: any, playerA: any, playerB: any;

//   let piece: Contract, pieceAction: Contract;
//   before(async function () {
//     const Piece = await ethers.getContractFactory("Piece");
//     const PieceAction = await ethers.getContractFactory("PieceAction");
//     [manager, playerA, playerB] = await ethers.getSigners();
//     piece = await Piece.attach("0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8");
//     pieceAction = await PieceAction.attach("0xf5059a5D33d5853360D16C683c16e67980206f36");
//     // await piece.deployed();
//     // await pieceAction.deployed();
//   });

//   // it("pause contract from a non manager", async function () {
//   //   const tx = piece.connect(playerA).pause();
//   //   await expect(tx).to.be.revertedWith("you are not manager");
//   // });

//   it("mint 5", async function () {
//     await piece.connect(manager).grantRole(piece.MANAGER_ROLE(), pieceAction.address);

//     console.log("manager Address", await piece.getRoleMember(piece.MANAGER_ROLE(), 0));
//     // console.log(await piece.managerAddress());

//     // await pieceAction.mintBatch(10);
//     await pieceAction.mintBatch(10);
//     // const list = await pieceAction.getPieceList();
//     // console.log(await pieceAction.attributes(2));
//     expect(await piece.totalSupply()).to.equal(5);
//   });
// });
