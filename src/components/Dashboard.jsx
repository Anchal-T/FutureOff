import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import useYields from '../hooks/useYields';
import { fetchSystemStatus, fetchExecutionHistory } from '../utils/api';

const Dashboard = () => {
  const { yields, loading: yieldsLoading, error: yieldsError } = useYields();
  const [systemStatus, setSystemStatus] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statusResponse, historyResponse] = await Promise.all([
          fetchSystemStatus(),
          fetchExecutionHistory(5)
        ]);

        if (statusResponse.success) {
          setSystemStatus(statusResponse.data);
        }

        if (historyResponse.success) {
          setRecentActivity(historyResponse.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [statusResponse, historyResponse] = await Promise.all([
        fetchSystemStatus(),
        fetchExecutionHistory(5)
      ]);

      if (statusResponse.success) {
        setSystemStatus(statusResponse.data);
      }

      if (historyResponse.success) {
        setRecentActivity(historyResponse.data);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* System Status Card */}
      <Card title="System Status">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Overview</h3>
          <Button onClick={refreshData} disabled={loading} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        {systemStatus ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{systemStatus.totalStrategies}</div>
              <div className="text-sm text-blue-600/70 dark:text-blue-300/70 font-medium mt-1">Total Strategies</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl border border-green-200 dark:border-green-700">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{systemStatus.recentExecutions}</div>
              <div className="text-sm text-green-600/70 dark:text-green-300/70 font-medium mt-1">Recent Executions</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {systemStatus.simulationMode ? 'SIM' : 'LIVE'}
              </div>
              <div className="text-sm text-purple-600/70 dark:text-purple-300/70 font-medium mt-1">Mode</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl border border-orange-200 dark:border-orange-700">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {Math.floor(systemStatus.uptime / 60)}m
              </div>
              <div className="text-sm text-orange-600/70 dark:text-orange-300/70 font-medium mt-1">Uptime</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading system status...</span>
          </div>
        )}
      </Card>

      {/* Available Protocols Card */}
      <Card title="Available Protocols">
        {yieldsLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading protocol data...</span>
          </div>
        ) : yieldsError ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">Error: {yieldsError}</p>
          </div>
        ) : yields.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500 dark:text-gray-400">No protocols available. Try optimizing strategies first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {yields.slice(0, 5).map((protocol) => (
              <div key={protocol.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-white">{protocol.protocol || protocol.name}</span>
                    {protocol.riskLevel && (
                      <span className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${
                        protocol.riskLevel === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        protocol.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {protocol.riskLevel}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    {protocol.apy || protocol.predictedReturn || 'N/A'}% APY
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Simulation Logs Card */}
      <Card title="Simulation Logs">
        {recentActivity.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500 dark:text-gray-400">No recent activity. Execute some strategies to see activity here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">{activity.action}</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{activity.strategy || activity.strategyId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800 dark:text-white">{activity.amount} ETH</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;