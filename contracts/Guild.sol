// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./interfaces/IProfile.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "./GM.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract Guild is GM, ERC721EnumerableUpgradeable, PausableUpgradeable {
    string private baseURI;

    function initialize(address _adminAddress, string memory _baseURI) public initializer {
        GM.init(_adminAddress);
        ERC721EnumerableUpgradeable.__ERC721Enumerable_init();
        __ERC721_init("Guild", "GUILD");

        PausableUpgradeable.__Pausable_init();
        baseURI = _baseURI;
    }

    function mint(address to, uint256 tokenId) external onlyRole(MANAGER_ROLE) whenNotPaused {
        _safeMint(to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721EnumerableUpgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setBaseURI(string memory _baseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _baseURI;
    }

    // function setGuildReward(uint256 _tokenId, uint256 amount) external {}

    // function getEarnedRate() private returns (uint256) {
    //     return 1 ether / 10;
    // }

    // function pendingReward(uint256 _tokenId) external view returns (uint256 reward) {}

    // function rewardUsedUp(uint256 _guildId) external view returns (bool) {}

    // function stakePiece(uint256[] memory _tokenIds) external {}
}
