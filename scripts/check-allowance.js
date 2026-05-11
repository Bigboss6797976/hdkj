const { ethers } = require("hardhat");

/**
 * 授权检测工具
 * 用法: npx hardhat run scripts/check-allowance.js --network <网络>
 */
async function main() {
    // 这里填入你要检测的钱包和代币（本地测试示例）
    const victimAddress = "0x..."; 
    const tokenAddress = "0x...";  // USDT 合约地址
    const spenderAddress = "0x..."; // 可疑的授权对象
    
    const token = await ethers.getContractAt("IERC20", tokenAddress);
    const allowance = await token.allowance(victimAddress, spenderAddress);
    
    console.log(`授权额度: ${ethers.formatUnits(allowance, 6)} USDT`);
    
    if (allowance > 0n) {
        console.log("⚠️  警告: 该地址已被授权，建议立即撤销！");
        console.log("撤销方法: 调用 token.approve(spender, 0)");
    }
}

main().catch(console.error);
