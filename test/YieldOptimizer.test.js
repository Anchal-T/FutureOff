const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

describe("YieldOptimizer Full Test Suite", function () {
  let YieldOptimizer, StrategyManager, yieldOptimizer, strategyManager;
  let owner, user, aiAgent, protocol, token1, token2;

  beforeEach(async function () {
    [owner, user, aiAgent, protocol, ...addrs] = await ethers.getSigners();

    // Deploy mock tokens
    const MockToken = await ethers.getContractFactory("ERC20Mock");
    token1 = await MockToken.deploy("Token1", "TK1", owner.address, ethers.parseEther("1000000"));
    token2 = await MockToken.deploy("Token2", "TK2", owner.address, ethers.parseEther("1000000"));
    await token1.waitForDeployment();
    await token2.waitForDeployment();

    // Deploy YieldOptimizer
    YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
    yieldOptimizer = await upgrades.deployProxy(
      YieldOptimizer.connect(owner), 
      [owner.address, 100, 100], 
      { initializer: "initialize" }
    );
    await yieldOptimizer.waitForDeployment();

    // Deploy StrategyManager
    StrategyManager = await ethers.getContractFactory("StrategyManager");
    strategyManager = await StrategyManager.deploy(await yieldOptimizer.getAddress());
    await strategyManager.waitForDeployment();

    // Setup initial configuration
    await yieldOptimizer.connect(owner).authorizeAI(aiAgent.address, true);
    await yieldOptimizer.connect(owner).addSupportedToken(await token1.getAddress());
    await yieldOptimizer.connect(owner).addSupportedToken(await token2.getAddress());
  });

  describe("Initialization", function () {
    it("should set correct initial values", async function () {
      expect(await yieldOptimizer.performanceFee()).to.equal(100);
      expect(await yieldOptimizer.managementFee()).to.equal(100);
      expect(await yieldOptimizer.authorizedAI(aiAgent.address)).to.be.true;
    });

    it("should have correct owner", async function () {
      expect(await yieldOptimizer.owner()).to.equal(owner.address);
    });
  });

  describe("Token Management", function () {
    it("should add supported tokens", async function () {
      expect(await yieldOptimizer.isTokenSupported(await token1.getAddress())).to.be.true;
    });

    it("should reject unsupported tokens", async function () {
      const MockToken = await ethers.getContractFactory("ERC20Mock");
      const unsupportedToken = await MockToken.deploy("Unsupported", "UNS", owner.address, ethers.parseEther("1000"));
      
      expect(await yieldOptimizer.isTokenSupported(await unsupportedToken.getAddress())).to.be.false;
    });
  });

  describe("Deposits and Withdrawals", function () {
    beforeEach(async function () {
      // Transfer tokens to user
      await token1.connect(owner).transfer(user.address, ethers.parseEther("1000"));
      await token1.connect(user).approve(await yieldOptimizer.getAddress(), ethers.parseEther("1000"));
    });

    it("should allow user deposits", async function () {
      await yieldOptimizer.connect(user).deposit(await token1.getAddress(), ethers.parseEther("100"));
      
      const userPosition = await yieldOptimizer.getUserPosition(user.address);
      expect(userPosition.totalDeposited).to.equal(ethers.parseEther("100"));
    });

    it("should allow user withdrawals", async function () {
      await yieldOptimizer.connect(user).deposit(await token1.getAddress(), ethers.parseEther("100"));
      
      const balanceBefore = await token1.balanceOf(user.address);
      await yieldOptimizer.connect(user).withdraw(await token1.getAddress(), ethers.parseEther("50"));
      const balanceAfter = await token1.balanceOf(user.address);
      
      expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.parseEther("50"));
    });

    it("should reject withdrawal of more than deposited", async function () {
      await yieldOptimizer.connect(user).deposit(await token1.getAddress(), ethers.parseEther("100"));
      
      await expect(
        yieldOptimizer.connect(user).withdraw(await token1.getAddress(), ethers.parseEther("200"))
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Strategy Management", function () {
    it("should create strategies", async function () {
      await yieldOptimizer.connect(owner).whitelistProtocol(protocol.address, "TestProtocol", 500);
      
      const tx = await yieldOptimizer.connect(owner).createStrategy(
        protocol.address,
        await token1.getAddress(),
        500
      );
      
      expect(tx).to.emit(yieldOptimizer, "StrategyCreated");
    });

    it("should execute strategies", async function () {
      await yieldOptimizer.connect(owner).whitelistProtocol(protocol.address, "TestProtocol", 500);
      
      const strategyId = await yieldOptimizer.connect(owner).createStrategy.staticCall(
        protocol.address,
        await token1.getAddress(),
        500
      );
      
      await yieldOptimizer.connect(owner).createStrategy(
        protocol.address,
        await token1.getAddress(),
        500
      );
      
      await expect(
        yieldOptimizer.connect(aiAgent).executeStrategy(strategyId, ethers.parseEther("100"))
      ).to.emit(yieldOptimizer, "StrategyExecuted");
    });
  });

  describe("AI Authorization", function () {
    it("should allow owner to authorize AI", async function () {
      const newAI = addrs[0];
      await yieldOptimizer.connect(owner).authorizeAI(newAI.address, true);
      expect(await yieldOptimizer.authorizedAI(newAI.address)).to.be.true;
    });

    it("should prevent unauthorized AI from executing strategies", async function () {
      const unauthorizedAI = addrs[1];
      await yieldOptimizer.connect(owner).whitelistProtocol(protocol.address, "TestProtocol", 500);
      
      const strategyId = await yieldOptimizer.connect(owner).createStrategy.staticCall(
        protocol.address,
        await token1.getAddress(),
        500
      );
      
      await expect(
        yieldOptimizer.connect(unauthorizedAI).executeStrategy(strategyId, ethers.parseEther("100"))
      ).to.be.revertedWith("Not authorized AI agent");
    });
  });

  describe("Emergency Functions", function () {
    it("should allow emergency exit", async function () {
      await yieldOptimizer.connect(owner).whitelistProtocol(protocol.address, "TestProtocol", 500);
      
      const strategyId = await yieldOptimizer.connect(owner).createStrategy.staticCall(
        protocol.address,
        await token1.getAddress(),
        500
      );
      
      await yieldOptimizer.connect(owner).createStrategy(
        protocol.address,
        await token1.getAddress(),
        500
      );
      
      await expect(
        yieldOptimizer.connect(owner).emergencyExit(strategyId, "Emergency test")
      ).to.emit(yieldOptimizer, "EmergencyExit");
    });

    it("should allow pausing", async function () {
      await yieldOptimizer.connect(owner).pause();
      expect(await yieldOptimizer.paused()).to.be.true;
      
      await yieldOptimizer.connect(owner).unpause();
      expect(await yieldOptimizer.paused()).to.be.false;
    });
  });
});
