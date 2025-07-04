import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';

const StrategySelector = () => {
  const [riskLevel, setRiskLevel] = useState('medium');

  const handleOptimize = () => {
    // Placeholder for optimization logic
    alert(`Optimizing for ${riskLevel} risk level...`);
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
        <Button onClick={handleOptimize}>Optimize Portfolio</Button>
      </div>
    </Card>
  );
};

export default StrategySelector;