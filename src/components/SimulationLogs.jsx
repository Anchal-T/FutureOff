import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { fetchSimulationLogs } from '../utils/api';

const SimulationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadLogs = async () => {
    try {
      const response = await fetchSimulationLogs();
      if (response.success) {
        setLogs(response.data);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Auto refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Card title="Simulation Logs">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => loadLogs()}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Auto-refresh (5s)</span>
            </label>
          </div>
          <div className="text-sm text-gray-400">
            {logs.length} log{logs.length !== 1 ? 's' : ''}
          </div>
        </div>
        {loading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">No simulation logs available.</p>
        ) : (
          <div className="space-y-2 max-h-screen overflow-y-auto">
            {logs.map((log, index) => {
                // Log is already an object from the database
                if (log && typeof log === 'object') {
                    const { id, timestamp, action, details } = log;
                    
                    // Parse details if it's a JSON string
                    let parsedDetails;
                    try {
                        parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
                    } catch (e) {
                        parsedDetails = details; // Use as-is if parsing fails
                    }

                    // Get action color based on type
                    const getActionColor = (actionType) => {
                        switch (actionType?.toLowerCase()) {
                            case 'createstrategy':
                                return 'text-green-400';
                            case 'executestrategy':
                                return 'text-blue-400';
                            case 'error':
                                return 'text-red-400';
                            case 'warning':
                                return 'text-yellow-400';
                            default:
                                return 'text-green-400';
                        }
                    };

                    return (
                        <div key={log.id || index} className="p-3 bg-gray-800 rounded text-sm font-mono border-l-4 border-blue-500">
                            <div className="flex justify-between items-start">
                                <span className={`font-bold ${getActionColor(action)}`}>
                                    {action || 'INFO'}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    {timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}
                                </span>
                            </div>
                            
                            {id && (
                                <div className="mt-1 text-xs text-gray-500">
                                    ID: {id}
                                </div>
                            )}
                            
                            {parsedDetails && (
                                <div className="mt-2 text-gray-300">
                                    {typeof parsedDetails === 'object' ? (
                                        <div className="space-y-1">
                                            {parsedDetails.protocol && (
                                                <div><span className="text-gray-400">Protocol:</span> {parsedDetails.protocol}</div>
                                            )}
                                            {parsedDetails.token && (
                                                <div><span className="text-gray-400">Token:</span> {parsedDetails.token}</div>
                                            )}
                                            {parsedDetails.riskScore && (
                                                <div><span className="text-gray-400">Risk Score:</span> {parsedDetails.riskScore}</div>
                                            )}
                                            {parsedDetails.walletAddress && (
                                                <div><span className="text-gray-400">Wallet:</span> {parsedDetails.walletAddress}</div>
                                            )}
                                            {parsedDetails.amount && (
                                                <div><span className="text-gray-400">Amount:</span> {parsedDetails.amount}</div>
                                            )}
                                            {parsedDetails.yield && (
                                                <div><span className="text-gray-400">Yield:</span> {parsedDetails.yield}%</div>
                                            )}
                                            {/* Show any other details */}
                                            {Object.entries(parsedDetails).map(([key, value]) => {
                                                if (!['protocol', 'token', 'riskScore', 'walletAddress', 'amount', 'yield'].includes(key)) {
                                                    return (
                                                        <div key={key}>
                                                            <span className="text-gray-400">{key}:</span> {String(value)}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-gray-300">{String(parsedDetails)}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }

                // Fallback for unexpected data format
                return (
                    <div key={index} className="p-3 bg-gray-800 rounded text-sm font-mono border-l-4 border-red-500">
                        <span className="text-red-400 font-bold">UNKNOWN FORMAT</span>
                        <pre className="mt-1 text-gray-300 whitespace-pre-wrap">{JSON.stringify(log, null, 2)}</pre>
                    </div>
                );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SimulationLogs;
