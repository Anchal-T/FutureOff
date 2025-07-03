const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("YieldOptimizer", function () {
  let YieldOptimizer, yieldOptimizer, owner, user, aiAgent, token;

  beforeEach(async function () {
    [owner, user, aiAgent, ...addrs] = await ethers.getSigners();

    // Deploy a mock ERC20 token
    const MockToken = await ethers.getContractFactory("ERC20Mock");
    token = await MockToken.deploy("Mock Token", "MTK", owner.address, ethers.parseEther("1000000"));

    // Deploy the YieldOptimizer contract (upgradeable)
    YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
    yieldOptimizer = await upgrades.deployProxy(YieldOptimizer, [100, 100], { initializer: "initialize" });

    // Authorize AI agent
    await yieldOptimizer.connect(owner).authorizeAI(aiAgent.address, true);
  });

  it("should deploy correctly", async function () {
    expect(await yieldOptimizer.performanceFee()).to.equal(100);
    expect(await yieldOptimizer.managementFee()).to.equal(100);
  });

  // Add more tests for strategy creation, execution, etc.
});