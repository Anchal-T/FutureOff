import { useState, useEffect, useCallback } from 'react';
import { fetchExecutionHistory } from '../utils/api';

const usePositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch execution history to get actual positions
      const historyResponse = await fetchExecutionHistory(20);
      const executionHistory = historyResponse.success ? historyResponse.data : [];
      
      // Transform execution history to positions format
      const positionsData = executionHistory
        .filter(execution => execution.action === 'execute')
        .map(execution => ({
          id: execution.id || `${execution.strategyId}-${execution.timestamp}`,
          protocol: execution.strategy || execution.strategyId,
          amount: execution.amount || '0',
          timestamp: execution.timestamp,
          transactionHash: execution.result?.hash || execution.result?.transactionHash
        }));
      
      setPositions(positionsData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const executePosition = async (strategyId, amount) => {
    try {
      setLoading(true);
      const { executeStrategy } = await import('../utils/api');
      const result = await executeStrategy(strategyId, amount);
      
      // Refresh positions after execution
      await fetchPositions();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { positions, loading, error, executePosition };
};

export default usePositions;