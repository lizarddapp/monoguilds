// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import {min} from "./Helpers.sol";

// for harmony only
contract Random is PausableUpgradeable {
    uint256 private randomSeed;

    function setup(uint256 _randomSeed) public initializer {
        __Pausable_init();
        randomSeed = _randomSeed;
    }

    function vrf() public view returns (bytes32 result) {
        uint256[1] memory bn;
        bn[0] = block.number;
        assembly {
            let memPtr := mload(0x40)
            if iszero(staticcall(not(0), 0xff, bn, 0x20, memPtr, 0x20)) {
                invalid()
            }
            result := mload(memPtr)
        }
    }

    function getRandomNumber(uint256 _min, uint256 _max) internal returns (uint256 randomNumber) {
        require(_max > 0 && _min < _max, "invalid input");
        randomSeed++;
        bytes32 _randomHash = vrf() ^ keccak256(abi.encodePacked(randomSeed * block.timestamp));
        randomNumber = (uint256(_randomHash) % (_max + 1 - _min)) + _min;
    }

    function getRandomNumberArr(
        uint256 _min,
        uint256 _max,
        uint256 _count
    ) internal returns (uint256[] memory randomNumbers) {
        randomNumbers = new uint256[](_count);

        for (uint256 i = 0; i < _count; ) {
            randomNumbers[i] = getRandomNumber(_min, _max);
            unchecked {
                ++i;
            }
        }
        return randomNumbers;
    }

    /**
    sum of _rate must be 100%
     */

    function getRandomNumberFromRate(uint256[] memory _rate) internal returns (uint256 randomNumber) {
        (uint256 totalRate, uint256[] memory processedRate) = processRate(_rate);

        uint256 r = getRandomNumber(0, totalRate);
        uint256 i;
        for (i = 0; i < processedRate.length; i++) {
            if (processedRate[i] >= r) {
                break;
            }
        }
        randomNumber = i + 1;
    }

    function processRate(uint256[] memory _arr) private pure returns (uint256 sum, uint256[] memory newArr) {
        uint256 i;
        uint256[] memory temp = new uint256[](_arr.length);

        for (i = 0; i < _arr.length; i++) {
            sum = sum + _arr[i];
            temp[i] = sum;
        }
        newArr = temp;
    }
}
