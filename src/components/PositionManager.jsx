import React from 'react';
import Card from './common/Card';
import usePositions from '../hooks/usePositions';

const PositionManager = () => {
  const { positions, loading, error } = usePositions();

  return (
    <Card title="Current Positions">
      {loading ? (
        <p>Loading positions...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <ul className="space-y-2">
          {positions.map((position) => (
            <li key={position.id} className="flex justify-between">
              <span>{position.protocol}</span>
              <span>{position.amount} ETH</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default PositionManager;