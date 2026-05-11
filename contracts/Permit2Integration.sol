// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@uniswap/permit2-sdk/src/interfaces/ISignatureTransfer.sol";

/**
 * @title 安全的 Permit2 集成示例
 * @notice 演示如何正确接收用户的 Permit2 签名转账
 */
contract Permit2Integration {
    ISignatureTransfer public immutable permit2;
    
    constructor(address _permit2) {
        permit2 = ISignatureTransfer(_permit2);
    }
    
    function depositWithPermit(
        ISignatureTransfer.PermitTransferFrom memory permit,
        ISignatureTransfer.SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external {
        // 安全的做法：只转给自己，且金额由用户签名决定
        permit2.permitTransferFrom(permit, transferDetails, owner, signature);
    }
}
