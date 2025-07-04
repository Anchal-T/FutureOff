const fs = require('fs');
const path = require('path');

let db;

async function initDB() {
    const { Low, JSONFile } = await import('lowdb');
    const file = path.join(__dirname, '../data/db.json');
    const adapter = new JSONFile(file);
    db = new Low(adapter);

    await db.read();
    db.data ||= {
        strategies: [],
        protocols: [],
        executionHistory: [],
        simulationLogs: []
    };
    
    // Migrate existing strategies if they exist
    const legacyStrategiesPath = path.join(__dirname, '../data/strategies.json');
    if (fs.existsSync(legacyStrategiesPath) && db.data.strategies.length === 0) {
        try {
            const legacyStrategies = JSON.parse(fs.readFileSync(legacyStrategiesPath, 'utf8'));
            db.data.strategies = legacyStrategies.map((strategy, index) => ({
                id: `strategy_${index + 1}`,
                ...strategy,
                status: 'created',
                createdAt: strategy.timestamp || new Date().toISOString()
            }));
            console.log(`Migrated ${legacyStrategies.length} strategies from legacy JSON file`);
        } catch (error) {
            console.warn('Could not migrate legacy strategies:', error.message);
        }
    }
    
    await db.write();
    console.log('Database initialized');
}

// Strategy operations
async function getStrategies() {
    return db.data.strategies;
}

async function addStrategy(strategy) {
    const newStrategy = {
        id: `strategy_${Date.now()}`,
        ...strategy,
        status: 'created',
        createdAt: new Date().toISOString()
    };
    db.data.strategies.push(newStrategy);
    await db.write();
    return newStrategy;
}

async function updateStrategyStatus(id, status, executionDetails = {}) {
    const strategy = db.data.strategies.find(s => s.id === id);
    if (strategy) {
        strategy.status = status;
        strategy.lastUpdated = new Date().toISOString();
        if (executionDetails) {
            strategy.executionDetails = executionDetails;
        }
    }
    await db.write();
    return strategy;
}

// Execution history
async function addExecutionHistory(entry) {
    const historyEntry = {
        id: `exec_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry
    };
    db.data.executionHistory.push(historyEntry);
    await db.write();
    return historyEntry;
}

async function getExecutionHistory(limit = 50) {
    return db.data.executionHistory
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

// Protocol operations
async function getProtocols() {
    return db.data.protocols;
}

async function updateProtocols(protocols) {
    db.data.protocols = protocols.map(protocol => ({
        ...protocol,
        lastUpdated: new Date().toISOString()
    }));
    await db.write();
    return db.data.protocols;
}

// Simulation logs
async function addSimulationLog(action, details) {
    const logEntry = {
        id: `sim_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action,
        details
    };
    db.data.simulationLogs.push(logEntry);
    
    // Keep only last 1000 simulation logs
    if (db.data.simulationLogs.length > 1000) {
        db.data.simulationLogs = db.data.simulationLogs.slice(-1000);
    }
    
    await db.write();
    return logEntry;
}

async function getSimulationLogs(limit = 100) {
    return db.data.simulationLogs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

module.exports = {
    initDB,
    getStrategies,
    addStrategy,
    updateStrategyStatus,
    addExecutionHistory,
    getExecutionHistory,
    getProtocols,
    updateProtocols,
    addSimulationLog,
    getSimulationLogs,
    get db() { return db; }
};
