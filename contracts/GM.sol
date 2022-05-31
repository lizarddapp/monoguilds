// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

abstract contract GM is AccessControlEnumerableUpgradeable {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    function init(address _managerAddress) public initializer {
        // require(_managerAddress == address(0));
        __AccessControlEnumerable_init();

        _setupRole(MANAGER_ROLE, _managerAddress);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
