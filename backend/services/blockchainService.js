const { ethers } = require('ethers');
const config = require('../config');
const yieldOptimizerArtifact = require('../abi/YieldOptimizer.json');
const strategyManagerArtifact = require('../abi/StrategyManager.json');

const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

const yieldOptimizer = new ethers.Contract(config.yieldOptimizerAddress, yieldOptimizerArtifact.abi, wallet);
const strategyManager = new ethers.Contract(config.strategyManagerAddress, strategyManagerArtifact.abi, wallet);

async function executeStrategy(strategyId, amount) {
    const tx = await yieldOptimizer.executeStrategy(strategyId, amount);
    await tx.wait();
    return tx;
}

async function createStrategy(protocol, token, riskScore) {
    const tx = await yieldOptimizer.createStrategy(protocol, token, riskScore);
    await tx.wait();
    return tx;
}

// Add other blockchain interaction functions here...

module.exports = { executeStrategy, createStrategy };
