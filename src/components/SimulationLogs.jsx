import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { fetchSimulationLogs } from '../utils/api';

const SimulationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await fetchSimulationLogs();
        if (response.success) {
          setLogs(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Card title="Simulation Logs">
        {loading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">No simulation logs available.</p>
        ) : (
          <div className="space-y-2 max-h-screen overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded text-sm font-mono">
                <div className="flex justify-between">
                  <span className={`font-bold ${
                    log.level === 'ERROR' ? 'text-red-400' :
                    log.level === 'WARN' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>{log.level || 'INFO'}</span>
                  <span className="text-gray-400">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <p className="mt-1 text-gray-300 whitespace-pre-wrap">{log.message || JSON.stringify(log)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SimulationLogs;
