const cron = require('node-cron');
const { getStrategyRecommendation } = require('../services/geminiService');
const { executeStrategy, createStrategy } = require('../services/blockchainService');
const fs = require('fs');
const path = require('path');

// This is a mock function. In a real implementation, you would fetch this data from various sources.
async function getProtocolData() {
    // In a real implementation, you would fetch this from The Graph, Moralis, etc.
    return [
        {
            name: 'Aave',
            protocol: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9', // Aave V2 Lending Pool
            token: '0x6B175474E89094C44Da98b954EedeAC495271d0F',    // DAI
            apy: 5.2,
            tvl: 1000000000,
            riskScore: 2000
        },
        {
            name: 'Compound',
            protocol: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B', // Compound Comptroller
            token: '0x6B175474E89094C44Da98b954EedeAC495271d0F',    // DAI
            apy: 4.8,
            tvl: 800000000,
            riskScore: 2500
        },
    ];
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