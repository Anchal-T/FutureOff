import  expect  from "chai";
import  ethers from "hardhat";
import upgrades  from "hardhat";

describe("YieldOptimizer", function () {
  let YieldOptimizer, yieldOptimizer, owner, user, aiAgent, token;

  beforeEach(async function () {
    // getSigners will work correctly with the required ethers object
    const [ownerSigner, userSigner, aiAgentSigner, ...addrs] = await ethers.getSigners();
    owner = ownerSigner;
    user = userSigner;
    aiAgent = aiAgentSigner;

    // Deploy a mock ERC20 token
    const MockToken = await ethers.getContractFactory("ERC20Mock");
    token = await MockToken.deploy("Mock Token", "MTK", owner.address, ethers.parseEther("1000000"));
    await token.waitForDeployment(); // It's good practice to wait for deployment to complete

    // Deploy the YieldOptimizer contract (upgradeable)
    YieldOptimizer = await ethers.getContractFactory("YieldOptimizer");
    // Ensure the contract factory is linked with the owner signer
    yieldOptimizer = await upgrades.deployProxy(YieldOptimizer.connect(owner), [100, 100], { initializer: "initialize" });
    await yieldOptimizer.waitForDeployment(); // Wait for the proxy deployment

    // Authorize AI agent
    await yieldOptimizer.connect(owner).authorizeAI(aiAgent.address, true);
  });

  it("should deploy correctly and set initial values", async function () {
    expect(await yieldOptimizer.performanceFee()).to.equal(100);
    expect(await yieldOptimizer.managementFee()).to.equal(100);
    expect(await yieldOptimizer.isAIAuthorized(aiAgent.address)).to.be.true;
  });

  // Add more tests for strategy creation, execution, deposits, withdrawals, etc.
  it("should allow a user to deposit tokens", async function() {
    // Transfer some tokens to the user
    await token.connect(owner).transfer(user.address, ethers.parseEther("1000"));
    const userBalanceBefore = await token.balanceOf(user.address);
    expect(userBalanceBefore).to.equal(ethers.parseEther("1000"));

    // User approves the YieldOptimizer contract to spend their tokens
    await token.connect(user).approve(await yieldOptimizer.getAddress(), ethers.parseEther("500"));

    // User deposits tokens
    await yieldOptimizer.connect(user).deposit(ethers.parseEther("500"), token.getAddress());

    // Check the user's share balance in the optimizer
    const userShares = await yieldOptimizer.balanceOf(user.address);
    expect(userShares).to.be.gt(0); // User should have received shares

    // Check the contract's token balance
    const contractTokenBalance = await token.balanceOf(await yieldOptimizer.getAddress());
    expect(contractTokenBalance).to.equal(ethers.parseEther("500"));
  });
});
