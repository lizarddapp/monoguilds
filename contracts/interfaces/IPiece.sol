// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPiece {
    function mint(address to, uint256 tokenId) external;

    function ownerOf(uint256 tokenId) external returns (address);

    function totalSupply() external view returns (uint256);
}
