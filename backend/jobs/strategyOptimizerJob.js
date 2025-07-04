const cron = require('node-cron');
const { getStrategyRecommendation } = require('../services/geminiService');
const { executeStrategy, createStrategy } = require('../services/blockchainService');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Enhanced function to fetch real-time protocol data
async function getProtocolData() {
    try {
        console.log('Fetching real-time protocol data from DefiLlama...');
        const { data } = await axios.get('https://yields.llama.fi/pools');
        
        // Filter for multiple protocols and tokens on Ethereum
        const protocols = data.data.filter(pool =>
            (pool.project === 'aave-v2' || 
             pool.project === 'aave-v3' || 
             pool.project === 'compound' || 
             pool.project === 'uniswap-v3' ||
             pool.project === 'curve') &&
            pool.chain === 'Ethereum' &&
            (pool.symbol.includes('DAI') || 
             pool.symbol.includes('USDC') || 
             pool.symbol.includes('ETH')) &&
            pool.apy > 0 &&
            pool.tvlUsd > 1000000 // Only pools with > $1M TVL
        ).slice(0, 10); // Limit to top 10 pools

        console.log(`Found ${protocols.length} eligible protocols`);
        
        // Map to your structure with enhanced data
        return protocols.map(pool => ({
            name: `${pool.project.charAt(0).toUpperCase() + pool.project.slice(1)} ${pool.symbol}`,
            protocol: pool.pool, // Pool address
            token: pool.underlyingTokens && pool.underlyingTokens[0] ? pool.underlyingTokens[0] : '',
            apy: parseFloat(pool.apy.toFixed(2)),
            tvl: pool.tvlUsd,
            chain: pool.chain,
            project: pool.project,
            symbol: pool.symbol,
            riskScore: calculateRiskScore(pool.apy, pool.tvlUsd)
        }));
    } catch (error) {
        console.error('Error fetching protocol data:', error);
        // Fallback to enhanced mock data
        return getEnhancedMockData();
    }
}

// Calculate risk score based on APY and TVL
function calculateRiskScore(apy, tvl) {
    if (apy <= 5 && tvl > 1000000000) return 1500; // Low risk
    if (apy <= 8 && tvl > 100000000) return 2500;  // Medium risk
    return 3500; // High risk
}

// Enhanced mock data as fallback
function getEnhancedMockData() {
    return [
        {
            name: 'Aave V3 DAI',
            protocol: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', // Aave V3 Pool
            token: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
            apy: 4.2,
            tvl: 800000000,
            riskScore: 2000
        },
        {
            name: 'Compound DAI',
            protocol: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // cDAI
            token: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
            apy: 3.8,
            tvl: 600000000,
            riskScore: 1800
        },
        {
            name: 'Aave V3 USDC',
            protocol: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
            token: '0xA0b86a33E6Fc17fE4e2A9E1b2e5efB4ef36f3c44', // USDC
            apy: 5.1,
            tvl: 1200000000,
            riskScore: 2200
        }
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
        console.log(`Protocol data fetched: ${protocolData.length} protocols`);
        
        const recommendations = await getStrategyRecommendation(protocolData);
        
        // Handle array of recommendations
        const recommendationArray = Array.isArray(recommendations) ? recommendations : [recommendations];
        
        for (const recommendation of recommendationArray) {
            switch (recommendation.action) {
                case 'CREATE_STRATEGY':
                    console.log('Creating new strategy...', {
                        protocol: recommendation.protocol,
                        token: recommendation.token,
                        riskScore: recommendation.riskScore,
                        expectedApy: recommendation.expectedApy
                    });
                    try {
                        await createStrategy(
                            recommendation.protocol,
                            recommendation.token,
                            recommendation.riskScore
                        );
                        saveStrategyToFile(recommendation);
                        console.log('Strategy created successfully');
                    } catch (error) {
                        console.error('Error creating strategy:', error.message);
                    }
                    break;
                    
                case 'EXECUTE_STRATEGY':
                    console.log('Executing strategy...', {
                        strategyId: recommendation.strategyId,
                        amount: recommendation.amount
                    });
                    try {
                        await executeStrategy(recommendation.strategyId, recommendation.amount);
                        saveStrategyToFile(recommendation);
                        console.log('Strategy executed successfully');
                    } catch (error) {
                        console.error('Error executing strategy:', error.message);
                    }
                    break;
                    
                case 'REBALANCE':
                    console.log('Rebalancing strategy...', {
                        from: recommendation.fromProtocol,
                        to: recommendation.toProtocol,
                        percentage: recommendation.percentage
                    });
                    saveStrategyToFile(recommendation);
                    break;
                    
                case 'NO_ACTION':
                    console.log('No action recommended at this time');
                    break;
                    
                default:
                    console.log('Unknown action:', recommendation.action);
            }
        }
        
        console.log('Strategy optimization job finished.');
    } catch (error) {
        console.error('Error in strategy optimization job:', error);
    }
});

console.log('Cron job scheduled to run every minute');