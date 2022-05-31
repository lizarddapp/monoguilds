// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

function min(uint256 a, uint256 b) pure returns (uint256) {
    if (a < b) return a;
    return b;
}

function max(uint256 a, uint256 b) pure returns (uint256) {
    if (a > b) return a;
    return b;
}
