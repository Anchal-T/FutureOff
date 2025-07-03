const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("StrategyManager Basic Tests", function () {
  let StrategyManager, strategyManager;
  let YieldOptimizer, yieldOptimizer;
  let owner, protocol;

  beforeEach(async function () {
    [owner, protocol] = await ethers.getSigners();

    // Deploy a simple YieldOptimizer mock first
    YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
    yieldOptimizer = await ethers.deployContract("YieldOptimizer");
    await yieldOptimizer.waitForDeployment();

    // Deploy StrategyManager
    StrategyManager = await ethers.getContractFactory("StrategyManager");
    strategyManager = await StrategyManager.deploy(await yieldOptimizer.getAddress());
    await strategyManager.waitForDeployment();
  });

  describe("Initialization", function () {
    it("should set correct yield optimizer address", async function () {
      expect(await strategyManager.yieldOptimizer()).to.equal(await yieldOptimizer.getAddress());
    });

    it("should set correct owner", async function () {
      expect(await strategyManager.owner()).to.equal(owner.address);
    });

    it("should set default execution fee", async function () {
      expect(await strategyManager.executionFee()).to.equal(50); // 0.5%
    });
  });

  describe("Protocol Management", function () {
    it("should allow owner to add protocol adapters", async function () {
      await strategyManager.connect(owner).addProtocolAdapter(
        protocol.address,
        protocol.address, // Using same address as adapter for testing
        "TestProtocol"
      );

      const protocolInfo = await strategyManager.protocolAdapters(protocol.address);
      expect(protocolInfo.protocolName).to.equal("TestProtocol");
      expect(protocolInfo.isActive).to.be.true;
    });

    it("should prevent non-owners from adding protocol adapters", async function () {
      await expect(
        strategyManager.connect(protocol).addProtocolAdapter(
          protocol.address,
          protocol.address,
          "TestProtocol"
        )
      ).to.be.revertedWithCustomError(strategyManager, "OwnableUnauthorizedAccount");
    });
  });

  describe("Execution Fees", function () {
    it("should allow owner to set execution fee", async function () {
      await strategyManager.connect(owner).setExecutionFee(100); // 1%
      expect(await strategyManager.executionFee()).to.equal(100);
    });

    it("should calculate execution cost correctly", async function () {
      await strategyManager.connect(owner).setExecutionFee(500); // 5%
      const cost = await strategyManager.calculateExecutionCost(ethers.parseEther("100"));
      expect(cost).to.equal(ethers.parseEther("5")); // 5% of 100
    });
  });

  describe("Protocol Information", function () {
    beforeEach(async function () {
      await strategyManager.connect(owner).addProtocolAdapter(
        protocol.address,
        protocol.address,
        "TestProtocol"
      );
    });

    it("should return supported protocols", async function () {
      const protocols = await strategyManager.getSupportedProtocols();
      expect(protocols).to.include(protocol.address);
    });

    it("should return protocol info", async function () {
      const protocolInfo = await strategyManager.getProtocolInfo(protocol.address);
      expect(protocolInfo.protocolName).to.equal("TestProtocol");
      expect(protocolInfo.isActive).to.be.true;
    });
  });
});
