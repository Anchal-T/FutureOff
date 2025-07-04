import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createConfig, sepolia } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { Web3Provider } from './context/Web3Context';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http('https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY'),
  }),
});

function App() {
  return (
    <WagmiConfig config={config}>
      <Web3Provider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </Router>
      </Web3Provider>
    </WagmiConfig>
  );
}

export default App;
