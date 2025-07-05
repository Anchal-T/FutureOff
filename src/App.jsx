import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'viem/chains';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask, walletConnect, injected } from 'wagmi/connectors';
import { Web3Provider } from './context/Web3Context';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import SimulationLogs from './components/SimulationLogs';

// Create a query client for React Query
const queryClient = new QueryClient();

// Configure Wagmi with proper connectors
const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: 'your-walletconnect-project-id', // You can get this from https://cloud.walletconnect.com
    }),
    injected(),
  ],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/J5OB6jOnqBqmPzxhWdBmNa_mHbNXEqLy'),
    [mainnet.id]: http(),
  },
  ssr: false,
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/simulation-logs" element={<SimulationLogs />} />
            </Routes>
          </Router>
        </Web3Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
