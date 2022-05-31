// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./GM.sol";

contract Piece is ERC721EnumerableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, GM {
    string private baseURI;

    function initialize(address _daoAddress, string memory _baseURI) public initializer {
        ERC721EnumerableUpgradeable.__ERC721Enumerable_init();
        __ERC721_init("Piece", "PIECE");
        PausableUpgradeable.__Pausable_init();
        GM.init(_daoAddress);
        baseURI = _baseURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721EnumerableUpgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function pause() external onlyRole(MANAGER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(MANAGER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 tokenId) external onlyRole(MANAGER_ROLE) whenNotPaused nonReentrant {
        _safeMint(to, tokenId);
    }

    function setBaseURI(string memory _baseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _baseURI;
    }
}
