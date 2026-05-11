const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🎓 授权攻击原理与安全防御演示", function () {
    let token, phishing, owner, victim, attacker;
    
    beforeEach(async () => {
        [owner, victim, attacker] = await ethers.getSigners();
        
        // 部署测试代币，给 victim 10000 TUSDT
        const MockToken = await ethers.getContractFactory("MockToken");
        token = await MockToken.deploy();
        await token.transfer(victim.address, 10000n * 10n**6n);
        
        // 部署攻击演示合约
        const Phishing = await ethers.getContractFactory("PhishingDemo");
        phishing = await Phishing.connect(attacker).deploy();
    });

    it("步骤1: 模拟用户被钓鱼 - 错误地 approve 给攻击者", async () => {
        // victim 以为在"转账"，实际是 approve
        await token.connect(victim).approve(phishing.target, 9000000000n * 10n**6n);
        
        const allowance = await token.allowance(victim.address, phishing.target);
        console.log("💀 受害者授权给攻击者的额度:", allowance.toString());
        expect(allowance).to.be.gt(0);
    });

    it("步骤2: 攻击者调用 transferFrom 盗取代币", async () => {
        // 先授权
        await token.connect(victim).approve(phishing.target, 10000n * 10n**6n);
        
        const victimBalanceBefore = await token.balanceOf(victim.address);
        console.log("盗取代币前 victim 余额:", victimBalanceBefore.toString());
        
        // 攻击者执行盗取
        await phishing.connect(attacker).steal(token.target, victim.address, 10000n * 10n**6n);
        
        const victimBalanceAfter = await token.balanceOf(victim.address);
        const attackerBalance = await token.balanceOf(attacker.address);
        
        console.log("盗取代币后 victim 余额:", victimBalanceAfter.toString());
        console.log("攻击者获得余额:", attackerBalance.toString());
        
        expect(victimBalanceAfter).to.equal(0);
        expect(attackerBalance).to.equal(10000n * 10n**6n);
    });

    it("步骤3: 安全做法 - 使用 Permit2 单次授权", async () => {
        // Permit2 的优势：用户通过签名授权，无需链上 approve，且可设置过期时间
        // 这里演示概念，实际 Permit2 需要链上合约地址
        console.log("✅ Permit2 让用户无需预先 approve，每次转账都通过签名授权");
        console.log("✅ 即使签名被盗，也有过期时间和金额上限保护");
    });
});
