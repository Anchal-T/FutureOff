import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import usePositions from '../hooks/usePositions';

const PositionManager = () => {
  const { positions, loading, error } = usePositions();

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <Card title="Current Positions">
      {loading ? (
        <div className="text-center py-4">
          <p>Loading positions...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : positions.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No positions found. Execute some strategies to see positions here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((position) => (
            <div 
              key={position.id} 
              className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{position.protocol}</h4>
                  <p className="text-sm text-gray-600">Amount: {position.amount} ETH</p>
                  <p className="text-sm text-gray-600">Date: {formatDate(position.timestamp)}</p>
                  {position.transactionHash && (
                    <p className="text-sm text-gray-600">
                      Tx: {truncateHash(position.transactionHash)}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (position.transactionHash) {
                        window.open(`https://sepolia.etherscan.io/tx/${position.transactionHash}`, '_blank');
                      }
                    }}
                    disabled={!position.transactionHash}
                  >
                    View Tx
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PositionManager;