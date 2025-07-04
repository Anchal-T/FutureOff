require('dotenv').config();

module.exports = {
    geminiApiKey: process.env.GEMINI_API_KEY,
    privateKey: process.env.PRIVATE_KEY,
    rpcUrl: process.env.RPC_URL,
    yieldOptimizerAddress: process.env.YIELD_OPTIMIZER_ADDRESS,
    strategyManagerAddress: process.env.STRATEGY_MANAGER_ADDRESS,
    simulationMode: process.env.SIMULATION_MODE === 'true' || true // Default to true for safety
};
