import { expect, assert } from "chai";
import { Contract } from "ethers";
import { id, keccak256, parseEther, solidityKeccak256 } from "ethers/lib/utils";
import { ethers, upgrades } from "hardhat";

describe("Piece", function () {
  let manager: any, playerA: any, playerB: any, founder: any;

  let piece: Contract, pieceAction: Contract, profile: Contract;
  before(async function () {
    const Piece = await ethers.getContractFactory("Piece");
    const PieceAction = await ethers.getContractFactory("PieceAction");
    const Profile = await ethers.getContractFactory("Profile");

    [manager, playerA, playerB, founder] = await ethers.getSigners();
    piece = await upgrades.deployProxy(Piece, [manager.address, "https://abc.com"]);
    profile = await upgrades.deployProxy(Profile, [manager.address]);
    pieceAction = await upgrades.deployProxy(PieceAction, [manager.address, manager.address, piece.address, profile.address]);
    await piece.deployed();
    await pieceAction.deployed();

    // console.table([manager.address, playerA.address, playerB.address]);
  });

  // it("pause contract from a non manager", async function () {
  //   const tx = piece.connect(playerA).pause();
  //   await expect(tx).to.be.revertedWith("you are not manager");
  // });

  it("mint 15", async function () {
    // console.log(abi.encode keccak256("MANAGER_ROLE"));

    await piece.connect(manager).grantRole(piece.MANAGER_ROLE(), pieceAction.address);

    await pieceAction.mintBatch(5, { value: parseEther("5") });
    await pieceAction.mintBatch(5, { value: parseEther("5") });
    // await pieceAction.connect(playerA).mintBatch(5, { value: parseEther("5") });
    await pieceAction.pause();
    expect(await piece.totalSupply()).to.equal(3);
  });


  it("reveal", async function () {
    // console.log(abi.encode keccak256("MANAGER_ROLE"));

    await piece.connect(manager).grantRole(piece.MANAGER_ROLE(), pieceAction.address);
    await pieceAction.setPauseReveal(false);
    await profile.createProfile()
    await pieceAction.reveal(1)
    await pieceAction.reveal(2)
    await pieceAction.reveal(3)
    await pieceAction.reveal(4)
    await pieceAction.reveal(5)
    await pieceAction.reveal(6)
    await pieceAction.reveal(7)
    await pieceAction.reveal(8)
    await pieceAction.reveal(9)
    await pieceAction.reveal(10)
    // const [level, gen, rarity, strength, speed, luck, agility] = await pieceAction.attributes(1)

    expect(await piece.totalSupply()).to.equal(15);
  });

  it("move 25 time with maximum speed", async function () {
    const [level, rarity, strength, speed, luck, agility] = await pieceAction.attributes(12);

    const speedNumber = parseInt(speed);
    let step = 0;
    console.log(speedNumber);
    for (var i = 0; i < 25; i++) {
      step += speedNumber;
      await pieceAction.connect(playerA).move(12, speedNumber);
      if (step > 40) {
        step -= 40;
      }
    }
    const [stepOn, lastMoveAt] = await pieceAction.locations(12);
    console.log(stepOn);
    expect(stepOn).to.equal(step);
  });

  // it("reach maximum mint", async function () {
  //   await pieceAction.connect(playerA).mintBatch(5, { value: parseEther("10") });

  //   // expect(stepOn).to.equal(step);
  // });
});

/** 236676 */