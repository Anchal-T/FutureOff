const cron = require('node-cron');
const { getStrategyRecommendation } = require('../services/geminiService');
const { executeStrategy, createStrategy } = require('../services/blockchainService');
const databaseService = require('../services/databaseService');
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
            poolId: pool.pool, // Keep pool ID for reference
            protocol: getProtocolAddress(pool.project), // Get actual protocol address
            token: pool.underlyingTokens && pool.underlyingTokens[0] ? pool.underlyingTokens[0] : getTokenAddress(pool.symbol),
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

// Get actual protocol addresses based on project name
function getProtocolAddress(project) {
    const protocolAddresses = {
        'aave-v2': '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9', // Aave V2 Lending Pool
        'aave-v3': '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', // Aave V3 Pool
        'compound': '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B', // Compound Comptroller
        'uniswap-v3': '0x1F98431c8aD98523631AE4a59f267346ea31F984', // Uniswap V3 Factory
        'curve': '0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5' // Curve Registry
    };
    return protocolAddresses[project] || '0x0000000000000000000000000000000000000000';
}

// Get token addresses based on symbol
function getTokenAddress(symbol) {
    const tokenAddresses = {
        'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        'WBTC': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
    };
    
    // Extract token symbol from pool symbol (e.g., "USDC-WETH" -> "USDC")
    const mainToken = symbol.split('-')[0];
    return tokenAddresses[mainToken] || tokenAddresses['DAI']; // Default to DAI
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
            token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
            apy: 5.1,
            tvl: 1200000000,
            riskScore: 2200
        }
    ];
}

// function to save strategy to database
async function saveStrategyToDatabase(strategy) {
    try {
        const savedStrategy = await databaseService.addStrategy(strategy);
        console.log('Strategy saved to database successfully:', savedStrategy.id);
        return savedStrategy;
    } catch (error) {
        console.error('Error saving strategy to database:', error.message);
        // Fallback to file system
        saveStrategyToFile(strategy);
    }
}

// Legacy function to save strategy to file (kept as fallback)
function saveStrategyToFile(strategy) {
    const filePath = path.join(__dirname, '../data/strategies.json');
    let strategies = [];
    
    if (fs.existsSync(filePath)) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            // Remove BOM if present and check if file is not empty
            const cleanContent = fileContent.replace(/^\uFEFF/, '').trim();
            if (cleanContent && cleanContent !== '') {
                strategies = JSON.parse(cleanContent);
            }
        } catch (error) {
            console.error('Error reading existing strategies file:', error.message);
            strategies = [];
            // Initialize with clean empty array
            try {
                fs.writeFileSync(filePath, '[]', 'utf8');
            } catch (writeError) {
                console.error('Error initializing strategies file:', writeError.message);
            }
        }
    }
    
    strategies.push({ ...strategy, timestamp: new Date().toISOString() });
    
    try {
        fs.writeFileSync(filePath, JSON.stringify(strategies, null, 2), 'utf8');
        console.log('Strategy saved to file successfully');
    } catch (error) {
        console.error('Error saving strategy to file:', error.message);
    }
}

// Main strategy optimization function (exported for API use)
async function runStrategyOptimizer() {
    console.log('Running strategy optimization...');
    
    try {
        const protocolData = await getProtocolData();
        console.log(`Protocol data fetched: ${protocolData.length} protocols`);
        
        // Update protocols in database
        await databaseService.updateProtocols(protocolData);
        
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
                        const result = await createStrategy(
                            recommendation.protocol,
                            recommendation.token,
                            recommendation.riskScore
                        );
                        const savedStrategy = await saveStrategyToDatabase(recommendation);
                        
                        // Add to execution history
                        await databaseService.addExecutionHistory({
                            strategyId: savedStrategy.id,
                            action: 'create',
                            result,
                            recommendation
                        });
                        
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
                        const result = await executeStrategy(recommendation.strategyId, recommendation.amount);
                        await saveStrategyToDatabase(recommendation);
                        
                        // Add to execution history
                        await databaseService.addExecutionHistory({
                            strategyId: recommendation.strategyId,
                            action: 'execute',
                            amount: recommendation.amount,
                            result
                        });
                        
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
                    await saveStrategyToDatabase(recommendation);
                    
                    // Add to execution history
                    await databaseService.addExecutionHistory({
                        action: 'rebalance',
                        recommendation
                    });
                    break;
                    
                case 'NO_ACTION':
                    console.log('No action recommended at this time');
                    break;
                    
                default:
                    console.log('Unknown action:', recommendation.action);
            }
        }
        
        console.log('Strategy optimization finished.');
    } catch (error) {
        console.error('Error in strategy optimization:', error);
        throw error;
    }
}

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Schedule the cron job
cron.schedule('* * * * *', runStrategyOptimizer);

console.log('Cron job scheduled to run every minute');

module.exports = { runStrategyOptimizer };