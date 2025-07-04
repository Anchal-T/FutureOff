const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

async function initDB() {
    db = await open({
        filename: path.join(__dirname, '../data/db.sqlite'),
        driver: sqlite3.Database
    });

    // Create tables if they don't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS strategies (
            id TEXT PRIMARY KEY,
            name TEXT,
            status TEXT,
            createdAt TEXT,
            lastUpdated TEXT,
            executionDetails TEXT
        );
        CREATE TABLE IF NOT EXISTS protocols (
            id TEXT PRIMARY KEY,
            name TEXT,
            lastUpdated TEXT
        );
        CREATE TABLE IF NOT EXISTS executionHistory (
            id TEXT PRIMARY KEY,
            timestamp TEXT,
            details TEXT
        );
        CREATE TABLE IF NOT EXISTS simulationLogs (
            id TEXT PRIMARY KEY,
            timestamp TEXT,
            action TEXT,
            details TEXT
        );
    `);

    console.log('SQLite database initialized');
}

// Strategy operations
async function getStrategies() {
    return db.all('SELECT * FROM strategies');
}

async function addStrategy(strategy) {
    const id = `strategy_${Date.now()}`;
    const createdAt = new Date().toISOString();
    await db.run(
        'INSERT INTO strategies (id, name, status, createdAt) VALUES (?, ?, ?, ?)',
        id, strategy.name, 'created', createdAt
    );
    return { id, ...strategy, status: 'created', createdAt };
}

async function updateStrategyStatus(id, status, executionDetails = {}) {
    await db.run(
        'UPDATE strategies SET status = ?, lastUpdated = ?, executionDetails = ? WHERE id = ?',
        status, new Date().toISOString(), JSON.stringify(executionDetails), id
    );
    return db.get('SELECT * FROM strategies WHERE id = ?', id);
}

// Execution history
async function addExecutionHistory(entry) {
    const id = `exec_${Date.now()}`;
    const timestamp = new Date().toISOString();
    await db.run(
        'INSERT INTO executionHistory (id, timestamp, details) VALUES (?, ?, ?)',
        id, timestamp, JSON.stringify(entry)
    );
    return { id, timestamp, ...entry };
}

async function getExecutionHistory(limit = 50) {
    return db.all('SELECT * FROM executionHistory ORDER BY timestamp DESC LIMIT ?', limit);
}

// Protocol operations
async function getProtocols() {
    return db.all('SELECT * FROM protocols');
}

async function updateProtocols(protocols) {
    const promises = protocols.map(protocol => {
        return db.run(
            'INSERT INTO protocols (id, name, lastUpdated) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = ?, lastUpdated = ?',
            protocol.id, protocol.name, new Date().toISOString(), protocol.name, new Date().toISOString()
        );
    });
    await Promise.all(promises);
    return db.all('SELECT * FROM protocols');
}

// Simulation logs
async function addSimulationLog(action, details) {
    const id = `sim_${Date.now()}`;
    const timestamp = new Date().toISOString();
    await db.run(
        'INSERT INTO simulationLogs (id, timestamp, action, details) VALUES (?, ?, ?, ?)',
        id, timestamp, action, JSON.stringify(details)
    );
    
    // Keep only last 1000 simulation logs
    const count = await db.get('SELECT COUNT(*) as count FROM simulationLogs');
    if (count.count > 1000) {
        await db.run('DELETE FROM simulationLogs WHERE id NOT IN (SELECT id FROM simulationLogs ORDER BY timestamp DESC LIMIT 1000)');
    }
    
    return { id, timestamp, action, details };
}

async function getSimulationLogs(limit = 100) {
    return db.all('SELECT * FROM simulationLogs ORDER BY timestamp DESC LIMIT ?', limit);
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
