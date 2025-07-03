const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

describe("YieldOptimizer Basic Tests", function () {
  let YieldOptimizer, yieldOptimizer;
  let owner, user, aiAgent, protocol;
  let token1, addrs;

  beforeEach(async function () {
    [owner, user, aiAgent, protocol, ...addrs] = await ethers.getSigners();

    // Deploy mock token
    const MockToken = await ethers.getContractFactory("ERC20Mock");
    token1 = await MockToken.deploy("Token1", "TK1", owner.address, ethers.parseEther("1000000"));
    await token1.waitForDeployment();

    // Deploy YieldOptimizer
    YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
    yieldOptimizer = await upgrades.deployProxy(
      YieldOptimizer.connect(owner), 
      [owner.address, 100, 100], 
      { initializer: "initialize" }
    );
    await yieldOptimizer.waitForDeployment();

    // Setup initial configuration
    await yieldOptimizer.connect(owner).authorizeAI(aiAgent.address, true);
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

  describe("AI Authorization", function () {
    it("should allow owner to authorize AI", async function () {
      const newAI = addrs[0];
      await yieldOptimizer.connect(owner).authorizeAI(newAI.address, true);
      expect(await yieldOptimizer.authorizedAI(newAI.address)).to.be.true;
    });

    it("should allow owner to deauthorize AI", async function () {
      await yieldOptimizer.connect(owner).authorizeAI(aiAgent.address, false);
      expect(await yieldOptimizer.authorizedAI(aiAgent.address)).to.be.false;
    });
  });

  describe("Protocol Management", function () {
    it("should allow owner to whitelist protocols", async function () {
      await yieldOptimizer.connect(owner).whitelistProtocol(protocol.address, "TestProtocol", 500);
      
      const protocolInfo = await yieldOptimizer.whitelistedProtocols(protocol.address);
      expect(protocolInfo.isWhitelisted).to.be.true;
      expect(protocolInfo.name).to.equal("TestProtocol");
    });
  });

  describe("Strategy Creation", function () {
    beforeEach(async function () {
      await yieldOptimizer.connect(owner).whitelistProtocol(protocol.address, "TestProtocol", 500);
    });

    it("should allow authorized AI to create strategies", async function () {
      const tx = await yieldOptimizer.connect(aiAgent).createStrategy(
        protocol.address,
        await token1.getAddress(),
        500
      );
      
      await expect(tx).to.emit(yieldOptimizer, "StrategyCreated");
    });

    it("should prevent unauthorized users from creating strategies", async function () {
      await expect(
        yieldOptimizer.connect(user).createStrategy(
          protocol.address,
          await token1.getAddress(),
          500
        )
      ).to.be.revertedWith("Not authorized AI");
    });
  });

  describe("Emergency Functions", function () {
    let strategyId;

    beforeEach(async function () {
      await yieldOptimizer.connect(owner).whitelistProtocol(protocol.address, "TestProtocol", 500);
      
      const tx = await yieldOptimizer.connect(aiAgent).createStrategy(
        protocol.address,
        await token1.getAddress(),
        500
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = yieldOptimizer.interface.parseLog(log);
          return parsed.name === "StrategyCreated";
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = yieldOptimizer.interface.parseLog(event);
        strategyId = parsed.args.strategyId;
      }
    });

    it("should allow emergency exit", async function () {
      if (strategyId) {
        await expect(
          yieldOptimizer.connect(aiAgent).emergencyExit(strategyId, "Emergency test")
        ).to.emit(yieldOptimizer, "EmergencyExit");
      }
    });

    it("should allow pausing", async function () {
      await yieldOptimizer.connect(owner).pause();
      expect(await yieldOptimizer.paused()).to.be.true;
      
      await yieldOptimizer.connect(owner).unpause();
      expect(await yieldOptimizer.paused()).to.be.false;
    });
  });
});
