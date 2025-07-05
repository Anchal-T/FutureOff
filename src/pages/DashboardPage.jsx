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
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-xl">
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
          <div className="text-center py-20">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to FutureOff Yield Optimizer
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Connect your wallet to access advanced yield optimization strategies, 
                  real-time risk monitoring, and AI-powered portfolio management tools.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                  <WalletConnect />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Smart Strategies</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">AI-powered yield optimization across multiple DeFi protocols</p>
                  </div>
                  
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl mb-3">🛡️</div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Risk Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Real-time monitoring and automated risk mitigation</p>
                  </div>
                  
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive dashboard with performance insights</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                  🔐 Supports MetaMask, WalletConnect, and other Web3 wallets
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FutureOff Yield Optimizer
              </h3>
              <p className="text-gray-300 mb-4 max-w-md">
                AI-Powered DeFi Strategy Management platform for optimizing yield across multiple protocols with automated risk management.
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl">🚀</span>
                <span className="text-2xl">⚡</span>
                <span className="text-2xl">🛡️</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-blue-300">Features</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Smart Yield Optimization</li>
                <li>• Real-time Risk Monitoring</li>
                <li>• Multi-Protocol Support</li>
                <li>• AI-Powered Analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-purple-300">Technology</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• React & Tailwind CSS</li>
                <li>• Node.js & Express</li>
                <li>• Smart Contracts</li>
                <li>• Web3 Integration</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 FutureOff Yield Optimizer. Built for the future of DeFi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;