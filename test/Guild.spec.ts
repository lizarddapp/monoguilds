import { expect, assert } from "chai";
import { Contract } from "ethers";
import { id, keccak256, parseEther } from "ethers/lib/utils";
import { ethers, upgrades } from "hardhat";
import { duration, increase } from "./utils";

describe("Sapphire", function () {
    let manager: any, playerA: any, playerB: any;
    let sapphire: Contract, guild: Contract, guildAction: Contract, profile: Contract;
    before(async function () {
        const Sapphire = await ethers.getContractFactory("SapphireToken");
        const Profile = await ethers.getContractFactory("Profile");
        const Guild = await ethers.getContractFactory("Guild");
        const GuildAction = await ethers.getContractFactory("GuildAction");
        [manager, playerA, playerB] = await ethers.getSigners();
        sapphire = await upgrades.deployProxy(Sapphire);
        profile = await upgrades.deployProxy(Profile, [manager.address]);
        guild = await upgrades.deployProxy(Guild, [manager.address, 'http://localhost/metadata']);
        guildAction = await upgrades.deployProxy(GuildAction, [manager.address, guild.address, profile.address, sapphire.address]);
        await sapphire.deployed();
        await profile.deployed();
        await guild.deployed();
        await guildAction.deployed();
        // supply reward token to guild contract
        // await sapphire.transfer(guild.address, 100)
        // await sapphire.transfer(playerA.address, 100)
    });

    it("claim guild", async function () {
        await guild.connect(manager).grantRole(guild.MANAGER_ROLE(), guildAction.address);
        await guildAction.presaleClaimGuild("aaa", { value: parseEther("1") });
        await guildAction.presaleClaimGuild("bbb", { value: parseEther("1") });

        await profile.connect(playerA).createProfile()
        expect(await guild.totalSupply()).to.be.equal(2);
    })

    it("check guild name length", async function () {
        await guild.connect(manager).grantRole(guild.MANAGER_ROLE(), guildAction.address);

        await expect(guildAction.presaleClaimGuild("a", { value: parseEther("1") })).to.be.revertedWith('guild name length invalid');

        await expect(guildAction.presaleClaimGuild("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", { value: parseEther("1") })).to.be.revertedWith('guild name length invalid');


    })
    it("claim guild with same name", async function () {
        await expect(guildAction.connect(playerA).presaleClaimGuild("bbb", { value: parseEther("1") })).to.be.revertedWith('name taken');
    })

    it("create profile & join guild", async function () {
        await guildAction.setJoinGuildPause(false);

        await profile.connect(playerB).createProfile()
        await guildAction.connect(playerA).joinGuild(1)
        await guildAction.connect(playerB).joinGuild(1)

        console.log(await guildAction.guildMemberList(1))
        expect((await guildAction.guildMemberList(1)).length).to.be.equal(2)

    })


    it("join guild again & leave guild", async function () {
        await expect(guildAction.connect(playerA).joinGuild(1)).to.be.revertedWith('you already have guild')
        await guildAction.connect(playerA).leaveGuild(1);
        expect((await guildAction.guildMemberList(1)).length).to.be.equal(1)
        await expect(guildAction.connect(playerA).leaveGuild(1)).to.be.revertedWith('you did not joined this guild')

        // manager join 
        await profile.createProfile();
        await guildAction.joinGuild(1);

        expect((await guildAction.guildMembers(1, 1))).to.be.equal(3);

        // set max member to 2
        await guildAction.setMaxMembers(2);
        await expect(guildAction.connect(playerA).joinGuild(1)).to.be.revertedWith("reach maximum members");

    })




    // it("check total Supply", async function () {
    //     await sapphire.approve(guild.address, 1000)
    //     await sapphire.connect(playerA).approve(guild.address, 1000)
    //     await guild.stake(10)


    //     await increase(10)
    //     await guild.connect(playerA).stake(10)
    //     await increase(5)
    //     console.log(manager.address)
    //     console.log('Manager: ', await guild.earned(manager.address));

    //     console.log('PlayerA: ', await guild.earned(playerA.address));
    // });
});
