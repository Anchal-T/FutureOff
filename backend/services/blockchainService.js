const { ethers } = require('ethers');
const config = require('../config');
const yieldOptimizerArtifact = require('../abi/YieldOptimizer.json');
const strategyManagerArtifact = require('../abi/StrategyManager.json');
const databaseService = require('./databaseService.js');

const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

const yieldOptimizer = new ethers.Contract(config.yieldOptimizerAddress, yieldOptimizerArtifact.abi, wallet);
const strategyManager = new ethers.Contract(config.strategyManagerAddress, strategyManagerArtifact.abi, wallet);

async function checkBalance() {
    try {
        const balance = await wallet.getBalance();
        const balanceInEth = ethers.utils.formatEther(balance);
        console.log(`Wallet balance: ${balanceInEth} ETH`);
        return parseFloat(balanceInEth) > 0.01; // Need at least 0.01 ETH for gas
    } catch (error) {
        console.error('Error checking balance:', error.message);
        return false;
    }
}

async function executeStrategy(strategyId, amount) {
    if (config.simulationMode) {
        const simulationData = {
            strategyId,
            amount,
            action: 'executeStrategy',
            walletAddress: wallet.address
        };
        
        console.log(`[SIMULATION] Would execute strategy ${strategyId} with amount ${amount}`);
        await databaseService.addSimulationLog('executeStrategy', simulationData);
        
        return { 
            hash: `simulation_tx_${Date.now()}`, 
            status: 'simulated',
            simulationData 
        };
    }
    
    const hasBalance = await checkBalance();
    if (!hasBalance) {
        throw new Error('Insufficient ETH balance for gas fees');
    }
    
    try {
        const tx = await yieldOptimizer.executeStrategy(strategyId, amount);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('Execute strategy error:', error.message);
        throw error;
    }
}

async function createStrategy(protocol, token, riskScore) {
    if (config.simulationMode) {
        const simulationData = {
            protocol,
            token,
            riskScore,
            action: 'createStrategy',
            walletAddress: wallet.address
        };
        
        console.log(`[SIMULATION] Would create strategy: protocol=${protocol}, token=${token}, riskScore=${riskScore}`);
        await databaseService.addSimulationLog('createStrategy', simulationData);
        
        return { 
            hash: `simulation_tx_${Date.now()}`, 
            status: 'simulated',
            simulationData 
        };
    }
    
    const hasBalance = await checkBalance();
    if (!hasBalance) {
        throw new Error('Insufficient ETH balance for gas fees');
    }
    
    try {
        const tx = await yieldOptimizer.createStrategy(protocol, token, riskScore);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('Create strategy error:', error.message);
        throw error;
    }
}

// Add other blockchain interaction functions here...

module.exports = { executeStrategy, createStrategy, checkBalance };
