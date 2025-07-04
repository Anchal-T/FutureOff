import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Optimize Your Yield Farming
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 opacity-90">
            Maximize returns with AI-powered strategies
          </p>
          <Link to="/dashboard">
            <button className="px-6 py-3 bg-green-400 text-white rounded-full hover:bg-green-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-white dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-4xl mb-4 text-blue-500">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                AI-Powered Optimization
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced algorithms find the best strategies for you.
              </p>
            </div>
            <div className="card bg-white dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-4xl mb-4 text-purple-500">🔒</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Secure & Transparent
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your funds are always under your control with full transparency.
              </p>
            </div>
            <div className="card bg-white dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-4xl mb-4 text-green-400">📈</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your portfolio performance with live data and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-500 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Connect Wallet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Link your crypto wallet to get started.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-500 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Choose Strategy
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select your risk level and preferred protocols.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-500 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Optimize & Earn
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Let our AI optimize your portfolio for maximum yields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Trusted by Thousands
          </h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Join our growing community of yield farmers.
          </p>
          <div className="flex justify-center space-x-8 flex-wrap">
            <div className="mb-4">
              <div className="text-4xl font-bold text-green-400">10K+</div>
              <p className="text-gray-600 dark:text-gray-300">Users</p>
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-green-400">$100M+</div>
              <p className="text-gray-600 dark:text-gray-300">Managed Assets</p>
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-green-400">24/7</div>
              <p className="text-gray-600 dark:text-gray-300">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Yield Farming Optimization Agent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 