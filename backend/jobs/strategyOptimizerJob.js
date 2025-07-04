const cron = require('node-cron');
const { getStrategyRecommendation } = require('../services/geminiService');
const { executeStrategy, createStrategy } = require('../services/blockchainService');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// This is a mock function. In a real implementation, you would fetch this data from various sources.
async function getProtocolData() {
    // Fetch pools from DefiLlama
    const { data } = await axios.get('https://yields.llama.fi/pools');
    // Filter for Aave and Compound DAI pools on Ethereum
    const protocols = data.data.filter(pool =>
        (pool.project === 'aave' || pool.project === 'compound') &&
        pool.chain === 'Ethereum' &&
        pool.symbol === 'DAI'
    );
    // Map to your structure
    return protocols.map(pool => ({
        name: pool.project.charAt(0).toUpperCase() + pool.project.slice(1),
        protocol: pool.pool, // Pool address
        token: pool.underlyingTokens && pool.underlyingTokens[0] ? pool.underlyingTokens[0] : '',
        apy: pool.apy,
        tvl: pool.tvlUsd,
        riskScore: 2000 // You can set your own logic for riskScore
    }));
}

// function to save strategy to file
function saveStrategyToFile(strategy) {
    const filePath = path.join(__dirname, '../data/strategies.json');
    let strategies = [];
    
    if (fs.existsSync(filePath)) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            strategies = JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading existing strategies file:', error);
            strategies = [];
        }
    }
    
    strategies.push({ ...strategy, timestamp: new Date().toISOString() });
    
    try {
        fs.writeFileSync(filePath, JSON.stringify(strategies, null, 2));
        console.log('Strategy saved successfully');
    } catch (error) {
        console.error('Error saving strategy to file:', error);
    }
}

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

cron.schedule('* * * * *', async () => {
    console.log('Running strategy optimization job...');
    
    try {
        const protocolData = await getProtocolData();
        const recommendation = await getStrategyRecommendation(protocolData);
        
        // Implement logic to act on the recommendation
        if (recommendation.action === 'CREATE_STRATEGY') {
            console.log('Creating new strategy...');
            await createStrategy(
                recommendation.protocol,
                recommendation.token,
                recommendation.riskScore
            );
            saveStrategyToFile(recommendation); // Save to file
        } else if (recommendation.action === 'EXECUTE_STRATEGY') {
            console.log('Executing strategy...');
            await executeStrategy(recommendation.strategyId, recommendation.amount);
            saveStrategyToFile(recommendation); // Save to file
        }
        
        console.log('Strategy optimization job finished.');
    } catch (error) {
        console.error('Error in strategy optimization job:', error);
    }
});

console.log('Cron job scheduled to run every minute');