import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { fetchSimulationLogs, fetchStrategies } from '../utils/api';

const RiskMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRiskData = async () => {
      try {
        const [logsResponse, strategiesResponse] = await Promise.all([
          fetchSimulationLogs(10),
          fetchStrategies()
        ]);

        if (logsResponse.success) {
          setLogs(logsResponse.data);
        }

        if (strategiesResponse.success) {
          setStrategies(strategiesResponse.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRiskData();
  }, []);

  const calculateRiskMetrics = () => {
    if (strategies.length === 0) return [];

    return strategies.map(strategy => {
      const riskScore = strategy.riskScore || Math.random() * 100;
      const riskLevel = riskScore < 30 ? 'Low' : riskScore < 70 ? 'Medium' : 'High';
      
      return {
        id: strategy.id,
        name: strategy.protocol || 'Unknown Protocol',
        riskLevel,
        riskScore: Math.round(riskScore),
        predictedReturn: strategy.predictedReturn || 0,
        volatility: strategy.volatility || 'Unknown'
      };
    });
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [logsResponse, strategiesResponse] = await Promise.all([
        fetchSimulationLogs(10),
        fetchStrategies()
      ]);

      if (logsResponse.success) {
        setLogs(logsResponse.data);
      }

      if (strategiesResponse.success) {
        setStrategies(strategiesResponse.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const riskMetrics = calculateRiskMetrics();

  return (
    <div className="space-y-6">
      {/* Risk Metrics Card */}
      <Card title="Risk Metrics">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Strategy Risk Analysis</h3>
          <Button onClick={refreshData} disabled={loading} size="sm">
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {loading ? (
          <p>Loading risk data...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : riskMetrics.length === 0 ? (
          <p className="text-gray-500">No risk data available. Generate strategies first.</p>
        ) : (
          <div className="space-y-3">
            {riskMetrics.map((risk) => (
              <div key={risk.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{risk.name}</h4>
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Risk Level:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          risk.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                          risk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {risk.riskLevel}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Risk Score:</span>
                        <span>{risk.riskScore}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Expected Return:</span>
                        <span className="text-green-600">{risk.predictedReturn}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Simulation Logs Card */}
      <Card title="Simulation Logs">
        {logs.length === 0 ? (
          <p className="text-gray-500">No simulation logs available.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{log.level || 'INFO'}</span>
                  <span className="text-gray-500">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'N/A'}
                  </span>
                </div>
                <p className="mt-1 text-gray-700">{log.message || JSON.stringify(log)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RiskMonitor;