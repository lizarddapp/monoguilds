// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProfile {
    function profileExist(address _addr) external view returns (bool);

    function profileId(address _addr) external view returns (uint256);
}
