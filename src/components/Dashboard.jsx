import React from 'react';
import Card from './common/Card';
import useYields from '../hooks/useYields';

const Dashboard = () => {
  const { yields, loading, error } = useYields();

  return (
    <Card title="Portfolio Overview">
      {loading ? (
        <p>Loading yield data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-2">Available Protocols</h3>
          <ul className="space-y-2">
            {yields.map((protocol) => (
              <li key={protocol.id} className="flex justify-between">
                <span>{protocol.name}</span>
                <span>{protocol.apy}% APY</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default Dashboard;