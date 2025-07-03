import { expect } from 'chai';
import hardhat from 'hardhat';
const { ethers } = hardhat;

describe("StrategyManager", function () {
  let StrategyManager, YieldOptimizer, strategyManager, yieldOptimizer;
  let owner, user, protocol;

  beforeEach(async function () {
    [owner, user, protocol] = await ethers.getSigners();

    // Deploy YieldOptimizer first
    YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
    yieldOptimizer = await upgrades.deployProxy(
      YieldOptimizer.connect(owner),
      [owner.address, 100, 100],
      { initializer: "initialize" }
    );

    // Deploy StrategyManager
    StrategyManager = await ethers.getContractFactory("StrategyManager");
    strategyManager = await StrategyManager.deploy(await yieldOptimizer.getAddress());
  });

  describe("Protocol Management", function () {
    it("should add protocol adapters", async function () {
      await strategyManager.connect(owner).addProtocolAdapter(
        protocol.address,
        protocol.address, // Using same address as adapter for testing
        "TestProtocol"
      );

      const protocolInfo = await strategyManager.getProtocolInfo(protocol.address);
      expect(protocolInfo.protocolName).to.equal("TestProtocol");
    });

    it("should get supported protocols", async function () {
      await strategyManager.connect(owner).addProtocolAdapter(
        protocol.address,
        protocol.address,
        "TestProtocol"
      );

      const protocols = await strategyManager.getSupportedProtocols();
      expect(protocols).to.include(protocol.address);
    });
  });

  describe("Execution Fees", function () {
    it("should set execution fee", async function () {
      await strategyManager.connect(owner).setExecutionFee(500); // 5%
      expect(await strategyManager.executionFee()).to.equal(500);
    });

    it("should calculate execution cost", async function () {
      await strategyManager.connect(owner).setExecutionFee(500); // 5%
      const cost = await strategyManager.calculateExecutionCost(ethers.parseEther("100"));
      expect(cost).to.equal(ethers.parseEther("5")); // 5% of 100
    });
  });
});