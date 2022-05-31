import { expect, assert } from "chai";
import { Contract } from "ethers";
import { id, keccak256, parseEther, solidityKeccak256 } from "ethers/lib/utils";
import { ethers, upgrades } from "hardhat";

describe("Create profile", function () {
    let manager: any, playerA: any, playerB: any;
    let profile: Contract;
    before(async function () {
        const Profile = await ethers.getContractFactory("Profile");

        [manager, playerA, playerB] = await ethers.getSigners();
        profile = await upgrades.deployProxy(Profile, [manager.address]);

        await profile.deployed();
    });

    it("check total Supply", async function () {
        await profile.createProfile()
        await profile.connect(playerA).createProfile()
        console.log(await profile.profileIds(manager.address))
        console.log(await profile.connect(playerA).profileIds(playerA.address))
    });
});
