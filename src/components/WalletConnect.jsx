import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Button from './common/Button';

function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isError, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    // Try MetaMask first, then fall back to injected
    const metaMaskConnector = connectors.find((connector) => connector.id === 'metaMask');
    const injectedConnector = connectors.find((connector) => connector.id === 'injected');
    
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    } else if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else {
      // Fallback to the first available connector
      connect({ connector: connectors[0] });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
          <Button onClick={() => disconnect()} variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
            Disconnect
          </Button>
        </>
      ) : (
        <>
          <Button 
            onClick={handleConnect} 
            disabled={isPending}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            size="md"
          >
            {isPending ? '� Connecting...' : '�🔗 Connect Wallet'}
          </Button>
          {isError && (
            <div className="text-red-400 text-sm mt-2">
              {error?.message || 'Failed to connect wallet'}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WalletConnect;