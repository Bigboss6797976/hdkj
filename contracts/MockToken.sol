// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("TestUSDT", "TUSDT") {
        _mint(msg.sender, 1000000 * 10**6); // 100万枚，6位小数
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
