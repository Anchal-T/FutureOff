import React from 'react';
import { useWeb3Context } from '../context/Web3Context';
import WalletConnect from '../components/WalletConnect';
import Dashboard from '../components/Dashboard';
import StrategySelector from '../components/StrategySelector';
import PositionManager from '../components/PositionManager';
import RiskMonitor from '../components/RiskMonitor';

const DashboardPage = () => {
  const { isConnected } = useWeb3Context();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-xl">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-3xl font-bold drop-shadow-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            FutureOff Yield Optimizer
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="/dashboard" className="flex items-center space-x-2 hover:text-green-300 transition-colors duration-300 font-medium">
              <span>📊</span>
              <span>Dashboard</span>
            </a>
            <a href="#strategies" className="flex items-center space-x-2 hover:text-green-300 transition-colors duration-300 font-medium">
              <span>⚡</span>
              <span>Strategies</span>
            </a>
            <a href="#risk" className="flex items-center space-x-2 hover:text-green-300 transition-colors duration-300 font-medium">
              <span>🛡️</span>
              <span>Risk Monitor</span>
            </a>
          </nav>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        {isConnected ? (
          <div className="space-y-10">
            {/* Top Row - Dashboard Overview */}
            <section className="animate-fade-in">
              <Dashboard />
            </section>

            {/* Middle Row - Strategy Management */}
            <section id="strategies" className="animate-fade-in">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <StrategySelector />
                <PositionManager />
              </div>
            </section>

            {/* Bottom Row - Risk Monitoring */}
            <section id="risk" className="animate-fade-in">
              <RiskMonitor />
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-lg text-gray-400 mb-8">Please connect your wallet to access the dashboard and manage your investments.</p>
              <WalletConnect />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;