const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // --- Deploy YieldOptimizer ---
  const YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
  console.log("Deploying YieldOptimizer...");

  // Set your desired fees here
  const performanceFee = 1000; // 10%
  const managementFee = 100;   // 1%

  const yieldOptimizer = await upgrades.deployProxy(
    YieldOptimizer,
    [deployer.address, performanceFee, managementFee],
    { initializer: "initialize" }
  );
  await yieldOptimizer.waitForDeployment();
  const yieldOptimizerAddress = await yieldOptimizer.getAddress();
  console.log("✅ YieldOptimizer (Proxy) deployed to:", yieldOptimizerAddress);


  // --- Deploy StrategyManager (if it's also upgradeable) ---
  const StrategyManager = await ethers.getContractFactory("StrategyManager");
  console.log("\nDeploying StrategyManager...");

  // Pass yieldOptimizerAddress as the constructor argument
  const strategyManager = await upgrades.deployProxy(
    StrategyManager,
    [yieldOptimizerAddress], // Pass the address here
    { initializer: "initialize" } // Remove or change if your contract does not have an initialize function
  );
  await strategyManager.waitForDeployment();
  const strategyManagerAddress = await strategyManager.getAddress();
  console.log("✅ StrategyManager (Proxy) deployed to:", strategyManagerAddress);

  console.log("\n--- Deployment Complete ---");
  console.log("Add these addresses to your backend .env file:");
  console.log(`YIELD_OPTIMIZER_ADDRESS=${yieldOptimizerAddress}`);
  console.log(`STRATEGY_MANAGER_ADDRESS=${strategyManagerAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });