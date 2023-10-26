// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CFNC is ERC20 {
    address public Owner;

    modifier OnlyOwner() {
        require(msg.sender == Owner, "CFNC: Not Owner");
        _;
    }

    constructor() ERC20("Chief Finance Token", "CFNC") {
        uint256 maxSupply = 750000000 * 10 ** decimals();
        Owner = msg.sender;
        _mint(msg.sender, maxSupply);
    }

    function transferToIco(address _ico) public OnlyOwner {
        transfer(_ico, balanceOf(msg.sender));
    }
}
