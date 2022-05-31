// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./GM.sol";

import "hardhat/console.sol";
import "./interfaces/IProfile.sol";
import "./interfaces/IGuild.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract GuildAction is GM, PausableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IProfile public profile;
    IGuild public guild;
    IERC20Upgradeable public sapphire;

    bool public joinGuildPause;
    bool public claimGuildPause;

    /** Guild Members Info */
    mapping(uint256 => uint256[]) public guildMembers;
    mapping(uint256 => JoinGuildInfo) public profileJoinGuildInfo;
    struct JoinGuildInfo {
        uint256 guildId;
        bool joined;
        uint256 joinedAt;
    }

    /** Guild Settings */
    mapping(uint256 => GuildSetting) public guildSettings;
    struct GuildSetting {
        string name;
        bool inviteOnly;
    }
    mapping(string => uint256) public nameToIndex;

    uint256 public maxMembers;
    uint256 public constant GUILD_PRESALE_SUPPLY = 100;
    uint256 public constant GUILD_PRESALE_PRICE = 1 ether;
    uint256 public guildPrice;
    // uint256 public constant LEAVE_GUILD_COOLDOWN = 259200; /**  3 days */

    event CreateGuild(uint256 indexed tokenId, address indexed to, string name);
    event JoinGuild(uint256 indexed profileId, uint256 indexed guildId, uint256 joinAt);
    event LeaveGuild(uint256 indexed profileId, uint256 indexed guildId, uint256 leaveAt);

    // struct ClaimableAddressInfo {
    //     uint256 guildId;
    //     bool set;
    //     bool claimed;
    // }

    // struct PieceWorkingInfo {
    //     uint256 firstDepositAt;
    //     uint256 lastWithdrawAt;
    // }

    function initialize(
        address _adminAddress,
        address _guildAddress,
        address _profileAddress,
        address _sapphireAddress
    ) public initializer {
        GM.init(_adminAddress);
        __Pausable_init();

        profile = IProfile(_profileAddress);
        guild = IGuild(_guildAddress);
        sapphire = IERC20Upgradeable(_sapphireAddress);
        guildPrice = 10 ether;
        maxMembers = 40;
        claimGuildPause = true;
    }

    function nameTaken(string memory name) public view returns (bool taken) {
        return (nameToIndex[name] > 0);
    }

    function setMaxMembers(uint256 _count) external onlyRole(DEFAULT_ADMIN_ROLE) {
        maxMembers = _count;
    }

    function setClaimGuildPause(bool _isPause) external onlyRole(DEFAULT_ADMIN_ROLE) {
        claimGuildPause = _isPause;
    }

    function presaleClaimGuild(string memory _name) external payable whenNotPaused {
        require(guild.totalSupply() <= GUILD_PRESALE_SUPPLY, "guild total supply exceeded");
        require(msg.value == GUILD_PRESALE_PRICE, "invalid price");
        require(!nameTaken(_name), "name taken");
        uint256 guildId = guild.totalSupply() + 1;
        guild.mint(msg.sender, guildId);
        guildSettings[guildId].name = _name;
        nameToIndex[_name] = guildId;
        emit CreateGuild(guildId, msg.sender, _name);
    }

    /** will be pay using SAPPHIRE */
    function claimGuild(string memory _name) external {
        require(claimGuildPause == false, "paused");
        require(nameTaken(_name), "name taken");
        require(sapphire.balanceOf(msg.sender) >= guildPrice, "insuffecient amount");
        sapphire.safeTransferFrom(msg.sender, address(this), guildPrice);
        uint256 guildId = guild.totalSupply() + GUILD_PRESALE_SUPPLY + 1;
        guild.mint(msg.sender, guildId);
        guildSettings[guildId].name = _name;
        nameToIndex[_name] = guildId;
        emit CreateGuild(guildId, msg.sender, _name);
    }

    function setJoinGuildPause(bool _status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        joinGuildPause = _status;
    }

    modifier whenJoinGuildNotPaused() {
        require(joinGuildPause == false, "join guild is paused");
        _;
    }

    function joinGuild(uint256 _guildId) external whenJoinGuildNotPaused {
        uint256 profileId = profile.profileId(msg.sender);
        JoinGuildInfo storage jgi = profileJoinGuildInfo[profileId];
        require(profileId != 0, "no profile");
        require(jgi.joined == false, "you already have guild");
        require(guildSettings[_guildId].inviteOnly == false, "invite only");
        uint256[] storage gm = guildMembers[_guildId];
        require(gm.length < maxMembers, "reach maximum members");
        // require()
        jgi.guildId = _guildId;
        jgi.joined = true;
        jgi.joinedAt = block.timestamp;
        gm.push(profileId);
        emit JoinGuild(profileId, _guildId, block.timestamp);
    }

    function leaveGuild(uint256 _guildId) external whenJoinGuildNotPaused {
        uint256 profileId = profile.profileId(msg.sender);
        JoinGuildInfo storage jgi = profileJoinGuildInfo[profileId];
        require(jgi.joined && jgi.guildId == _guildId, "you did not joined this guild");
        uint256[] storage gm = guildMembers[_guildId];

        jgi.joined = false;
        jgi.guildId = 0;

        remove(gm, profileId);
        emit LeaveGuild(profileId, _guildId, block.timestamp);
    }

    function remove(uint256[] storage _arr, uint256 _value) private returns (uint256[] memory) {
        bool startShift = false;
        for (uint256 i = 0; i < _arr.length - 1; i++) {
            if (_arr[i] == _value) {
                startShift = true;
            }
            if (startShift) _arr[i] = _arr[i + 1];
        }
        if (startShift || _arr[_arr.length - 1] == _value) _arr.pop();
        return _arr;
    }

    function guildMemberList(uint256 _guildId) external view returns (uint256[] memory) {
        return guildMembers[_guildId];
    }

    function withdrawValue(uint256 value) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(address(this).balance != 0, "Nothing to withdraw");
        (bool success, ) = payable(msg.sender).call{value: value}("");
        require(success, "Withdraw failed");
    }

    function withdrawToken(
        address _tokenContract,
        address _whereTo,
        uint256 _amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20Upgradeable tokenContract = IERC20Upgradeable(_tokenContract);
        tokenContract.transfer(_whereTo, _amount);
    }
}

// function addClaimableAddress(address[] calldata _claimableAddress, uint256[] calldata _claimableGuildIds)
//     external
//     onlyRole(DEFAULT_ADMIN_ROLE)
// {
//     require(_claimableAddress.length == _claimableGuildIds.length, "invalid input");
//     for (uint256 i; i < _claimableAddress.length; i++) {
//         claimableAddressArray.push(_claimableAddress[i]);
//         initialClaimableGuildId++;
//         claimableAddresses[_claimableAddress[i]] = ClaimableAddressInfo(_claimableGuildIds[i], true, false);
//     }
// }

/** in case someone didn't claim for a long time */

// function setClaimableAddresses(address[] calldata _claimableAddress, bool _set)
//     external
//     onlyRole(DEFAULT_ADMIN_ROLE)
// {
//     for (uint256 i; i < _claimableAddress.length; i++) {
//         claimableAddresses[_claimableAddress[i]].set = _set;
//     }
// }

// function claim(uint256 _guildId) external {
//     ClaimableAddressInfo memory cai = claimableAddresses[msg.sender];

//     require(profile.profileExist(msg.sender), "no profile");
//     require(cai.set && !cai.claimed, "claim invalid");

//     guild.safeTransferFrom(gameMasterAddress, msg.sender, _guildId);
//     cai.claimed = true;
// }
