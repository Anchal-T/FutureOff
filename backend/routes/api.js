const express = require('express');
const router = express.Router();
const databaseService = require('../services/databaseService');
const blockchainService = require('../services/blockchainService');
const { runStrategyOptimizer } = require('../jobs/strategyOptimizerJob');

// GET /api/strategies - List all strategies
router.get('/strategies', async (req, res) => {
    try {
        const strategies = await databaseService.getStrategies();
        res.json({
            success: true,
            data: strategies,
            count: strategies.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/strategies/:id - Get specific strategy
router.get('/strategies/:id', async (req, res) => {
    try {
        const strategies = await databaseService.getStrategies();
        const strategy = strategies.find(s => s.id === req.params.id);
        
        if (!strategy) {
            return res.status(404).json({
                success: false,
                error: 'Strategy not found'
            });
        }
        
        res.json({
            success: true,
            data: strategy
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/strategies/:id/execute - Execute a specific strategy
router.post('/strategies/:id/execute', async (req, res) => {
    try {
        const { amount } = req.body;
        const strategyId = req.params.id;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Valid amount is required'
            });
        }
        
        // Find the strategy
        const strategies = await databaseService.getStrategies();
        const strategy = strategies.find(s => s.id === strategyId);
        
        if (!strategy) {
            return res.status(404).json({
                success: false,
                error: 'Strategy not found'
            });
        }
        
        // Execute the strategy
        const result = await blockchainService.executeStrategy(strategyId, amount);
        
        // Update strategy status
        await databaseService.updateStrategyStatus(strategyId, 'executed', {
            transactionHash: result.hash,
            amount: amount,
            executedAt: new Date().toISOString()
        });
        
        // Add to execution history
        await databaseService.addExecutionHistory({
            strategyId,
            action: 'execute',
            amount,
            result,
            strategy: strategy.protocol
        });
        
        res.json({
            success: true,
            data: {
                strategyId,
                transactionHash: result.hash,
                status: result.status || 'executed',
                amount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/strategies/optimize - Trigger strategy optimization
router.post('/strategies/optimize', async (req, res) => {
    try {
        console.log('Manual strategy optimization triggered via API');
        
        // Run the strategy optimizer
        await runStrategyOptimizer();
        
        // Get updated strategies
        const strategies = await databaseService.getStrategies();
        
        res.json({
            success: true,
            message: 'Strategy optimization completed',
            data: {
                totalStrategies: strategies.length,
                latestStrategies: strategies.slice(-5) // Last 5 strategies
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/protocols - List available protocols
router.get('/protocols', async (req, res) => {
    try {
        const protocols = await databaseService.getProtocols();
        res.json({
            success: true,
            data: protocols,
            count: protocols.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/execution-history - Get execution history
router.get('/execution-history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const history = await databaseService.getExecutionHistory(limit);
        
        res.json({
            success: true,
            data: history,
            count: history.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/simulation-logs - Get simulation logs
router.get('/simulation-logs', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const logs = await databaseService.getSimulationLogs(limit);
        
        res.json({
            success: true,
            data: logs,
            count: logs.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/status - Get system status
router.get('/status', async (req, res) => {
    try {
        const strategies = await databaseService.getStrategies();
        const history = await databaseService.getExecutionHistory(10);
        const config = require('../config');
        
        res.json({
            success: true,
            data: {
                simulationMode: config.simulationMode,
                totalStrategies: strategies.length,
                recentExecutions: history.length,
                lastActivity: history[0]?.timestamp || null,
                uptime: process.uptime()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
