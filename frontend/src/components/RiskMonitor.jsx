import React from 'react';
import Card from './common/Card';

const RiskMonitor = () => {
  // Placeholder for risk data
  const risks = [
    { name: 'Aave', volatility: 'Low', liquidity: 'High' },
    { name: 'Compound', volatility: 'Medium', liquidity: 'Medium' },
  ];

  return (
    <Card title="Risk Metrics">
      <ul className="space-y-2">
        {risks.map((risk) => (
          <li key={risk.name} className="flex justify-between">
            <span>{risk.name}</span>
            <span>Volatility: {risk.volatility}, Liquidity: {risk.liquidity}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default RiskMonitor;