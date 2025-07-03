const { ethers } = require('ethers');
const config = require('../config');
const yieldOptimizerAbi = require('../abi/YieldOptimizer.json'); // You'll need to add the ABI file
const strategyManagerAbi = require('../abi/StrategyManager.json'); // You'll need to add the ABI file

const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

const yieldOptimizer = new ethers.Contract(config.yieldOptimizerAddress, yieldOptimizerAbi, wallet);
const strategyManager = new ethers.Contract(config.strategyManagerAddress, strategyManagerAbi, wallet);

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
