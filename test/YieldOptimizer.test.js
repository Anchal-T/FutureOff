const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("YieldOptimizer", function () {
  let YieldOptimizer, yieldOptimizer, owner, user, aiAgent, token;

  beforeEach(async function () {
    [owner, user, aiAgent, ...addrs] = await ethers.getSigners();

    // Deploy a mock ERC20 token
    const MockToken = await ethers.getContractFactory("ERC20Mock");
    token = await MockToken.deploy("Mock Token", "MTK", owner.address, ethers.utils.parseEther("1000000"));

    // Deploy the YieldOptimizer contract (upgradeable)
    YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
    yieldOptimizer = await upgrades.deployProxy(YieldOptimizer, [100, 100], { initializer: "initialize" });

    // Add the token to supportedTokens
    await yieldOptimizer.connect(owner).authorizeAI(aiAgent.address, true);
    await yieldOptimizer.supportedTokens.push(token.address); // You may need a function to add supported tokens
  });

  it("should allow deposit and withdraw", async function () {
    await token.connect(owner).transfer(user.address, ethers.utils.parseEther("1000"));
    await token.connect(user).approve(yieldOptimizer.address, ethers.utils.parseEther("1000"));

    await yieldOptimizer.connect(user).deposit(token.address, ethers.utils.parseEther("100"));
    expect((await yieldOptimizer.userPositions(user.address)).totalDeposited).to.equal(ethers.utils.parseEther("100"));

    await yieldOptimizer.connect(user).withdraw(token.address, ethers.utils.parseEther("50"));
    expect((await yieldOptimizer.userPositions(user.address)).totalDeposited).to.equal(ethers.utils.parseEther("50"));
  });

  // Add more tests for strategy creation, execution, etc.
});