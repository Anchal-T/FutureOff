import React from 'react';
import { useWeb3Context } from '../context/Web3Context';
import WalletConnect from '../components/WalletConnect';

const DashboardPage = () => {
  const { isConnected } = useWeb3Context();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold drop-shadow-md">Yield Agent</div>
          <nav className="space-x-4">
            <a href="/dashboard" className="hover:text-green-300 transition-colors duration-300">
              Dashboard
            </a>
            <a href="#" className="hover:text-green-300 transition-colors duration-300">
              Strategies
            </a>
            <a href="#" className="hover:text-green-300 transition-colors duration-300">
              Settings
            </a>
          </nav>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Portfolio Overview Card */}
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Portfolio Overview
              </h2>
              <p className="text-3xl font-bold text-green-400">5.23% APY</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Total Value: $12,345
              </p>
            </div>

            {/* Strategy Selector Card */}
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Current Strategy
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Moderate Risk - Uniswap V3
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300">
                Change Strategy
              </button>
            </div>

            {/* Position Manager Card */}
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Active Positions
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                ETH-USDC: $5,000 @ 4.8% APY
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                DAI-USDT: $7,345 @ 5.5% APY
              </p>
            </div>

            {/* Risk Monitor Card */}
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Risk Metrics
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Volatility: Low
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Impermanent Loss: 0.12%
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Please connect your wallet to access the dashboard.
            </h2>
            <WalletConnect />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;