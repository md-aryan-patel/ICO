// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDT is ERC20, Ownable {
    address mintAddress;

    constructor(address addr) ERC20("USDT", "USDT") {}

    function mint(uint256 amount) public onlyOwner {
        _mint(mintAddress, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
