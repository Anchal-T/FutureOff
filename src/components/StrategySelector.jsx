import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { fetchStrategies, optimizeStrategies, executeStrategy } from '../utils/api';

const StrategySelector = () => {
  const [riskLevel, setRiskLevel] = useState('medium');
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const loadStrategies = async () => {
      try {
        const response = await fetchStrategies();
        if (response.success) {
          setStrategies(response.data);
        }
      } catch (error) {
        console.error('Failed to load strategies:', error);
      }
    };
    loadStrategies();
  }, []);

  const handleOptimize = async () => {
    try {
      setLoading(true);
      const response = await optimizeStrategies();
      if (response.success) {
        alert('Portfolio optimization completed successfully!');
        // Reload strategies after optimization
        const updatedResponse = await fetchStrategies();
        if (updatedResponse.success) {
          setStrategies(updatedResponse.data);
        }
      } else {
        alert('Optimization failed: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Optimization failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteStrategy = async () => {
    if (!selectedStrategy || !amount) {
      alert('Please select a strategy and enter an amount');
      return;
    }

    try {
      setLoading(true);
      const response = await executeStrategy(selectedStrategy, parseFloat(amount));
      if (response.success) {
        alert(`Strategy executed successfully! Transaction: ${response.data.transactionHash}`);
        setAmount('');
        setSelectedStrategy('');
      } else {
        alert('Strategy execution failed: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Strategy execution failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Strategy Selector">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Risk Level</label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Available Strategies</label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">Select a strategy...</option>
            {strategies.map((strategy) => (
              <option key={strategy.id} value={strategy.id}>
                {strategy.protocol} - {strategy.predictedReturn}% APY
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Amount (ETH)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            min="0"
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleOptimize} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Optimizing...' : 'Optimize Portfolio'}
          </Button>
          
          <Button 
            onClick={handleExecuteStrategy} 
            disabled={loading || !selectedStrategy || !amount}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Executing...' : 'Execute Strategy'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StrategySelector;