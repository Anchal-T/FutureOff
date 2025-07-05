import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createConfig } from 'wagmi';
import { sepolia } from 'viem/chains';
import { http } from 'viem';
import { Web3Provider } from './context/Web3Context';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/J5OB6jOnqBqmPzxhWdBmNa_mHbNXEqLy'),
  },
  ssr: false,
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
