// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";

contract SapphireToken is ERC20CappedUpgradeable {
    function initialize() public initializer {
        __ERC20_init("Sapphire Token", "SAPPHIRE");
        __ERC20Capped_init(200_000_000 ether);
        _mint(msg.sender, 10_000);
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
