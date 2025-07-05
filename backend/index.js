const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const databaseService = require('./services/databaseService.js');

// Initialize database
databaseService.initDB().catch(console.error);

// Start the strategy optimizer job
require('./jobs/strategyOptimizerJob');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Yield Optimizer Backend is running!',
    version: '1.0.0',
    endpoints: {
      strategies: '/api/strategies',
      protocols: '/api/protocols',
      executionHistory: '/api/execution-history',
      simulationLogs: '/api/simulation-logs',
      status: '/api/status'
    }
  });
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/`);
});
