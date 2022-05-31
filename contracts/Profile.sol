// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./GM.sol";

contract Profile is GM {
    uint256 public currentProfileId;
    mapping(address => uint256) public profileIds;
    mapping(uint256 => GuildStatus) public profileGuild;

    event ProfileCreated(address indexed _from, uint256 indexed _profileId);
    event ProfileTransfer(address indexed _from, address indexed _to, uint256 indexed _profileId);

    struct GuildStatus {
        uint256 guildId; /** 1-40 */
        uint256 joinAt;
        uint256 leaveAt;
    }

    function initialize(address _adminAddress) public initializer {
        GM.init(_adminAddress);
    }

    function profileExist(address _addr) public view returns (bool isExist) {
        return profileIds[_addr] == 0 ? false : true;
    }

    function hasGuild(uint256 _profileId) internal view returns (bool result) {
        result = profileGuild[_profileId].joinAt == 0 ? true : false;
    }

    function createProfile() external {
        require(!profileExist(msg.sender), "profile already exist");
        uint256 _profileId = ++currentProfileId;
        profileIds[msg.sender] = _profileId;
        emit ProfileCreated(msg.sender, _profileId);
    }

    function profileId(address _addr) public view returns (uint256 _profileId) {
        _profileId = profileIds[_addr];
    }

    function joinGuild(uint256 _guildId) internal {
        GuildStatus storage pg = profileGuild[profileId(msg.sender)];
        pg.guildId = _guildId;
        pg.joinAt = block.timestamp;
    }

    /** profile transfer (emergency) */
    function emergencyTransferProfile(
        address _from,
        address _to,
        uint256 _profileId
    ) external {
        require(profileId(msg.sender) == _profileId, "not the profile owner");
        require(!profileExist(_to), "receiver already has profile");
        profileIds[_from] = 0;
        profileIds[_to] = _profileId;
        emit ProfileTransfer(_from, _to, _profileId);
    }
}
